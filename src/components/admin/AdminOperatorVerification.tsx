'use client';

import { useMemo, useState } from 'react';

type ApplicationType = 'Independent Guide' | 'Tour Operator';
type ApplicationStatus = 'Under Review' | 'Pending' | 'Approved' | 'Rejected';
type VerificationTier = 'Silver' | 'Gold' | 'Platinum';

interface Application {
  id: string;
  name: string;
  location: string;
  type: ApplicationType;
  applied: string;
  status: ApplicationStatus;
  initials: string;
  tier: VerificationTier;
  cardId: string;
  certification: string;
  portrait: string;
  cardImage: string;
}

const initialApplications: Application[] = [
  {
    id: 'GTA-V-8821',
    name: 'Kwame Ansah',
    location: 'Accra Region',
    type: 'Independent Guide',
    applied: 'Oct 24, 2023',
    status: 'Under Review',
    initials: 'KA',
    tier: 'Silver',
    cardId: '00921-GH-ACC',
    certification: 'GTA-ID-00129',
    portrait:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC0ZkzN2xuQodD8zNS5uocwCjaZdTDfnDKycJOVVXNje7tkNNP8sDW_5xbpdafdU35mvaMkDkvvwI8J-GahQ-7oWS3V1swg5MhZxP5RFW8NtHwmhPS91uLwnRzU-15BVKVmTMesz-P08ESTgPXfWEik4uuwDpFPRb7qk4G1D5gigBrDrCURv9_xwKApVGG8bXD238CBVK6-7WYp2KtVUcUJVMLUORouxo26QPpuIiFfQaiicL5AhF-n4OmVUi_TUSSgumcNvBuIo4jO',
    cardImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBJsMlZyVPboGEE6FogJl3zXDtPNJB0yTHb9reFQpa0V_1fGYMOykvEZ08RiPkDEmuZk0eq9PugXXagOOllDcj0S78jsDF5s-Nbfd3xdlcInXvjn7b5HTHnB3blBUmiFobuEU0HbIBigWJy_MhhmJiNfmuMIABO6hrjNnu2pNHApWzp96aim5LYgYDvPzD-2XrFVNUo1WvLbNdrvjDkQBpWHgPaRuEJ-rgRQnLFhs3GmbT3mg4KwC6KyTWN-Y2uis4VaMVxOR_d5EJX',
  },
  {
    id: 'GTA-V-8820',
    name: 'West-End Tours Ltd.',
    location: 'Cape Coast',
    type: 'Tour Operator',
    applied: 'Oct 23, 2023',
    status: 'Pending',
    initials: 'WT',
    tier: 'Platinum',
    cardId: '00214-GH-CEN',
    certification: 'GTA-OP-00418',
    portrait:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA-0G64D3a2LnQAmfuy-qijPcI-JvNvAhZkmnKL5xV07UGoY8O67sEw0YcgCiYONmi0GnlzJ4LkLyJRqCapOma6iQfLOBtID_vJ-p9ggVMyvKf5T9znUXiwiuIDuqzRZFR4nhR_TMhzY8VeXsjwTYcJ6F9o115mHzgR6R2I0bqyT9fBLzxs0ihxNwb7Sg_kkRKKABtCB5lqtByOrkRGkMtNh3sJW9z-eB8B6gxioZpgyryyr3CKgvJaB4lMbM_Ni93l3Prg3aA-jpnI',
    cardImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBJsMlZyVPboGEE6FogJl3zXDtPNJB0yTHb9reFQpa0V_1fGYMOykvEZ08RiPkDEmuZk0eq9PugXXagOOllDcj0S78jsDF5s-Nbfd3xdlcInXvjn7b5HTHnB3blBUmiFobuEU0HbIBigWJy_MhhmJiNfmuMIABO6hrjNnu2pNHApWzp96aim5LYgYDvPzD-2XrFVNUo1WvLbNdrvjDkQBpWHgPaRuEJ-rgRQnLFhs3GmbT3mg4KwC6KyTWN-Y2uis4VaMVxOR_d5EJX',
  },
  {
    id: 'GTA-V-8819',
    name: 'Efua Danso',
    location: 'Cape Coast',
    type: 'Independent Guide',
    applied: 'Oct 22, 2023',
    status: 'Pending',
    initials: 'ED',
    tier: 'Gold',
    cardId: '00682-GH-CEN',
    certification: 'GTA-ID-00134',
    portrait:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC0ZkzN2xuQodD8zNS5uocwCjaZdTDfnDKycJOVVXNje7tkNNP8sDW_5xbpdafdU35mvaMkDkvvwI8J-GahQ-7oWS3V1swg5MhZxP5RFW8NtHwmhPS91uLwnRzU-15BVKVmTMesz-P08ESTgPXfWEik4uuwDpFPRb7qk4G1D5gigBrDrCURv9_xwKApVGG8bXD238CBVK6-7WYp2KtVUcUJVMLUORouxo26QPpuIiFfQaiicL5AhF-n4OmVUi_TUSSgumcNvBuIo4jO',
    cardImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBJsMlZyVPboGEE6FogJl3zXDtPNJB0yTHb9reFQpa0V_1fGYMOykvEZ08RiPkDEmuZk0eq9PugXXagOOllDcj0S78jsDF5s-Nbfd3xdlcInXvjn7b5HTHnB3blBUmiFobuEU0HbIBigWJy_MhhmJiNfmuMIABO6hrjNnu2pNHApWzp96aim5LYgYDvPzD-2XrFVNUo1WvLbNdrvjDkQBpWHgPaRuEJ-rgRQnLFhs3GmbT3mg4KwC6KyTWN-Y2uis4VaMVxOR_d5EJX',
  },
  {
    id: 'GTA-V-8818',
    name: 'Savannah Trails Ghana',
    location: 'Tamale Region',
    type: 'Tour Operator',
    applied: 'Oct 21, 2023',
    status: 'Pending',
    initials: 'ST',
    tier: 'Silver',
    cardId: '00309-GH-NOR',
    certification: 'GTA-OP-00421',
    portrait:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA-0G64D3a2LnQAmfuy-qijPcI-JvNvAhZkmnKL5xV07UGoY8O67sEw0YcgCiYONmi0GnlzJ4LkLyJRqCapOma6iQfLOBtID_vJ-p9ggVMyvKf5T9znUXiwiuIDuqzRZFR4nhR_TMhzY8VeXsjwTYcJ6F9o115mHzgR6R2I0bqyT9fBLzxs0ihxNwb7Sg_kkRKKABtCB5lqtByOrkRGkMtNh3sJW9z-eB8B6gxioZpgyryyr3CKgvJaB4lMbM_Ni93l3Prg3aA-jpnI',
    cardImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBJsMlZyVPboGEE6FogJl3zXDtPNJB0yTHb9reFQpa0V_1fGYMOykvEZ08RiPkDEmuZk0eq9PugXXagOOllDcj0S78jsDF5s-Nbfd3xdlcInXvjn7b5HTHnB3blBUmiFobuEU0HbIBigWJy_MhhmJiNfmuMIABO6hrjNnu2pNHApWzp96aim5LYgYDvPzD-2XrFVNUo1WvLbNdrvjDkQBpWHgPaRuEJ-rgRQnLFhs3GmbT3mg4KwC6KyTWN-Y2uis4VaMVxOR_d5EJX',
  },
];

