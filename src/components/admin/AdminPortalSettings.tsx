'use client';

import { useEffect, useState } from 'react';

type Sensitivity = 'Low' | 'Normal' | 'High';
type ArchivePolicy = '12 months' | '24 months' | 'Never';

interface Region {
  id: number;
  name: string;
  taxRate: string;
  headquarters?: boolean;
}

interface PortalSettings {
  displayName: string;
  contactEmail: string;
  timezone: string;
  mfaRequired: boolean;
  sessionTimeout: string;
  regions: Region[];
  confidenceThreshold: number;
  flaggingSensitivity: Sensitivity;
  archivePolicy: ArchivePolicy;
}

const STORAGE_KEY = 'ghanaxplore-admin-portal-settings';

const defaultSettings: PortalSettings = {
  displayName: 'GhanaXplore Admin Suite',
  contactEmail: 'admin@gta.gov.gh',
  timezone: '(GMT+00:00) Accra, Ghana',
  mfaRequired: true,
  sessionTimeout: '30',
  regions: [
    { id: 1, name: 'Greater Accra', taxRate: '12.5', headquarters: true },
    { id: 2, name: 'Ashanti Region', taxRate: '10.0' },
    { id: 3, name: 'Western Region', taxRate: '11.5' },
  ],
  confidenceThreshold: 85,
  flaggingSensitivity: 'Normal',
  archivePolicy: '12 months',
};

const navigation = [
  { label: 'National Analytics', icon: 'leaderboard', href: '/admin' },
  { label: 'Operator Verification', icon: 'verified_user', href: '/admin/operator-verification' },
  { label: 'Content Moderation', icon: 'gavel', href: '/admin/content-moderation' },
  { label: 'Tourism Reports', icon: 'description', href: '/admin/revenue-tracking' },
  { label: 'Portal Settings', icon: 'settings', href: '/admin/settings' },
];

function Icon({
  name,
  className = '',
  filled = false,
}: {
  name: string;
  className?: string;
  filled?: boolean;
}) {
  return (
    <span
      aria-hidden="true"
      className={`material-symbols-outlined ${className}`}
      style={filled ? { fontVariationSettings: "'FILL' 1" } : undefined}
    >
      {name}
    </span>
  );
}

function isPortalSettings(value: unknown): value is PortalSettings {
  if (!value || typeof value !== 'object') return false;
  const settings = value as Record<string, unknown>;
  const regions = settings.regions;
  const validRegions =
    Array.isArray(regions) &&
    regions.every((region: unknown) => {
      if (!region || typeof region !== 'object') return false;
      const item = region as Record<string, unknown>;
      return (
        typeof item.id === 'number' &&
        typeof item.name === 'string' &&
        typeof item.taxRate === 'string' &&
        (item.headquarters === undefined || typeof item.headquarters === 'boolean')
      );
    });

  return (
    typeof settings.displayName === 'string' &&
    typeof settings.contactEmail === 'string' &&
    typeof settings.timezone === 'string' &&
    typeof settings.mfaRequired === 'boolean' &&
    typeof settings.sessionTimeout === 'string' &&
    validRegions &&
    typeof settings.confidenceThreshold === 'number' &&
    settings.confidenceThreshold >= 50 &&
    settings.confidenceThreshold <= 99 &&
    (settings.flaggingSensitivity === 'Low' ||
      settings.flaggingSensitivity === 'Normal' ||
      settings.flaggingSensitivity === 'High') &&
    (settings.archivePolicy === '12 months' ||
      settings.archivePolicy === '24 months' ||
      settings.archivePolicy === 'Never')
  );
}

function readSavedSettings(): PortalSettings | null {
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (!saved) return null;

  const parsed: unknown = JSON.parse(saved);
  if (!isPortalSettings(parsed)) {
    throw new Error('Saved portal settings have an invalid format.');
  }
  return parsed;
}

