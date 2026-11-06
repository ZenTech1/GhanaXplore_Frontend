'use client';

import { useMemo, useState } from 'react';

interface Region {
  name: string;
  visitors: string;
  growth: number;
  revenue: string;
  trend: 'up' | 'flat';
}

const regions: Region[] = [
  { name: 'Ashanti Region', visitors: '245,000', growth: 18.5, revenue: 'GHS 850M', trend: 'up' },
  { name: 'Central Region', visitors: '182,500', growth: 15.2, revenue: 'GHS 620M', trend: 'up' },
  { name: 'Greater Accra', visitors: '530,200', growth: 12.1, revenue: 'GHS 1.8B', trend: 'up' },
  { name: 'Volta Region', visitors: '98,400', growth: 9.8, revenue: 'GHS 310M', trend: 'up' },
  { name: 'Western Region', visitors: '115,000', growth: 4.3, revenue: 'GHS 445M', trend: 'flat' },
];

const seasonalBars = [
  { month: 'Jan', height: 40, color: 'bg-primary/40' },
  { month: 'Feb', height: 55, color: 'bg-primary/60' },
  { month: 'Mar', height: 75, color: 'bg-primary/80' },
  { month: 'Apr', height: 90, color: 'bg-primary' },
  { month: 'May', height: 45, color: 'bg-primary/50' },
  { month: 'Jun', height: 30, color: 'bg-primary/30' },
  { month: 'Jul', height: 65, color: 'bg-secondary-container' },
  { month: 'Aug', height: 50, color: 'bg-secondary-container/80' },
  { month: 'Sep', height: 85, color: 'bg-secondary-container/60' },
  { month: 'Oct', height: 95, color: 'bg-primary' },
  { month: 'Nov', height: 100, color: 'bg-primary/90' },
  { month: 'Dec', height: 80, color: 'bg-primary/70' },
];

