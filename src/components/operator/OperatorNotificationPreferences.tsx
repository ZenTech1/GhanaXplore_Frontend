'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type ChannelKey = 'email' | 'push' | 'sms';
type EventKey =
  | 'newBooking'
  | 'cancellations'
  | 'itineraryChanges'
  | 'guestReviews'
  | 'payoutInitiated'
  | 'payoutFailed'
  | 'monthlyInvoice'
  | 'directMessages'
  | 'responseWarnings'
  | 'featureAnnouncements'
  | 'marketingTips';
type ReportFrequency = 'daily' | 'weekly' | 'monthly' | 'none';

interface NotificationPreferences {
  channels: Record<ChannelKey, boolean>;
  events: Record<EventKey, boolean>;
  reportFrequency: ReportFrequency;
}

const STORAGE_KEY = 'ghanaxplore-operator-notification-preferences';
const defaultPreferences: NotificationPreferences = {
  channels: { email: true, push: true, sms: false },
  events: {
    newBooking: true,
    cancellations: true,
    itineraryChanges: true,
    guestReviews: false,
    payoutInitiated: true,
    payoutFailed: true,
    monthlyInvoice: false,
    directMessages: true,
    responseWarnings: true,
    featureAnnouncements: false,
    marketingTips: false,
  },
  reportFrequency: 'weekly',
};

const channels: Array<{
  key: ChannelKey;
  title: string;
  description: string;
  icon: string;
  iconClass: string;
}> = [
  {
    key: 'email',
    title: 'Email Notifications',
    description: 'Sent to kwame@ghanaxplore.com',
    icon: 'mail',
    iconClass: 'bg-primary-container text-on-primary-container',
  },
  {
    key: 'push',
    title: 'Push Notifications',
    description: 'Browser and mobile app',
    icon: 'notifications_active',
    iconClass: 'bg-secondary-container text-on-secondary-container',
  },
  {
    key: 'sms',
    title: 'SMS Alerts',
    description: 'For urgent issues only',
    icon: 'sms',
    iconClass: 'bg-surface-container-high text-on-surface-variant',
  },
];

const eventGroups: Array<{
  title: string;
  description: string;
  icon: string;
  iconClass: string;
  events: Array<{ key: EventKey; title: string; description: string; enabled: boolean }>;
}> = [
  {
    title: 'Bookings & Reservations',
    description: 'Alerts for new bookings, cancellations, and modifications.',
    icon: 'event_available',
    iconClass: 'text-primary',
    events: [
      { key: 'newBooking', title: 'New Booking Confirmed', description: 'Instant alerts for new reservations', enabled: true },
      { key: 'cancellations', title: 'Booking Cancellations', description: 'When a guest cancels a trip', enabled: true },
      { key: 'itineraryChanges', title: 'Itinerary Changes', description: 'Updates to a guest reservation', enabled: true },
      { key: 'guestReviews', title: 'Review Left by Guest', description: 'When a traveler reviews your experience', enabled: false },
    ],
  },
  {
    title: 'Payouts & Financials',
    description: 'Notifications regarding your revenue and bank transfers.',
    icon: 'payments',
    iconClass: 'text-secondary',
    events: [
      { key: 'payoutInitiated', title: 'Payout Initiated', description: 'When a payout is sent', enabled: true },
      { key: 'payoutFailed', title: 'Payout Failed', description: 'Issues with a bank transfer', enabled: true },
      { key: 'monthlyInvoice', title: 'Monthly Invoice Ready', description: 'Your monthly statement is available', enabled: false },
    ],
  },
  {
    title: 'Guest Communications',
    description: 'Direct messages and inquiries from prospective travelers.',
    icon: 'chat',
    iconClass: 'text-tertiary',
    events: [
      { key: 'directMessages', title: 'New Direct Message', description: 'Messages from travelers', enabled: true },
      { key: 'responseWarnings', title: 'Response Time Warning', description: 'A reminder to reply to a guest', enabled: true },
    ],
  },
  {
    title: 'System & Marketing',
    description: 'Platform updates, feature releases, and promotional tips.',
    icon: 'campaign',
    iconClass: 'text-error',
    events: [
      { key: 'featureAnnouncements', title: 'New Feature Announcements', description: 'Updates to GhanaXplore', enabled: false },
      { key: 'marketingTips', title: 'Marketing & Tips', description: 'Ideas to grow your operator business', enabled: false },
    ],
  },
];

