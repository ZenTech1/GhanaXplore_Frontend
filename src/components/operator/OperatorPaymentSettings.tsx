'use client';

import Link from 'next/link';
import { type FormEvent, useState } from 'react';

type PaymentMethodType = 'bank' | 'mobile-money';
type PayoutSchedule = 'weekly' | 'biweekly' | 'monthly';

interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  name: string;
  lastFour: string;
  primary: boolean;
}

interface PaymentMethodDraft {
  type: PaymentMethodType;
  name: string;
  lastFour: string;
  primary: boolean;
}

const initialMethods: PaymentMethod[] = [
  { id: 'bank-1', type: 'bank', name: 'EcoBank Ghana Ltd.', lastFour: '4829', primary: true },
  { id: 'momo-1', type: 'mobile-money', name: 'MTN Mobile Money', lastFour: '4567', primary: false },
];

const initialPayouts = [
  { id: 'payout-1', amount: 'GH₵ 4,250.00', date: 'Oct 12, 2023', method: 'EcoBank', status: 'Paid' },
  { id: 'payout-2', amount: 'GH₵ 1,120.50', date: 'Oct 05, 2023', method: 'MTN MoMo', status: 'Paid' },
  { id: 'payout-3', amount: 'GH₵ 3,890.50', date: 'Sep 28, 2023', method: 'EcoBank', status: 'Paid' },
];

const operatorNavigation = [
  { label: 'Dashboard', icon: 'dashboard', href: '/dashboard' },
  { label: 'Attractions', icon: 'landscape', href: '/operator/attractions' },
  { label: 'Bookings', icon: 'calendar_month', href: '/operator/bookings' },
  { label: 'Analytics', icon: 'analytics', href: '/operator/analytics' },
  { label: 'Settings', icon: 'settings', href: '/operator/settings' },
];

const emptyDraft: PaymentMethodDraft = {
  type: 'bank',
  name: '',
  lastFour: '',
  primary: false,
};

function Icon({ name, className = '' }: { name: string; className?: string }) {
  return <span aria-hidden="true" className={`material-symbols-outlined ${className}`}>{name}</span>;
}

