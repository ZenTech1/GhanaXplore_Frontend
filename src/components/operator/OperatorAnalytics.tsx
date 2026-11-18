'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

type Period = '7D' | '30D' | '90D' | '1Y';
type ChartMode = 'Monthly' | 'Weekly';

const periodStats: Record<Period, { revenue: string; bookings: string; partySize: string; visitors: string; conversion: string }> = {
  '7D': { revenue: '₵42.8k', bookings: '842', partySize: '3.4', visitors: '4,208', conversion: '18.2%' },
  '30D': { revenue: '₵182.4k', bookings: '3,428', partySize: '3.5', visitors: '12,840', conversion: '18.6%' },
  '90D': { revenue: '₵523k', bookings: '9,650', partySize: '3.6', visitors: '28,120', conversion: '19.1%' },
  '1Y': { revenue: '₵1.28M', bookings: '23,804', partySize: '3.7', visitors: '42,804', conversion: '18.2%' },
};

const weeklyTrend = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  values: [40, 65, 50, 85, 60, 100, 75],
};

const monthlyTrend = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  values: [60, 45, 70, 55, 85, 65, 40, 90, 75, 60, 50, 80],
};

const attractions = [
  { name: 'Kakum National Park', bookings: '15,600', revenue: '₵624,000', rating: '4.9', trend: 'flat' },
  { name: 'Cape Coast Castle', bookings: '12,450', revenue: '₵498,000', rating: '4.8', trend: 'up' },
  { name: 'Elmina Castle Tour', bookings: '8,210', revenue: '₵164,200', rating: '4.5', trend: 'up' },
];

const markets = [
  { name: 'USA', share: 32 },
  { name: 'UK', share: 24 },
  { name: 'Nigeria', share: 18 },
  { name: 'Germany', share: 12 },
];

const regions = [
  { name: 'Greater Accra', visits: '28,400', value: 85 },
  { name: 'Central Region', visits: '18,900', value: 70 },
  { name: 'Ashanti Region', visits: '12,100', value: 55 },
  { name: 'Volta Region', visits: '7,500', value: 35 },
  { name: 'Northern Region', visits: '4,200', value: 25 },
];

function Icon({ name, className = '' }: { name: string; className?: string }) {
  return <span aria-hidden="true" className={`material-symbols-outlined ${className}`}>{name}</span>;
}

