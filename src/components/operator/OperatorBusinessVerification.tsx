'use client';

import Link from 'next/link';
import { type ChangeEvent, type DragEvent, useEffect, useRef, useState } from 'react';

type DocumentStatus = 'verified' | 'expiring' | 'missing' | 'pending';
type DocumentId = 'incorporation' | 'license' | 'insurance';

interface ComplianceDocument {
  id: DocumentId;
  name: string;
  status: DocumentStatus;
  uploadedAt: string | null;
  fileName: string | null;
  size: number | null;
}

interface VerificationState {
  documents: ComplianceDocument[];
  submitted: boolean;
}

const STORAGE_KEY = 'ghanaxplore-operator-verification';
const initialDocuments: ComplianceDocument[] = [
  {
    id: 'incorporation',
    name: 'Certificate of Incorporation',
    status: 'verified',
    uploadedAt: 'Jan 12, 2023',
    fileName: 'certificate-of-incorporation.pdf',
    size: 1.2 * 1024 * 1024,
  },
  {
    id: 'license',
    name: 'GTA Operating License',
    status: 'expiring',
    uploadedAt: 'Nov 01, 2023',
    fileName: 'gta-operating-license.pdf',
    size: 2.5 * 1024 * 1024,
  },
  {
    id: 'insurance',
    name: 'Liability Insurance Policy',
    status: 'missing',
    uploadedAt: null,
    fileName: null,
    size: null,
  },
];

const operatorNavigation = [
  { label: 'Dashboard', icon: 'dashboard', href: '/dashboard' },
  { label: 'Attractions', icon: 'landscape', href: '/operator/attractions' },
  { label: 'Bookings', icon: 'calendar_month', href: '/operator/bookings' },
  { label: 'Analytics', icon: 'analytics', href: '/operator/analytics' },
  { label: 'Settings', icon: 'settings', href: '/operator/settings' },
];

const acceptedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
const maximumFileSize = 10 * 1024 * 1024;

function Icon({ name, className = '' }: { name: string; className?: string }) {
  return <span aria-hidden="true" className={`material-symbols-outlined ${className}`}>{name}</span>;
}

function isDocumentStatus(value: unknown): value is DocumentStatus {
  return value === 'verified' || value === 'expiring' || value === 'missing' || value === 'pending';
}

function isComplianceDocument(value: unknown): value is ComplianceDocument {
  if (!value || typeof value !== 'object') return false;
  const document = value as Record<string, unknown>;
  return (
    (document.id === 'incorporation' || document.id === 'license' || document.id === 'insurance') &&
    typeof document.name === 'string' &&
    isDocumentStatus(document.status) &&
    (document.uploadedAt === null || typeof document.uploadedAt === 'string') &&
    (document.fileName === null || typeof document.fileName === 'string') &&
    (document.size === null || (typeof document.size === 'number' && document.size >= 0))
  );
}

function isVerificationState(value: unknown): value is VerificationState {
  if (!value || typeof value !== 'object') return false;
  const state = value as Record<string, unknown>;
  return (
    Array.isArray(state.documents) &&
    state.documents.length === initialDocuments.length &&
    state.documents.every(isComplianceDocument) &&
    typeof state.submitted === 'boolean'
  );
}

function readSavedState(): VerificationState | null {
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (!saved) return null;

  const parsed: unknown = JSON.parse(saved);
  if (!isVerificationState(parsed)) {
    throw new Error('Saved verification documents have an invalid format.');
  }
  return parsed;
}