export function AdminPortalSettings() {
  const [settings, setSettings] = useState<PortalSettings>(defaultSettings);
  const [notice, setNotice] = useState('');
  const [search, setSearch] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const query = search.trim().toLowerCase();
  const sectionSearchTerms = [
    ['general settings', 'platform display name', 'primary contact email', 'system timezone'],
    ['integration hub', 'momo gateway', 'gta official db', 'relom8 api'],
    ['security access', 'multi-factor authentication', 'mfa', 'session timeout', 'roles permissions'],
    ['regional config', ...settings.regions.map((region) => region.name.toLowerCase()), 'tax rate'],
    ['content governance', 'ai moderation', 'confidence threshold', 'flagging sensitivity', 'archival policy'],
  ];
  const visibleSections = sectionSearchTerms.map(
    (terms) => !query || terms.some((term) => term.includes(query)),
  );

  useEffect(() => {
    try {
      const saved = readSavedSettings();
      if (saved) setSettings(saved);
    } catch {
      setNotice('Saved settings could not be loaded. Current defaults are shown.');
    }
  }, []);

  function saveSettings() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      setNotice('Settings saved on this device.');
    } catch {
      setNotice('Settings could not be saved in this browser.');
    }
  }

  function resetSettings() {
    setSettings(defaultSettings);
    setNotice('Default values restored in the form. Select Save Changes to keep them.');
  }

  function updateRegion(id: number, field: 'name' | 'taxRate', value: string) {
    setSettings((current) => ({
      ...current,
      regions: current.regions.map((region) =>
        region.id === id ? { ...region, [field]: value } : region,
      ),
    }));
  }

  function addRegion() {
    const id = Math.max(0, ...settings.regions.map((region) => region.id)) + 1;
    setSettings((current) => ({
      ...current,
      regions: [...current.regions, { id, name: 'New Region', taxRate: '10.0' }],
    }));
    setNotice('A region was added. Update its name and tax rate before saving.');
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-on-surface">
      <aside className="fixed left-0 top-0 z-50 hidden h-screen w-72 flex-col overflow-y-auto border-r border-outline-variant bg-surface py-8 shadow-sm lg:flex">
        <div className="mb-10 px-6">
          <a href="/admin" className="font-headline-md text-headline-md font-bold text-primary">GTA Admin</a>
          <p className="mt-1 text-label-sm uppercase tracking-wider text-on-surface-variant">Infrastructure Portal</p>
        </div>
        <nav aria-label="Admin navigation" className="flex-grow space-y-1">
          {navigation.map((item) => {
            const active = item.label === 'Portal Settings';
            return (
              <a
                key={item.label}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={`flex items-center gap-4 border-r-4 px-6 py-3 transition-colors duration-200 ${
                  active
                    ? 'border-primary bg-primary/5 font-bold text-primary'
                    : 'border-transparent font-medium text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                <Icon name={item.icon} filled={active} />
                <span className="text-label-lg">{item.label}</span>
              </a>
            );
          })}
        </nav>
        <div className="mt-auto px-6">
          <button
            type="button"
            onClick={() => setNotice('Emergency response contact is not configured in this demo.')}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-error px-4 py-4 font-bold text-on-error shadow-lg shadow-error/20 transition-all hover:opacity-90 active:scale-95"
          >
            <Icon name="emergency_home" />
            Emergency Response
          </button>
        </div>
      </aside>

      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-outline-variant bg-surface px-4 shadow-sm lg:hidden">
        <div className="flex items-center gap-4">
          <button
            type="button"
            aria-label={isMobileMenuOpen ? 'Close admin menu' : 'Open admin menu'}
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            className="text-primary active:scale-95"
          >
            <Icon name={isMobileMenuOpen ? 'close' : 'menu'} />
          </button>
          <a href="/admin" className="font-headline-md text-headline-md font-bold text-primary">Portal Settings</a>
        </div>
        <button type="button" aria-label="Notifications" className="text-primary active:scale-95">
          <Icon name="notifications" />
        </button>
      </header>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-[70] bg-on-surface/40 lg:hidden"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsMobileMenuOpen(false);
          }}
        >
          <nav aria-label="Admin navigation" className="flex h-full w-[min(20rem,85vw)] flex-col bg-surface p-5 shadow-xl">
            <div className="mb-6 border-b border-outline-variant/50 pb-5">
              <p className="font-headline-md text-headline-md font-bold text-primary">GTA Admin</p>
              <p className="mt-1 text-label-sm uppercase tracking-widest text-outline">Infrastructure Portal</p>
            </div>
            <div className="space-y-1">
              {navigation.map((item) => {
                const active = item.label === 'Portal Settings';
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-4 py-3 ${
                      active ? 'bg-primary/5 font-semibold text-primary' : 'text-on-surface-variant'
                    }`}
                  >
                    <Icon name={item.icon} filled={active} />
                    {item.label}
                  </a>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => {
                setNotice('Emergency response contact is not configured in this demo.');
                setIsMobileMenuOpen(false);
              }}
              className="mt-auto flex items-center justify-center gap-2 rounded-xl bg-error px-4 py-3 font-semibold text-on-error"
            >
              <Icon name="emergency_home" />
              Emergency Response
            </button>
          </nav>
        </div>
      )}

      <div className="lg:ml-72">
        <header className="sticky top-0 z-30 hidden h-20 items-center justify-between border-b border-outline-variant bg-surface-bright px-6 lg:flex xl:px-16">
          <div className="flex min-w-0 items-center gap-4">
            <h1 className="shrink-0 font-display-lg text-headline-md font-black tracking-tight text-primary">Admin Portal</h1>
            <label className="hidden items-center rounded-full border border-outline-variant/30 bg-surface-container px-4 py-2 lg:flex">
              <Icon name="search" className="mr-2 text-outline" />
              <input
                aria-label="Search configurations"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search configurations..."
                className="w-64 border-none bg-transparent text-sm focus:ring-0"
              />
            </label>
          </div>
          <div className="flex items-center gap-5">
            <button type="button" aria-label="Notifications" className="p-2 text-on-surface-variant transition-colors hover:text-primary">
              <Icon name="notifications" />
            </button>
            <button type="button" aria-label="Help" className="p-2 text-on-surface-variant transition-colors hover:text-primary">
              <Icon name="help" />
            </button>
            <button type="button" aria-label="Apps" className="p-2 text-on-surface-variant transition-colors hover:text-primary">
              <Icon name="apps" />
            </button>
            <span className="h-10 w-px bg-outline-variant" />
            <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-primary/20 bg-primary-fixed font-bold text-primary">KM</span>
          </div>
        </header>

        <main className="mx-auto min-h-[calc(100vh-5rem)] max-w-[1440px] bg-surface-container-low px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:py-10 xl:px-12">
          <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between lg:mb-12">
            <div>
              <nav aria-label="Breadcrumb" className="mb-2 flex flex-wrap items-center gap-2 text-label-sm text-outline">
                <span>Admin</span>
                <Icon name="chevron_right" className="text-[12px]" />
                <span>Infrastructure</span>
                <Icon name="chevron_right" className="text-[12px]" />
                <span className="font-bold text-primary">Portal Settings</span>
              </nav>
              <h2 className="font-headline-lg text-headline-lg text-on-surface">Portal Settings</h2>
              <p className="mt-2 max-w-2xl text-body-md text-on-surface-variant">
                Manage the core parameters, security protocols, and international integrations of the Ghana Tourism Authority digital infrastructure.
              </p>
            </div>
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={resetSettings}
                className="rounded-lg border border-primary px-6 py-2.5 font-semibold text-primary transition-colors hover:bg-primary/5"
              >
                Reset to Defaults
              </button>
              <button
                type="button"
                onClick={saveSettings}
                className="rounded-lg bg-primary px-8 py-2.5 font-semibold text-on-primary transition-all hover:shadow-xl hover:shadow-primary/20 active:scale-95"
              >
                Save Changes
              </button>
            </div>
          </div>

          {notice && (
            <div role="status" className="mb-6 flex items-start justify-between gap-4 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-on-primary-fixed-variant">
              <span>{notice}</span>
              <button type="button" aria-label="Dismiss notification" onClick={() => setNotice('')} className="rounded p-1 hover:bg-primary/10">
                <Icon name="close" />
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
            <div className="space-y-6 lg:col-span-7">
              {visibleSections[0] && (
              <section className="rounded-2xl border border-primary/20 bg-white/80 p-5 shadow-sm backdrop-blur sm:p-8">
                <div className="mb-6 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon name="settings_applications" />
                  </span>
                  <h3 className="font-headline-md text-headline-md">General Settings</h3>
                </div>
                <div className="space-y-5">
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <label className="space-y-2">
                      <span className="block font-label-lg">Platform Display Name</span>
                      <input
                        type="text"
                        value={settings.displayName}
                        onChange={(event) => setSettings((current) => ({ ...current, displayName: event.target.value }))}
                        className="w-full rounded-lg border-outline-variant bg-surface-container-low p-3 focus:border-primary focus:ring-2 focus:ring-primary/10"
                      />
                    </label>
                    <label className="space-y-2">
                      <span className="block font-label-lg">Primary Contact Email</span>
                      <input
                        type="email"
                        value={settings.contactEmail}
                        onChange={(event) => setSettings((current) => ({ ...current, contactEmail: event.target.value }))}
                        className="w-full rounded-lg border-outline-variant bg-surface-container-low p-3 focus:border-primary focus:ring-2 focus:ring-primary/10"
                      />
                    </label>
                  </div>
                  <label className="block space-y-2">
                    <span className="block font-label-lg">System Timezone</span>
                    <select
                      value={settings.timezone}
                      onChange={(event) => setSettings((current) => ({ ...current, timezone: event.target.value }))}
                      className="w-full rounded-lg border-outline-variant bg-surface-container-low p-3 focus:border-primary focus:ring-2 focus:ring-primary/10"
                    >
                      <option>(GMT+00:00) Accra, Ghana</option>
                      <option>(GMT-05:00) New York</option>
                      <option>(GMT+01:00) London</option>
                    </select>
                  </label>
                </div>
              </section>
              )}
              {visibleSections[1] && <section className="rounded-2xl border border-primary/20 bg-white/80 p-5 shadow-sm backdrop-blur sm:p-8">
                <div className="mb-6 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-tertiary/10 text-tertiary">
                    <Icon name="hub" />
                  </span>
                  <h3 className="font-headline-md text-headline-md">Integration Hub</h3>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {[
                    { name: 'MoMo Gateway', icon: 'payments', tileClass: 'bg-secondary-fixed', iconTone: 'text-secondary', status: 'ACTIVE' },
                    { name: 'GTA Official DB', icon: 'database', tileClass: 'bg-primary-fixed', iconTone: 'text-primary', status: 'ACTIVE' },
                    { name: 'ReloM8 API', icon: 'terminal', tileClass: 'bg-tertiary-fixed', iconTone: 'text-tertiary', status: 'OFFLINE' },
                  ].map((integration) => {
                    const online = integration.status === 'ACTIVE';
                    return (
                      <article key={integration.name} className="flex items-center justify-between gap-3 rounded-xl border border-outline-variant bg-surface-container-lowest p-4">
                        <div className="flex min-w-0 items-center gap-3">
                          <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded ${integration.tileClass}`}>
                            <Icon name={integration.icon} className={`text-xl ${integration.iconTone}`} />
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold">{integration.name}</p>
                            <p className={`flex items-center gap-1 text-[10px] font-bold ${online ? 'text-green-600' : 'text-error'}`}>
                              <span className={`h-1.5 w-1.5 rounded-full ${online ? 'bg-green-500' : 'bg-error'}`} />
                              {integration.status}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          aria-label={`Check ${integration.name} connection`}
                          onClick={() => setNotice(`${integration.name} connection checks are not configured in this demo.`)}
                          className="shrink-0 p-1 text-outline transition-colors hover:text-primary"
                        >
                          <Icon name={online ? 'sync' : 'refresh'} />
                        </button>
                      </article>
                    );
                  })}
                </div>
              </section>}
            </div>

            <div className="space-y-6 lg:col-span-5 lg:space-y-8">
              {visibleSections[2] && (
              <section className="rounded-2xl bg-inverse-surface p-5 text-inverse-on-surface shadow-xl sm:p-8">
                <div className="mb-6 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-fixed/20 text-primary-fixed">
                    <Icon name="admin_panel_settings" filled />
                  </span>
                  <h3 className="font-headline-md text-headline-md">Security &amp; Access</h3>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-bold">Multi-Factor Authentication (MFA)</p>
                      <p className="text-sm text-outline-variant">Enforce for all administrator accounts</p>
                    </div>
                    <label className="relative inline-flex shrink-0 cursor-pointer items-center">
                      <span className="sr-only">Require multi-factor authentication</span>
                      <input
                        type="checkbox"
                        checked={settings.mfaRequired}
                        onChange={(event) => setSettings((current) => ({ ...current, mfaRequired: event.target.checked }))}
                        className="peer sr-only"
                      />
                      <span className="h-6 w-12 rounded-full bg-white/20 transition-colors peer-checked:bg-primary-fixed peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary-fixed" />
                      <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-inverse-surface transition-transform peer-checked:translate-x-6" />
                    </label>
                  </div>
                  <label className="block space-y-2">
                    <span className="block font-label-lg text-outline-variant">Session Timeout (Minutes)</span>
                    <input
                      type="number"
                      min="1"
                      value={settings.sessionTimeout}
                      onChange={(event) => setSettings((current) => ({ ...current, sessionTimeout: event.target.value }))}
                      className="w-full rounded-lg border-none bg-white/10 p-3 text-white focus:ring-2 focus:ring-primary-fixed"
                    />
                  </label>
                  <hr className="border-white/10" />
                  <button
                    type="button"
                    onClick={() => setNotice('Roles and permissions management is not configured in this demo.')}
                    className="group flex w-full items-center justify-between rounded-xl bg-white/5 p-4 text-left transition-colors hover:bg-white/10"
                  >
                    <span className="flex items-center gap-3">
                      <Icon name="group_work" className="text-secondary-fixed" />
                      <span className="font-bold">Roles &amp; Permissions Management</span>
                    </span>
                    <Icon name="arrow_forward" className="transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </section>
              )}
              {visibleSections[3] && <section className="rounded-2xl border border-primary/20 bg-white/80 p-5 shadow-sm backdrop-blur sm:p-8">
                <div className="mb-6 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                    <Icon name="map" />
                  </span>
                  <h3 className="font-headline-md text-headline-md">Regional Config</h3>
                </div>
                <div className="space-y-3">
                  {settings.regions.map((region) => (
                    <div key={region.id} className="flex flex-wrap items-center gap-2 rounded-lg bg-surface-container p-3 sm:flex-nowrap">
                      <label className="min-w-0 flex-1">
                        <span className="sr-only">Region name</span>
                        <input
                          value={region.name}
                          onChange={(event) => updateRegion(region.id, 'name', event.target.value)}
                          className="w-full border-none bg-transparent p-0 font-bold focus:ring-0"
                        />
                      </label>
                      {region.headquarters && <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-black text-primary">HQ</span>}
                      <label className="flex items-center gap-1 text-xs font-medium text-outline">
                        <span className="sr-only">Tax rate for {region.name}</span>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="0.1"
                          value={region.taxRate}
                          onChange={(event) => updateRegion(region.id, 'taxRate', event.target.value)}
                          className="w-16 border-none bg-transparent p-0 text-right text-xs font-medium focus:ring-0"
                        />
                        <span>% Tax Rate</span>
                      </label>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addRegion}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-outline-variant py-3 font-bold text-outline transition-colors hover:border-primary hover:text-primary"
                  >
                    <Icon name="add" />
                    Add New Region
                  </button>
                </div>
              </section>}
            </div>

            {visibleSections[4] && <section className="rounded-2xl border border-primary/20 bg-white/80 p-5 shadow-sm backdrop-blur sm:p-8 lg:col-span-12">
              <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-error/10 text-error">
                    <Icon name="gavel" />
                  </span>
                  <h3 className="font-headline-md text-headline-md">Content Governance</h3>
                </div>
                <div className="flex items-center gap-3 text-label-lg font-bold text-primary">
                  AI Moderation Status: ACTIVE
                  <span className="h-3 w-3 animate-pulse rounded-full bg-primary" />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-10">
                <div className="space-y-4">
                  <label htmlFor="confidence-threshold" className="flex items-center gap-2 font-bold">
                    <Icon name="precision_manufacturing" className="text-sm text-secondary" />
                    AI Confidence Threshold
                  </label>
                  <input
                    id="confidence-threshold"
                    type="range"
                    min="50"
                    max="99"
                    value={settings.confidenceThreshold}
                    onChange={(event) => setSettings((current) => ({ ...current, confidenceThreshold: Number(event.target.value) }))}
                    className="w-full accent-primary"
                  />
                  <div className="flex justify-between text-xs font-bold text-outline">
                    <span>50% (Permissive)</span>
                    <span className="text-primary">{settings.confidenceThreshold}% Current</span>
                    <span>99% (Strict)</span>
                  </div>
                  <p className="text-sm text-on-surface-variant">Content below this confidence requires manual review before publishing.</p>
                </div>
                <fieldset className="space-y-4">
                  <legend className="flex items-center gap-2 font-bold">
                    <Icon name="flag" className="text-sm text-secondary" />
                    Flagging Sensitivity
                  </legend>
                  <div className="flex gap-2">
                    {(['Low', 'Normal', 'High'] as const).map((level) => {
                      const active = settings.flaggingSensitivity === level;
                      return (
                        <button
                          key={level}
                          type="button"
                          aria-pressed={active}
                          onClick={() => setSettings((current) => ({ ...current, flaggingSensitivity: level }))}
                          className={`flex-1 rounded-lg py-2 text-xs font-bold transition-colors ${
                            active
                              ? 'bg-primary text-on-primary'
                              : 'bg-surface-container hover:bg-primary-fixed hover:text-primary'
                          }`}
                        >
                          {level.toUpperCase()}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-sm text-on-surface-variant">Determines how aggressively user-generated content is filtered for potential policy violations.</p>
                </fieldset>
                <label className="space-y-4">
                  <span className="flex items-center gap-2 font-bold">
                    <Icon name="inventory_2" className="text-sm text-secondary" />
                    Archival Policy
                  </span>
                  <select
                    value={settings.archivePolicy}
                    onChange={(event) => setSettings((current) => ({ ...current, archivePolicy: event.target.value as ArchivePolicy }))}
                    className="w-full rounded-lg border-outline-variant bg-surface-container-low p-3 focus:border-primary focus:ring-2 focus:ring-primary/10"
                  >
                    <option value="12 months">Archive after 12 months</option>
                    <option value="24 months">Archive after 24 months</option>
                    <option value="Never">Never Archive (Always Live)</option>
                  </select>
                  <span className="block text-sm text-on-surface-variant">Global rule for moving reviewed and processed tourism operator content to long-term storage.</span>
                </label>
              </div>
            </section>}
            {query && !visibleSections.some(Boolean) && (
              <p className="rounded-xl border border-outline-variant bg-white p-6 text-sm text-on-surface-variant lg:col-span-12">
                No settings sections match “{search}”.
              </p>
            )}
          </div>

          <footer className="mt-12 border-t border-outline-variant pt-6 text-center text-label-sm text-outline lg:mt-20">
            © 2024 Ghana Tourism Authority. Digital Infrastructure &amp; Security Unit (DISU).
          </footer>
        </main>
      </div>

      <nav
        aria-label="Mobile admin navigation"
        className="fixed bottom-0 z-50 flex w-full items-center justify-around border-t border-outline-variant/20 bg-surface px-2 pt-3 shadow-[0px_-4px_20px_rgba(0,0,0,0.05)] [padding-bottom:max(0.75rem,env(safe-area-inset-bottom))] lg:hidden"
      >
        {[
          { label: 'Analytics', icon: 'analytics', href: '/admin' },
          { label: 'Verify', icon: 'verified_user', href: '/admin/operator-verification' },
          { label: 'Mod', icon: 'gavel', href: '/admin/content-moderation' },
          { label: 'Profile', icon: 'person', href: '/admin/settings' },
        ].map((item) => {
          const active = item.label === 'Profile';
          return (
            <a
              key={item.label}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={`flex min-w-[64px] flex-col items-center justify-center rounded-xl px-4 py-1 transition-all active:scale-95 ${
                active ? 'scale-95 bg-primary-container font-bold text-on-primary-container' : 'text-on-surface-variant hover:bg-surface-variant'
              }`}
            >
              <Icon name={item.icon} filled={active} />
              <span className="mt-0.5 text-[10px] uppercase tracking-tighter">{item.label}</span>
            </a>
          );
        })}
      </nav>
    </div>
  );
}