const navigation = [
  { label: 'National Analytics', icon: 'analytics', href: '/admin' },
  { label: 'Operator Verification', icon: 'fact_check', href: '/admin/operator-verification' },
  { label: 'Content Moderation', icon: 'rule', href: '/admin/content-moderation' },
  { label: 'Revenue Tracking', icon: 'payments', href: '#revenue-tracking' },
  { label: 'Settings', icon: 'settings', href: '#settings' },
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

function downloadCsv(data: Region[]) {
  const rows = [
    ['Region Name', 'Visitor Count', 'Growth Rate', 'Revenue Contribution', 'Trend'],
    ...data.map((region) => [
      region.name,
      region.visitors,
      `+${region.growth}%`,
      region.revenue,
      region.trend === 'up' ? 'Rising' : 'Stable',
    ]),
  ];
  const csv = rows.map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(',')).join('\r\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'ghana-tourism-regional-analytics.csv';
  link.click();
  URL.revokeObjectURL(url);
}

export function AdminDashboard() {
  const [activeNavigation, setActiveNavigation] = useState('National Analytics');
  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All regions');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [supportDispatched, setSupportDispatched] = useState(false);
  const [incidentExpanded, setIncidentExpanded] = useState(false);
  const [selectedQuickAction, setSelectedQuickAction] = useState('');
  const [isRegionalReportOpen, setIsRegionalReportOpen] = useState(false);
  const filteredRegions = useMemo(() => {
    const query = search.trim().toLowerCase();
    return regions.filter((region) => {
      const matchesSearch = !query || region.name.toLowerCase().includes(query);
      const matchesRegion = selectedRegion === 'All regions' || region.name === selectedRegion;
      return matchesSearch && matchesRegion;
    });
  }, [search, selectedRegion]);

  return (
    <div id="analytics" className="min-h-screen bg-background text-on-surface">
      <aside className="fixed left-0 top-0 z-50 hidden h-screen w-64 flex-col border-r border-outline-variant bg-surface-container-lowest py-2 shadow-sm lg:flex">
        <div className="px-6 py-8">
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Icon name="castle" className="text-white" filled />
            </div>
            <h2 className="font-headline-md text-headline-md text-primary">GTA Admin</h2>
          </div>
          <p className="text-label-sm text-on-surface-variant opacity-70">Management Portal</p>
        </div>

        <nav aria-label="Admin navigation" className="flex-1 space-y-1 px-2">
          {navigation.map((item) => {
            const isActive = activeNavigation === item.label;
            return (
              <a
                key={item.label}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => setActiveNavigation(item.label)}
                className={`flex items-center gap-3 border-r-4 px-4 py-3 transition-all duration-150 ${
                  isActive
                    ? 'border-primary bg-primary-container/10 font-bold text-primary'
                    : 'border-transparent text-on-surface-variant transition-colors duration-200 hover:bg-surface-container-high hover:text-primary'
                }`}
              >
                <Icon
                  name={item.icon}
                  className={isActive ? 'animate-pulse' : ''}
                />
                <span className="font-label-lg text-label-lg">{item.label}</span>
              </a>
            );
          })}
        </nav>

        <div className="mb-6 mt-auto px-4">
          <button
            type="button"
            onClick={() => downloadCsv(filteredRegions)}
            className="w-full rounded-lg bg-primary px-4 py-3 text-label-lg font-label-lg text-white shadow-lg transition-all hover:opacity-90 active:scale-95"
          >
            Generate Report
          </button>
        </div>
      </aside>

      <header className="fixed left-0 right-0 top-0 z-[60] flex items-center justify-between border-b border-outline-variant/30 bg-surface px-4 py-4 shadow-sm lg:hidden">
        <div className="flex items-center gap-4">
          <button
            type="button"
            aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="admin-mobile-menu"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            className="text-on-surface-variant transition-colors hover:text-primary active:scale-95"
          >
            <Icon name={isMobileMenuOpen ? 'close' : 'menu'} />
          </button>
          <span className="font-headline-md text-headline-md font-bold text-primary">GhanaXplore</span>
        </div>
        <button
          type="button"
          aria-label="Notifications"
          className="relative text-on-surface-variant transition-colors hover:text-primary active:scale-95"
        >
          <Icon name="notifications" />
          <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-error" />
        </button>
      </header>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-[70] bg-on-surface/40 lg:hidden"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsMobileMenuOpen(false);
          }}
        >
          <nav
            id="admin-mobile-menu"
            aria-label="Admin navigation"
            className="flex h-full w-[min(20rem,85vw)] flex-col bg-surface-container-lowest p-5 shadow-xl"
          >
            <div className="mb-6 flex items-center gap-3 border-b border-outline-variant/50 pb-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white">
                <Icon name="castle" filled />
              </span>
              <div>
                <p className="font-headline-md text-lg font-bold text-primary">GTA Admin</p>
                <p className="text-xs text-on-surface-variant">Management Portal</p>
              </div>
            </div>
            <div className="space-y-1">
              {navigation.map((item) => {
                const isActive = activeNavigation === item.label;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    aria-current={isActive ? 'page' : undefined}
                    onClick={() => {
                      setActiveNavigation(item.label);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition-colors ${
                      isActive
                        ? 'bg-primary-container/10 font-semibold text-primary'
                        : 'text-on-surface-variant hover:bg-surface-container-high'
                    }`}
                  >
                    <Icon name={item.icon} />
                    {item.label}
                  </a>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => {
                downloadCsv(filteredRegions);
                setIsMobileMenuOpen(false);
              }}
              className="mt-auto rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white shadow-md"
            >
              Generate Report
            </button>
          </nav>
        </div>
      )}

      <main className="mx-auto w-full max-w-md px-4 pb-32 pt-24 sm:max-w-xl sm:px-6 lg:hidden">
        <section className="mb-8">
          <p className="mb-1 text-label-lg uppercase tracking-wider text-on-surface-variant">
            GTA Command Center
          </p>
          <h1 className="font-headline-lg text-headline-lg leading-tight text-on-surface">
            National Oversight
          </h1>
          <div className="mt-2 flex items-center gap-2 text-primary">
            <Icon name="calendar_today" className="text-[18px]" />
            <span className="text-label-lg">August 2024 (Real-time)</span>
          </div>
        </section>

        <section aria-label="Tourism overview" className="mb-10 grid grid-cols-2 gap-4">
          <article className="admin-glass-card flex min-h-[168px] flex-col justify-between rounded-xl p-4 shadow-[0px_4px_20px_rgba(0,0,0,0.05)] sm:p-5">
            <div>
              <Icon name="groups" className="mb-2 text-primary" />
              <p className="text-label-sm text-on-surface-variant">Monthly Visitors</p>
              <p className="font-headline-md text-headline-md text-on-surface">142.8k</p>
            </div>
            <p className="mt-4 flex items-center gap-1 text-label-sm font-bold text-primary-container">
              <Icon name="trending_up" className="text-[14px]" />
              12%
            </p>
          </article>
          <article className="admin-glass-card flex min-h-[168px] flex-col justify-between rounded-xl p-4 shadow-[0px_4px_20px_rgba(0,0,0,0.05)] sm:p-5">
            <div>
              <Icon name="payments" className="mb-2 text-secondary" />
              <p className="text-label-sm text-on-surface-variant">Revenue (GHS)</p>
              <p className="font-headline-md text-headline-md text-on-surface">3.2M</p>
            </div>
            <p className="mt-4 flex items-center gap-1 text-label-sm font-bold text-primary-container">
              <Icon name="trending_up" className="text-[14px]" />
              8.4%
            </p>
          </article>
          <button
            type="button"
            onClick={() => setSelectedQuickAction('Visitor stay details')}
            className="admin-glass-card col-span-2 flex items-center justify-between rounded-xl p-4 text-left shadow-[0px_4px_20px_rgba(0,0,0,0.05)] transition hover:border-primary/30 active:scale-[0.99] sm:p-5"
          >
            <span className="flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant">
                <Icon name="nest_clock_farsight_analog" />
              </span>
              <span>
                <span className="block text-label-sm text-on-surface-variant">Avg. Visitor Stay</span>
                <span className="block font-headline-md text-headline-md text-on-surface">4.2 Days</span>
              </span>
            </span>
            <Icon name="chevron_right" className="text-outline" />
          </button>
        </section>

        <section className="mb-10">
          <div className="mb-6 flex items-end justify-between gap-3">
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface">Regional Lead</h2>
              <p className="text-body-md text-on-surface-variant">By Booking Volume</p>
            </div>
            <button
              type="button"
              aria-expanded={isRegionalReportOpen}
              onClick={() => setIsRegionalReportOpen((open) => !open)}
              className="shrink-0 text-label-lg text-primary hover:underline"
            >
              {isRegionalReportOpen ? 'Hide Report' : 'Full Report'}
            </button>
          </div>
          <div className="space-y-6">
            <MobileRegionBar name="Greater Accra" count="45,102" percent={92} color="bg-primary" />
            <MobileRegionBar name="Central Region" count="32,840" percent={70} color="bg-secondary" />
            <MobileRegionBar name="Ashanti Region" count="28,115" percent={58} color="bg-tertiary" />
            <MobileRegionBar name="Volta Region" count="19,420" percent={42} color="bg-outline-variant" />
          </div>
          {isRegionalReportOpen && (
            <div className="mt-5 space-y-3 rounded-xl border border-outline-variant/40 bg-surface-container-lowest p-4">
              {regions.map((region) => (
                <div key={region.name} className="flex items-center justify-between gap-3 text-label-sm">
                  <span className="text-on-surface-variant">{region.name}</span>
                  <span className="font-semibold text-on-surface">{region.visitors} visitors</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mb-6">
          <div className="mb-4 flex items-center gap-2">
            <Icon name="warning" className="text-error" />
            <h2 className="font-headline-md text-headline-md text-on-surface">Priority Attention</h2>
          </div>
          <div className="space-y-3">
            <article className="flex items-start gap-3 rounded-xl bg-error-container p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-on-error text-error">
                <Icon name="heart_broken" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <h3 className="font-bold text-on-error-container">Mole Park Hub</h3>
                  <span className="rounded bg-error px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                    Critical
                  </span>
                </div>
                <p className="mb-3 text-label-sm text-on-error-container/80">
                  Readiness Score: 34% (Power outage &amp; Staff shortage)
                </p>
                <button
                  type="button"
                  onClick={() => setSupportDispatched(true)}
                  disabled={supportDispatched}
                  className="w-full rounded-lg bg-error px-3 py-2 text-label-sm font-semibold text-white transition-transform active:scale-95 disabled:cursor-default disabled:bg-primary"
                >
                  {supportDispatched ? 'Support Dispatched' : 'Dispatch Support'}
                </button>
              </div>
            </article>

            <article className="flex items-start gap-3 rounded-xl border border-secondary/20 bg-on-secondary-container/10 p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary-container text-on-secondary-container">
                <Icon name="construction" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <h3 className="font-bold text-on-secondary-container">Wli Falls Access</h3>
                  <span className="rounded bg-secondary px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                    Medium
                  </span>
                </div>
                <p className="mb-3 text-label-sm text-on-secondary-container/80">
                  Readiness Score: 52% (Path maintenance required)
                </p>
                {incidentExpanded && (
                  <p className="mb-3 rounded-lg bg-white/70 p-3 text-label-sm text-on-secondary-container">
                    An access-path inspection and maintenance follow-up are recommended.
                  </p>
                )}
                <button
                  type="button"
                  aria-expanded={incidentExpanded}
                  onClick={() => setIncidentExpanded((expanded) => !expanded)}
                  className="w-full rounded-lg bg-secondary px-3 py-2 text-label-sm font-semibold text-white transition-transform active:scale-95"
                >
                  {incidentExpanded ? 'Hide Incident' : 'View Incident'}
                </button>
              </div>
            </article>
          </div>
        </section>

        <section aria-label="Quick actions" className="mt-8 grid grid-cols-2 gap-4">
          {[
            { label: 'Audits', icon: 'assignment_turned_in' },
            { label: 'Policies', icon: 'policy' },
          ].map((action) => (
            <button
              key={action.label}
              type="button"
              aria-pressed={selectedQuickAction === action.label}
              onClick={() => setSelectedQuickAction(action.label)}
              className={`flex min-h-[92px] flex-col items-center justify-center rounded-xl border border-outline-variant/30 bg-surface-container-low p-4 text-center transition-colors hover:bg-primary/5 ${
                selectedQuickAction === action.label ? 'ring-2 ring-primary' : ''
              }`}
            >
              <Icon name={action.icon} className="mb-2 text-primary" />
              <span className="text-label-lg text-on-surface">{action.label}</span>
            </button>
          ))}
        </section>
        {selectedQuickAction && (
          <p role="status" className="mt-3 text-center text-xs text-on-surface-variant">
            {selectedQuickAction} selected
          </p>
        )}
      </main>

      <nav
        aria-label="Mobile admin navigation"
        className="fixed bottom-0 z-50 flex w-full items-center justify-around border-t border-outline-variant/20 bg-surface px-2 pt-3 shadow-[0px_-4px_20px_rgba(0,0,0,0.05)] [padding-bottom:max(0.75rem,env(safe-area-inset-bottom))] lg:hidden"
      >
        {[
          { label: 'Analytics', icon: 'analytics', href: '/admin', active: true },
          { label: 'Verify', icon: 'verified_user', href: '/admin/operator-verification', active: false },
          { label: 'Mod', icon: 'gavel', href: '/admin/content-moderation', active: false },
          { label: 'Profile', icon: 'person', href: '/admin/settings', active: false },
        ].map((item) => (
          <a
            key={item.label}
            href={item.href}
            aria-current={item.active ? 'page' : undefined}
            className={`flex min-w-[64px] flex-col items-center justify-center rounded-xl px-4 py-1 transition-all active:scale-95 ${
              item.active
                ? 'scale-95 bg-primary-container font-bold text-on-primary-container'
                : 'text-on-surface-variant hover:bg-surface-variant'
            }`}
          >
            <Icon name={item.icon} filled={item.active} />
            <span className="mt-0.5 text-[10px] uppercase tracking-tighter">{item.label}</span>
          </a>
        ))}
      </nav>

      <main className="hidden min-h-screen lg:ml-64 lg:block">
        <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-outline-variant bg-surface px-4 sm:px-6 lg:px-gutter">
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary lg:hidden">
              <Icon name="castle" className="text-white" filled />
            </div>
            <h1 className="whitespace-nowrap font-headline-md text-headline-md text-on-surface">
              GTA Dashboard
            </h1>
            <div className="hidden h-6 w-px bg-outline-variant sm:block" />
            <span className="hidden whitespace-nowrap text-label-lg font-medium text-on-surface-variant sm:block">
              Analytics Overview
            </span>
          </div>
          <div className="flex items-center gap-3 sm:gap-6">
            <label className="relative hidden lg:block">
              <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search data..."
                className="w-64 rounded-full border-none bg-surface-container-low py-2 pl-10 pr-4 text-body-md placeholder:text-on-surface-variant/70 focus:ring-2 focus:ring-primary"
              />
            </label>
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                type="button"
                aria-label="Notifications"
                className="text-on-surface-variant transition-colors hover:text-primary"
              >
                <Icon name="notifications" />
              </button>
              <button
                type="button"
                aria-label="Help"
                className="hidden text-on-surface-variant transition-colors hover:text-primary sm:block"
              >
                <Icon name="help" />
              </button>
              <button
                type="button"
                aria-label="Apps"
                className="hidden text-on-surface-variant transition-colors hover:text-primary sm:block"
              >
                <Icon name="apps" />
              </button>
              <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-primary-container">
                <img
                  alt="GTA administrator"
                  className="h-full w-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-0G64D3a2LnQAmfuy-qijPcI-JvNvAhZkmnKL5xV07UGoY8O67sEw0YcgCiYONmi0GnlzJ4LkLyJRqCapOma6iQfLOBtID_vJ-p9ggVMyvKf5T9znUXiwiuIDuqzRZFR4nhR_TMhzY8VeXsjwTYcJ6F9o115mHzgR6R2I0bqyT9fBLzxs0ihxNwb7Sg_kkRKKABtCB5lqtByOrkRGkMtNh3sJW9z-eB8B6gxioZpgyryyr3CKgvJaB4lMbM_Ni93l3Prg3aA-jpnI"
                />
              </div>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8">
          <section aria-label="National tourism key performance indicators" className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <KpiCard
              icon="groups"
              change="+12.4% ↑"
              label="Total Annual Visitors"
              value="1,248,500"
              note="Target: 1.5M by Dec 2024"
              accent="border-primary"
              iconColor="bg-primary/10 text-primary"
              changeColor="text-primary"
            />
            <KpiCard
              icon="payments"
              change="+8.2% ↑"
              label="Estimated Revenue (GHS)"
              value="4.2B"
              note="Fiscal Year 2023-24"
              accent="border-secondary-container"
              iconColor="bg-secondary-container/10 text-on-secondary-container"
              changeColor="text-primary"
            />
            <KpiCard
              icon="verified"
              change="3,420"
              label="Active Operators"
              value="2,854"
              note="92% Compliance Rate"
              accent="border-tertiary"
              iconColor="bg-tertiary/10 text-tertiary"
              changeColor="text-on-surface-variant"
            />
            <KpiCard
              icon="trending_up"
              change="High"
              label="Regional Growth %"
              value="15.8%"
              note="Avg. Across 16 Regions"
              accent="border-outline"
              iconColor="bg-outline/10 text-on-surface"
              changeColor="text-primary"
            />
          </section>

          <section className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <article className="flex flex-col rounded-xl bg-surface-container-lowest p-5 shadow-[0px_4px_20px_rgba(0,0,0,0.05)] sm:p-8 lg:col-span-7">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-headline-md text-headline-md">Visitor Distribution</h2>
                <div className="flex gap-2" aria-label="Visitor type">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-label-sm font-bold text-primary">
                    Domestic
                  </span>
                  <span className="rounded-full bg-secondary-container/10 px-3 py-1 text-label-sm font-bold text-on-secondary-container">
                    International
                  </span>
                </div>
              </div>
              <div
                className="group relative min-h-[400px] flex-1 overflow-hidden rounded-xl bg-surface-container-low"
                onMouseMove={(event) => {
                  const bounds = event.currentTarget.getBoundingClientRect();
                  const x = (event.clientX - bounds.left) / bounds.width - 0.5;
                  const y = (event.clientY - bounds.top) / bounds.height - 0.5;
                  const image = event.currentTarget.querySelector('img');
                  if (image) image.style.transform = `translate(${x * 10}px, ${y * 10}px)`;
                }}
                onMouseLeave={(event) => {
                  const image = event.currentTarget.querySelector('img');
                  if (image) image.style.transform = 'translate(0, 0)';
                }}
              >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#2e7d32_0%,_transparent_70%)] opacity-40 transition-opacity group-hover:opacity-60" />
                <div className="flex h-full min-h-[400px] items-center justify-center p-4">
                  <img
                    alt="Heatmap of visitor distribution across Ghana, with hotspots around Greater Accra and Kumasi"
                    className="max-h-full max-w-full object-contain drop-shadow-lg transition-transform duration-200"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCza7tsE7tyCAl1VkT8om0C7GRcx4xFk1xzdoeuPwkMs2xaNwRNfpdNCRVbVGeZgXZ5qI6cBTmz6Bw1MNBdEDGCA9RJAOHMrLPSRrz_WRAybdl2ko8cK1ba_C8ijW9k0ITNcSlDkRtRXJ2Gk92vCt4r_6jUFtjY_z0ljLS5-47fGkzjw1FM5PU-fGcJ9VgtkVqKwN9FV5KHWAs4LgDZfHxcYSDuOnr4qLtSTZky56ikPuklpgoTTFLHuKKL-jLgxZgEnkdmeFfmcUL-"
                  />
                </div>
                <div className="pointer-events-none absolute right-1/4 top-1/4 rounded-lg border border-primary/20 bg-white/90 p-3 shadow-xl backdrop-blur">
                  <p className="text-label-sm font-bold text-primary">Greater Accra</p>
                  <p className="font-headline-md text-headline-md leading-none">42.5%</p>
                  <p className="text-xs text-on-surface-variant">Density Index: 0.94</p>
                </div>
              </div>
            </article>

            <article className="flex flex-col rounded-xl bg-surface-container-lowest p-5 shadow-[0px_4px_20px_rgba(0,0,0,0.05)] sm:p-8 lg:col-span-5">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="font-headline-md text-headline-md">Seasonal Trends</h2>
                <button type="button" aria-label="More seasonal trend options" className="text-on-surface-variant">
                  <Icon name="more_vert" />
                </button>
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div
                  role="img"
                  aria-label="Monthly visitor trend chart. Visitor counts peak in October and November."
                  className="chart-gradient relative flex h-64 w-full items-end gap-2 border-b border-l border-outline-variant px-2"
                >
                  {seasonalBars.map((bar) => (
                    <div
                      key={bar.month}
                      title={bar.month}
                      className={`group relative flex-1 rounded-t-sm ${bar.color}`}
                      style={{ height: `${bar.height}%` }}
                    >
                      {(bar.month === 'Apr' || bar.month === 'Sep') && (
                        <span
                          className={`absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-bold ${
                            bar.month === 'Apr' ? 'text-primary' : 'text-on-secondary-container'
                          }`}
                        >
                          {bar.month === 'Apr' ? 'Apr' : 'Sept'}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-8 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-3 w-3 rounded-full bg-primary" />
                      <span className="text-label-lg font-medium">2023 (Actual)</span>
                    </div>
                    <span className="font-bold text-primary">1.2M</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-outline-variant pt-4">
                    <div className="flex items-center gap-3">
                      <div className="h-3 w-3 rounded-full bg-secondary-container" />
                      <span className="text-label-lg font-medium">2022 (Actual)</span>
                    </div>
                    <span className="font-bold text-on-secondary-container">0.9M</span>
                  </div>
                </div>
              </div>
            </article>
          </section>

          <section className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-[0px_4px_20px_rgba(0,0,0,0.05)]">
            <div className="flex flex-col justify-between gap-5 border-b border-outline-variant p-5 sm:flex-row sm:items-center sm:p-8">
              <div>
                <h2 className="font-headline-md text-headline-md">Top 5 Regions by Growth</h2>
                <p className="text-body-md text-on-surface-variant">
                  Regional performance metrics for the current quarter.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={() => downloadCsv(filteredRegions)}
                  className="rounded-lg border border-outline px-4 py-2 text-on-surface-variant transition-colors hover:bg-surface-container-high"
                >
                  Export CSV
                </button>
                <div className="relative">
                  <button
                    type="button"
                    aria-expanded={isFilterOpen}
                    onClick={() => setIsFilterOpen((open) => !open)}
                    className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white shadow-md hover:opacity-90"
                  >
                    <Icon name="filter_list" className="text-[18px]" />
                    Filter Data
                  </button>
                  {isFilterOpen && (
                    <div className="absolute right-0 z-20 mt-2 w-52 rounded-lg border border-outline-variant bg-surface-container-lowest p-3 shadow-xl">
                      <label className="block text-label-sm text-on-surface-variant" htmlFor="region-filter">
                        Filter by region
                      </label>
                      <select
                        id="region-filter"
                        value={selectedRegion}
                        onChange={(event) => setSelectedRegion(event.target.value)}
                        className="mt-2 w-full rounded-md border-outline-variant bg-surface text-sm focus:border-primary focus:ring-primary"
                      >
                        <option>All regions</option>
                        {regions.map((region) => (
                          <option key={region.name}>{region.name}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left">
                <thead className="bg-surface-container-low text-label-lg text-on-surface-variant">
                  <tr>
                    <th scope="col" className="px-8 py-4 font-semibold">Region Name</th>
                    <th scope="col" className="px-8 py-4 font-semibold">Visitor Count</th>
                    <th scope="col" className="px-8 py-4 font-semibold">Growth Rate</th>
                    <th scope="col" className="px-8 py-4 font-semibold">Revenue Contribution</th>
                    <th scope="col" className="px-8 py-4 text-right font-semibold">Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {filteredRegions.map((region) => (
                    <tr key={region.name} className="transition-colors hover:bg-surface-container-low/50">
                      <td className="flex items-center gap-3 px-8 py-5">
                        <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10 text-primary">
                          <Icon name="map" />
                        </div>
                        <span className="font-bold">{region.name}</span>
                      </td>
                      <td className="px-8 py-5 text-body-md">{region.visitors}</td>
                      <td className="px-8 py-5">
                        <span
                          className={`rounded-full px-2 py-1 text-label-sm font-bold ${
                            region.growth > 5
                              ? 'bg-primary/10 text-primary'
                              : 'bg-secondary-container/10 text-on-secondary-container'
                          }`}
                        >
                          +{region.growth}%
                        </span>
                      </td>
                      <td className="px-8 py-5 text-body-md">{region.revenue}</td>
                      <td className="px-8 py-5 text-right">
                        <Icon
                          name={region.trend === 'up' ? 'trending_up' : 'trending_flat'}
                          className={region.trend === 'up' ? 'text-primary' : 'text-on-secondary-container'}
                        />
                      </td>
                    </tr>
                  ))}
                  {filteredRegions.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-8 py-10 text-center text-sm text-on-surface-variant">
                        No regions match your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function KpiCard({
  icon,
  change,
  label,
  value,
  note,
  accent,
  iconColor,
  changeColor,
}: {
  icon: string;
  change: string;
  label: string;
  value: string;
  note: string;
  accent: string;
  iconColor: string;
  changeColor: string;
}) {
  return (
    <article
      className={`rounded-xl border-l-4 ${accent} bg-surface-container-lowest p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.05)]`}
    >
      <div className="mb-4 flex items-start justify-between">
        <div className={`rounded-lg p-2 ${iconColor}`}>
          <Icon name={icon} />
        </div>
        <span className={`text-label-sm font-bold ${changeColor}`}>{change}</span>
      </div>
      <h3 className="text-label-lg font-medium text-on-surface-variant">{label}</h3>
      <p className="mt-1 font-headline-lg text-headline-lg">{value}</p>
      <p className="mt-2 text-label-sm text-on-surface-variant opacity-60">{note}</p>
    </article>
  );
}

function MobileRegionBar({
  name,
  count,
  percent,
  color,
}: {
  name: string;
  count: string;
  percent: number;
  color: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between gap-3 text-label-lg">
        <span>{name}</span>
        <span className="font-bold text-on-surface">{count}</span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-surface-variant">
        <div
          className={`admin-animate-bar h-full rounded-full ${color}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
