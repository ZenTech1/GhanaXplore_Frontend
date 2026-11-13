'use client';

import { useMemo, useState } from 'react';

type ReportStatus = 'Ready' | 'Processing';

interface Report {
  id: number;
  name: string;
  type: string;
  date: string;
  status: ReportStatus;
}

interface ReportTemplate {
  name: string;
  description: string;
  icon: string;
  iconClass: string;
  buttonClass: string;
}

const navigation = [
  { label: 'National Analytics', icon: 'leaderboard', href: '/admin' },
  { label: 'Operator Verification', icon: 'verified_user', href: '/admin/operator-verification' },
  { label: 'Content Moderation', icon: 'gavel', href: '/admin/content-moderation' },
  { label: 'Tourism Reports', icon: 'description', href: '/admin/revenue-tracking' },
  { label: 'Portal Settings', icon: 'settings', href: '/admin/settings' },
];

const templates: ReportTemplate[] = [
  {
    name: 'Quarterly Regional Growth',
    description: 'Detailed breakdown of visitor surges and economic impact across regions.',
    icon: 'insights',
    iconClass: 'bg-primary/10 text-primary',
    buttonClass: 'hover:bg-primary',
  },
  {
    name: 'Annual Infrastructure Audit',
    description: 'Assessment of roads, landmarks, and hospitality facility statuses.',
    icon: 'construction',
    iconClass: 'bg-secondary/10 text-secondary',
    buttonClass: 'hover:bg-secondary',
  },
  {
    name: 'Revenue & Tax Compliance',
    description: 'Financial tracking and operator tax contribution summaries.',
    icon: 'receipt_long',
    iconClass: 'bg-tertiary/10 text-tertiary',
    buttonClass: 'hover:bg-tertiary',
  },
  {
    name: 'Visitor Demographic Analysis',
    description: 'Deep dive into age, origin, and interest patterns of tourists.',
    icon: 'group',
    iconClass: 'bg-primary-fixed-dim/30 text-on-primary-fixed-variant',
    buttonClass: 'hover:bg-primary-container',
  },
];

const initialReports: Report[] = [
  { id: 1, name: 'Q3_Eastern_Region_Summary', type: 'Regional Growth', date: 'Oct 12, 2023', status: 'Ready' },
  { id: 2, name: 'Annual_Accra_Hotels_2023', type: 'Infrastructure Audit', date: 'Oct 10, 2023', status: 'Processing' },
  { id: 3, name: 'Demographics_Festivals_23', type: 'Visitor Analysis', date: 'Oct 08, 2023', status: 'Ready' },
  { id: 4, name: 'Tax_Compliance_Log_Final', type: 'Revenue & Tax', date: 'Sep 30, 2023', status: 'Ready' },
];

