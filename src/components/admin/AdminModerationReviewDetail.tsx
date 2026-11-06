'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  initialItems,
  type ModerationStatus,
} from './AdminContentModeration';
import { readModerationStatuses, saveModerationStatus } from './moderationStatusStorage';

const navigation = [
  { label: 'Dashboard', icon: 'dashboard', href: '/admin' },
  { label: 'Content Moderation', icon: 'gavel', href: '/admin/content-moderation' },
  { label: 'Attractions', icon: 'map', href: '/admin/attractions' },
  { label: 'User Management', icon: 'group', href: '/admin/user-management' },
  { label: 'Analytics', icon: 'monitoring', href: '/admin' },
  { label: 'Settings', icon: 'settings', href: '/admin/settings' },
];

export function AdminModerationReviewDetail({ reviewId }: { reviewId: string }) {
  const item = initialItems.find((candidate) => candidate.id === reviewId);
  const [status, setStatus] = useState<ModerationStatus>(item?.status ?? 'Pending');
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    try {
      const savedStatus = readModerationStatuses()[reviewId];
      if (savedStatus) setStatus(savedStatus);
    } catch {
      setNotice('Saved moderation decisions could not be loaded.');
    }
  }, [reviewId]);

  if (!item) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-surface px-6 text-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-error">Review not found</p>
          <h1 className="mt-2 font-headline-lg text-headline-lg text-on-surface">
            This moderation item is unavailable.
          </h1>
          <Link
            href="/admin/content-moderation"
            className="mt-6 inline-flex rounded-lg bg-primary px-5 py-3 font-semibold text-on-primary"
          >
            Back to moderation queue
          </Link>
        </div>
      </main>
    );
  }

  const decide = (nextStatus: 'Approved' | 'Rejected' | 'Escalated') => {
    let saveFailed = false;
    try {
      saveModerationStatus(item.id, nextStatus);
    } catch {
      saveFailed = true;
    }
    setStatus(nextStatus);
    setNotice(
      saveFailed
        ? 'Decision applied, but could not be saved for later.'
        : `${item.id} marked ${nextStatus.toLowerCase()}.`,
    );
  };

  const postNote = () => {
    const trimmedNote = note.trim();
    if (!trimmedNote) {
      setNotice('Enter a note before posting.');
      return;
    }

    setNotes((currentNotes) => [...currentNotes, trimmedNote]);
    setNote('');
    setNotice('Internal note added.');
  };

  const shareReport = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setNotice('Review link copied to clipboard.');
    } catch {
      setNotice('Unable to copy the review link. Copy the URL from your browser.');
    }
  };

  const statusColor =
    status === 'Approved' || status === 'Safe'
      ? 'bg-primary/10 text-primary'
      : status === 'Rejected' || status === 'Flagged'
        ? 'bg-error-container text-on-error-container'
        : status === 'Escalated'
          ? 'bg-secondary-container text-on-secondary-container'
          : 'bg-secondary-container/70 text-on-secondary-container';

  return (
    <div className="min-h-screen bg-background pb-40 text-on-surface">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-outline-variant/30 bg-surface-container-low lg:flex">
        <div className="p-6">
          <h1 className="font-headline-md text-headline-md font-bold text-primary">GTA Admin</h1>
          <p className="mt-1 text-xs tracking-wider text-on-surface-variant/70">Content Control Center</p>
        </div>
        <nav className="mt-4 flex-grow" aria-label="Admin navigation">
          {navigation.map((entry) => {
            const active = entry.label === 'Content Moderation';
            return (
              <Link
                key={entry.label}
                href={entry.href}
                aria-current={active ? 'page' : undefined}
                className={`flex items-center gap-3 border-r-4 px-4 py-3 transition-colors ${
                  active
                    ? 'border-primary bg-surface-container-high font-bold text-primary'
                    : 'border-transparent text-on-surface-variant hover:bg-surface-container-high hover:text-primary'
                }`}
              >
                <span className="material-symbols-outlined" aria-hidden="true">{entry.icon}</span>
                <span className="text-sm">{entry.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="m-4 rounded-lg bg-primary/10 p-3 text-xs font-bold text-primary">
          <span className="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-primary" />
          System Status: Active
        </div>
      </aside>

      <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-outline-variant/30 bg-surface/95 px-4 backdrop-blur md:px-8 lg:ml-64">
        <div className="flex min-w-0 items-center gap-3">
          <Link href="/admin/content-moderation" className="text-sm font-semibold text-primary">
            <span className="hidden sm:inline">Content Moderation</span>
            <span className="sm:hidden">Moderation</span>
          </Link>
          <span className="text-on-surface-variant">/</span>
          <span className="truncate text-sm text-on-surface-variant">{item.id}</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/content-moderation"
            className="hidden rounded-full border border-outline-variant px-4 py-2 text-sm font-medium hover:bg-surface-container sm:inline-flex"
          >
            Queue
          </Link>
          <span className="material-symbols-outlined text-on-surface-variant" aria-label="Notifications">notifications</span>
          <span className="material-symbols-outlined text-3xl text-on-surface-variant" aria-label="Admin account">account_circle</span>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] px-4 pb-20 pt-6 sm:px-6 lg:ml-64 lg:px-8 lg:pt-8">
        <div className="mb-7 flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
          <div>
            <nav aria-label="Breadcrumb" className="mb-3 hidden items-center gap-2 text-sm text-on-surface-variant sm:flex">
              <Link href="/admin/content-moderation" className="hover:text-primary">Content Moderation</Link>
              <span aria-hidden="true">›</span>
              <span>Flagged Content</span>
              <span aria-hidden="true">›</span>
              <span className="font-bold text-primary">{item.id}</span>
            </nav>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="font-headline-lg text-headline-lg">Review ID #{item.id}</h2>
              <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-bold ${statusColor}`}>
                <span className="h-2 w-2 rounded-full bg-current" />
                {status}
              </span>
            </div>
          </div>
          <div className="flex gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setShowHistory((visible) => !visible)}
              className="inline-flex items-center gap-2 rounded-lg border border-outline px-3 py-2 text-sm hover:bg-surface-container-low sm:px-4"
              aria-expanded={showHistory}
            >
              <span className="material-symbols-outlined text-lg">history</span>
              View Changes
            </button>
            <button
              type="button"
              onClick={shareReport}
              className="inline-flex items-center gap-2 rounded-lg border border-outline px-3 py-2 text-sm hover:bg-surface-container-low sm:px-4"
            >
              <span className="material-symbols-outlined text-lg">share</span>
              Share Report
            </button>
          </div>
        </div>

        {notice && (
          <p role="status" className="mb-5 rounded-lg bg-primary/10 px-4 py-3 text-sm font-medium text-primary">
            {notice}
          </p>
        )}

        {showHistory && (
          <section className="mb-6 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-5 shadow-sm" aria-label="Review history">
            <h3 className="font-semibold">Review history</h3>
            <p className="mt-2 text-sm text-on-surface-variant">
              Submitted {item.reportedAt}; current status: {status}.
            </p>
          </section>
        )}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12 xl:gap-8">
          <div className="space-y-6 xl:col-span-8">
            <section className="overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest shadow-sm">
              <div className="p-5 sm:p-7">
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <span className="material-symbols-outlined text-3xl">castle</span>
                    </div>
                    <div>
                      <h3 className="font-headline-md text-headline-md">{item.attraction}</h3>
                      <p className="flex items-center gap-1 text-sm text-on-surface-variant">
                        <span className="material-symbols-outlined text-base">location_on</span>
                        {item.region}, Ghana
                      </p>
                    </div>
                  </div>
                  <div className="hidden text-right sm:block">
                    <div className="flex justify-end text-secondary" aria-label="4 out of 5 stars">
                      {'★★★★☆'.split('').map((star, index) => (
                        <span key={index} aria-hidden="true">{star}</span>
                      ))}
                    </div>
                    <span className="text-xs text-on-surface-variant">Reported {item.reportedAt}</span>
                  </div>
                </div>

                <blockquote className="mb-6 rounded-lg border-l-4 border-primary bg-surface-container-low p-4 text-base italic leading-relaxed sm:p-6 sm:text-lg">
                  {item.snippet}
                </blockquote>

                {item.image ? (
                  <div className="group relative overflow-hidden rounded-xl border-2 border-error/50 bg-surface-container-low">
                    <img
                      src={item.image}
                      alt={`Flagged submission for ${item.attraction}`}
                      className="aspect-video max-h-[560px] w-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-error/10">
                      <span className="inline-flex items-center gap-2 rounded-full bg-error px-5 py-3 text-sm font-bold uppercase tracking-widest text-white shadow-xl">
                        <span className="material-symbols-outlined">warning</span>
                        Flagged Area
                      </span>
                    </div>
                    <p className="absolute inset-x-3 bottom-3 rounded-lg bg-black/70 p-3 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 sm:inset-x-5 sm:bottom-5 sm:text-sm">
                      AI vision analysis detected possible {item.contentLabel.toLowerCase()} in the submitted content.
                    </p>
                  </div>
                ) : (
                  <div className="rounded-xl border border-outline-variant bg-surface-container-low p-6 text-sm text-on-surface-variant">
                    This report does not include an image attachment.
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-3 bg-surface-container-high px-5 py-4 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-7">
                <span className="text-on-surface-variant">Original submission · {item.type}</span>
                <span className="text-xs text-on-surface-variant">{item.contentLabel}</span>
              </div>
            </section>

            <section className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-5 shadow-sm sm:p-7">
              <h3 className="mb-5 font-headline-md text-headline-md">System Log &amp; Internal Notes</h3>
              <div className="space-y-4">
                <div className="flex gap-3 sm:gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary-container text-secondary">
                    <span className="material-symbols-outlined">smart_toy</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <span className="text-sm font-bold">Vision AI Bot</span>
                      <span className="text-xs text-on-surface-variant">· Reported {item.reportedAt}</span>
                    </div>
                    <p className="rounded-lg bg-surface-container p-3 text-sm text-on-surface-variant">
                      Automated scan flagged this submission based on {item.contentLabel.toLowerCase()} pattern detection.
                    </p>
                  </div>
                </div>
                {notes.map((postedNote, index) => (
                  <div key={`${index}-${postedNote}`} className="rounded-lg bg-primary/5 p-3 text-sm">
                    <p className="mb-1 font-bold text-primary">Internal note · Admin</p>
                    {postedNote}
                  </div>
                ))}
                <div className="flex gap-3 sm:gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <span className="material-symbols-outlined">person</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <label className="sr-only" htmlFor="review-note">Internal note</label>
                    <textarea
                      id="review-note"
                      value={note}
                      onChange={(event) => setNote(event.target.value)}
                      className="w-full rounded-xl border-outline-variant bg-surface-container-low p-4 text-sm focus:border-primary focus:ring-primary"
                      placeholder="Add an internal note for the site manager..."
                      rows={3}
                    />
                    <div className="mt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={postNote}
                        className="rounded-lg bg-primary/10 px-4 py-2 text-sm font-bold text-primary hover:bg-primary/20"
                      >
                        Post Note
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <aside className="space-y-6 xl:col-span-4">
            <section className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-5 shadow-sm sm:p-6">
              <h3 className="mb-5 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Contributor Profile</h3>
              <div className="mb-5 flex items-center gap-4">
                {item.portrait ? (
                  <img src={item.portrait} alt="" className="h-16 w-16 rounded-full object-cover" />
                ) : (
                  <span className={`flex h-16 w-16 items-center justify-center rounded-full text-lg font-bold ${item.avatar}`}>
                    {item.initials}
                  </span>
                )}
                <div className="min-w-0">
                  <h4 className="text-lg font-bold">{item.contributor}</h4>
                  <p className="text-sm text-on-surface-variant">{item.contributorDetail}</p>
                  <span className="mt-1 inline-block rounded-full bg-primary/10 px-3 py-0.5 text-xs font-bold text-primary">
                    Verified Contributor
                  </span>
                </div>
              </div>
              <div className="mb-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-surface-container-low p-3 text-center">
                  <div className="text-2xl font-bold text-primary">3</div>
                  <div className="text-[10px] font-bold uppercase text-on-surface-variant">Approved</div>
                </div>
                <div className="rounded-xl bg-surface-container-low p-3 text-center">
                  <div className="text-2xl font-bold text-error">0</div>
                  <div className="text-[10px] font-bold uppercase text-on-surface-variant">Violations</div>
                </div>
              </div>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between gap-3"><dt className="text-on-surface-variant">Account Age</dt><dd className="font-bold">14 Months</dd></div>
                <div className="flex justify-between gap-3"><dt className="text-on-surface-variant">Trust Score</dt><dd className="font-bold text-primary">98/100</dd></div>
                <div className="flex justify-between gap-3"><dt className="text-on-surface-variant">Last Activity</dt><dd className="font-bold">Today</dd></div>
              </dl>
            </section>

            <section className="rounded-xl border border-error/20 bg-error/5 p-5 shadow-sm sm:p-6">
              <h3 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-error">
                <span className="material-symbols-outlined">security</span>
                Risk Analysis
              </h3>
              <div className="space-y-3">
                <div className="rounded-lg bg-white/70 p-3">
                  <p className="mb-1 text-[10px] font-bold uppercase text-on-surface-variant">Primary Flag</p>
                  <p className="font-bold">{item.contentLabel}</p>
                </div>
                <div className="rounded-lg bg-white/70 p-3">
                  <p className="text-[10px] font-bold uppercase text-on-surface-variant">AI Confidence</p>
                  <div className="mt-2 h-2 rounded-full bg-surface-container-highest">
                    <div className="h-2 w-[88%] rounded-full bg-error" />
                  </div>
                  <p className="mt-1 text-right text-[10px] font-bold text-error">88.4% Confidence</p>
                </div>
                <div className="rounded-lg bg-white/70 p-3">
                  <p className="mb-1 text-[10px] font-bold uppercase text-on-surface-variant">Recommended Action</p>
                  <p className="text-sm font-bold">Escalate for manual site maintenance review.</p>
                </div>
              </div>
            </section>

            <section className="overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-5 shadow-sm sm:p-6">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Location Context</h3>
              <div className="relative mb-4 flex h-40 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 via-surface-container to-secondary-container/40">
                <span className="material-symbols-outlined text-4xl text-primary">location_on</span>
                <span className="absolute bottom-3 left-3 rounded bg-white/90 px-2 py-1 text-xs font-semibold">{item.attraction}</span>
              </div>
              <p className="mb-1 font-bold">{item.region}, Ghana</p>
              <p className="text-sm leading-relaxed text-on-surface-variant">
                Regional management should review the reported site condition and coordinate any required maintenance.
              </p>
            </section>
          </aside>
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-primary/10 bg-white/90 px-3 py-3 shadow-2xl backdrop-blur-xl sm:inset-x-4 sm:bottom-4 sm:mx-auto sm:w-fit sm:rounded-2xl sm:border-2 sm:px-5 sm:py-4 lg:left-64 lg:right-8">
        <div className="mx-auto flex max-w-xl items-center justify-center gap-2 sm:gap-3">
          <div className="mr-1 hidden border-r border-outline-variant/50 pr-4 text-left xl:block">
            <p className="text-[10px] font-bold uppercase text-on-surface-variant">Decision Required</p>
            <p className="text-sm font-medium">{item.id}</p>
          </div>
          <button
            type="button"
            onClick={() => decide('Escalated')}
            disabled={status === 'Escalated' || status === 'Approved' || status === 'Rejected'}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-surface-container-highest px-3 text-sm font-bold hover:bg-surface-container-high disabled:opacity-50 sm:px-5"
          >
            <span className="material-symbols-outlined text-lg">flag</span>
            <span className="hidden sm:inline">Escalate</span>
          </button>
          <button
            type="button"
            onClick={() => decide('Rejected')}
            disabled={status === 'Approved' || status === 'Rejected'}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-error px-3 text-sm font-bold text-white hover:bg-error/90 disabled:opacity-50 sm:px-5"
          >
            <span className="material-symbols-outlined text-lg">close</span>
            Reject
          </button>
          <button
            type="button"
            onClick={() => decide('Approved')}
            disabled={status === 'Approved' || status === 'Rejected'}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-3 text-sm font-bold text-white hover:bg-primary/90 disabled:opacity-50 sm:px-5"
          >
            <span className="material-symbols-outlined text-lg">check</span>
            Approve
          </button>
        </div>
      </div>
    </div>
  );
}
