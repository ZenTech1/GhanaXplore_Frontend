'use client';

import Link from 'next/link';
import { type ChangeEvent, type FormEvent, useEffect, useRef, useState } from 'react';

interface OperatorProfile {
  fullName: string;
  email: string;
  phone: string;
  businessName: string;
  bio: string;
}

const STORAGE_KEY = 'ghanaxplore-operator-profile';
const defaultProfile: OperatorProfile = {
  fullName: 'Kwame Mensah',
  email: 'kwame.mensah@ghanaxplore.com',
  phone: '55 123 4567',
  businessName: "Kwame's Heritage Tours",
  bio: 'Passionate local guide specializing in cultural heritage tours across the Ashanti region. Over 10 years of experience connecting travelers with authentic Ghanaian stories.',
};

const operatorNavigation = [
  { label: 'Dashboard', icon: 'dashboard', href: '/dashboard' },
  { label: 'Attractions', icon: 'landscape', href: '/operator/attractions' },
  { label: 'Bookings', icon: 'calendar_month', href: '/operator/bookings' },
  { label: 'Analytics', icon: 'analytics', href: '/operator/analytics' },
  { label: 'Settings', icon: 'settings', href: '/operator/settings' },
];

const settingsSections = [
  { label: 'Profile Details', icon: 'person', href: '/operator/settings' },
  { label: 'Business Verification', icon: 'verified_user', href: '/operator/settings/verification' },
  { label: 'Security & Password', icon: 'security', href: '/operator/settings/security' },
  { label: 'Payout Methods', icon: 'payments', href: '/operator/settings/payments' },
  { label: 'Notification Preferences', icon: 'notifications_active', href: '/operator/settings/notifications' },
];

function Icon({ name, className = '' }: { name: string; className?: string }) {
  return <span aria-hidden="true" className={`material-symbols-outlined ${className}`}>{name}</span>;
}

function isOperatorProfile(value: unknown): value is OperatorProfile {
  if (!value || typeof value !== 'object') return false;
  const profile = value as Record<string, unknown>;
  return (
    typeof profile.fullName === 'string' &&
    typeof profile.email === 'string' &&
    typeof profile.phone === 'string' &&
    typeof profile.businessName === 'string' &&
    typeof profile.bio === 'string' &&
    profile.bio.length <= 300
  );
}

function readSavedProfile(): OperatorProfile | null {
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (!saved) return null;

  const parsed: unknown = JSON.parse(saved);
  if (!isOperatorProfile(parsed)) {
    throw new Error('Saved profile details have an invalid format.');
  }
  return parsed;
}