const reportOptions: Array<{ key: ReportFrequency; title: string; desktopTitle: string }> = [
  { key: 'daily', title: 'Daily Digest', desktopTitle: 'Daily Summary (8:00 AM)' },
  { key: 'weekly', title: 'Weekly Summary', desktopTitle: 'Weekly Digest (Mondays)' },
  { key: 'monthly', title: 'Monthly Insights', desktopTitle: 'Monthly Insights' },
  { key: 'none', title: 'None', desktopTitle: 'Disable Reports' },
];

const operatorNavigation = [
  { label: 'Dashboard', icon: 'dashboard', href: '/dashboard' },
  { label: 'Attractions', icon: 'landscape', href: '/operator/attractions' },
  { label: 'Bookings', icon: 'calendar_month', href: '/operator/bookings' },
  { label: 'Analytics', icon: 'analytics', href: '/operator/analytics' },
  { label: 'Settings', icon: 'settings', href: '/operator/settings' },
];

function Icon({ name, className = '' }: { name: string; className?: string }) {
  return <span aria-hidden="true" className={`material-symbols-outlined ${className}`}>{name}</span>;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object';
}

function isNotificationPreferences(value: unknown): value is NotificationPreferences {
  if (!isRecord(value)) return false;
  const savedChannels = value.channels;
  const savedEvents = value.events;
  if (!isRecord(savedChannels) || !isRecord(savedEvents)) return false;
  const channelKeys: ChannelKey[] = ['email', 'push', 'sms'];
  const eventKeys: EventKey[] = [
    'newBooking',
    'cancellations',
    'itineraryChanges',
    'guestReviews',
    'payoutInitiated',
    'payoutFailed',
    'monthlyInvoice',
    'directMessages',
    'responseWarnings',
    'featureAnnouncements',
    'marketingTips',
  ];
  return (
    channelKeys.every((key) => typeof savedChannels[key] === 'boolean') &&
    eventKeys.every((key) => typeof savedEvents[key] === 'boolean') &&
    (value.reportFrequency === 'daily' ||
      value.reportFrequency === 'weekly' ||
      value.reportFrequency === 'monthly' ||
      value.reportFrequency === 'none')
  );
}

function readSavedPreferences(): NotificationPreferences | null {
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (!saved) return null;

  const parsed: unknown = JSON.parse(saved);
  if (!isNotificationPreferences(parsed)) {
    throw new Error('Saved notification preferences have an invalid format.');
  }
  return parsed;
}