function downloadCsv(period: Period) {
  const stats = periodStats[period];
  const rows = [
    ['Metric', 'Value', 'Period'],
    ['Total Revenue', stats.revenue, period],
    ['Total Bookings', stats.bookings, period],
    ['Average Party Size', stats.partySize, period],
    ['Total Visitors', stats.visitors, period],
    ...attractions.map((item) => [`Attraction revenue: ${item.name}`, item.revenue, period]),
  ];
  const csv = rows.map((row) => row.map((value) => `"${value.replace(/"/g, '""')}"`).join(',')).join('\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `ghanaxplore-analytics-${period.toLowerCase()}.csv`;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

function RevenueChart({ labels, values, mobile = false }: { labels: string[]; values: number[]; mobile?: boolean }) {
  if (mobile) {
    return (
      <div className="overflow-x-auto pb-3 -mx-2 px-2">
        <div className="flex h-40 min-w-[500px] items-end gap-3">
          {labels.map((label, index) => (
            <div key={label} className="flex h-full flex-1 flex-col items-center gap-2">
              <span className="flex-1" />
              <div
                className={`w-full rounded-t-lg transition-all duration-500 ${index === 5 ? 'bg-primary shadow-[0_-4px_12px_rgba(13,99,27,0.15)]' : index % 2 === 0 ? 'bg-primary/10' : 'bg-primary/20'}`}
                style={{ height: `${values[index]}%` }}
              />
              <span className={`text-label-sm ${index === 5 ? 'font-bold' : ''} text-on-surface-variant`}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const points = values.map((value, index) => {
    const x = Math.round((index / Math.max(values.length - 1, 1)) * 1000);
    const y = Math.round(350 - value * 3.1);
    return `${x},${y}`;
  });
  const areaPath = `M 0 400 L ${points.join(' L ')} L 1000 400 Z`;

  return (
    <div>
      <div className="relative h-[320px] w-full overflow-hidden rounded-xl bg-gradient-to-t from-surface-container/20 to-transparent sm:h-[380px]">
        <svg viewBox="0 0 1000 400" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" role="img" aria-label="Revenue trend area chart">
          <defs>
            <linearGradient id="revenue-chart-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#0d631b" stopOpacity=".28" />
              <stop offset="100%" stopColor="#0d631b" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[100, 180, 260, 340].map((y) => <line key={y} x1="0" x2="1000" y1={y} y2={y} stroke="#bfcaba" strokeDasharray="5 8" strokeOpacity=".35" />)}
          <path d={areaPath} fill="url(#revenue-chart-fill)" />
          <polyline points={points.join(' ')} fill="none" stroke="#0d631b" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          {points.map((point, index) => {
            const [cx, cy] = point.split(',');
            return <circle key={labels[index]} cx={cx} cy={cy} r="5" fill="#0d631b" stroke="white" strokeWidth="3" vectorEffect="non-scaling-stroke" />;
          })}
        </svg>
        <span className="absolute right-4 top-4 rounded-lg bg-on-surface px-3 py-2 text-xs font-semibold text-on-primary">
          GH₵ 142k
        </span>
      </div>
      <div className="mt-4 flex justify-between px-1 text-label-sm text-outline">
        {labels.filter((_, index) => index % Math.ceil(labels.length / 6) === 0).map((label) => <span key={label}>{label}</span>)}
      </div>
    </div>
  );
}

export function OperatorAnalytics() {
  const [period, setPeriod] = useState<Period>('7D');
  const [chartMode, setChartMode] = useState<ChartMode>('Monthly');
  const [notice, setNotice] = useState('');
  const stats = periodStats[period];

  const chartData = useMemo(
    () => (chartMode === 'Monthly' ? monthlyTrend : weeklyTrend),
    [chartMode],
  );

  const navigation = [
    { label: 'Dashboard', icon: 'dashboard', href: '/dashboard' },
    { label: 'Attractions', icon: 'map', href: '/operator/attractions' },
    { label: 'Bookings', icon: 'book_online', href: '/operator/bookings' },
    { label: 'Analytics', icon: 'analytics', href: '/operator/analytics' },
  ];

  const mobileNavigation = [
    ...navigation,
    { label: 'Settings', icon: 'settings', href: '#settings' },
  ];

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col border-r border-outline-variant/20 bg-surface md:flex">
        <Link href="/dashboard" className="flex h-16 shrink-0 flex-col justify-center border-b border-outline-variant/10 px-6">
          <span className="font-display-lg-mobile text-2xl tracking-tight text-primary">GhanaXplore</span>
          <span className="-mt-1 text-[10px] font-semibold uppercase tracking-widest text-secondary">Operator</span>
        </Link>
        <nav aria-label="Operator navigation" className="flex-1 space-y-2 overflow-y-auto px-4 py-6">
          {navigation.map((item) => {
            const active = item.label === 'Analytics';
            return (
              <Link
                key={item.label}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 font-label-lg transition-colors ${
                  active
                    ? 'bg-secondary-container text-on-secondary-container'
                    : 'text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                <Icon name={item.icon} />
                {item.label}
              </Link>
            );
          })}
          <button type="button" onClick={() => setNotice('Settings are not connected in this demo.')} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left font-label-lg text-on-surface-variant transition-colors hover:bg-surface-container">
            <Icon name="settings" />
            Settings
          </button>
        </nav>
      </aside>

      <div className="min-h-screen md:ml-64">
        <header className="fixed inset-x-0 top-0 z-40 bg-surface/90 pt-safe shadow-[0_1px_8px_rgba(0,0,0,0.04)] backdrop-blur-xl md:left-64">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <button type="button" aria-label="Open operator menu" onClick={() => setNotice('Use the navigation bar to visit other operator pages.')} className="flex h-11 w-11 items-center justify-center md:hidden">
              <Icon name="menu" />
            </button>
            <div className="flex flex-col items-center md:hidden">
              <span className="font-display-lg-mobile text-2xl tracking-tight text-primary">GhanaXplore</span>
              <span className="-mt-1 text-[10px] font-semibold uppercase tracking-widest text-secondary">Operator</span>
            </div>
            <div className="hidden font-headline-md text-headline-md md:block">Analytics</div>
            <div className="ml-auto flex items-center gap-2">
              <button type="button" aria-label="Notifications" onClick={() => setNotice('You are all caught up on notifications.')} className="relative flex h-11 w-11 items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-high">
                <Icon name="notifications" />
                <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-error" />
              </button>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-on-primary">
                <Icon name="person" className="text-lg" />
              </span>
            </div>
          </div>
        </header>

        <main className="min-h-screen bg-surface pb-28 pt-16 md:pb-10">
          {notice && (
            <div role="status" aria-live="polite" className="mx-4 mt-4 flex items-center justify-between gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-primary sm:mx-8">
              <span>{notice}</span>
              <button type="button" aria-label="Dismiss notification" onClick={() => setNotice('')}><Icon name="close" /></button>
            </div>
          )}

          <section className="flex flex-col justify-between gap-5 px-4 py-7 sm:px-8 md:flex-row md:items-end lg:px-12 xl:px-16">
            <div className="space-y-1">
              <span className="text-label-sm font-bold uppercase tracking-[0.2em] text-secondary">Operator Intelligence</span>
              <h1 className="font-display-lg-mobile text-display-lg-mobile text-on-surface md:text-display-lg">Performance Analytics</h1>
              <p className="max-w-2xl text-body-md text-on-surface-variant">
                Real-time oversight of revenue, visitor flow, and booking channels across your attractions.
              </p>
            </div>
            <div className="hidden gap-3 md:flex">
              <button type="button" onClick={() => downloadCsv(period)} className="group flex items-center gap-2 rounded-xl bg-surface-container-high px-5 py-3 font-label-lg transition-colors hover:bg-surface-variant">
                <Icon name="download" className="text-xl transition-transform group-hover:rotate-12" />
                Export CSV
              </button>
              <button type="button" onClick={() => window.print()} className="flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-label-lg text-on-primary shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95">
                <Icon name="picture_as_pdf" className="text-xl" />
                Monthly Report
              </button>
            </div>
          </section>

          <div className="sticky top-16 z-30 flex items-center justify-between bg-surface/95 px-4 py-3 shadow-sm backdrop-blur-md md:hidden">
            <div role="group" aria-label="Analytics time range" className="flex w-full max-w-sm rounded-full bg-surface-container p-1">
              {(['7D', '30D', '90D', '1Y'] as Period[]).map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={period === option}
                  onClick={() => setPeriod(option)}
                  className={`flex-1 rounded-full py-2 text-sm font-semibold transition-colors ${
                    period === option ? 'bg-primary-container text-on-primary-container shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            <button type="button" aria-label="Export analytics CSV" onClick={() => downloadCsv(period)} className="ml-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon name="download" />
            </button>
          </div>

          <section aria-label="Performance metrics" className="grid grid-cols-1 gap-4 px-4 py-6 md:grid-cols-2 md:gap-6 md:px-8 lg:grid-cols-4 lg:px-12 xl:px-16">
            <article className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-5 shadow-sm md:p-6">
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary/5 transition-transform duration-700 group-hover:scale-150" />
              <div className="flex items-center gap-3 md:items-start md:justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-container text-primary md:rounded-full md:bg-primary/10"><Icon name="payments" /></span>
                <span className="hidden rounded bg-primary-fixed px-2 py-1 text-label-sm text-primary md:inline">+12.4%</span>
                <span className="text-label-lg text-on-surface-variant md:hidden">Total Revenue</span>
                <span className="hidden text-label-lg text-on-surface-variant md:block">Total Revenue</span>
              </div>
              <div className="mt-3 flex items-baseline gap-2 md:mt-4">
                <span className="font-display-lg-mobile text-on-surface md:font-headline-lg md:text-headline-lg">{stats.revenue}</span>
                <span className="flex items-center text-label-sm text-primary md:hidden"><Icon name="trending_up" className="text-sm" />+12%</span>
              </div>
              <div className="mt-4 hidden h-12 w-full items-end gap-1 md:flex" aria-hidden="true">
                {[40, 60, 45, 80, 100].map((height, index) => <span key={index} className={`w-full rounded-t-sm ${index === 4 ? 'bg-primary' : 'bg-primary/20'}`} style={{ height: `${height}%` }} />)}
              </div>
            </article>

            <article className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-5 shadow-sm md:p-6">
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-secondary-container/10" />
              <div className="flex items-center gap-3 md:items-start md:justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary-container text-on-secondary-container md:rounded-full md:bg-secondary/10"><Icon name="confirmation_number" /></span>
                <span className="hidden rounded bg-secondary-fixed px-2 py-1 text-label-sm text-secondary md:inline">+3.1%</span>
                <span className="text-label-lg text-on-surface-variant md:hidden">Total Bookings</span>
                <span className="hidden text-label-lg text-on-surface-variant md:block">Avg. Booking Value</span>
              </div>
              <div className="mt-3 flex items-baseline gap-2 md:mt-4">
                <span className="font-display-lg-mobile text-on-surface md:hidden">{stats.bookings}</span>
                <span className="text-label-sm text-primary md:hidden"><Icon name="trending_up" className="inline text-sm" /> +8%</span>
                <span className="hidden font-headline-lg text-on-surface md:block">GH₵ 412.50</span>
              </div>
              <div className="mt-4 hidden h-12 w-full items-end gap-1 opacity-50 md:flex" aria-hidden="true">
                {[67, 83, 58, 75, 67].map((height, index) => <span key={index} className={`w-full rounded-t-sm ${index === 4 ? 'bg-secondary' : 'bg-secondary/40'}`} style={{ height: `${height}%` }} />)}
              </div>
            </article>

            <article className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-5 shadow-sm md:p-6">
              <div className="flex items-center gap-3 md:items-start md:justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-tertiary-container text-on-tertiary-container md:rounded-full md:bg-tertiary/10 md:text-tertiary"><Icon name="group" /></span>
                <span className="hidden rounded bg-error-container px-2 py-1 text-label-sm text-error md:inline">-0.4%</span>
                <span className="text-label-lg text-on-surface-variant md:hidden">Avg. Party Size</span>
                <span className="hidden text-label-lg text-on-surface-variant md:block">Conversion Rate</span>
              </div>
              <div className="mt-3 flex items-baseline gap-2 md:mt-4">
                <span className="font-display-lg-mobile text-on-surface md:hidden">{stats.partySize}</span>
                <span className="text-label-sm text-on-surface-variant md:hidden">Visitors</span>
                <span className="hidden font-headline-lg text-on-surface md:block">{stats.conversion}</span>
              </div>
              <div className="mt-4 hidden h-2 w-full overflow-hidden rounded-full bg-surface-container md:block">
                <div className="h-full rounded-full bg-tertiary" style={{ width: stats.conversion }} />
              </div>
            </article>

            <article className="hidden rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-sm md:block">
              <div className="flex items-start justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary"><Icon name="groups" /></span>
                <span className="rounded bg-primary-fixed px-2 py-1 text-label-sm text-primary">+22%</span>
              </div>
              <p className="mt-4 text-label-lg text-on-surface-variant">Total Visitors</p>
              <p className="font-headline-lg text-headline-lg">{stats.visitors}</p>
              <p className="mt-2 text-label-sm text-outline">Active now: 152</p>
            </article>
          </section>

          <section aria-label="Revenue trends and booking channels" className="grid grid-cols-1 gap-6 px-4 pb-8 md:px-8 lg:grid-cols-3 lg:px-12 xl:px-16">
            <article className="rounded-2xl bg-surface-container-lowest p-5 shadow-sm sm:rounded-3xl sm:p-8 lg:col-span-2">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="font-headline-md text-headline-md">Revenue Trends</h2>
                  <p className="text-sm text-on-surface-variant">Year over year performance</p>
                </div>
                <div className="hidden rounded-lg bg-surface-container p-1 md:flex" role="group" aria-label="Revenue chart interval">
                  {(['Monthly', 'Weekly'] as ChartMode[]).map((mode) => (
                    <button key={mode} type="button" aria-pressed={chartMode === mode} onClick={() => setChartMode(mode)} className={`rounded-md px-4 py-1.5 text-xs font-semibold ${chartMode === mode ? 'bg-white text-on-surface shadow-sm' : 'text-on-surface-variant'}`}>
                      {mode}
                    </button>
                  ))}
                </div>
                <span className="md:hidden text-label-sm font-semibold text-on-surface-variant">{period}</span>
              </div>
              <div className="hidden md:block">
                <RevenueChart labels={chartData.labels} values={chartData.values} />
              </div>
              <div className="md:hidden">
                <RevenueChart labels={weeklyTrend.labels} values={weeklyTrend.values.map((value, index) => Math.min(100, value + (period === '7D' ? 0 : period === '30D' ? index * 2 : period === '90D' ? index * 3 : index * 4)))} mobile />
                <p className="mt-4 text-center text-xs text-on-surface-variant">Swipe to see full weekly breakdown</p>
              </div>
            </article>

            <article className="hidden rounded-3xl border border-outline-variant/10 bg-surface-container-lowest p-8 shadow-sm lg:block">
              <h2 className="mb-2 font-headline-md text-headline-md">Booking Channels</h2>
              <p className="mb-10 text-label-lg text-on-surface-variant">Preferred payment methods</p>
              <div className="relative mx-auto mb-10 h-48 w-48 rounded-full" role="img" aria-label="Booking channels: Mobile Money 65%, Card or Online 25%, Cash at Attraction 10%" style={{ background: 'conic-gradient(#0d631b 0% 65%, #00598f 65% 90%, #fabd00 90% 100%)' }}>
                <div className="absolute inset-7 flex flex-col items-center justify-center rounded-full bg-surface-container-lowest">
                  <span className="text-label-sm text-outline">Total</span>
                  <span className="font-headline-md text-headline-md">100%</span>
                </div>
              </div>
              <div className="space-y-4">
                {[
                  { label: 'Mobile Money (MoMo)', value: '65%', color: 'bg-primary' },
                  { label: 'Card / Online', value: '25%', color: 'bg-tertiary' },
                  { label: 'Cash at Attraction', value: '10%', color: 'bg-secondary-fixed' },
                ].map((channel) => (
                  <div key={channel.label} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className={`h-3 w-3 rounded-full ${channel.color}`} />
                      <span className="text-sm">{channel.label}</span>
                    </div>
                    <span className="text-sm text-on-surface-variant">{channel.value}</span>
                  </div>
                ))}
              </div>
            </article>
          </section>

          <section aria-labelledby="channels-title" className="px-4 pb-8 md:hidden">
            <article className="rounded-2xl bg-surface-container-lowest p-5 shadow-sm">
              <h2 id="channels-title" className="mb-6 font-headline-md text-headline-md">Booking Channels</h2>
              <div className="space-y-5">
                {[
                  { label: 'GhanaXplore App', value: 65, color: 'bg-primary' },
                  { label: 'Direct Website', value: 20, color: 'bg-secondary-container' },
                  { label: 'Third Party OTA', value: 15, color: 'bg-outline-variant' },
                ].map((channel) => (
                  <div key={channel.label} className="flex flex-col gap-2">
                    <div className="flex items-center justify-between font-label-lg">
                      <span>{channel.label}</span>
                      <span className="font-bold">{channel.value}%</span>
                    </div>
                    <div className="h-3 w-full overflow-hidden rounded-full bg-surface-container">
                      <div className={`h-full rounded-full transition-all duration-700 ${channel.color}`} style={{ width: `${channel.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </section>

          <section aria-labelledby="attractions-title" className="px-4 pb-8 md:px-8 lg:px-12 xl:px-16">
            <article className="overflow-hidden rounded-2xl bg-surface-container-lowest shadow-sm sm:rounded-3xl">
              <div className="flex items-center justify-between gap-4 border-b border-outline-variant/10 p-5 sm:p-8">
                <div>
                  <h2 id="attractions-title" className="font-headline-md text-headline-md">Attraction Performance</h2>
                  <p className="text-sm text-on-surface-variant">Breakdown by site</p>
                </div>
                <Link href="/operator/attractions" className="shrink-0 text-sm font-semibold text-primary underline-offset-4 hover:underline">View All Sites</Link>
              </div>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[700px] text-left">
                  <thead>
                    <tr className="bg-surface-container-low text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                      <th scope="col" className="px-6 py-4">Attraction Name</th>
                      <th scope="col" className="px-6 py-4">Total Bookings</th>
                      <th scope="col" className="px-6 py-4">Revenue (GHS)</th>
                      <th scope="col" className="px-6 py-4">Avg. Rating</th>
                      <th scope="col" className="px-6 py-4 text-right">Trend</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10">
                    {attractions.map((item) => (
                      <tr key={item.name} className="transition-colors hover:bg-surface-container">
                        <th scope="row" className="px-6 py-5 font-label-lg font-medium">{item.name}</th>
                        <td className="px-6 py-5">{item.bookings}</td>
                        <td className="px-6 py-5 font-medium">{item.revenue}</td>
                        <td className="px-6 py-5"><span className="flex items-center gap-1 text-secondary"><Icon name="star" className="text-lg" /> <span className="text-on-surface">{item.rating}</span></span></td>
                        <td className="px-6 py-5 text-right"><Icon name={item.trend === 'up' ? 'trending_up' : 'trending_flat'} className={item.trend === 'up' ? 'text-primary' : 'text-error'} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="space-y-3 p-4 md:hidden">
                {attractions.map((item, index) => (
                  <article key={item.name} className="flex items-center gap-4 rounded-2xl bg-surface-container-low p-3">
                    <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-xl ${index === 0 ? 'bg-primary/10 text-primary' : index === 1 ? 'bg-secondary-container/30 text-secondary' : 'bg-tertiary/10 text-tertiary'}`}>
                      <Icon name={index === 0 ? 'forest' : index === 1 ? 'account_balance' : 'waterfall_chart'} className="text-3xl" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-label-lg font-semibold">{item.name}</h3>
                      <p className="truncate text-xs text-on-surface-variant">{item.revenue} revenue · {item.bookings} bookings</p>
                    </div>
                    <Icon name="arrow_forward_ios" className="text-lg text-primary" />
                  </article>
                ))}
              </div>
            </article>
          </section>

          <section aria-label="Visitor demographics" className="hidden grid-cols-1 gap-6 px-4 pb-12 md:grid md:px-8 lg:grid-cols-2 lg:px-12 xl:px-16">
            <article className="rounded-3xl border border-outline-variant/10 bg-surface-container-lowest p-6 shadow-sm sm:p-8">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="font-headline-md text-headline-md">Global Origin</h2>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">Top 5 Markets</span>
              </div>
              <div className="relative flex h-64 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-tertiary-fixed to-surface-container">
                <div aria-hidden="true" className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(#00598f 1px, transparent 1px)', backgroundSize: '14px 14px' }} />
                <div className="relative flex h-32 w-32 items-center justify-center rounded-full border border-tertiary/20 bg-white/70 text-tertiary shadow-sm">
                  <Icon name="public" className="text-7xl" />
                </div>
                <span className="absolute left-[22%] top-[35%] h-3 w-3 rounded-full border-2 border-white bg-primary shadow" />
                <span className="absolute right-[25%] top-[25%] h-4 w-4 rounded-full border-2 border-white bg-primary shadow" />
                <span className="absolute bottom-[24%] right-[37%] h-2.5 w-2.5 rounded-full border-2 border-white bg-primary shadow" />
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3">
                {markets.map((market) => (
                  <div key={market.name} className="flex items-center justify-between rounded-xl bg-surface-container-low p-3">
                    <span className="font-label-lg">{market.name}</span>
                    <span className="font-bold text-primary">{market.share}%</span>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-3xl border border-outline-variant/10 bg-surface-container-lowest p-6 shadow-sm sm:p-8">
              <h2 className="mb-8 font-headline-md text-headline-md">Regional Traffic</h2>
              <div className="space-y-7">
                {regions.map((region) => (
                  <div key={region.name}>
                    <div className="mb-2 flex justify-between gap-3">
                      <span className="font-label-lg">{region.name}</span>
                      <span className="shrink-0 text-xs text-outline">{region.visits} visits</span>
                    </div>
                    <div className="h-3 w-full overflow-hidden rounded-full bg-surface-container">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${region.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </section>

          <section className="flex flex-col items-center px-8 py-10 text-center md:hidden">
            <div className="mb-4 flex h-28 w-28 items-center justify-center rounded-full bg-primary/10 text-primary/40">
              <Icon name="explore" className="text-6xl" />
            </div>
            <h2 className="font-headline-md text-headline-md text-on-surface-variant">Keep Exploring!</h2>
            <p className="mt-2 max-w-sm text-sm text-on-surface-variant">
              Your bookings are up by 12% this week compared to last month.
            </p>
          </section>
        </main>

        <footer className="hidden items-center justify-between gap-4 border-t border-outline-variant/10 bg-surface-container-lowest px-8 py-6 md:flex lg:px-12 xl:px-16">
          <p className="text-xs text-on-surface-variant">© 2024 GhanaXplore. All rights reserved.</p>
          <div className="flex gap-6 text-xs text-on-surface-variant">
            <button type="button" onClick={() => setNotice('Support Center is not connected in this demo.')} className="hover:text-primary">Support Center</button>
            <button type="button" onClick={() => setNotice('Privacy Policy is not connected in this demo.')} className="hover:text-primary">Privacy Policy</button>
            <button type="button" onClick={() => setNotice('Terms of Service is not connected in this demo.')} className="hover:text-primary">Terms of Service</button>
          </div>
        </footer>
      </div>

      <nav aria-label="Mobile operator navigation" className="fixed inset-x-0 bottom-0 z-50 flex h-20 items-center justify-around border-t border-outline-variant/20 bg-surface-container px-2 shadow-[0_-1px_8px_rgba(0,0,0,0.05)] md:hidden">
        {mobileNavigation.map((item) => {
          const active = item.label === 'Analytics';
          if (item.label === 'Settings') {
            return (
              <button key={item.label} type="button" onClick={() => setNotice('Settings are not connected in this demo.')} className="flex min-w-[56px] flex-col items-center gap-1 text-on-surface-variant">
                <span className="flex h-8 w-16 items-center justify-center"><Icon name={item.icon} /></span>
                <span className="text-[11px]">Settings</span>
              </button>
            );
          }
          return (
            <Link key={item.label} href={item.href} aria-current={active ? 'page' : undefined} className={`flex min-w-[56px] flex-col items-center gap-1 ${active ? 'font-bold text-on-surface' : 'text-on-surface-variant'}`}>
              <span className={`flex h-8 w-16 items-center justify-center rounded-full ${active ? 'bg-primary-container text-on-primary-container' : ''}`}><Icon name={item.icon} /></span>
              <span className="text-[11px]">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