function formatFileSize(size: number) {
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function statusPresentation(status: DocumentStatus) {
  switch (status) {
    case 'verified':
      return {
        label: 'Verified',
        icon: 'check_circle',
        className: 'bg-primary-container text-on-primary-container',
      };
    case 'expiring':
      return {
        label: 'Expiring Soon',
        icon: 'warning',
        className: 'bg-secondary-container text-on-secondary-container',
      };
    case 'missing':
      return {
        label: 'Required',
        icon: 'error',
        className: 'bg-error-container text-on-error-container',
      };
    case 'pending':
      return {
        label: 'Pending Review',
        icon: 'pending_actions',
        className: 'bg-tertiary-container text-on-tertiary-container',
      };
  }
}

export function OperatorBusinessVerification() {
  const [documents, setDocuments] = useState(initialDocuments);
  const [submitted, setSubmitted] = useState(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState<DocumentId>('license');
  const [notice, setNotice] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const saved = readSavedState();
      if (saved) {
        setDocuments(saved.documents);
        setSubmitted(saved.submitted);
      }
    } catch (caught) {
      setNotice(caught instanceof Error ? caught.message : 'Unable to load saved verification documents.');
    }
  }, []);

  const hasOutstandingDocuments = documents.some(
    (document) => document.status === 'missing' || document.status === 'expiring',
  );
  const canSubmit = !hasOutstandingDocuments && !submitted;

  function persistState(nextDocuments: ComplianceDocument[], nextSubmitted: boolean) {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ documents: nextDocuments, submitted: nextSubmitted }),
      );
      return true;
    } catch {
      return false;
    }
  }

  function processFile(file: File | undefined) {
    if (!file) return;
    if (!acceptedTypes.includes(file.type)) {
      setNotice('Choose a PDF, JPEG, or PNG file.');
      return;
    }
    if (file.size > maximumFileSize) {
      setNotice('Documents must be 10MB or smaller.');
      return;
    }

    const updatedDocuments = documents.map((document) =>
      document.id === selectedDocumentId
        ? {
            ...document,
            status: 'pending' as const,
            uploadedAt: new Intl.DateTimeFormat('en', {
              month: 'short',
              day: '2-digit',
              year: 'numeric',
            }).format(new Date()),
            fileName: file.name,
            size: file.size,
          }
        : document,
    );
    setDocuments(updatedDocuments);
    setSubmitted(false);
    const saved = persistState(updatedDocuments, false);
    setNotice(
      saved
        ? `${file.name} added to ${documents.find((document) => document.id === selectedDocumentId)?.name}. This is a local demo; the file was not uploaded.`
        : 'The document preview was updated, but its details could not be saved in this browser.',
    );
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    processFile(event.target.files?.[0]);
    event.target.value = '';
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    processFile(event.dataTransfer.files[0]);
  }

  function submitForReview() {
    if (!canSubmit) return;
    setSubmitted(true);
    if (persistState(documents, true)) {
      setNotice('Your documents have been submitted for review in this demo.');
    } else {
      setSubmitted(false);
      setNotice('Your documents could not be submitted because browser storage is unavailable.');
    }
  }

  function chooseDocument(documentId: DocumentId) {
    setSelectedDocumentId(documentId);
    fileInputRef.current?.click();
  }

  const documentCards = documents.map((document) => {
    const status = statusPresentation(document.status);
    return (
      <article
        key={document.id}
        className="group flex flex-col gap-4 rounded-2xl bg-surface-bright p-4 transition-colors hover:bg-surface-container-low sm:flex-row sm:items-center sm:justify-between sm:p-5"
      >
        <div className="flex min-w-0 items-center gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-surface-container text-primary transition-colors group-hover:bg-primary/10">
            <Icon name="description" />
          </span>
          <div className="min-w-0">
            <h4 className="font-label-lg text-on-surface">{document.name}</h4>
            {document.status === 'missing' ? (
              <p className="mt-1 text-label-sm text-error">Required for verification</p>
            ) : (
              <p className="mt-1 break-all text-label-sm text-on-surface-variant">
                Uploaded {document.uploadedAt}
                {document.fileName && document.size !== null && (
                  <> · {document.fileName} · {formatFileSize(document.size)}</>
                )}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between gap-3 sm:justify-end">
          <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-label-sm ${status.className}`}>
            <Icon name={status.icon} className="text-sm" />
            {status.label}
          </span>
          {document.status !== 'verified' && document.status !== 'pending' && (
            <button
              type="button"
              onClick={() => chooseDocument(document.id)}
              className="rounded-full bg-primary-fixed/20 px-3 py-1.5 font-label-lg text-primary transition-colors hover:bg-primary-fixed/40"
            >
              Update
            </button>
          )}
        </div>
      </article>
    );
  });

  return (
    <div className="min-h-screen overflow-x-hidden bg-surface text-on-surface">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-outline-variant/20 bg-surface-container-low p-4 lg:flex">
        <Link href="/dashboard" className="mb-8 px-3 py-4 font-headline-md text-headline-md font-bold text-primary">
          GhanaXplore
          <span className="mt-1 block text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant">Operator Portal</span>
        </Link>
        <nav aria-label="Operator navigation" className="flex flex-col gap-1">
          {operatorNavigation.map((item) => {
            const active = item.label === 'Settings';
            return (
              <Link
                key={item.label}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 font-label-lg transition-colors ${
                  active
                    ? 'bg-primary-container text-on-primary-container'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
              >
                <Icon name={item.icon} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto border-t border-outline-variant/20 p-3">
          <p className="font-label-lg font-bold">Kwame Mensah</p>
          <p className="text-xs text-on-surface-variant">Gold Coast Safaris</p>
        </div>
      </aside>

      <header className="fixed inset-x-0 top-0 z-30 flex h-16 items-center justify-between border-b border-outline-variant/20 bg-surface/90 px-4 backdrop-blur-xl lg:left-64 lg:h-20 lg:px-8">
        <div className="flex items-center gap-3">
          <Link href="/operator/settings" aria-label="Back to settings" className="flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container lg:hidden">
            <Icon name="arrow_back" />
          </Link>
          <h1 className="font-headline-md text-headline-md">Business Verification</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-right sm:block">
            <span className="block text-label-sm text-on-surface-variant">Current Status</span>
            <span className="block font-label-lg text-primary">Active Now</span>
          </span>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-on-primary">
            <Icon name="person" />
          </span>
        </div>
      </header>

      <main className="min-h-screen px-4 pb-32 pt-20 sm:px-8 lg:ml-64 lg:px-12 lg:pb-12 lg:pt-28">
        <div className="mx-auto flex w-full max-w-7xl flex-col">
          {notice && (
            <div role="status" aria-live="polite" className="mb-6 flex items-center justify-between gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-primary">
              <span>{notice}</span>
              <button type="button" aria-label="Dismiss notification" onClick={() => setNotice('')} className="shrink-0">
                <Icon name="close" />
              </button>
            </div>
          )}

          <section className="mb-8 lg:mb-12">
            <p className="text-label-sm font-semibold uppercase tracking-[0.2em] text-secondary">Operator Compliance</p>
            <h2 className="mb-2 font-display-lg-mobile text-display-lg-mobile text-on-surface lg:font-display-lg lg:text-display-lg">
              Business Verification
            </h2>
            <p className="max-w-3xl text-body-md text-on-surface-variant lg:text-body-lg">
              Manage your compliance documents to meet Ghana Tourism Authority (GTA) guidelines and keep your operator status up to date.
            </p>
          </section>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
            <div className="flex flex-col gap-6 lg:col-span-8 lg:gap-8">
              <section className="group relative overflow-hidden rounded-3xl bg-surface-container p-5 transition-shadow duration-300 hover:shadow-xl sm:p-8">
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-br from-secondary-fixed/20 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative z-10 flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
                  <div className="flex items-start gap-4 sm:items-center sm:gap-6">
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-secondary-container text-on-secondary-container sm:h-16 sm:w-16">
                      <Icon name="pending_actions" className="text-3xl" />
                    </span>
                    <div>
                      <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-secondary-container px-3 py-1 font-label-sm text-on-secondary-container">
                        <Icon name="pending_actions" className="text-base" />
                        {submitted ? 'Submitted for Review' : 'Verification Pending'}
                      </span>
                      <h3 className="mb-1 font-headline-md text-headline-md text-on-surface">Company Profile</h3>
                      <p className="max-w-xl text-sm text-on-surface-variant sm:text-body-md">
                        {submitted
                          ? 'Your documents are in the review queue. Processing typically takes 3-5 business days.'
                          : 'Update your business details and compliance documents to complete verification.'}
                      </p>
                    </div>
                  </div>
                  {!submitted && (
                    <a href="#compliance-documents" className="shrink-0 rounded-xl bg-primary px-5 py-3 text-center font-label-lg text-on-primary transition-shadow hover:shadow-md">
                      Review Requirements
                    </a>
                  )}
                  {submitted && (
                    <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-tertiary-container px-4 py-2 font-label-lg text-on-tertiary-container">
                      <Icon name="schedule" />
                      In review
                    </span>
                  )}
                </div>
                <div className="relative z-10 mt-5 flex items-center gap-2 border-t border-outline-variant/30 pt-4 text-label-sm text-on-surface-variant sm:ml-20 sm:mt-6">
                  <Icon name="calendar_today" className="text-base" />
                  <span>{submitted ? 'Next update: within 3-5 business days' : 'Renew your license and provide all required documents'}</span>
                </div>
              </section>

              <section id="compliance-documents">
                <h3 className="mb-4 flex items-center gap-3 font-headline-md text-headline-md sm:mb-6">
                  <Icon name="folder_managed" className="text-primary" />
                  Compliance Documents
                </h3>
                <div className="flex flex-col gap-3 sm:gap-4">{documentCards}</div>
              </section>
            </div>

            <div className="flex flex-col gap-6 lg:col-span-4 lg:gap-8">
              <section className="flex flex-col rounded-3xl bg-surface-container-low p-5 sm:p-6">
                <h3 className="mb-2 font-headline-md text-headline-md">Upload Document</h3>
                <p className="mb-5 text-sm text-on-surface-variant sm:text-body-md">
                  Accepted formats: PDF, JPEG, PNG (max 10MB).
                </p>
                <label htmlFor="document-type" className="mb-2 font-label-lg">Document type</label>
                <select
                  id="document-type"
                  value={selectedDocumentId}
                  onChange={(event) => {
                    const selected = documents.find((document) => document.id === event.target.value);
                    if (selected) setSelectedDocumentId(selected.id);
                  }}
                  className="mb-4 h-12 w-full rounded-xl border border-outline-variant/60 bg-surface px-3 font-body-md focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {documents.map((document) => (
                    <option key={document.id} value={document.id}>{document.name}</option>
                  ))}
                </select>
                <div
                  role="button"
                  tabIndex={0}
                  aria-label="Choose or drop a compliance document"
                  onClick={() => fileInputRef.current?.click()}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      fileInputRef.current?.click();
                    }
                  }}
                  onDragEnter={(event) => {
                    event.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragOver={(event) => event.preventDefault()}
                  onDragLeave={(event) => {
                    if (event.currentTarget === event.target) setIsDragging(false);
                  }}
                  onDrop={handleDrop}
                  className={`relative flex min-h-56 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed p-6 text-center transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
                    isDragging
                      ? 'border-primary bg-primary-container/20'
                      : 'border-outline-variant bg-surface hover:bg-surface-container'
                  }`}
                >
                  <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform group-hover:scale-110">
                    <Icon name="cloud_upload" className="text-3xl" />
                  </span>
                  <p className="mb-2 font-body-lg text-on-surface">Drag &amp; drop file here</p>
                  <p className="mb-4 text-label-sm uppercase tracking-wider text-on-surface-variant">or</p>
                  <span className="rounded-xl bg-surface-container-high px-5 py-2 font-label-lg transition-colors hover:bg-outline-variant">
                    Browse Files
                  </span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                    aria-label="Upload compliance document"
                    onChange={handleFileChange}
                    className="sr-only"
                  />
                </div>
              </section>

              <aside className="rounded-3xl bg-tertiary-container p-5 text-on-tertiary-container sm:p-6">
                <div className="mb-4 flex items-center gap-3">
                  <Icon name="info" />
                  <h3 className="font-body-lg font-semibold">Annual Verification Process</h3>
                </div>
                <p className="mb-4 text-sm opacity-90 sm:text-body-md">
                  The Ghana Tourism Authority requires certified operators to submit current licensing and insurance documents.
                </p>
                <ul className="list-disc space-y-2 pl-5 text-sm opacity-90 sm:text-label-lg">
                  <li>Ensure all documents are clear and legible.</li>
                  <li>Submit renewals at least 30 days before expiry.</li>
                  <li>Review typically takes 3-5 business days.</li>
                </ul>
              </aside>
            </div>
          </div>

          <section className="mt-6 sm:mt-8 lg:hidden">
            <button
              type="button"
              onClick={submitForReview}
              disabled={!canSubmit}
              className={`flex w-full items-center justify-center gap-2 rounded-full py-3.5 font-label-lg shadow-sm transition-shadow ${
                canSubmit
                  ? 'bg-primary text-on-primary hover:shadow-md'
                  : 'cursor-not-allowed bg-primary text-on-primary opacity-50'
              }`}
            >
              <Icon name={submitted ? 'check_circle' : 'send'} />
              {submitted ? 'Submitted for Review' : 'Submit for Review'}
            </button>
            <p className="mt-3 text-center text-label-sm text-on-surface-variant">
              {canSubmit
                ? 'Your documents are ready to submit.'
                : submitted
                  ? 'Your documents are in review.'
                  : 'Upload all required documents and renew your license to submit.'}
            </p>
          </section>
        </div>
      </main>

      <nav aria-label="Mobile operator navigation" className="fixed inset-x-0 bottom-0 z-50 flex justify-around border-t border-outline-variant/20 bg-surface/95 px-1 pt-2 shadow-[0_-1px_8px_rgba(0,0,0,0.04)] [padding-bottom:max(0.5rem,env(safe-area-inset-bottom))] lg:hidden">
        {operatorNavigation.map((item) => {
          const active = item.label === 'Settings';
          return (
            <Link
              key={item.label}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl py-2 text-[10px] ${
                active ? 'font-bold text-primary' : 'text-on-surface-variant'
              }`}
            >
              <span className={`flex h-8 w-12 items-center justify-center rounded-full ${active ? 'bg-primary-container text-on-primary-container' : ''}`}>
                <Icon name={item.icon} />
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