const initialSchedules = [
  { id: 1, name: 'Monthly ROI', cadence: 'Every 1st of month', email: 'stakeholders@gta.gov', enabled: true },
  { id: 2, name: 'Weekly Arrivals', cadence: 'Every Monday, 8:00 AM', email: 'kwame.m@gta.gov', enabled: true },
  { id: 3, name: 'Heritage Audit', cadence: 'Biannual Schedule', email: '', enabled: false },
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

function downloadReportsCsv(reports: Report[], filename: string) {
  const rows = [
    ['Report Name', 'Type', 'Date', 'Status'],
    ...reports.map((report) => [report.name, report.type, report.date, report.status]),
  ];
  const csv = rows
    .map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(','))
    .join('\r\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function AdminTourismReports() {
  const [reports, setReports] = useState(initialReports);
  const [schedules, setSchedules] = useState(initialSchedules);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All types');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notice, setNotice] = useState('');
  const [nextId, setNextId] = useState(5);

  const filteredReports = useMemo(() => {
    const query = search.trim().toLowerCase();
    return reports.filter((report) => {
      const matchesSearch = !query || `${report.name} ${report.type} ${report.status}`.toLowerCase().includes(query);
      return matchesSearch && (typeFilter === 'All types' || report.type === typeFilter);
    });
  }, [reports, search, typeFilter]);

  const reportTypes = Array.from(new Set(reports.map((report) => report.type)));

  function generateReport(template?: ReportTemplate) {
    const name = template?.name ?? 'Tourism_Operational_Overview';
    const type = template
      ? template.name.includes('Growth')
        ? 'Regional Growth'
        : template.name.includes('Infrastructure')
          ? 'Infrastructure Audit'
          : template.name.includes('Tax')
            ? 'Revenue & Tax'
            : 'Visitor Analysis'
      : 'Operational Overview';
    const report: Report = {
      id: nextId,
      name: `${name.replaceAll(/[^a-zA-Z0-9]+/g, '_')}_${nextId}`,
      type,
      date: new Intl.DateTimeFormat('en', { month: 'short', day: '2-digit', year: 'numeric' }).format(new Date()),
      status: 'Processing',
    };
    setReports((current) => [report, ...current]);
    setNextId((id) => id + 1);
    setSearch('');
    setTypeFilter('All types');
    setNotice(`${template?.name ?? 'Tourism report'} added to the report queue.`);
  }

  function toggleSchedule(id: number) {
    setSchedules((current) =>
      current.map((schedule) =>
        schedule.id === id ? { ...schedule, enabled: !schedule.enabled } : schedule,
      ),
    );
  }

  function addSchedule() {
    const id = Math.max(0, ...schedules.map((schedule) => schedule.id)) + 1;
    setSchedules((current) => [
      ...current,
      { id, name: 'New Tourism Report', cadence: 'Monthly', email: '', enabled: true },
    ]);
    setNotice('A monthly report schedule was added.');
  }

  function shareReport(report: Report) {
    if (!navigator.clipboard) {
      setNotice('Clipboard access is unavailable in this browser.');
      return;
    }
    navigator.clipboard
      .writeText(report.name)
      .then(() => setNotice(`Copied "${report.name}" to the clipboard.`))
      .catch(() => setNotice('Could not copy the report name to the clipboard.'));
  }

  function reportRow(report: Report) {
    const statusClass =
      report.status === 'Ready'
        ? 'bg-primary-fixed-dim/30 text-on-primary-fixed-variant'
        : 'bg-secondary-fixed-dim/30 text-on-secondary-fixed-variant';

    return (
      <>
        <td className="px-6 py-5">
          <div className="flex items-center gap-3">
            <Icon
              name={report.status === 'Ready' ? 'picture_as_pdf' : 'analytics'}
              className={report.status === 'Ready' ? 'text-primary' : 'text-secondary'}
            />
            <span className="font-label-lg text-on-surface">{report.name}</span>
          </div>
        </td>
        <td className="px-6 py-5 text-body-md text-on-surface-variant">{report.type}</td>
        <td className="px-6 py-5 text-body-md text-on-surface-variant">{report.date}</td>
        <td className="px-6 py-5">
          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-label-sm ${statusClass}`}>
            {report.status === 'Processing' && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-secondary" />}
            {report.status}
          </span>
        </td>
        <td className="px-6 py-5 text-right">
          {report.status === 'Ready' ? (
            <div className="flex items-center justify-end gap-1">
              <button
                type="button"
                onClick={() => downloadReportsCsv([report], `${report.name}.csv`)}
                aria-label={`Download ${report.name} data`}
                title="Download report data"
                className="rounded p-2 text-on-surface-variant transition-colors hover:text-primary"
              >
                <Icon name="download" className="text-[20px]" />
              </button>
              <button
                type="button"
                onClick={() => shareReport(report)}
                aria-label={`Copy ${report.name} name`}
                title="Copy report name"
                className="rounded p-2 text-on-surface-variant transition-colors hover:text-primary"
              >
                <Icon name="share" className="text-[20px]" />
              </button>
            </div>
          ) : (
            <span className="inline-flex items-center justify-end p-2 text-outline" title="Report is processing">
              <Icon name="lock" className="text-[20px]" />
              <span className="sr-only">Report is processing</span>
            </span>
          )}
        </td>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <aside className="fixed left-0 top-0 z-50 hidden h-screen w-72 flex-col overflow-y-auto border-r border-outline-variant bg-surface py-8 lg:flex">
        <div className="mb-10 flex items-center gap-3 px-8">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-container text-white">
            <Icon name="account_balance" />
          </span>
          <div>
            <a href="/admin" className="font-headline-md text-headline-md font-bold text-primary">GTA Admin</a>
            <p className="text-label-sm text-on-surface-variant">Infrastructure Portal</p>
          </div>
        </div>
        <nav aria-label="Admin navigation" className="flex-1 space-y-1">
          {navigation.map((item) => {
            const active = item.label === 'Tourism Reports';
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
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-error px-4 py-3 font-label-lg text-on-error transition-all hover:bg-error/90 active:scale-95"
          >
            <Icon name="emergency_home" filled />
            Emergency Response
          </button>
        </div>
      </aside>

      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-outline-variant/30 bg-surface px-4 shadow-sm lg:hidden">
        <div className="flex items-center gap-4">
          <button
            type="button"
            aria-label={isMobileMenuOpen ? 'Close admin menu' : 'Open admin menu'}
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            className="text-on-surface-variant hover:text-primary"
          >
            <Icon name={isMobileMenuOpen ? 'close' : 'menu'} />
          </button>
          <a href="/admin" className="font-headline-md text-headline-md font-bold text-primary">Tourism Reports</a>
        </div>
        <button type="button" aria-label="Notifications" className="relative text-on-surface-variant">
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
          <nav aria-label="Admin navigation" className="flex h-full w-[min(20rem,85vw)] flex-col bg-surface p-5 shadow-xl">
            <div className="mb-6 border-b border-outline-variant/50 pb-5">
              <p className="font-headline-md text-headline-md font-bold text-primary">GTA Admin</p>
              <p className="mt-1 text-label-sm uppercase tracking-widest text-outline">Infrastructure Portal</p>
            </div>
            <div className="space-y-1">
              {navigation.map((item) => {
                const active = item.label === 'Tourism Reports';
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

      <main className="min-h-screen lg:ml-72">
        <header className="sticky top-0 z-30 hidden h-20 items-center justify-between border-b border-outline-variant bg-surface-bright px-6 lg:flex xl:px-16">
          <div className="flex min-w-0 flex-1 items-center gap-6">
            <h1 className="shrink-0 font-display-lg text-headline-md font-black tracking-tight text-primary">Admin Portal</h1>
            <label className="relative w-full max-w-sm">
              <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                aria-label="Search analytics or reports"
                placeholder="Search analytics or reports..."
                className="w-full rounded-full border-none bg-surface-container py-2.5 pl-12 pr-4 text-body-md placeholder:text-outline focus:ring-2 focus:ring-primary/20"
              />
            </label>
          </div>
          <div className="ml-6 flex shrink-0 items-center gap-4 text-on-surface-variant">
            <button type="button" aria-label="Notifications" className="relative rounded-full p-2 hover:bg-surface-container">
              <Icon name="notifications" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-error" />
            </button>
            <button type="button" aria-label="Help" className="rounded-full p-2 hover:bg-surface-container">
              <Icon name="help" />
            </button>
            <button type="button" aria-label="Apps" className="rounded-full p-2 hover:bg-surface-container">
              <Icon name="apps" />
            </button>
            <span className="h-8 w-px bg-outline-variant" />
            <div className="flex items-center gap-3">
              <div className="hidden text-right xl:block">
                <p className="text-label-lg leading-tight text-on-surface">Kwame Mensah</p>
                <p className="text-label-sm leading-tight text-on-surface-variant">Senior Administrator</p>
              </div>
              <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary/20 bg-primary-container font-bold text-on-primary-container">
                KM
              </span>
            </div>
          </div>
        </header>

        <div className="bg-surface-container-low px-4 pb-28 pt-6 sm:px-6 lg:min-h-[calc(100vh-5rem)] lg:px-10 lg:py-10">
          <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between lg:mb-12">
            <div>
              <div className="mb-3 flex items-center gap-2 text-label-sm text-on-surface-variant">
                <span>Admin</span>
                <Icon name="chevron_right" className="text-[14px]" />
                <span className="font-bold text-primary">Reports</span>
              </div>
              <h2 className="font-headline-lg text-headline-lg text-on-surface">Tourism Reports</h2>
              <p className="mt-2 max-w-2xl text-body-md text-on-surface-variant">
                Access comprehensive data regarding regional growth, infrastructure audits, and visitor demographics for the Republic of Ghana.
              </p>
            </div>
            <button
              type="button"
              onClick={() => generateReport()}
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-primary-container px-6 py-3.5 font-label-lg text-white shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:bg-primary-container/90 active:scale-95 md:w-auto md:px-8"
            >
              <Icon name="add_chart" />
              Generate New Report
            </button>
          </div>

          {notice && (
            <div role="status" className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-on-primary-fixed-variant">
              <span>{notice}</span>
              <button type="button" aria-label="Dismiss notification" onClick={() => setNotice('')} className="rounded p-1 hover:bg-primary/10">
                <Icon name="close" />
              </button>
            </div>
          )}

          <label className="relative mb-6 block lg:hidden">
            <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search reports"
              placeholder="Search for reports..."
              className="w-full rounded-xl border border-outline-variant/20 bg-surface-container py-3 pl-12 pr-4 text-body-md placeholder:text-on-surface-variant focus:border-primary focus:ring-0"
            />
          </label>

          <section aria-labelledby="report-templates-title" className="mb-10 lg:mb-16">
            <div className="mb-5 flex items-center justify-between lg:mb-8">
              <h3 id="report-templates-title" className="font-headline-md text-headline-md text-on-surface">Report Templates</h3>
              <span className="hidden items-center gap-1 text-label-lg text-primary sm:inline-flex">
                Choose a template to generate a report <Icon name="arrow_forward" className="text-[18px]" />
              </span>
            </div>
            <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 md:pb-0 xl:grid-cols-4">
              {templates.map((template) => (
                <article
                  key={template.name}
                  className="w-56 shrink-0 rounded-2xl border border-outline-variant bg-white p-5 transition-all hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 md:w-auto md:p-6"
                >
                  <span className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${template.iconClass}`}>
                    <Icon name={template.icon} filled />
                  </span>
                  <h4 className="mb-2 font-label-lg text-lg text-on-surface">{template.name}</h4>
                  <p className="mb-5 text-label-sm text-on-surface-variant">{template.description}</p>
                  <button
                    type="button"
                    onClick={() => generateReport(template)}
                    className={`w-full rounded-lg bg-surface-container-high py-2 font-label-sm text-on-surface transition-colors ${template.buttonClass} hover:text-white`}
                  >
                    Select Template
                  </button>
                </article>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
            <section aria-labelledby="recent-reports-title" className="min-w-0 xl:col-span-2">
              <div className="overflow-hidden rounded-3xl border border-outline-variant bg-white shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-outline-variant p-5 sm:p-6">
                  <h3 id="recent-reports-title" className="font-headline-md text-headline-md text-on-surface">Recent Reports</h3>
                  <div className="flex items-center gap-2">
                    <label className="relative">
                      <span className="sr-only">Filter reports by type</span>
                      <select
                        value={typeFilter}
                        onChange={(event) => setTypeFilter(event.target.value)}
                        className={`${isFilterOpen ? 'block' : 'hidden sm:block'} max-w-44 rounded-lg border border-outline-variant bg-white py-2 pl-3 pr-8 text-sm focus:border-primary focus:ring-primary`}
                      >
                        <option>All types</option>
                        {reportTypes.map((type) => <option key={type}>{type}</option>)}
                      </select>
                    </label>
                    <button
                      type="button"
                      aria-label={isFilterOpen ? 'Hide report filters' : 'Show report filters'}
                      aria-expanded={isFilterOpen}
                      onClick={() => setIsFilterOpen((open) => !open)}
                      className="rounded-lg border border-outline-variant p-2 transition-colors hover:bg-surface-container-low"
                    >
                      <Icon name="filter_list" className="text-[20px]" />
                    </button>
                    <button
                      type="button"
                      onClick={() => downloadReportsCsv(filteredReports, 'ghanaxplore-tourism-reports.csv')}
                      aria-label="Export visible reports as CSV"
                      className="rounded-lg border border-outline-variant p-2 transition-colors hover:bg-surface-container-low"
                    >
                      <Icon name="download" className="text-[20px]" />
                    </button>
                  </div>
                </div>
                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full min-w-[700px] text-left">
                    <thead className="bg-surface-container-lowest">
                      <tr>
                        {['Report Name', 'Type', 'Date', 'Status', 'Actions'].map((label) => (
                          <th key={label} scope="col" className={`px-6 py-4 font-label-sm uppercase tracking-wider text-on-surface-variant ${label === 'Actions' ? 'text-right' : ''}`}>
                            {label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant">
                      {filteredReports.map((report) => <tr key={report.id} className="transition-colors hover:bg-surface-container-low">{reportRow(report)}</tr>)}
                    </tbody>
                  </table>
                  {filteredReports.length === 0 && <p className="p-8 text-center text-sm text-on-surface-variant">No reports match your search.</p>}
                </div>
                <div className="space-y-3 p-4 md:hidden">
                  {filteredReports.map((report) => (
                    <article key={report.id} className="flex items-center justify-between gap-3 rounded-2xl border border-outline-variant/30 bg-surface p-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/5 text-primary">
                          <Icon name={report.status === 'Ready' ? 'description' : 'analytics'} />
                        </span>
                        <div className="min-w-0">
                          <h4 className="truncate font-bold text-on-surface">{report.name}</h4>
                          <p className="truncate text-xs text-on-surface-variant">{report.type} · {report.date}</p>
                          <span className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${report.status === 'Ready' ? 'bg-primary-fixed-dim/30 text-on-primary-fixed-variant' : 'bg-secondary-fixed-dim/30 text-on-secondary-fixed-variant'}`}>
                            {report.status}
                          </span>
                        </div>
                      </div>
                      {report.status === 'Ready' ? (
                        <button
                          type="button"
                          onClick={() => downloadReportsCsv([report], `${report.name}.csv`)}
                          aria-label={`Download ${report.name} data`}
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-on-surface-variant hover:bg-primary/10 hover:text-primary"
                        >
                          <Icon name="download" />
                        </button>
                      ) : <Icon name="lock" className="shrink-0 p-2 text-outline" />}
                    </article>
                  ))}
                  {filteredReports.length === 0 && <p className="py-8 text-center text-sm text-on-surface-variant">No reports match your search.</p>}
                </div>
                <div className="flex items-center justify-between border-t border-outline-variant bg-surface-container-lowest px-5 py-4 text-label-sm text-on-surface-variant sm:px-6">
                  <span>Showing {filteredReports.length} of {reports.length} reports</span>
                  <button
                    type="button"
                    onClick={() => setReports(initialReports)}
                    disabled={reports.length === initialReports.length}
                    className="rounded-lg border border-outline-variant px-3 py-1.5 font-label-sm transition-colors hover:bg-surface-container-low disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Reset demo data
                  </button>
                </div>
              </div>
            </section>

            <section aria-labelledby="scheduled-title" className="xl:col-span-1">
              <div className="h-full rounded-3xl border border-outline-variant bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-6 flex items-center justify-between">
                  <h3 id="scheduled-title" className="font-headline-md text-headline-md text-on-surface">Scheduled Reports</h3>
                  <button
                    type="button"
                    onClick={addSchedule}
                    aria-label="Add scheduled report"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-container text-white transition-transform hover:scale-105 active:scale-95"
                  >
                    <Icon name="add" className="text-[18px]" />
                  </button>
                </div>
                <div className="space-y-4">
                  {schedules.map((schedule) => (
                    <article key={schedule.id} className={`rounded-2xl border border-outline-variant/30 bg-surface-container-low p-4 ${schedule.enabled ? '' : 'opacity-60'}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-primary shadow-sm">
                            <Icon name={schedule.name.includes('Weekly') ? 'update' : schedule.name.includes('Heritage') ? 'history' : 'calendar_month'} />
                          </span>
                          <div>
                            <h4 className="font-label-lg text-on-surface">{schedule.name}</h4>
                            <p className="text-label-sm text-on-surface-variant">{schedule.cadence}</p>
                          </div>
                        </div>
                        <label className="relative inline-flex shrink-0 cursor-pointer items-center">
                          <span className="sr-only">Enable {schedule.name}</span>
                          <input
                            type="checkbox"
                            checked={schedule.enabled}
                            onChange={() => toggleSchedule(schedule.id)}
                            className="peer sr-only"
                          />
                          <span className="h-5 w-10 rounded-full bg-surface-variant transition-colors peer-checked:bg-primary-fixed-dim peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary" />
                          <span className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
                        </label>
                      </div>
                      {schedule.email && (
                        <p className="mt-4 flex items-center gap-2 text-label-sm text-on-surface-variant">
                          <Icon name="mail" className="text-[16px]" />
                          {schedule.email}
                        </p>
                      )}
                    </article>
                  ))}
                </div>
                <div className="mt-8 rounded-2xl border border-primary/20 bg-primary-container/5 p-4">
                  <div className="flex gap-3">
                    <Icon name="info" className="text-primary" />
                    <p className="text-label-sm text-on-primary-fixed-variant">
                      Automated reports are delivered to encrypted government endpoints only.{' '}
                      <button type="button" onClick={() => setNotice('Report delivery policy settings are not configured in this demo.')} className="font-bold underline">
                        Manage Policy
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <nav
        aria-label="Mobile admin navigation"
        className="fixed bottom-0 z-50 flex w-full items-center justify-around border-t border-outline-variant/20 bg-surface px-2 pt-3 shadow-[0px_-4px_20px_rgba(0,0,0,0.05)] [padding-bottom:max(0.75rem,env(safe-area-inset-bottom))] lg:hidden"
      >
        {[
          { label: 'Analytics', icon: 'analytics', href: '/admin' },
          { label: 'Verify', icon: 'verified_user', href: '/admin/operator-verification' },
          { label: 'Mod', icon: 'gavel', href: '/admin/content-moderation' },
          { label: 'Reports', icon: 'description', href: '/admin/revenue-tracking' },
        ].map((item) => {
          const active = item.label === 'Reports';
          return (
            <a
              key={item.label}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={`flex min-w-[64px] flex-col items-center justify-center rounded-xl px-4 py-1 transition-all active:scale-95 ${
                active ? 'bg-primary-container font-bold text-on-primary-container' : 'text-on-surface-variant hover:bg-surface-variant'
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