const navItems = [
  { name: 'National Analytics', icon: 'analytics', href: '/admin' },
  { name: 'Operator Verification', icon: 'fact_check', href: '/admin/operator-verification' },
  { name: 'Content Moderation', icon: 'rule', href: '/admin/content-moderation' },
  { name: 'Revenue Tracking', icon: 'payments', href: '/admin/revenue-tracking' },
  { name: 'Settings', icon: 'settings', href: '/admin/settings' },
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

export function AdminOperatorVerification() {
  const [applications, setApplications] = useState(initialApplications);
  const [selectedId, setSelectedId] = useState(initialApplications[0].id);
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'All Types' | ApplicationType>('All Types');
  const [tierFilter, setTierFilter] = useState<'All Tiers' | VerificationTier>('All Tiers');
  const [regionFilter, setRegionFilter] = useState('All Regions');
  const [isMobileDetailsOpen, setIsMobileDetailsOpen] = useState(false);
  const [shareNotice, setShareNotice] = useState('');
  const [notice, setNotice] = useState('');

  const mobileRegions = useMemo(
    () => [...new Set(applications.map((application) => getRegion(application.location)))],
    [applications],
  );

  const filteredApplications = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return applications.filter((application) => {
      const matchesQuery =
        !normalizedQuery ||
        [application.name, application.location, application.id, application.type]
          .join(' ')
          .toLowerCase()
          .includes(normalizedQuery);
      const matchesType = typeFilter === 'All Types' || application.type === typeFilter;
      const matchesTier = tierFilter === 'All Tiers' || application.tier === tierFilter;
      const matchesRegion =
        regionFilter === 'All Regions' || getRegion(application.location) === regionFilter;
      return matchesQuery && matchesType && matchesTier && matchesRegion;
    });
  }, [applications, query, regionFilter, tierFilter, typeFilter]);

  const selectedApplication =
    filteredApplications.find((application) => application.id === selectedId) ??
    filteredApplications[0] ??
    null;
  const pendingCount = applications.filter(
    (application) => application.status === 'Pending' || application.status === 'Under Review',
  ).length;

  function decideApplication(decision: 'Approved' | 'Rejected') {
    if (!selectedApplication) return;

    setApplications((current) =>
      current.map((application) =>
        application.id === selectedApplication.id ? { ...application, status: decision } : application,
      ),
    );
    setNotice(`${selectedApplication.name} was marked ${decision.toLowerCase()}.`);

    const nextApplication = filteredApplications.find(
      (application) =>
        application.id !== selectedApplication.id &&
        (application.status === 'Pending' || application.status === 'Under Review'),
    );
    if (nextApplication) setSelectedId(nextApplication.id);
  }

  async function shareApplication(application: Application) {
    const shareData = {
      title: `GTA verification: ${application.name}`,
      text: `Review ${application.name}'s ${application.type.toLowerCase()} application (Ref: ${application.id}).`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        setShareNotice(`Application for ${application.name} shared.`);
        return;
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') return;
        setShareNotice('Unable to share this application. Please try again.');
        return;
      }
    }

    try {
      await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
      setShareNotice('Application link copied.');
    } catch {
      setShareNotice('Sharing is unavailable in this browser.');
    }
  }

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <aside className="fixed left-0 top-0 z-50 hidden h-screen w-64 flex-col border-r border-outline-variant bg-surface-container-lowest py-2 shadow-sm lg:flex">
        <div className="mb-6 px-6 py-4">
          <a href="/admin" className="font-headline-md text-headline-md font-bold tracking-tight text-primary">
            GTA Admin
          </a>
          <p className="mt-1 text-label-sm text-on-surface-variant opacity-70">Management Portal</p>
        </div>
        <nav aria-label="Admin navigation" className="flex flex-1 flex-col gap-1">
          {navItems.map((item) => {
            const active = item.name === 'Operator Verification';
            return (
              <a
                key={item.name}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={`flex items-center gap-3 border-r-4 px-4 py-3 transition-colors duration-200 ${
                  active
                    ? 'border-primary bg-primary-container/10 font-bold text-primary'
                    : 'border-transparent text-on-surface-variant hover:bg-surface-container-high hover:text-primary'
                }`}
              >
                <Icon name={item.icon} />
                <span className="text-label-lg">{item.name}</span>
              </a>
            );
          })}
        </nav>
        <div className="mt-auto p-4">
          <button
            type="button"
            onClick={() => setNotice('Reports are not connected in this demo.')}
            className="w-full rounded-xl bg-primary py-3 text-label-lg font-semibold text-on-primary shadow-md transition-all hover:opacity-90 active:scale-95"
          >
            Generate Report
          </button>
        </div>
      </aside>

      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-outline-variant bg-surface px-4 sm:px-6 lg:ml-64 lg:px-6">
        <div className="flex min-w-0 items-center gap-4">
          <a href="/admin" className="font-headline-md text-headline-md font-bold text-primary lg:hidden">
            GhanaXplore
          </a>
          <h1 className="hidden whitespace-nowrap font-headline-md text-headline-md text-on-surface lg:block">
            GTA Dashboard
          </h1>
          <span className="hidden h-6 w-px bg-outline-variant lg:block" />
          <span className="hidden truncate text-label-lg text-on-surface-variant lg:block">
            Verification Queue
          </span>
        </div>
        <div className="flex items-center gap-3 sm:gap-6">
          <label className="relative hidden lg:flex lg:items-center">
            <Icon name="search" className="absolute left-3 text-outline" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-56 rounded-full border-none bg-surface-container-low py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary lg:w-64"
              placeholder="Search application..."
              type="search"
              aria-label="Search applications"
            />
          </label>
          <button type="button" aria-label="Notifications" className="text-on-surface-variant hover:text-primary">
            <Icon name="notifications" />
          </button>
          <button type="button" aria-label="Help" className="hidden text-on-surface-variant hover:text-primary sm:block">
            <Icon name="help" />
          </button>
          <div className="h-8 w-8 overflow-hidden rounded-full border border-primary">
            <img
              className="h-full w-full object-cover"
              alt="GTA administrator"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-0G64D3a2LnQAmfuy-qijPcI-JvNvAhZkmnKL5xV07UGoY8O67sEw0YcgCiYONmi0GnlzJ4LkLyJRqCapOma6iQfLOBtID_vJ-p9ggVMyvKf5T9znUXiwiuIDuqzRZFR4nhR_TMhzY8VeXsjwTYcJ6F9o115mHzgR6R2I0bqyT9fBLzxs0ihxNwb7Sg_kkRKKABtCB5lqtByOrkRGkMtNh3sJW9z-eB8B6gxioZpgyryyr3CKgvJaB4lMbM_Ni93l3Prg3aA-jpnI"
            />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1800px] px-4 py-5 sm:px-6 lg:ml-64 lg:h-[calc(100vh-64px)] lg:overflow-hidden lg:p-6">
        <div className="grid gap-6 lg:h-full lg:grid-cols-[minmax(0,1fr)_minmax(320px,400px)]">
          <section aria-label="Pending verification applications" className="flex min-h-0 flex-col gap-5">
            <div className="px-1 lg:hidden">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-on-surface-variant">
                Management Portal
              </p>
              <div className="mt-1 flex items-end justify-between gap-2">
                <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">
                  Pending Verifications
                </h2>
                <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                  {pendingCount} pending
                </span>
              </div>
            </div>

            <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 lg:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {['All Regions', ...mobileRegions].map((region) => {
                const isActive = regionFilter === region;
                return (
                  <button
                    key={region}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setRegionFilter(region)}
                    className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-label-lg shadow-sm transition-colors ${
                      isActive
                        ? 'bg-primary font-medium text-on-primary'
                        : 'bg-surface-container-high text-on-surface-variant hover:bg-outline-variant'
                    }`}
                  >
                    {region}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between gap-3 lg:hidden">
              <label className="relative min-w-0 flex-1">
                <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="w-full rounded-xl border border-outline-variant/50 bg-surface-container-lowest py-2.5 pl-10 pr-3 text-sm shadow-sm focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="Search applicants..."
                  type="search"
                  aria-label="Search applications"
                />
              </label>
              <span className="shrink-0 text-xs text-on-surface-variant">
                {filteredApplications.length} results
              </span>
            </div>

            <div className="hidden flex-col gap-4 rounded-2xl border border-outline-variant bg-surface-container-lowest p-4 shadow-sm md:flex-row md:items-center md:justify-between md:p-6 lg:flex lg:p-6">
              <div className="flex flex-wrap gap-3">
                <label className="flex items-center gap-2 rounded-full bg-primary-container px-4 py-2 text-on-primary-container">
                  <span className="text-label-lg">Application type</span>
                  <select
                    aria-label="Filter by application type"
                    value={typeFilter}
                    onChange={(event) =>
                      setTypeFilter(event.target.value as 'All Types' | ApplicationType)
                    }
                    className="max-w-[155px] border-0 bg-transparent py-0 pl-1 pr-6 text-sm font-medium text-on-primary-container focus:ring-0"
                  >
                    <option className="text-on-surface" value="All Types">All Types</option>
                    <option className="text-on-surface" value="Independent Guide">Independent Guide</option>
                    <option className="text-on-surface" value="Tour Operator">Tour Operator</option>
                  </select>
                </label>
                <label className="flex items-center gap-2 rounded-full bg-surface-container-high px-4 py-2 text-on-surface-variant">
                  <span className="whitespace-nowrap text-label-lg">Verification Tier</span>
                  <select
                    aria-label="Filter by verification tier"
                    value={tierFilter}
                    onChange={(event) =>
                      setTierFilter(event.target.value as 'All Tiers' | VerificationTier)
                    }
                    className="max-w-[116px] border-0 bg-transparent py-0 pl-0 pr-6 text-sm focus:ring-0"
                  >
                    <option value="All Tiers">All Tiers</option>
                    <option value="Platinum">Platinum</option>
                    <option value="Gold">Gold</option>
                    <option value="Silver">Silver</option>
                  </select>
                </label>
              </div>
              <p className="shrink-0 text-sm text-on-surface-variant">
                Showing <span className="font-bold text-primary">{filteredApplications.length}</span> applications
                <span className="hidden sm:inline"> · {pendingCount} pending</span>
              </p>
            </div>

            <div className="min-h-0 flex-1 overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-sm">
              <div className="hidden h-full overflow-auto lg:block">
                <table className="w-full border-collapse text-left">
                  <thead className="sticky top-0 z-10 bg-surface-container-low">
                    <tr className="border-b border-outline-variant">
                      <th scope="col" className="px-5 py-4 text-sm font-semibold text-on-surface-variant">Name</th>
                      <th scope="col" className="px-5 py-4 text-sm font-semibold text-on-surface-variant">Type</th>
                      <th scope="col" className="px-5 py-4 text-sm font-semibold text-on-surface-variant">Date Applied</th>
                      <th scope="col" className="px-5 py-4 text-sm font-semibold text-on-surface-variant">Status</th>
                      <th scope="col" className="px-5 py-4 text-right text-sm font-semibold text-on-surface-variant">View Docs</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/30">
                    {filteredApplications.map((application) => (
                      <tr
                        key={application.id}
                        onClick={() => {
                          setSelectedId(application.id);
                          setNotice('');
                        }}
                        className={`group cursor-pointer transition-colors hover:bg-primary/5 ${
                          selectedApplication?.id === application.id ? 'bg-primary/5' : ''
                        }`}
                      >
                        <td className="px-5 py-4">
                          <ApplicantName application={application} compact />
                        </td>
                        <td className="px-5 py-4">
                          <TypeBadge type={application.type} />
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-sm text-on-surface-variant">
                          {application.applied}
                        </td>
                        <td className="px-5 py-4">
                          <StatusLabel status={application.status} />
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button
                            type="button"
                            aria-label={`View documents for ${application.name}`}
                            onClick={(event) => {
                              event.stopPropagation();
                              setSelectedId(application.id);
                              setNotice('');
                            }}
                            className="text-primary transition-transform group-hover:scale-110"
                          >
                            <Icon name="visibility" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredApplications.length === 0 && <EmptyQueue />}
              </div>

              <div className="space-y-4 p-1 lg:hidden">
                {filteredApplications.map((application, index) => (
                  <MobileApplicationCard
                    key={application.id}
                    application={application}
                    index={index}
                    onReview={() => {
                      setSelectedId(application.id);
                      setNotice('');
                      setIsMobileDetailsOpen(true);
                    }}
                    onShare={() => void shareApplication(application)}
                  />
                ))}
                {filteredApplications.length === 0 && <EmptyQueue />}
              </div>
            </div>
            {shareNotice && (
              <p role="status" className="text-center text-xs text-on-surface-variant lg:hidden">
                {shareNotice}
              </p>
            )}
          </section>

          {selectedApplication ? (
            <div className="hidden min-h-0 lg:flex">
              <ApplicantDetails
                application={selectedApplication}
                onDecision={decideApplication}
                notice={notice}
              />
            </div>
          ) : (
            <aside className="hidden rounded-3xl border border-outline-variant/50 bg-white/70 p-6 shadow-lg backdrop-blur-xl lg:flex lg:items-center lg:justify-center">
              <p className="text-center text-sm text-on-surface-variant">Select an application to review.</p>
            </aside>
          )}
        </div>
      </main>

      {isMobileDetailsOpen && selectedApplication && (
        <div
          className="fixed inset-0 z-[80] flex items-end justify-center bg-on-surface/40 p-0 backdrop-blur-[2px] sm:items-center sm:p-4 lg:hidden"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsMobileDetailsOpen(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-label={`Review application for ${selectedApplication.name}`}
            className="max-h-[92dvh] w-full overflow-y-auto rounded-t-3xl bg-background p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-2xl sm:max-w-lg sm:rounded-3xl sm:p-6"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="h-1 w-10 rounded-full bg-outline-variant sm:hidden" />
              <button
                type="button"
                aria-label="Close application details"
                onClick={() => setIsMobileDetailsOpen(false)}
                className="ml-auto flex h-9 w-9 items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-high"
              >
                <Icon name="close" />
              </button>
            </div>
            <ApplicantDetails
              application={selectedApplication}
              onDecision={(decision) => {
                decideApplication(decision);
                setIsMobileDetailsOpen(false);
              }}
              notice={notice}
            />
          </section>
        </div>
      )}

      <MobileVerificationNav />
    </div>
  );
}

function getRegion(location: string) {
  if (location.toLowerCase().includes('accra')) return 'Greater Accra';
  if (location.toLowerCase().includes('cape coast')) return 'Central Region';
  if (location.toLowerCase().includes('tamale')) return 'Northern Region';
  return location;
}

function MobileApplicationCard({
  application,
  index,
  onReview,
  onShare,
}: {
  application: Application;
  index: number;
  onReview: () => void;
  onShare: () => void;
}) {
  const urgency = index === 0 ? 'Expedited' : index === 1 ? 'New' : 'Standard';
  const submittedAgo = ['2 hours ago', '5 hours ago', 'Yesterday', '2 days ago'][index % 4];
  const urgencyStyles =
    urgency === 'Expedited'
      ? 'bg-on-secondary-container/10 text-on-secondary-container'
      : urgency === 'New'
        ? 'bg-primary-container/10 text-primary'
        : 'bg-surface-variant text-on-surface-variant';

  return (
    <article className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-5 shadow-[0px_4px_20px_rgba(0,0,0,0.05)] transition-transform active:scale-[0.99]">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-label-sm ${urgencyStyles}`}>
            {urgency === 'Expedited' && <Icon name="bolt" className="text-[14px]" />}
            {urgency === 'New' && <Icon name="new_releases" className="text-[14px]" />}
            {urgency}
          </span>
          <span className="text-label-sm text-on-surface-variant">{submittedAgo}</span>
        </div>
        <span className="text-outline">
          <Icon name="more_vert" />
        </span>
      </div>

      <div className="mb-5 flex items-center gap-4">
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-outline-variant/30 bg-surface-container">
          <img
            src={application.portrait}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
        <div className="min-w-0">
          <h3 className="truncate font-headline-md text-headline-md text-on-surface">{application.name}</h3>
          <p className="text-sm leading-5 text-on-surface-variant">
            {application.type} <span aria-hidden="true">•</span> {getRegion(application.location)}
          </p>
          <p className="mt-1 text-xs text-on-surface-variant">Ref: #{application.id}</p>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onReview}
          className="min-h-11 flex-1 rounded-lg bg-primary py-3 text-label-lg font-medium text-on-primary shadow-sm transition-all hover:brightness-110 active:opacity-80"
        >
          Review
        </button>
        <button
          type="button"
          aria-label={`Share application for ${application.name}`}
          onClick={onShare}
          className="flex min-h-11 items-center justify-center rounded-lg border border-outline px-4 text-on-surface-variant transition-colors hover:bg-surface-variant"
        >
          <Icon name="share" />
        </button>
      </div>
    </article>
  );
}