export function OperatorPaymentSettings() {
  const [methods, setMethods] = useState(initialMethods);
  const [schedule, setSchedule] = useState<PayoutSchedule>('weekly');
  const [draft, setDraft] = useState<PaymentMethodDraft>(emptyDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [taxInfo, setTaxInfo] = useState({
    entityName: 'GhanaXplore Adventures Ltd.',
    tin: '',
    registrationNumber: '',
    vatNumber: '',
  });
  const [notice, setNotice] = useState('');

  function openAddMethod() {
    setDraft({ ...emptyDraft, primary: methods.length === 0 });
    setEditingId('new');
  }

  function openEditMethod(method: PaymentMethod) {
    setDraft({
      type: method.type,
      name: method.name,
      lastFour: method.lastFour,
      primary: method.primary,
    });
    setEditingId(method.id);
  }

  function closeMethodDialog() {
    setEditingId(null);
    setDraft(emptyDraft);
  }

  function saveMethod(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = draft.name.trim();
    const lastFour = draft.lastFour.trim();
    if (!name || !/^\d{4}$/.test(lastFour)) {
      setNotice('Enter a method name and exactly four account-ending digits.');
      return;
    }

    if (editingId === 'new') {
      const newMethod: PaymentMethod = {
        id: `method-${Date.now()}`,
        type: draft.type,
        name,
        lastFour,
        primary: draft.primary || methods.length === 0,
      };
      setMethods((current) => [
        ...current.map((method) => (newMethod.primary ? { ...method, primary: false } : method)),
        newMethod,
      ]);
    } else if (editingId) {
      setMethods((current) =>
        current.map((method) => ({
          ...(method.id === editingId
            ? { ...method, type: draft.type, name, lastFour, primary: draft.primary }
            : method),
          ...(draft.primary && method.id !== editingId ? { primary: false } : {}),
        })),
      );
    }

    closeMethodDialog();
    setNotice('Payout method updated in this demo only. No account information was sent or saved.');
  }

  function removeMethod(id: string) {
    const removed = methods.find((method) => method.id === id);
    if (!removed) return;
    const remaining = methods.filter((method) => method.id !== id);
    if (removed.primary && remaining.length > 0) {
      remaining[0] = { ...remaining[0], primary: true };
    }
    setMethods(remaining);
    setNotice('Payout method removed from this demo only. No payment account was changed.');
  }

  function makePrimary(id: string) {
    setMethods((current) => current.map((method) => ({ ...method, primary: method.id === id })));
    setNotice('Primary payout method changed in this demo only.');
  }

  function saveTaxInfo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice('Tax details are preview-only in this demo. Nothing was sent or saved.');
  }

  const methodDialog = editingId && (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-on-surface/40 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeMethodDialog();
      }}
    >
      <section role="dialog" aria-modal="true" aria-labelledby="method-dialog-title" className="w-full max-w-md rounded-2xl bg-surface p-5 shadow-2xl sm:p-6">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 id="method-dialog-title" className="font-headline-md text-headline-md">
            {editingId === 'new' ? 'Add Payout Method' : 'Edit Payout Method'}
          </h2>
          <button type="button" onClick={closeMethodDialog} aria-label="Close dialog" className="flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container">
            <Icon name="close" />
          </button>
        </div>
        <p className="mb-5 text-sm text-on-surface-variant">
          Demo only. Enter a display name and the last four digits; do not enter a full account number.
        </p>
        <form onSubmit={saveMethod} className="space-y-4">
          <label className="block font-label-lg" htmlFor="method-type">
            Method type
            <select
              id="method-type"
              value={draft.type}
              onChange={(event) => setDraft((current) => ({
                ...current,
                type: event.target.value === 'mobile-money' ? 'mobile-money' : 'bank',
              }))}
              className="mt-2 h-12 w-full rounded-xl border border-outline-variant/60 bg-surface px-3 font-body-md focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="bank">Bank account</option>
              <option value="mobile-money">Mobile Money</option>
            </select>
          </label>
          <label className="block font-label-lg" htmlFor="method-name">
            Bank or provider name
            <input
              id="method-name"
              required
              maxLength={60}
              value={draft.name}
              onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))}
              className="mt-2 h-12 w-full rounded-xl border border-outline-variant/60 bg-surface px-3 font-body-md focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </label>
          <label className="block font-label-lg" htmlFor="method-last-four">
            Account ending in
            <input
              id="method-last-four"
              required
              inputMode="numeric"
              autoComplete="off"
              pattern="\d{4}"
              maxLength={4}
              value={draft.lastFour}
              onChange={(event) => setDraft((current) => ({
                ...current,
                lastFour: event.target.value.replace(/\D/g, '').slice(0, 4),
              }))}
              placeholder="4 digits only"
              className="mt-2 h-12 w-full rounded-xl border border-outline-variant/60 bg-surface px-3 font-body-md focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </label>
          <label className="flex items-center gap-3 rounded-xl bg-surface-container-low p-3 font-label-lg">
            <input
              type="checkbox"
              checked={draft.primary}
              onChange={(event) => setDraft((current) => ({ ...current, primary: event.target.checked }))}
              className="h-5 w-5 accent-primary"
            />
            Make this my primary payout method
          </label>
          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button type="button" onClick={closeMethodDialog} className="rounded-xl bg-surface-container-high px-5 py-3 font-label-lg hover:bg-surface-variant">
              Cancel
            </button>
            <button type="submit" className="rounded-xl bg-primary px-5 py-3 font-label-lg text-on-primary hover:bg-primary/90">
              Save Method
            </button>
          </div>
        </form>
      </section>
    </div>
  );

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
          <h1 className="font-headline-md text-headline-md">Payment Settings</h1>
        </div>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-on-primary">
          <Icon name="person" />
        </span>
      </header>

      <main className="min-h-screen px-4 pb-24 pt-20 sm:px-8 lg:ml-64 lg:px-12 lg:pb-12 lg:pt-28">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 lg:gap-8">
          {notice && (
            <div role="status" aria-live="polite" className="flex items-center justify-between gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-primary">
              <span>{notice}</span>
              <button type="button" aria-label="Dismiss notification" onClick={() => setNotice('')} className="shrink-0">
                <Icon name="close" />
              </button>
            </div>
          )}

          <section>
            <p className="text-label-sm font-semibold uppercase tracking-[0.2em] text-secondary">Operator Account</p>
            <h2 className="font-display-lg-mobile text-display-lg-mobile text-on-surface lg:font-display-lg lg:text-display-lg">Payment Settings</h2>
            <p className="mt-2 max-w-3xl text-body-md text-on-surface-variant lg:text-body-lg">
              Manage your payout methods, schedule, and tax information for revenue processing.
            </p>
          </section>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
            <div className="flex flex-col gap-6 lg:col-span-8 lg:gap-8">
              <section className="group relative overflow-hidden rounded-3xl bg-surface-container p-5 shadow-sm sm:p-8">
                <div aria-hidden="true" className="absolute -right-32 -top-32 h-64 w-64 rounded-full bg-primary-fixed/20 opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100" />
                <div className="relative z-10 flex flex-col gap-6">
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div>
                      <h3 className="font-headline-md text-headline-md">Payout Methods</h3>
                      <p className="text-sm text-on-surface-variant sm:text-body-md">Where we send your earnings.</p>
                    </div>
                    <button type="button" onClick={openAddMethod} className="flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-primary px-5 py-3 font-label-lg text-on-primary shadow-md transition-colors hover:bg-primary/90">
                      <Icon name="add" className="text-xl" />
                      Add Method
                    </button>
                  </div>

                  <div className="flex flex-col gap-3">
                    {methods.map((method) => (
                      <article key={method.id} className="relative flex flex-col justify-between gap-4 overflow-hidden rounded-2xl bg-surface p-4 shadow-sm sm:flex-row sm:items-center sm:p-6">
                        {method.primary && <span className="absolute bottom-0 left-0 top-0 w-1 bg-primary" />}
                        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                          <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
                            method.type === 'bank' ? 'bg-surface-container-high text-primary' : 'bg-secondary-fixed/20 text-secondary'
                          }`}>
                            <Icon name={method.type === 'bank' ? 'account_balance' : 'smartphone'} className="text-2xl" />
                          </span>
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-label-lg">{method.name}</p>
                              {method.primary && <span className="rounded-full bg-primary-fixed-dim/30 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-on-primary-fixed-variant">Primary</span>}
                            </div>
                            <p className="mt-1 text-sm text-on-surface-variant">Account ending in •••• {method.lastFour}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-end gap-2">
                          {!method.primary && (
                            <button type="button" onClick={() => makePrimary(method.id)} aria-label={`Make ${method.name} primary`} title="Make Primary" className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-primary">
                              <Icon name="star_border" className="text-xl" />
                            </button>
                          )}
                          <button type="button" onClick={() => openEditMethod(method)} aria-label={`Edit ${method.name}`} title="Edit" className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-primary">
                            <Icon name="edit" className="text-xl" />
                          </button>
                          <button type="button" onClick={() => removeMethod(method.id)} aria-label={`Remove ${method.name}`} title="Remove" className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-error-container hover:text-error">
                            <Icon name="delete" className="text-xl" />
                          </button>
                        </div>
                      </article>
                    ))}
                    {methods.length === 0 && (
                      <p className="rounded-xl bg-surface p-6 text-center text-sm text-on-surface-variant">No payout methods in this demo.</p>
                    )}
                  </div>
                </div>
              </section>

              <section className="rounded-3xl bg-surface-container p-5 shadow-sm sm:p-8">
                <div className="mb-5">
                  <h3 className="font-headline-md text-headline-md">Tax Information</h3>
                  <p className="text-sm text-on-surface-variant sm:text-body-md">Required for compliance and invoicing.</p>
                </div>
                <form onSubmit={saveTaxInfo} className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <label htmlFor="entity-name" className="font-label-lg">
                    Business Entity Name
                    <input
                      id="entity-name"
                      value={taxInfo.entityName}
                      maxLength={100}
                      onChange={(event) => setTaxInfo((current) => ({ ...current, entityName: event.target.value }))}
                      className="mt-2 w-full rounded-xl border-2 border-transparent bg-surface px-4 py-3 font-body-md shadow-sm transition-colors focus:border-primary focus:outline-none"
                    />
                  </label>
                  <label htmlFor="tin" className="font-label-lg">
                    Tax Identification Number (TIN)
                    <input
                      id="tin"
                      value={taxInfo.tin}
                      maxLength={30}
                      autoComplete="off"
                      onChange={(event) => setTaxInfo((current) => ({ ...current, tin: event.target.value }))}
                      placeholder="Enter TIN"
                      className="mt-2 w-full rounded-xl border-2 border-transparent bg-surface px-4 py-3 font-mono font-normal shadow-sm transition-colors focus:border-primary focus:outline-none"
                    />
                  </label>
                  <label htmlFor="registration-number" className="font-label-lg md:col-span-2">
                    Business Registration Number
                    <input
                      id="registration-number"
                      value={taxInfo.registrationNumber}
                      maxLength={40}
                      autoComplete="off"
                      onChange={(event) => setTaxInfo((current) => ({ ...current, registrationNumber: event.target.value }))}
                      placeholder="Enter business registration number"
                      className="mt-2 w-full rounded-xl border-2 border-transparent bg-surface px-4 py-3 font-mono font-normal shadow-sm transition-colors focus:border-primary focus:outline-none"
                    />
                  </label>
                  <label htmlFor="vat-number" className="font-label-lg md:col-span-2">
                    VAT Registration Number (Optional)
                    <input
                      id="vat-number"
                      value={taxInfo.vatNumber}
                      maxLength={40}
                      autoComplete="off"
                      onChange={(event) => setTaxInfo((current) => ({ ...current, vatNumber: event.target.value }))}
                      placeholder="Enter VAT number if applicable"
                      className="mt-2 w-full rounded-xl border-2 border-transparent bg-surface px-4 py-3 font-mono font-normal shadow-sm transition-colors focus:border-primary focus:outline-none"
                    />
                  </label>
                  <div className="pt-1 md:col-span-2">
                    <button type="submit" className="w-full rounded-full bg-surface-variant px-6 py-3 font-label-lg text-on-surface-variant shadow-sm transition-colors hover:bg-surface-container-highest sm:w-auto">
                      Save Tax Details
                    </button>
                  </div>
                </form>
              </section>
            </div>

            <div className="flex flex-col gap-6 lg:col-span-4 lg:gap-8">
              <section className="relative overflow-hidden rounded-3xl bg-secondary-container p-5 shadow-md sm:p-6">
                <div aria-hidden="true" className="pointer-events-none absolute right-0 top-0 p-4 opacity-10">
                  <Icon name="calendar_month" className="rotate-12 text-[100px] text-on-secondary-container sm:text-[120px]" />
                </div>
                <div className="relative z-10 flex flex-col gap-4">
                  <h3 className="font-headline-md text-headline-md text-on-secondary-container">Payout Schedule</h3>
                  <fieldset className="flex flex-col gap-2">
                    <legend className="sr-only">Choose payout schedule</legend>
                    {([
                      { key: 'weekly', title: 'Weekly', detail: 'Every Monday' },
                      { key: 'biweekly', title: 'Bi-Weekly', detail: '1st & 15th' },
                      { key: 'monthly', title: 'Monthly', detail: 'Last day of the month' },
                    ] as const).map((option) => (
                      <label key={option.key} className="flex cursor-pointer items-center gap-3 rounded-xl bg-surface/50 p-3 transition-colors hover:bg-surface/80">
                        <input
                          type="radio"
                          name="payout-schedule"
                          value={option.key}
                          checked={schedule === option.key}
                          onChange={() => setSchedule(option.key)}
                          className="h-5 w-5 accent-secondary"
                        />
                        <span className="font-label-lg text-on-secondary-container">
                          {option.title} <span className="font-normal">({option.detail})</span>
                        </span>
                      </label>
                    ))}
                  </fieldset>
                  <p className="text-sm text-on-secondary-container/80">
                    Next estimated payout: <strong>Based on your selected schedule</strong>
                  </p>
                  <p className="text-xs text-on-secondary-container/80">Schedule changes are preview-only in this demo.</p>
                </div>
              </section>

              <section className="flex flex-col gap-3 rounded-3xl bg-surface-container p-5 shadow-sm sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-headline-md text-headline-md">Recent Payouts</h3>
                  <button type="button" aria-label="View all payouts" onClick={() => setNotice('Full payout history is not connected in this demo.')} className="rounded-full p-2 text-primary transition-colors hover:bg-primary/10">
                    <Icon name="open_in_new" />
                  </button>
                </div>
                <div className="flex flex-col gap-1">
                  {initialPayouts.map((payout) => (
                    <article key={payout.id} className="flex items-center justify-between gap-3 rounded-xl p-3 transition-colors hover:bg-surface">
                      <div className="min-w-0">
                        <p className="font-label-lg">{payout.amount}</p>
                        <p className="mt-1 text-sm text-on-surface-variant">{payout.date} · {payout.method}</p>
                      </div>
                      <span className="shrink-0 rounded-full bg-primary-fixed-dim/20 px-3 py-1 text-label-sm text-on-primary-fixed-variant">{payout.status}</span>
                    </article>
                  ))}
                </div>
                <button type="button" onClick={() => setNotice('Full payout history is not connected in this demo.')} className="mt-1 w-full py-2 text-center font-label-lg text-primary hover:underline">
                  View All Transactions
                </button>
              </section>
            </div>
          </div>
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

      {methodDialog}
    </div>
  );
}