export function OperatorNotificationPreferences() {
  const [preferences, setPreferences] = useState<NotificationPreferences>(defaultPreferences);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    try {
      const saved = readSavedPreferences();
      if (saved) setPreferences(saved);
    } catch (caught) {
      setNotice(caught instanceof Error ? caught.message : 'Unable to load notification preferences.');
    }
  }, []);

  function updateChannel(key: ChannelKey, enabled: boolean) {
    setPreferences((current) => ({
      ...current,
      channels: { ...current.channels, [key]: enabled },
    }));
  }

  function updateEvent(key: EventKey, enabled: boolean) {
    setPreferences((current) => ({
      ...current,
      events: { ...current.events, [key]: enabled },
    }));
  }

  function savePreferences() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
      setNotice('Notification preferences saved on this device.');
    } catch {
      setNotice('Notification preferences could not be saved in this browser.');
    }
  }

  function resetPreferences() {
    setPreferences(defaultPreferences);
    setNotice('Default preferences restored. Select Save Changes to keep them.');
  }

  const channelControls = channels.map((channel, index) => (
    <div key={channel.key}>
      {index > 0 && <div className="my-5 h-px w-full bg-outline-variant/30" />}
      <label className="flex cursor-pointer items-center justify-between gap-3">
        <span className="flex min-w-0 items-center gap-3 sm:gap-4">
          <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${channel.iconClass}`}>
            <Icon name={channel.icon} className="text-xl" />
          </span>
          <span className="min-w-0">
            <span className="block font-label-lg text-on-surface">{channel.title}</span>
            <span className="block text-xs text-on-surface-variant">{channel.description}</span>
          </span>
        </span>
        <span className="relative inline-flex h-6 w-12 shrink-0 items-center rounded-full bg-surface-variant transition-colors">
          <input
            type="checkbox"
            checked={preferences.channels[channel.key]}
            onChange={(event) => updateChannel(channel.key, event.target.checked)}
            aria-label={channel.title}
            className="peer sr-only"
          />
          <span className="pointer-events-none absolute inset-0 rounded-full bg-transparent transition-colors peer-checked:bg-primary" />
          <span className="pointer-events-none absolute left-1 h-4 w-4 rounded-full bg-on-surface-variant shadow-sm transition-all peer-checked:translate-x-6 peer-checked:bg-on-primary peer-focus-visible:ring-2 peer-focus-visible:ring-primary" />
        </span>
      </label>
    </div>
  ));

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
          <h1 className="font-headline-md text-headline-md lg:hidden">Notification Preferences</h1>
          <h1 className="hidden font-headline-md text-headline-md lg:block">Settings</h1>
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

      <main className="min-h-screen px-4 pb-28 pt-20 sm:px-8 lg:ml-64 lg:px-12 lg:pb-12 lg:pt-28">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 pb-8 lg:gap-10">
          {notice && (
            <div role="status" aria-live="polite" className="flex items-center justify-between gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-primary">
              <span>{notice}</span>
              <button type="button" aria-label="Dismiss notification" onClick={() => setNotice('')} className="shrink-0">
                <Icon name="close" />
              </button>
            </div>
          )}

          <section className="flex flex-col justify-between gap-5 pt-4 md:flex-row md:items-end">
            <div>
              <p className="text-label-sm font-semibold uppercase tracking-[0.2em] text-secondary">Operator Account</p>
              <h2 className="font-display-lg-mobile text-display-lg-mobile text-on-surface lg:font-display-lg lg:text-display-lg">
                Notification Preferences
              </h2>
              <p className="mt-2 max-w-2xl text-body-md text-on-surface-variant lg:text-body-lg">
                Control how and when you receive updates regarding your bookings, payouts, and operator account.
              </p>
            </div>
            <div className="hidden gap-3 md:flex">
              <button type="button" onClick={resetPreferences} className="rounded-full bg-surface-container px-5 py-3 font-label-lg transition-colors hover:bg-surface-container-high">
                Reset to Default
              </button>
              <button type="button" onClick={savePreferences} className="rounded-full bg-primary px-6 py-3 font-label-lg text-on-primary shadow-md transition-colors hover:bg-primary-container hover:text-on-primary-container">
                Save Changes
              </button>
            </div>
          </section>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
            <div className="flex flex-col gap-6 lg:col-span-4">
              <section className="group relative overflow-hidden rounded-2xl bg-surface-container-lowest p-5 shadow-[0_4px_24px_rgba(0,0,0,0.03)] transition-shadow duration-500 hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] sm:p-6">
                <div aria-hidden="true" className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/5 blur-2xl transition-colors group-hover:bg-primary/10" />
                <h3 className="relative z-10 mb-6 font-headline-md text-headline-md">Delivery Channels</h3>
                <div className="relative z-10">{channelControls}</div>
              </section>

              <section className="relative overflow-hidden rounded-2xl bg-tertiary-container p-5 text-on-tertiary-container shadow-md sm:p-6">
                <svg aria-hidden="true" className="absolute bottom-0 right-0 h-48 w-48 translate-x-8 translate-y-8 opacity-10" fill="currentColor" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                  <path d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.1,-46.3C90.4,-33.5,96.1,-18.1,95.4,-3.2C94.7,11.8,87.6,26.3,77.7,38.1C67.8,49.9,55.1,59,41.4,66.1C27.7,73.2,13.9,78.3,-0.6,79.5C-15.1,80.7,-30.2,78,-43.3,70.9C-56.4,63.8,-67.5,52.3,-75.7,39C-83.9,25.7,-89.2,10.6,-88.7,-4.3C-88.2,-19.2,-81.9,-33.9,-72.6,-45.5C-63.3,-57.1,-51.1,-65.6,-37.9,-73.2C-24.7,-80.8,-10.5,-87.5,2.7,-91.3C15.9,-95.1,30.5,-83.6,44.7,-76.4Z" transform="translate(100 100)" />
                </svg>
                <h3 className="relative z-10 mb-2 font-headline-md text-headline-md">Automated Reports</h3>
                <p className="relative z-10 mb-6 text-sm opacity-90 sm:text-body-md">
                  Receive consolidated updates to avoid notification fatigue.
                </p>
                <fieldset className="relative z-10 space-y-3">
                  <legend className="sr-only">Automated report frequency</legend>
                  {reportOptions.map((option) => (
                    <label key={option.key} className="flex cursor-pointer items-center gap-3 text-sm sm:text-label-lg">
                      <input
                        type="radio"
                        name="report-frequency"
                        value={option.key}
                        checked={preferences.reportFrequency === option.key}
                        onChange={() => setPreferences((current) => ({ ...current, reportFrequency: option.key }))}
                        className="h-4 w-4 accent-on-tertiary-container"
                      />
                      <span className="sm:hidden">{option.title}</span>
                      <span className="hidden sm:inline">{option.desktopTitle}</span>
                    </label>
                  ))}
                </fieldset>
              </section>

              <section className="hidden items-center gap-5 rounded-2xl bg-surface-container-lowest p-5 shadow-sm lg:flex">
                <div className="relative h-16 w-16 shrink-0">
                  <svg aria-hidden="true" className="-rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e5e2e1" strokeWidth="3" />
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#0d631b" strokeDasharray="85, 100" strokeLinecap="round" strokeWidth="3" />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-label-sm">85%</span>
                </div>
                <div>
                  <h3 className="font-headline-md text-headline-md">High Responsiveness</h3>
                  <p className="text-sm text-on-surface-variant">
                    You reply to 85% of notifications within 1 hour. Keep it up!
                  </p>
                </div>
              </section>
            </div>

            <section className="rounded-2xl bg-surface-container-lowest p-5 shadow-[0_4px_24px_rgba(0,0,0,0.03)] sm:p-8 lg:col-span-8">
              <h3 className="mb-6 font-label-lg uppercase tracking-wider text-primary lg:mb-8 lg:font-headline-lg lg:normal-case lg:tracking-normal lg:text-on-surface">
                <span className="lg:hidden">Event Categories</span>
                <span className="hidden lg:inline">Event Categories</span>
              </h3>
              <div className="space-y-7 lg:space-y-8">
                {eventGroups.map((group, groupIndex) => (
                  <div key={group.title}>
                    {groupIndex > 0 && <div className="mb-7 h-px w-full bg-outline-variant/50 lg:mb-8" />}
                    <div className="mb-4 flex items-start gap-3">
                      <Icon name={group.icon} className={`mt-0.5 ${group.iconClass}`} />
                      <div>
                        <h4 className="font-headline-md text-on-surface">{group.title}</h4>
                        <p className="mt-1 text-sm text-on-surface-variant">{group.description}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-3 rounded-xl bg-surface-container-low p-4 sm:grid-cols-2">
                      {group.events.map((event) => (
                        <label key={event.key} className="flex cursor-pointer items-start gap-3">
                          <input
                            type="checkbox"
                            checked={preferences.events[event.key]}
                            onChange={(change) => updateEvent(event.key, change.target.checked)}
                            aria-label={event.title}
                            className="mt-0.5 h-5 w-5 shrink-0 rounded border-outline accent-primary focus:ring-primary"
                          />
                          <span>
                            <span className="block font-label-lg">{event.title}</span>
                            <span className="block text-xs text-on-surface-variant lg:hidden">{event.description}</span>
                          </span>
                        </label>
                      ))}
                      {group.title === 'System & Marketing' && (
                        <label className="flex cursor-not-allowed items-start gap-3 opacity-70">
                          <input type="checkbox" checked disabled aria-label="Critical System Alerts are always enabled" className="mt-0.5 h-5 w-5 shrink-0 accent-primary" />
                          <span className="font-label-lg">
                            Critical System Alerts
                            <span className="ml-2 inline-flex rounded-full bg-error-container px-2 py-0.5 text-[10px] uppercase tracking-wider text-on-error-container">Required</span>
                          </span>
                        </label>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="md:hidden">
            <button type="button" onClick={savePreferences} className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-4 font-label-lg text-on-primary shadow-md transition-colors hover:bg-primary/90">
              <Icon name="save" className="text-xl" />
              Save Preferences
            </button>
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
    </div>
  );
}