function MobileVerificationNav() {
  return (
    <nav
      aria-label="Admin navigation"
      className="fixed bottom-0 z-50 flex w-full items-center justify-around border-t border-outline-variant/20 bg-surface px-2 pt-3 shadow-[0px_-4px_20px_rgba(0,0,0,0.05)] [padding-bottom:max(0.75rem,env(safe-area-inset-bottom))] lg:hidden"
    >
      {[
        { label: 'Analytics', icon: 'analytics', href: '/admin', active: false },
        { label: 'Verify', icon: 'verified_user', href: '/admin/operator-verification', active: true },
        { label: 'Mod', icon: 'gavel', href: '/admin/content-moderation', active: false },
        { label: 'Profile', icon: 'person', href: '/admin#profile', active: false },
      ].map((item) => (
        <a
          key={item.label}
          href={item.href}
          aria-current={item.active ? 'page' : undefined}
          className={`flex min-w-[64px] flex-col items-center justify-center rounded-xl px-3 py-1 transition-all ${
            item.active
              ? 'scale-95 bg-primary-container font-bold text-on-primary-container'
              : 'text-on-surface-variant hover:bg-surface-variant'
          }`}
        >
          <Icon name={item.icon} filled={item.active} />
          <span className="mt-0.5 text-label-sm">{item.label}</span>
        </a>
      ))}
    </nav>
  );
}

