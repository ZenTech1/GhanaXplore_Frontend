'use client';

import Link from 'next/link';
import { type FormEvent, useState } from 'react';

interface LoginSession {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  browser: string;
  icon: string;
  current: boolean;
}

const initialSessions: LoginSession[] = [
  {
    id: 'current',
    device: 'This Device (Current Session)',
    location: 'Accra, Ghana',
    lastActive: 'Active now',
    browser: 'Current browser',
    icon: 'laptop_mac',
    current: true,
  },
  {
    id: 'mobile',
    device: 'Mobile Device',
    location: 'Kumasi, Ghana',
    lastActive: '2 hours ago',
    browser: 'Safari on iOS',
    icon: 'smartphone',
    current: false,
  },
  {
    id: 'desktop',
    device: 'Desktop Computer',
    location: 'London, UK',
    lastActive: 'Yesterday, 14:30',
    browser: 'Edge on Windows',
    icon: 'desktop_windows',
    current: false,
  },
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

function passwordStrength(password: string) {
  if (!password) return 0;
  return [
    password.length >= 12,
    /[a-z]/.test(password) && /[A-Z]/.test(password),
    /\d/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ].filter(Boolean).length;
}

function strengthDescription(strength: number) {
  if (!strength) return { label: 'Password strength', color: 'text-on-surface-variant', bar: 'bg-surface-variant' };
  if (strength === 1) return { label: 'Weak', color: 'text-error', bar: 'bg-error' };
  if (strength === 2) return { label: 'Fair', color: 'text-secondary', bar: 'bg-secondary-container' };
  if (strength === 3) return { label: 'Good', color: 'text-primary', bar: 'bg-primary-fixed' };
  return { label: 'Strong', color: 'text-primary', bar: 'bg-primary' };
}

export function OperatorSecuritySettings() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [sessions, setSessions] = useState(initialSessions);
  const [strength, setStrength] = useState(0);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [notice, setNotice] = useState('');
  const strengthInfo = strengthDescription(strength);

  function togglePasswordVisibility(id: string) {
    setShowPasswords((current) => ({ ...current, [id]: !current[id] }));
  }

  function updatePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const currentPassword = formData.get('currentPassword');
    const newPassword = formData.get('newPassword');
    const confirmPassword = formData.get('confirmPassword');

    if (
      typeof currentPassword !== 'string' ||
      typeof newPassword !== 'string' ||
      typeof confirmPassword !== 'string' ||
      !currentPassword ||
      newPassword.length < 12 ||
      newPassword !== confirmPassword
    ) {
      setNotice(
        newPassword !== confirmPassword
          ? 'The new password and confirmation do not match.'
          : 'Enter your current password and a new password with at least 12 characters.',
      );
      return;
    }

    form.reset();
    setStrength(0);
    setNotice('Password updates are not connected to an authentication service. No password was changed.');
  }

  function removeSession(id: string) {
    setSessions((current) => current.filter((session) => session.id !== id));
    setNotice('Session removed from this demo only. No account session was revoked.');
  }

  function removeOtherSessions() {
    setSessions((current) => current.filter((session) => session.current));
    setNotice('Other sessions were removed from this demo only. No account sessions were revoked.');
  }

  function toggleTwoFactor() {
    setTwoFactorEnabled((enabled) => !enabled);
    setNotice('Two-factor authentication is not connected to an authentication service. This change is demo-only.');
  }

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
          <h1 className="font-headline-md text-headline-md">Security Settings</h1>
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

          <section className="mb-2">
            <p className="text-label-sm font-semibold uppercase tracking-[0.2em] text-secondary">Operator Account</p>
            <h2 className="font-display-lg-mobile text-display-lg-mobile text-on-surface lg:font-display-lg lg:text-display-lg">Security Settings</h2>
            <p className="mt-2 text-body-md text-on-surface-variant lg:text-body-lg">
              Manage your account protection and sign-in methods.
            </p>
          </section>

          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-8">
            <div className="flex flex-col gap-6 lg:col-span-4">
              <section className="relative overflow-hidden rounded-3xl bg-surface-container p-5 shadow-sm transition-transform duration-300 hover:-translate-y-1 sm:p-6">
                <div aria-hidden="true" className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary/10 blur-xl" />
                <div className="relative z-10 mb-4 flex items-center gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-container text-on-primary-container">
                    <Icon name="shield_person" className="text-2xl" />
                  </span>
                  <div>
                    <h3 className="font-headline-md text-headline-md">Two-Factor Auth</h3>
                    <p className={`mt-1 text-label-sm uppercase tracking-widest ${twoFactorEnabled ? 'text-primary' : 'text-on-surface-variant'}`}>
                      Status: {twoFactorEnabled ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                </div>
                <p className="relative z-10 mb-5 text-sm text-on-surface-variant sm:text-body-md">
                  Add an extra layer of security by requiring a code from your authenticator app when signing in.
                </p>
                <button
                  type="button"
                  aria-pressed={twoFactorEnabled}
                  onClick={toggleTwoFactor}
                  className="relative z-10 flex w-full items-center justify-between rounded-xl bg-surface-container-highest px-4 py-3 text-left font-label-lg transition-colors hover:bg-surface-variant"
                >
                  <span>Manage 2FA Settings</span>
                  <span className={`relative h-6 w-12 rounded-full transition-colors ${twoFactorEnabled ? 'bg-primary' : 'bg-surface-variant'}`}>
                    <span className={`absolute top-1 h-4 w-4 rounded-full bg-on-primary shadow-sm transition-transform ${twoFactorEnabled ? 'left-7' : 'left-1'}`} />
                  </span>
                </button>
              </section>

              <section className="rounded-3xl bg-surface-container-low p-5 shadow-sm sm:p-6">
                <h3 className="mb-4 font-headline-md text-headline-md">Recovery Methods</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <Icon name="mail" className="text-on-surface-variant" />
                      <div className="min-w-0">
                        <p className="font-label-lg">Email Address</p>
                        <p className="truncate text-label-sm text-on-surface-variant">k***@ghanaxplore.com</p>
                      </div>
                    </div>
                    <Link href="/operator/settings" aria-label="Edit recovery email in profile settings" className="rounded-full p-2 text-primary hover:bg-primary/10">
                      <Icon name="edit" />
                    </Link>
                  </div>
                  <div className="h-px w-full bg-outline-variant/30" />
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <Icon name="smartphone" className="text-on-surface-variant" />
                      <div className="min-w-0">
                        <p className="font-label-lg">Phone Number</p>
                        <p className="truncate text-label-sm text-on-surface-variant">+233 24 *** ****</p>
                      </div>
                    </div>
                    <Link href="/operator/settings" aria-label="Edit recovery phone in profile settings" className="rounded-full p-2 text-primary hover:bg-primary/10">
                      <Icon name="edit" />
                    </Link>
                  </div>
                </div>
              </section>
            </div>

            <div className="flex min-w-0 flex-col gap-6 lg:col-span-8">
              <section className="relative rounded-3xl bg-surface-container-lowest p-5 shadow-md sm:p-8">
                <div className="mb-6 flex items-start justify-between gap-4 sm:mb-8">
                  <div>
                    <h3 className="font-headline-md text-headline-md sm:font-headline-lg sm:text-headline-lg">Change Password</h3>
                    <p className="mt-1 text-sm text-on-surface-variant sm:text-body-md">
                      Use a unique password with at least 12 characters.
                    </p>
                  </div>
                  <Icon name="key" className="hidden text-[40px] text-surface-container-highest sm:inline-block" />
                </div>
                <form onSubmit={updatePassword} className="max-w-lg space-y-5">
                  {[
                    { id: 'current-password', name: 'currentPassword', label: 'Current Password', placeholder: 'Enter current password', autoComplete: 'current-password' },
                    { id: 'new-password', name: 'newPassword', label: 'New Password', placeholder: 'Create a new password', autoComplete: 'new-password' },
                    { id: 'confirm-password', name: 'confirmPassword', label: 'Confirm New Password', placeholder: 'Re-enter new password', autoComplete: 'new-password' },
                  ].map((field) => (
                    <div key={field.id}>
                      <label htmlFor={field.id} className="mb-2 block font-label-lg text-on-surface">{field.label}</label>
                      <div className="relative">
                        <input
                          id={field.id}
                          name={field.name}
                          type={showPasswords[field.id] ? 'text' : 'password'}
                          autoComplete={field.autoComplete}
                          required
                          minLength={field.name === 'newPassword' || field.name === 'confirmPassword' ? 12 : undefined}
                          onChange={field.name === 'newPassword' ? (event) => setStrength(passwordStrength(event.target.value)) : undefined}
                          placeholder={field.placeholder}
                          className="h-14 w-full rounded-xl bg-surface-container-low px-4 pr-12 font-body-md outline-none transition-shadow focus:ring-2 focus:ring-primary"
                        />
                        <button
                          type="button"
                          aria-label={`${showPasswords[field.id] ? 'Hide' : 'Show'} ${field.label.toLowerCase()}`}
                          aria-pressed={Boolean(showPasswords[field.id])}
                          onClick={() => togglePasswordVisibility(field.id)}
                          className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container hover:text-primary"
                        >
                          <Icon name={showPasswords[field.id] ? 'visibility' : 'visibility_off'} />
                        </button>
                      </div>
                      {field.name === 'newPassword' && (
                        <div className="mt-3" aria-live="polite">
                          <div className="flex h-1.5 w-full gap-1 overflow-hidden rounded-full bg-surface-container-highest">
                            {[1, 2, 3, 4].map((segment) => (
                              <span key={segment} className={`h-full flex-1 rounded-full ${strength >= segment ? strengthInfo.bar : 'bg-transparent'}`} />
                            ))}
                          </div>
                          <p className={`mt-1 text-right text-label-sm ${strengthInfo.color}`}>{strengthInfo.label}</p>
                        </div>
                      )}
                    </div>
                  ))}
                  <button type="submit" className="mt-2 w-full rounded-full bg-primary px-8 py-4 font-label-lg text-on-primary shadow-md transition-colors hover:bg-primary/90 sm:w-auto sm:rounded-xl">
                    Update Password
                  </button>
                </form>
              </section>

              <section className="rounded-3xl bg-surface-container-lowest p-5 shadow-md sm:p-8">
                <div className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-headline-md text-headline-md sm:font-headline-lg sm:text-headline-lg">Login Activity</h3>
                    <p className="mt-1 text-sm text-on-surface-variant sm:text-body-md">Recent devices shown in this demo.</p>
                  </div>
                  <button
                    type="button"
                    onClick={removeOtherSessions}
                    disabled={!sessions.some((session) => !session.current)}
                    className="inline-flex w-fit items-center gap-2 rounded-xl bg-error-container/40 px-4 py-2 font-label-lg text-error transition-colors hover:bg-error-container disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Icon name="logout" className="text-xl" />
                    Sign out all other sessions
                  </button>
                </div>
                <div className="space-y-2">
                  {sessions.map((session) => (
                    <article
                      key={session.id}
                      className={`flex items-start gap-3 rounded-2xl p-3 transition-colors sm:gap-4 sm:p-4 ${
                        session.current ? 'bg-primary-container/10' : 'hover:bg-surface-container-low'
                      }`}
                    >
                      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                        session.current ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container text-on-surface-variant'
                      }`}>
                        <Icon name={session.icon} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                          <p className="break-words font-label-lg">{session.device}</p>
                          {session.current ? (
                            <span className="w-fit rounded-full bg-primary px-2 py-1 text-[10px] uppercase tracking-wider text-on-primary">Active Now</span>
                          ) : (
                            <span className="text-label-sm text-on-surface-variant">{session.lastActive}</span>
                          )}
                        </div>
                        <p className="mt-1 text-sm text-on-surface-variant">{session.location} · {session.lastActive}</p>
                        <p className="mt-1 text-label-sm text-outline">{session.browser}</p>
                      </div>
                      {!session.current && (
                        <button
                          type="button"
                          aria-label={`Sign out ${session.device}`}
                          onClick={() => removeSession(session.id)}
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-error-container/50 hover:text-error"
                        >
                          <Icon name="logout" />
                        </button>
                      )}
                    </article>
                  ))}
                  {sessions.length === 0 && (
                    <p className="py-6 text-center text-sm text-on-surface-variant">No demo sessions remain in this list.</p>
                  )}
                </div>
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
    </div>
  );
}