export function OperatorSettings() {
  const [profile, setProfile] = useState<OperatorProfile>(defaultProfile);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarChanged, setAvatarChanged] = useState(false);
  const [notice, setNotice] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const saved = readSavedProfile();
      if (saved) setProfile(saved);
    } catch (caught) {
      setNotice(caught instanceof Error ? caught.message : 'Unable to load saved profile details.');
    }
  }, []);

  useEffect(() => {
    if (!avatarUrl) return;
    return () => URL.revokeObjectURL(avatarUrl);
  }, [avatarUrl]);

  function updateProfile(field: keyof OperatorProfile, value: string) {
    setProfile((current) => ({ ...current, [field]: value }));
  }

  function selectAvatar(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    const supportedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!supportedTypes.includes(file.type)) {
      setNotice('Choose a JPG, PNG, or WebP image.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setNotice('The profile photo must be 5MB or smaller.');
      return;
    }

    setAvatarUrl(URL.createObjectURL(file));
    setAvatarChanged(true);
    setNotice('Photo preview updated. It will not be uploaded in this demo.');
  }

  function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
      setNotice(
        avatarChanged
          ? 'Profile details saved on this device. Photo changes are preview-only in this demo.'
          : 'Profile details saved on this device.',
      );
    } catch {
      setNotice('Profile details could not be saved in this browser.');
    }
  }

  function removeAvatar() {
    setAvatarUrl(null);
    setAvatarChanged(true);
    setNotice('Photo removed from the preview. This change is not uploaded in the demo.');
  }

  const navigationLinks = (
    <>
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
    </>
  );

  const contextualNavigation = (
    <nav aria-label="Settings sections" className="flex gap-2 overflow-x-auto lg:flex-col lg:gap-1">
      {settingsSections.map((section) => {
        const active = section.label === 'Profile Details';
        if (section.href) {
          return (
            <Link
              key={section.label}
              href={section.href}
              aria-current={active ? 'page' : undefined}
              className={`relative flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-left font-label-lg transition-colors ${
                active
                  ? 'bg-surface-container-high text-on-surface'
                  : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
              }`}
            >
              {active && <span className="absolute bottom-2 left-0 top-2 w-1 rounded-r-full bg-primary" />}
              <Icon name={section.icon} className={active ? 'text-primary' : ''} />
              {section.label}
            </Link>
          );
        }
        return (
          <button
            key={section.label}
            type="button"
            onClick={() => {
              setNotice(`${section.label} settings are not available yet.`);
            }}
            className="relative flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-left font-label-lg text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-on-surface"
          >
            <Icon name={section.icon} />
            {section.label}
          </button>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen overflow-x-hidden bg-surface text-on-surface">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-outline-variant/20 bg-surface-container-low p-4 lg:flex">
        <Link href="/dashboard" className="mb-8 px-3 py-4 font-headline-md text-headline-md font-bold text-primary">
          GhanaXplore
          <span className="mt-1 block text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant">Operator Portal</span>
        </Link>
        <nav aria-label="Operator navigation" className="flex flex-col gap-1">
          {navigationLinks}
        </nav>
        <div className="mt-auto border-t border-outline-variant/20 p-3">
          <p className="font-label-lg font-bold">{profile.fullName || 'Operator'}</p>
          <p className="truncate text-xs text-on-surface-variant">{profile.businessName || 'Operator account'}</p>
        </div>
      </aside>

      <header className="fixed inset-x-0 top-0 z-30 flex h-16 items-center justify-between border-b border-outline-variant/20 bg-surface/90 px-4 backdrop-blur-xl lg:left-64 lg:h-20 lg:px-8">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" aria-label="Back to dashboard" className="flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container lg:hidden">
            <Icon name="arrow_back" />
          </Link>
          <h1 className="font-headline-md text-headline-md">Business Profile</h1>
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
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
          {notice && (
            <div role="status" aria-live="polite" className="flex items-center justify-between gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-primary">
              <span>{notice}</span>
              <button type="button" aria-label="Dismiss notification" onClick={() => setNotice('')} className="shrink-0">
                <Icon name="close" />
              </button>
            </div>
          )}

          <section className="relative flex flex-col justify-between gap-5 border-b border-outline-variant/50 pb-6 after:absolute after:bottom-0 after:left-0 after:h-1 after:w-24 after:rounded-full after:bg-primary lg:flex-row lg:items-end">
            <div>
              <p className="text-label-sm font-semibold uppercase tracking-[0.2em] text-secondary">Operator Account</p>
              <h2 className="mb-2 font-display-lg-mobile text-display-lg-mobile text-on-surface lg:font-display-lg lg:text-display-lg">Profile Details</h2>
              <p className="max-w-2xl text-body-md text-on-surface-variant">
                Manage your personal operator identity and business contact information displayed to travelers.
              </p>
            </div>
            <span className="hidden items-center gap-2 self-start rounded-full bg-primary-container px-4 py-2 font-label-lg text-on-primary-container lg:inline-flex">
              <span className="h-2 w-2 animate-pulse rounded-full bg-on-primary-container" />
              Gold Tier Operator
            </span>
          </section>

          <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-3">{contextualNavigation}</div>

            <div className="flex flex-col gap-6 lg:col-span-9 lg:gap-8">
              <section aria-labelledby="avatar-heading" className="group relative overflow-hidden rounded-2xl bg-surface-container p-5 shadow-sm sm:p-8">
                <div aria-hidden="true" className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl transition-colors duration-700 group-hover:bg-primary/10" />
                <div aria-hidden="true" className="absolute bottom-8 right-8 h-32 w-32 rounded-full bg-secondary/10 blur-2xl" />
                <h3 id="avatar-heading" className="relative z-10 mb-6 font-headline-md text-headline-md">Avatar</h3>
                <div className="relative z-10 flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-8">
                  <div className="relative shrink-0">
                    <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-3xl font-semibold text-primary shadow-md ring-4 ring-surface">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt="Selected profile photo preview" className="h-full w-full object-cover" />
                      ) : (
                        <span>{profile.fullName.split(/\s+/).filter(Boolean).map((part) => part[0]).slice(0, 2).join('').toUpperCase() || 'OP'}</span>
                      )}
                    </div>
                    <button
                      type="button"
                      aria-label="Choose profile photo"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-on-primary shadow-lg transition-transform hover:-translate-y-1"
                    >
                      <Icon name="edit" className="text-xl" />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      aria-label="Upload a profile photo"
                      onChange={selectAvatar}
                      className="sr-only"
                    />
                  </div>
                  <div className="flex flex-col items-center gap-4 sm:items-start">
                    <div className="flex flex-wrap justify-center gap-3 sm:justify-start">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="rounded-full bg-secondary-container px-5 py-2.5 font-label-lg text-on-secondary-container shadow-sm transition-colors hover:bg-secondary/90 hover:text-on-secondary"
                      >
                        Upload New
                      </button>
                      <button
                        type="button"
                        onClick={removeAvatar}
                        className="rounded-full px-5 py-2.5 font-label-lg text-error transition-colors hover:bg-error-container hover:text-on-error-container"
                      >
                        Remove
                      </button>
                    </div>
                    <p className="text-center text-sm text-on-surface-variant sm:text-left">
                      Recommended size: 500 x 500px. JPG, PNG or WebP, max 5MB.
                    </p>
                  </div>
                </div>
              </section>

              <form id="profile-form" onSubmit={saveProfile} className="rounded-2xl bg-surface-container p-5 shadow-sm sm:p-8">
                <h3 className="mb-6 font-headline-md text-headline-md">Personal Information</h3>
                <div className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-2 md:gap-y-8">
                  <label className="flex flex-col gap-2 font-label-lg text-on-surface" htmlFor="fullName">
                    Full Name
                    <span className="group relative">
                      <Icon name="person" className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant transition-colors group-focus-within:text-primary" />
                      <input id="fullName" type="text" required autoComplete="name" value={profile.fullName} onChange={(event) => updateProfile('fullName', event.target.value)} className="h-12 w-full rounded-xl border-none bg-surface pl-12 pr-4 font-body-md text-on-surface shadow-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-primary" />
                    </span>
                  </label>

                  <label className="flex flex-col gap-2 font-label-lg text-on-surface" htmlFor="email">
                    Email Address
                    <span className="group relative">
                      <Icon name="mail" className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant transition-colors group-focus-within:text-primary" />
                      <input id="email" type="email" required autoComplete="email" value={profile.email} onChange={(event) => updateProfile('email', event.target.value)} className="h-12 w-full rounded-xl border-none bg-surface pl-12 pr-4 font-body-md text-on-surface shadow-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-primary" />
                    </span>
                  </label>

                  <label className="flex flex-col gap-2 font-label-lg text-on-surface" htmlFor="phone">
                    Phone Number
                    <span className="flex">
                      <span className="flex items-center rounded-l-xl border-r border-outline-variant/30 bg-surface-variant px-4 text-label-lg text-on-surface-variant">+233</span>
                      <input id="phone" type="tel" autoComplete="tel-national" value={profile.phone} onChange={(event) => updateProfile('phone', event.target.value)} className="h-12 min-w-0 flex-1 rounded-r-xl border-none bg-surface px-4 font-body-md text-on-surface shadow-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-primary" />
                    </span>
                  </label>

                  <label className="flex flex-col gap-2 font-label-lg text-on-surface" htmlFor="businessName">
                    Business Name
                    <span className="group relative">
                      <Icon name="store" className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant transition-colors group-focus-within:text-primary" />
                      <input id="businessName" type="text" value={profile.businessName} onChange={(event) => updateProfile('businessName', event.target.value)} className="h-12 w-full rounded-xl border-none bg-surface pl-12 pr-4 font-body-md text-on-surface shadow-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-primary" />
                    </span>
                  </label>

                  <label className="flex flex-col gap-2 font-label-lg text-on-surface md:col-span-2" htmlFor="bio">
                    <span className="flex justify-between gap-3">
                      Short Bio
                      <span className="text-sm font-normal text-on-surface-variant">{profile.bio.length} / 300</span>
                    </span>
                    <textarea id="bio" rows={4} maxLength={300} value={profile.bio} onChange={(event) => updateProfile('bio', event.target.value)} className="w-full resize-none rounded-xl border-none bg-surface p-4 font-body-md text-on-surface shadow-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-primary" />
                  </label>
                </div>
              </form>

              <div className="sticky bottom-24 z-20 flex justify-end bg-gradient-to-t from-surface via-surface to-transparent py-3 lg:static lg:bg-none lg:py-0">
                <button
                  type="submit"
                  form="profile-form"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 font-label-lg text-on-primary shadow-md transition-all hover:-translate-y-0.5 hover:shadow-xl active:scale-95 sm:w-auto"
                >
                  <Icon name="save" className="text-xl" />
                  Save Changes
                </button>
              </div>
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