function ApplicantName({ application, compact = false }: { application: Application; compact?: boolean }) {
  const avatarStyles =
    application.initials === 'KA'
      ? 'bg-secondary-container text-on-secondary-container'
      : application.initials === 'WT'
        ? 'bg-primary-container text-on-primary-container'
        : 'bg-secondary-fixed text-on-secondary-fixed';

  return (
    <span className="flex min-w-0 items-center gap-3">
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold ${avatarStyles}`}>
        {application.initials}
      </span>
      <span className="min-w-0">
        <span className="block truncate font-bold text-on-surface">{application.name}</span>
        <span className="block truncate text-label-sm text-on-surface-variant">{application.location}</span>
        {!compact && <span className="mt-1 block text-xs text-on-surface-variant">Ref: #{application.id}</span>}
      </span>
    </span>
  );
}

function TypeBadge({ type }: { type: ApplicationType }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs ${
        type === 'Independent Guide'
          ? 'bg-tertiary-container text-on-tertiary-container'
          : 'bg-surface-container-highest text-on-surface-variant'
      }`}
    >
      {type}
    </span>
  );
}

function StatusLabel({ status }: { status: ApplicationStatus }) {
  const statusColor =
    status === 'Under Review'
      ? 'text-secondary'
      : status === 'Approved'
        ? 'text-primary'
        : status === 'Rejected'
          ? 'text-error'
          : 'text-on-surface-variant opacity-70';
  const dotColor =
    status === 'Under Review'
      ? 'bg-secondary'
      : status === 'Approved'
        ? 'bg-primary'
        : status === 'Rejected'
          ? 'bg-error'
          : 'bg-on-surface-variant';

  return (
    <span className={`inline-flex items-center gap-2 whitespace-nowrap text-sm ${statusColor}`}>
      <span className={`h-2 w-2 rounded-full ${dotColor} ${status === 'Under Review' ? 'animate-pulse' : ''}`} />
      <span>{status}</span>
    </span>
  );
}

function ApplicantDetails({
  application,
  onDecision,
  notice,
}: {
  application: Application;
  onDecision: (decision: 'Approved' | 'Rejected') => void;
  notice: string;
}) {
  const isPending = application.status === 'Pending' || application.status === 'Under Review';

  return (
    <aside className="flex min-h-0 flex-col gap-5 rounded-3xl border border-outline-variant/50 bg-white/70 p-5 shadow-lg backdrop-blur-xl sm:p-6 lg:overflow-y-auto">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-headline-md text-headline-md leading-tight text-on-surface">Applicant Details</h2>
          <p className="mt-1 text-label-lg font-bold text-primary">Ref: #{application.id}</p>
        </div>
        <StatusLabel status={application.status} />
      </div>

      <div className="flex items-center gap-4 rounded-2xl bg-surface-container p-4">
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl shadow-sm">
          <img src={application.portrait} alt={`${application.name} profile`} className="h-full w-full object-cover" />
        </div>
        <div className="min-w-0">
          <h3 className="truncate text-lg font-bold">{application.name}</h3>
          <p className="text-label-sm text-on-surface-variant">ID: {application.cardId}</p>
          <div className="mt-1 flex items-center gap-1 text-secondary">
            <Icon name="star" className="text-[14px]" filled />
            <span className="text-label-sm font-bold uppercase">{application.tier} Tier Applicant</span>
          </div>
        </div>
      </div>

      <div className="space-y-4 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:pr-1">
        <DocumentPreview
          title="Ghana Card (National ID)"
          image={application.cardImage}
          alt="Submitted Ghana Card document"
          aspect="aspect-[1.58/1]"
        />
        <section className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
              Guide Certification
            </h3>
            <button type="button" aria-label="Open guide certification" className="text-primary">
              <Icon name="open_in_new" className="text-[18px]" />
            </button>
          </div>
          <div className="relative aspect-[1.41/1] overflow-hidden rounded-xl border-2 border-outline-variant bg-white p-3 shadow-inner sm:p-4">
            <div className="flex h-full w-full flex-col justify-between rounded border border-outline-variant p-2 text-[10px] italic text-on-surface-variant">
              <div className="flex justify-between">
                <Icon name="verified_user" className="text-4xl text-primary/40" />
                <div className="text-right">
                  <p className="font-bold">GHANA TOURISM AUTHORITY</p>
                  <p>Official Certification</p>
                </div>
              </div>
              <div className="py-2 text-center">
                <p className="text-xs font-bold text-on-surface">CERTIFICATE OF TRAINING</p>
                <p className="mt-2">
                  This certifies that {application.name.toUpperCase()} has completed the advanced guide course.
                </p>
              </div>
              <div className="flex items-end justify-between">
                <div className="h-8 w-16 border-b border-outline" />
                <span className="text-[8px] opacity-40">{application.certification}</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {notice && (
        <p role="status" className="rounded-lg bg-primary/10 px-3 py-2 text-sm text-primary">
          {notice}
        </p>
      )}
      {!isPending && (
        <p className="text-xs text-on-surface-variant">
          This demo decision is stored only for this session; it is not connected to the verification API.
        </p>
      )}
      <div className="grid grid-cols-2 gap-3 border-t border-outline-variant pt-4">
        <button
          type="button"
          disabled={!isPending}
          onClick={() => onDecision('Rejected')}
          className="flex items-center justify-center gap-2 rounded-xl border-2 border-error py-3 font-bold text-error transition-all hover:bg-error/5 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Icon name="block" />
          Reject
        </button>
        <button
          type="button"
          disabled={!isPending}
          onClick={() => onDecision('Approved')}
          className="flex items-center justify-center gap-2 rounded-xl bg-primary py-3 font-bold text-on-primary shadow-lg shadow-primary/20 transition-all hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Icon name="verified" />
          Approve
        </button>
      </div>
    </aside>
  );
}

function DocumentPreview({
  title,
  image,
  alt,
  aspect,
}: {
  title: string;
  image: string;
  alt: string;
  aspect: string;
}) {
  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">{title}</h3>
        <button type="button" aria-label={`Open ${title}`} className="text-primary">
          <Icon name="open_in_new" className="text-[18px]" />
        </button>
      </div>
      <div className={`${aspect} group relative w-full overflow-hidden rounded-xl border-2 border-outline-variant`}>
        <img src={image} alt={alt} className="h-full w-full object-cover" />
        <div className="absolute inset-0 flex items-center justify-center bg-primary/20 opacity-0 transition-opacity group-hover:opacity-100">
          <span className="rounded-full bg-white px-4 py-2 font-semibold text-primary shadow-lg">Verify Document</span>
        </div>
      </div>
    </section>
  );
}

function EmptyQueue() {
  return (
    <div className="px-6 py-12 text-center">
      <Icon name="search_off" className="text-3xl text-outline" />
      <p className="mt-2 font-medium">No applications found</p>
      <p className="mt-1 text-sm text-on-surface-variant">Try changing your filters or search terms.</p>
    </div>
  );
}
