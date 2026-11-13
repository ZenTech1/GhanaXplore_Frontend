'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { readModerationStatuses, saveModerationStatus } from './moderationStatusStorage';

export type ContentType = 'Review' | 'Image' | 'Description' | 'Comment';
type Severity = 'High Risk' | 'Medium' | 'Low';
export type ModerationStatus = 'Pending' | 'Flagged' | 'Safe' | 'Approved' | 'Rejected' | 'Escalated';

export interface ModerationItem {
  id: string;
  contributor: string;
  contributorDetail: string;
  initials: string;
  avatar: string;
  attraction: string;
  region: string;
  snippet: string;
  contentLabel: string;
  type: ContentType;
  severity: Severity;
  status: ModerationStatus;
  image?: string;
  portrait?: string;
  reportedAt: string;
}

export const initialItems: ModerationItem[] = [
  {
    id: 'MOD-2048',
    contributor: 'Abena Appiah',
    contributorDetail: 'Lvl 4 Guide · Accra',
    initials: 'AA',
    avatar: 'bg-secondary-fixed text-on-secondary-fixed',
    attraction: 'Cape Coast Castle',
    region: 'Central Region',
    snippet:
      '"A deeply moving experience that everyone must witness. The tour guides were very knowledgeable..."',
    contentLabel: 'Review Content',
    type: 'Image',
    severity: 'Low',
    status: 'Pending',
    reportedAt: '2m ago',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBFIKICct7Hx4Zl-PFnSjGZJOqWWinWQ6ZruMfuPcMoz2Gk2wCbjQVAjDs82aAEfMJVvSS6p44VSLwLAGJ00dYTqGZ04X3Rw6CYllT4h1z_b627aUMkGb5YeGTLkIi0x6R3fr4EU9VjMsAF4jsjbgLjV4k_LdrQKxkpE0TnM1fnX4FG9VUW5sLU7MX0M4tUVQx9jsdNGynsVy8XZK7ZbM6yOaoifQL9mwsS-sbeGqnLM7TLJYXgRopVMdvELaeSYyeWyfvLn1yAgz4Q',
    portrait:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAzL0SAYbGmyb5HKv4uOh-9EXOdn0Fomb371vbj2u_sSrDOeHi86dRGfEk5MHXTqcUXJKp7rgDQgY-W1MghokkewZN3_CddrwAUKoxUA1J4bIw1b1Ue0aNnDrhNwuUeLlTE9KNWXaaymvGC_wVuhIC8UOWHpVr2UukRivgqcoU7aCaxw6TgpR_tV82mept8GyJB-emo2hGrRuzSJjB1t5_5MH1YMvteB5FBmdcuAbdaXlohHQiAjhWy2MfWfIE9fISORIwA_BsnIfxr',
  },
  {
    id: 'MOD-2047',
    contributor: 'Kofi Adu',
    contributorDetail: 'New Member · Kumasi',
    initials: 'KA',
    avatar: 'bg-tertiary-fixed text-on-tertiary-fixed',
    attraction: 'Mole National Park',
    region: 'Savannah Region',
    snippet:
      '"Found some outdated info about the safari times. Don’t go there at 5pm as the [REDACTED] says..."',
    contentLabel: 'Flagged: Profanity/Spam',
    type: 'Review',
    severity: 'High Risk',
    status: 'Flagged',
    reportedAt: '15m ago',
    portrait:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDgz3KUzATwLmh3dxMSzvhVLsScx9X3OzeyLBUMoP3I1VWTagfn_oa08AqL1gD31lhyUMbXET89wO0yHHSJk2gIIdBl2Q_2uB2xDZmbjYpy-ryaksyweIV3vWD-cR11x8Ap8dKI8hLZ8xDp41_zRjkGHQcNbVhfz_xozmctyh_dLtRmhKANReFoKAWIkJSP69IUipoxpXEPKzbUwaIATUyl_zkvQzeqtW-n4PDqnm8qgMCd7bL_TyNfndhyObsLQCuenn_Qqb1IkYMo',
  },
  {
    id: 'MOD-2046',
    contributor: 'Esi Nyarko',
    contributorDetail: 'Verified Operator · Wli',
    initials: 'EN',
    avatar: 'bg-primary-fixed text-on-primary-fixed',
    attraction: 'Wli Waterfalls',
    region: 'Volta Region',
    snippet:
      '"Updated business description for Wli Heights Resort & Tours. We now offer evening camping trips..."',
    contentLabel: 'Business Update',
    type: 'Description',
    severity: 'Medium',
    status: 'Safe',
    reportedAt: '1h ago',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDmWyx8N4cMrURrEkOn9oliJv6t23mtr66ICP2IkMDlJtUMJ0Lpza_Tdghlt8BROQFgLJn0KG_xDF67Bs0KWis0DGg3SeGTDd51l1CZ7mqai_6GeuID-u6NdqRR6V7TL0qbiHw7GB_LjTxJUe3pZB-m1Dm0FGaJhW_mtqDUsO1V2ad9l9hKgA1cZKB17zHXI1t05lTdNKlhHh5EuHc1-KgR4RZAn8P0NSYRTNJOTwQvNy2VPSSmc2WAmZuD_RWxMCbZSEukF-Zs2wr-',
  },
  {
    id: 'MOD-2045',
    contributor: 'Akosua Mensima',
    contributorDetail: 'Verified Traveler · Accra',
    initials: 'AM',
    avatar: 'bg-secondary-fixed text-on-secondary-fixed',
    attraction: 'Kakum National Park',
    region: 'Central Region',
    snippet: '"The canopy walkway was beautiful and the staff made our visit feel safe and memorable."',
    contentLabel: 'Review Content',
    type: 'Review',
    severity: 'Low',
    status: 'Pending',
    reportedAt: 'Yesterday',
  },
  {
    id: 'MOD-2044',
    contributor: 'Yaw Boateng',
    contributorDetail: 'New Member · Tamale',
    initials: 'YB',
    avatar: 'bg-tertiary-fixed text-on-tertiary-fixed',
    attraction: 'Larabanga Mosque',
    region: 'Savannah Region',
    snippet: '"Please contact me directly for an exclusive deal and off-platform booking..."',
    contentLabel: 'Flagged: Spam',
    type: 'Description',
    severity: 'High Risk',
    status: 'Flagged',
    reportedAt: '2 days ago',
  },
  {
    id: 'MOD-2043',
    contributor: 'Nana Osei',
    contributorDetail: 'Verified Operator · Kumasi',
    initials: 'NO',
    avatar: 'bg-primary-fixed text-on-primary-fixed',
    attraction: 'Manhyia Palace Museum',
    region: 'Ashanti Region',
    snippet: '"New gallery images and updated visitor information are ready for review."',
    contentLabel: 'Image Submission',
    type: 'Image',
    severity: 'Medium',
    status: 'Pending',
    reportedAt: '2 days ago',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBFIKICct7Hx4Zl-PFnSjGZJOqWWinWQ6ZruMfuPcMoz2Gk2wCbjQVAjDs82aAEfMJVvSS6p44VSLwLAGJ00dYTqGZ04X3Rw6CYllT4h1z_b627aUMkGb5YeGTLkIi0x6R3fr4EU9VjMsAF4jsjbgLjV4k_LdrQKxkpE0TnM1fnX4FG9VUW5sLU7MX0M4tUVQx9jsdNGynsVy8XZK7ZbM6yOaoifQL9mwsS-sbeGqnLM7TLJYXgRopVMdvELaeSYyeWyfvLn1yAgz4Q',
  },
  {
    id: 'MOD-2042',
    contributor: 'Abeiku Ansah',
    contributorDetail: 'Verified Traveler · Elmina',
    initials: 'AA',
    avatar: 'bg-secondary-container text-on-secondary-container',
    attraction: 'Elmina Castle',
    region: 'Central Region',
    snippet:
      '"The historical site was powerful, but I noticed some inappropriate graffiti in the dungeon area..."',
    contentLabel: 'Visitor Comment',
    type: 'Comment',
    severity: 'High Risk',
    status: 'Flagged',
    reportedAt: '3 days ago',
    portrait:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBqGy0WkTm3ziQgf-N_OmNbiWFDcEJDHssrWzIyLq_pLiYoOoFWieviLoZio1iR6ZMiKRUkxv13pXx_jXPL1DZ8sqoUwi9UghNabuQB-yQ21nTsbYfSdCP6-9f_d5v4d84CXaqI7lJPhi4-GnK4xKrkjME-_MTaIhHbEJx12FQZf3c09G3TiyTVWt1tmonFTDhvOMtblUDtsX1OdBzC5sAgM8A8sU723riIUso0wKouBiZgRsbNZLQwkXHdGwx7r3BCvmTeB9ApXoYD',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDAqA3L2hMg8ppW-F68xMmyPhCIZrnPpvCjMNmOr2Mguu8_RpcnI4Re0H7-LgoXD92bd4EmUHOhHY28jpOSQJtnh7-byzUnl13DOojBsGZaH-5QITzMOWtyOWJxgoK8wEpimQbdp5_03P-4acQ3UhTBK6T__iWDrbGOSTyq2urmJoieo8rA8i016_F9fd70u8QXbQUxvw8toRVzaemehkorDZ1u_NNsZCQKjVTpNkDapikk3KaC9rjjH1E3h2MkqaGNQlJpM9WHjMVH',
  },
];

const initialPendingCount = initialItems.filter(
  (item) => item.status === 'Pending' || item.status === 'Flagged',
).length;
const initialFlaggedCount = initialItems.filter((item) => item.status === 'Flagged').length;
const initialCriticalCount = initialItems.filter(
  (item) =>
    item.severity === 'High Risk' &&
    (item.status === 'Pending' || item.status === 'Flagged'),
).length;

const navigation = [
  { label: 'National Analytics', icon: 'leaderboard', href: '/admin' },
  { label: 'Operator Verification', icon: 'verified_user', href: '/admin/operator-verification' },
  { label: 'Content Moderation', icon: 'gavel', href: '/admin/content-moderation' },
  { label: 'Tourism Reports', icon: 'description', href: '/admin/revenue-tracking' },
  { label: 'Portal Settings', icon: 'settings', href: '/admin/settings' },
];

function Icon({ name, className = '', filled = false }: { name: string; className?: string; filled?: boolean }) {
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

export function AdminContentModeration() {
  const [items, setItems] = useState(initialItems);
  const [search, setSearch] = useState('');
  const [draftType, setDraftType] = useState('All Content');
  const [draftSeverity, setDraftSeverity] = useState('All Levels');
  const [typeFilter, setTypeFilter] = useState('All Content');
  const [severityFilter, setSeverityFilter] = useState('All Levels');
  const [page, setPage] = useState(1);
  const [notice, setNotice] = useState('');
  const [mobileCategory, setMobileCategory] = useState('All Content');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pageSize = 3;

  useEffect(() => {
    try {
      const savedStatuses = readModerationStatuses();
      setItems((currentItems) =>
        currentItems.map((item) =>
          savedStatuses[item.id] ? { ...item, status: savedStatuses[item.id] } : item,
        ),
      );
    } catch {
      setNotice('Saved moderation decisions could not be loaded.');
    }
  }, []);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    return items.filter((item) => {
      const matchesQuery =
        !query ||
        [item.contributor, item.contributorDetail, item.attraction, item.region, item.snippet, item.contentLabel]
          .join(' ')
          .toLowerCase()
          .includes(query);
      const matchesType = typeFilter === 'All Content' || item.type === typeFilter.slice(0, -1);
      const matchesSeverity =
        severityFilter === 'All Levels' ||
        (severityFilter === 'High Risk' ? item.severity === 'High Risk' : item.severity === severityFilter);
      return matchesQuery && matchesType && matchesSeverity;
    });
  }, [items, search, severityFilter, typeFilter]);

  const mobileItems = useMemo(() => {
    const categoryTypes: Record<string, ContentType | null> = {
      'All Content': null,
      Reviews: 'Review',
      Photos: 'Image',
      Comments: 'Comment',
    };
    const type = categoryTypes[mobileCategory];

    return filteredItems
      .filter(
        (item) =>
        (!type || item.type === type) &&
        item.status !== 'Approved' &&
          item.status !== 'Rejected',
      )
      .sort((left, right) => {
        const priority = (item: ModerationItem) =>
          item.severity === 'High Risk'
            ? 0
            : item.image
              ? 1
              : item.type === 'Comment'
                ? 2
                : 3;
        return priority(left) - priority(right);
      });
  }, [filteredItems, mobileCategory]);

  const pageCount = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pageItems = filteredItems.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const pendingCount = items.filter((item) => item.status === 'Pending' || item.status === 'Flagged').length;
  const flaggedCount = items.filter((item) => item.status === 'Flagged').length;
  const criticalCount = items.filter(
    (item) =>
      item.severity === 'High Risk' &&
      (item.status === 'Pending' || item.status === 'Flagged'),
  ).length;

  function applyFilters() {
    setTypeFilter(draftType);
    setSeverityFilter(draftSeverity);
    setPage(1);
  }

  function updateStatus(item: ModerationItem, status: 'Approved' | 'Rejected' | 'Escalated') {
    let saveFailed = false;
    try {
      saveModerationStatus(item.id, status);
    } catch {
      saveFailed = true;
    }
    setItems((current) => current.map((entry) => (entry.id === item.id ? { ...entry, status } : entry)));
    setPage(1);
    setNotice(
      saveFailed
        ? 'Decision applied, but could not be saved for later.'
        : `${item.attraction} content ${status.toLowerCase()}.`,
    );
  }

  return (
    <div className="min-h-screen bg-background text-on-surface lg:h-screen lg:overflow-hidden">
      <aside className="fixed left-0 top-0 z-50 hidden h-screen w-72 flex-col overflow-y-auto border-r border-outline-variant bg-surface py-8 lg:flex">
        <div className="mb-10 px-8">
          <a href="/admin" className="font-headline-md text-headline-md font-bold text-primary">GTA Admin</a>
          <p className="mt-1 text-label-sm uppercase tracking-widest text-outline">Infrastructure Portal</p>
        </div>
        <nav aria-label="Admin navigation" className="flex-grow space-y-1">
          {navigation.map((item) => {
            const active = item.label === 'Content Moderation';
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
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-error px-6 py-4 font-bold text-on-error shadow-lg shadow-error/20 transition-transform hover:scale-[1.02] active:scale-95"
          >
            <Icon name="emergency_share" />
            Emergency Response
          </button>
        </div>
      </aside>

      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-outline-variant/30 bg-surface px-4 py-4 shadow-sm lg:hidden">
        <div className="flex items-center gap-4">
          <button
            type="button"
            aria-label={isMobileMenuOpen ? 'Close admin menu' : 'Open admin menu'}
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            className="text-on-surface-variant transition-colors hover:text-primary"
          >
            <Icon name={isMobileMenuOpen ? 'close' : 'menu'} />
          </button>
          <a href="/admin" className="font-headline-md text-headline-md font-bold text-primary">
            GhanaXplore
          </a>
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
          <nav
            aria-label="Admin navigation"
            className="flex h-full w-[min(20rem,85vw)] flex-col bg-surface p-5 shadow-xl"
          >
            <div className="mb-6 border-b border-outline-variant/50 pb-5">
              <p className="font-headline-md text-headline-md font-bold text-primary">GTA Admin</p>
              <p className="mt-1 text-label-sm uppercase tracking-widest text-outline">Infrastructure Portal</p>
            </div>
            <div className="space-y-1">
              {navigation.map((item) => {
                const active = item.label === 'Content Moderation';
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
              <Icon name="emergency_share" />
              Emergency Response
            </button>
          </nav>
        </div>
      )}

      <main className="flex min-h-screen flex-col lg:ml-72 lg:h-screen lg:min-h-0 lg:overflow-hidden">
        <header className="sticky top-0 z-40 hidden h-16 shrink-0 items-center justify-between border-b border-outline-variant bg-surface-bright px-4 sm:px-6 lg:flex lg:h-20 lg:px-8 xl:px-16">
          <label className="relative hidden w-full max-w-sm lg:block">
            <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-outline lg:left-4" />
            <input
              type="search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              aria-label="Search moderation history"
              placeholder="Search moderation history..."
              className="w-full rounded-full border-none bg-surface-container py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 lg:pl-12 lg:text-body-md"
            />
          </label>
          <div className="ml-auto flex shrink-0 items-center gap-3 text-on-surface-variant sm:gap-5 lg:ml-4 lg:gap-6">
            <button type="button" aria-label="Notifications" className="relative rounded-full p-2 hover:bg-surface-container">
              <Icon name="notifications" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-error" />
            </button>
            <button type="button" aria-label="Help" className="hidden rounded-full p-2 hover:bg-surface-container sm:block">
              <Icon name="help" />
            </button>
            <button type="button" aria-label="Apps" className="hidden rounded-full p-2 hover:bg-surface-container sm:block">
              <Icon name="apps" />
            </button>
            <span className="hidden h-10 w-px bg-outline-variant sm:block" />
            <div className="flex items-center gap-3">
              <div className="hidden text-right xl:block">
                <p className="text-label-lg leading-none text-on-surface">Kwame Mensah</p>
                <p className="mt-1 text-label-sm text-outline">Senior Admin</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-surface bg-primary-container font-bold text-on-primary-container">
                KM
              </div>
            </div>
          </div>
        </header>

        <section className="flex-grow overflow-y-auto bg-surface-container-low p-4 pb-32 sm:p-6 lg:hidden">
          <div className="mb-6">
            <h1 className="mb-3 font-headline-lg-mobile text-headline-lg-mobile text-on-surface">
              Moderation Queue
            </h1>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-label-lg text-primary">
                {12 + pendingCount - initialPendingCount} Pending Tasks
              </span>
              <span className="inline-flex items-center rounded-full bg-secondary-container/20 px-3 py-1 text-label-lg text-on-secondary-container">
                Critical: {3 + criticalCount - initialCriticalCount}
              </span>
            </div>
          </div>

          <div
            role="tablist"
            aria-label="Filter moderation content"
            className="-mx-4 mb-6 flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {['All Content', 'Reviews', 'Photos', 'Comments'].map((category) => {
              const isActive = mobileCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setMobileCategory(category)}
                  className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-label-lg transition-colors ${
                    isActive
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'border border-outline-variant/30 bg-surface-container text-on-surface-variant'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          {notice && (
            <p role="status" className="mb-4 rounded-lg bg-primary/10 px-4 py-3 text-sm text-primary">
              {notice}
            </p>
          )}

          <div className="space-y-4">
            {mobileItems.map((item) => (
              <MobileModerationCard
                key={item.id}
                item={item}
                onAction={updateStatus}
              />
            ))}
            {mobileItems.length === 0 && <EmptyResults />}
          </div>

          <p className="mt-8 px-4 text-center text-sm text-on-surface-variant/70">
            Tip: Swipe right to quickly <span className="font-bold text-primary">Approve</span> or left to{' '}
            <span className="font-bold text-error">Reject</span>.
          </p>
        </section>

        <section className="hidden flex-grow overflow-y-auto bg-surface-container-low p-4 sm:p-6 lg:block lg:p-8 xl:p-10">
          <div className="mb-7 grid grid-cols-1 gap-4 md:grid-cols-3 lg:mb-10 lg:gap-6">
            <SummaryCard
              label="Pending Reviews"
              value={(1284 + pendingCount - initialPendingCount).toLocaleString('en-US')}
              detail="+12% from yesterday"
              icon="pending_actions"
              color="primary"
              trendIcon="trending_up"
            />
            <SummaryCard
              label="Reported Content"
              value={String(42 + flaggedCount - initialFlaggedCount)}
              detail={flaggedCount > 0 ? 'Requires immediate action' : 'No urgent reports'}
              icon="report"
              color="error"
              trendIcon="priority_high"
            />
            <SummaryCard
              label="Automated Flags"
              value="312"
              detail="AI Processing Active"
              icon="auto_awesome"
              color="secondary"
              trendIcon="bolt"
            />
          </div>

          <section className="overflow-hidden rounded-3xl border border-outline-variant bg-surface-bright shadow-lg">
            <div className="flex flex-col items-start justify-between gap-4 border-b border-outline-variant px-5 py-5 lg:flex-row lg:items-center lg:px-8 lg:py-6">
              <div>
                <h1 className="font-headline-md text-headline-md text-on-surface">Moderation Queue</h1>
                <p className="text-sm text-outline lg:text-body-md">Real-time content verification stream</p>
              </div>
              <div className="flex w-full flex-wrap items-center gap-2 lg:w-auto lg:gap-3">
                <label className="flex min-w-[145px] flex-1 items-center rounded-full border border-outline-variant bg-surface-container px-3 py-2 sm:flex-none sm:px-4">
                  <span className="mr-2 text-label-sm text-outline">Type:</span>
                  <select
                    value={draftType}
                    onChange={(event) => setDraftType(event.target.value)}
                    aria-label="Filter by content type"
                    className="min-w-0 flex-1 border-0 bg-transparent p-0 text-sm font-bold focus:ring-0"
                  >
                    <option>All Content</option>
                    <option>Reviews</option>
                    <option>Images</option>
                    <option>Descriptions</option>
                    <option>Comments</option>
                  </select>
                </label>
                <label className="flex min-w-[145px] flex-1 items-center rounded-full border border-outline-variant bg-surface-container px-3 py-2 sm:flex-none sm:px-4">
                  <span className="mr-2 text-label-sm text-outline">Severity:</span>
                  <select
                    value={draftSeverity}
                    onChange={(event) => setDraftSeverity(event.target.value)}
                    aria-label="Filter by severity"
                    className="min-w-0 flex-1 border-0 bg-transparent p-0 text-sm font-bold focus:ring-0"
                  >
                    <option>All Levels</option>
                    <option>High Risk</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </label>
                <button
                  type="button"
                  onClick={applyFilters}
                  className="flex min-h-10 flex-1 items-center justify-center gap-2 rounded-full bg-primary px-4 py-2 font-bold text-on-primary transition-opacity hover:opacity-90 sm:flex-none sm:px-6"
                >
                  <Icon name="filter_list" className="text-sm" />
                  Apply Filters
                </button>
              </div>
            </div>

            {notice && (
              <p role="status" className="border-b border-outline-variant bg-primary/5 px-5 py-3 text-sm text-primary lg:px-8">
                {notice}
              </p>
            )}

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1040px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-outline-variant bg-surface-container-low">
                    <th scope="col" className="px-6 py-4 text-xs font-semibold uppercase text-outline xl:px-8">
                      User &amp; Contributor
                    </th>
                    <th scope="col" className="px-6 py-4 text-xs font-semibold uppercase text-outline xl:px-8">
                      Attraction
                    </th>
                    <th scope="col" className="w-1/3 px-6 py-4 text-xs font-semibold uppercase text-outline xl:px-8">
                      Content Snippet
                    </th>
                    <th scope="col" className="px-6 py-4 text-xs font-semibold uppercase text-outline xl:px-8">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-4 text-right text-xs font-semibold uppercase text-outline xl:px-8">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30">
                  {pageItems.map((item) => (
                    <ModerationRow key={item.id} item={item} onAction={updateStatus} />
                  ))}
                </tbody>
              </table>
              {pageItems.length === 0 && <EmptyResults />}
            </div>

            <div className="flex flex-col items-center justify-between gap-4 border-t border-outline-variant bg-surface-container-low px-5 py-4 sm:flex-row lg:px-8 lg:py-6">
              <p className="text-center text-label-sm text-outline sm:text-left">
                Showing {filteredItems.length ? (currentPage - 1) * pageSize + 1 : 0}–
                {Math.min(currentPage * pageSize, filteredItems.length)} of {filteredItems.length} entries
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setPage((value) => Math.max(1, value - 1))}
                  className="rounded-lg border border-outline-variant px-3 py-2 text-sm transition-colors hover:bg-surface disabled:opacity-50"
                >
                  Previous
                </button>
                {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => (
                  <button
                    key={pageNumber}
                    type="button"
                    aria-current={currentPage === pageNumber ? 'page' : undefined}
                    onClick={() => setPage(pageNumber)}
                    className={`rounded-lg px-3 py-2 text-sm ${
                      currentPage === pageNumber
                        ? 'bg-primary text-on-primary shadow-sm'
                        : 'border border-outline-variant hover:bg-surface'
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}
                <button
                  type="button"
                  disabled={currentPage === pageCount}
                  onClick={() => setPage((value) => Math.min(pageCount, value + 1))}
                  className="rounded-lg border border-outline-variant px-3 py-2 text-sm transition-colors hover:bg-surface disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </section>
        </section>
      </main>

      <div className="pointer-events-none fixed bottom-5 right-5 z-40 hidden sm:block lg:bottom-10 lg:right-10">
        <div className="moderation-glass-card flex items-center gap-3 rounded-full px-5 py-3 shadow-2xl">
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-secondary" />
          </span>
          <p className="text-sm text-on-surface">
            AI Content Scanner Active: <span className="font-bold">42 pkts/sec</span>
          </p>
        </div>
      </div>

      <MobileModerationNavigation />

    </div>
  );
}

function SummaryCard({
  label,
  value,
  detail,
  icon,
  color,
  trendIcon,
}: {
  label: string;
  value: string;
  detail: string;
  icon: string;
  color: 'primary' | 'error' | 'secondary';
  trendIcon: string;
}) {
  const styles = {
    primary: {
      text: 'text-primary',
      pale: 'bg-primary/10',
      icon: 'text-primary',
    },
    error: {
      text: 'text-error',
      pale: 'bg-error/10',
      icon: 'text-error',
    },
    secondary: {
      text: 'text-secondary',
      pale: 'bg-secondary/10',
      icon: 'text-secondary',
    },
  }[color];

  return (
    <article className="flex items-center justify-between rounded-2xl border border-outline-variant bg-surface-bright p-5 shadow-sm sm:p-6">
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wider text-outline sm:text-label-lg">{label}</p>
        <p className={`mt-2 font-display text-4xl ${styles.text}`}>{value}</p>
        <p className={`mt-2 flex items-center gap-1 text-label-sm ${styles.text}`}>
          <Icon name={trendIcon} className="text-[16px]" />
          {detail}
        </p>
      </div>
      <div className={`ml-3 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl sm:h-16 sm:w-16 ${styles.pale} ${styles.icon}`}>
        <Icon name={icon} className="text-3xl" />
      </div>
    </article>
  );
}

function ModerationRow({
  item,
  onAction,
}: {
  item: ModerationItem;
  onAction: (item: ModerationItem, status: 'Approved' | 'Rejected' | 'Escalated') => void;
}) {
  const statusStyles: Record<ModerationStatus, string> = {
    Pending: 'bg-surface-container-highest text-on-surface-variant',
    Flagged: 'bg-error-container text-on-error-container',
    Safe: 'bg-on-primary-container text-primary-container',
    Approved: 'bg-primary/10 text-primary',
    Rejected: 'bg-error-container text-error',
    Escalated: 'bg-secondary-container/30 text-on-secondary-container',
  };
  const statusIcon: Record<ModerationStatus, string> = {
    Pending: 'hourglass_empty',
    Flagged: 'warning',
    Safe: 'verified',
    Approved: 'check_circle',
    Rejected: 'cancel',
    Escalated: 'flag',
  };

  return (
    <tr className="group transition-colors hover:bg-primary/5">
      <td className="px-6 py-5 xl:px-8">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold ${item.avatar}`}>
            {item.initials}
          </div>
          <div>
            <p className="whitespace-nowrap text-label-lg text-on-surface">{item.contributor}</p>
            <p className="whitespace-nowrap text-label-sm text-outline">{item.contributorDetail}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-5 xl:px-8">
        <div className="flex flex-col">
          <span className="whitespace-nowrap text-label-lg text-on-surface">{item.attraction}</span>
          <span className="flex items-center gap-1 whitespace-nowrap text-label-sm text-outline">
            <Icon name="location_on" className="text-[14px]" />
            {item.region}
          </span>
        </div>
      </td>
      <td className="px-6 py-5 xl:px-8">
        <div className="flex gap-4">
          {item.image && (
            <div className="relative h-20 w-20 shrink-0 overflow-visible rounded-xl bg-surface-variant">
              <img src={item.image} alt={`${item.attraction} submitted image`} className="h-full w-full rounded-xl object-cover" />
              <span className="absolute -right-2 -top-2 rounded-full border border-surface bg-secondary-container px-2 text-[10px] font-semibold text-on-secondary-container">
                IMAGE
              </span>
            </div>
          )}
          <div className="min-w-[220px]">
            <p className={`line-clamp-2 text-sm italic ${item.severity === 'High Risk' ? 'text-error not-italic' : 'text-on-surface-variant'}`}>
              {item.snippet}
            </p>
            <p
              className={`mt-1 text-label-sm font-bold ${
                item.severity === 'High Risk'
                  ? 'text-error'
                  : item.type === 'Description'
                    ? 'text-tertiary'
                    : 'text-primary'
              }`}
            >
              {item.contentLabel}
            </p>
          </div>
        </div>
      </td>
      <td className="px-6 py-5 xl:px-8">
        <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-label-sm ${statusStyles[item.status]}`}>
          <Icon name={statusIcon[item.status]} className="text-[16px]" filled={item.status === 'Flagged' || item.status === 'Safe'} />
          {item.status}
        </span>
      </td>
      <td className="px-6 py-5">
        <div className="flex items-center justify-end gap-1 opacity-70 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 focus-within:opacity-100">
          <button
            type="button"
            aria-label={`Approve ${item.attraction} content`}
            title="Approve"
            onClick={() => onAction(item, 'Approved')}
            disabled={item.status === 'Approved' || item.status === 'Rejected'}
            className="rounded-full p-2 text-primary hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Icon name="check_circle" />
          </button>
          <Link
            href={`/admin/content-moderation/${encodeURIComponent(item.id)}`}
            aria-label={`Review details for ${item.attraction}`}
            title="Review details"
            className="rounded-full p-2 text-on-surface-variant hover:bg-surface-container"
          >
            <Icon name="visibility" />
          </Link>
          <button
            type="button"
            aria-label={`Reject ${item.attraction} content`}
            title="Reject"
            onClick={() => onAction(item, 'Rejected')}
            disabled={item.status === 'Approved' || item.status === 'Rejected'}
            className="rounded-full p-2 text-error hover:bg-error/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Icon name="cancel" />
          </button>
          <button
            type="button"
            aria-label={`Escalate ${item.attraction} content`}
            title="Escalate"
            onClick={() => onAction(item, 'Escalated')}
            disabled={item.status === 'Approved' || item.status === 'Rejected' || item.status === 'Escalated'}
            className="rounded-full p-2 text-secondary hover:bg-secondary/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Icon name="flag" />
          </button>
        </div>
      </td>
    </tr>
  );
}

function MobileModerationCard({
  item,
  onAction,
}: {
  item: ModerationItem;
  onAction: (item: ModerationItem, status: 'Approved' | 'Rejected' | 'Escalated') => void;
}) {
  const [offset, setOffset] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const badgeLabel =
    item.severity === 'High Risk'
      ? 'High Risk'
      : item.contributorDetail.startsWith('New Member')
        ? 'New User'
        : item.status === 'Safe'
          ? 'Safe'
          : 'Standard';
  const badgeColor =
    badgeLabel === 'High Risk'
      ? 'bg-secondary-fixed text-on-secondary-fixed'
      : badgeLabel === 'New User'
        ? 'bg-tertiary-fixed text-on-tertiary-fixed'
        : badgeLabel === 'Safe'
          ? 'bg-primary/10 text-primary'
          : 'bg-surface-variant text-on-surface-variant';

  function finishSwipe() {
    if (offset > 80) {
      onAction(item, 'Approved');
    } else if (offset < -80) {
      onAction(item, 'Rejected');
    }

    touchStartX.current = null;
    setOffset(0);
  }

  return (
    <article className="relative overflow-hidden rounded-xl border border-outline-variant/20 bg-surface-container-low shadow-[0px_4px_20px_rgba(0,0,0,0.05)]">
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-0 flex w-24 items-center justify-center bg-primary/15 text-primary"
      >
        <Icon name="check_circle" className="text-2xl" filled />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-y-0 right-0 flex w-24 items-center justify-center bg-error/15 text-error"
      >
        <Icon name="cancel" className="text-2xl" filled />
      </div>
      <div
        onTouchStart={(event) => {
          touchStartX.current = event.touches[0]?.clientX ?? null;
        }}
        onTouchMove={(event) => {
          if (touchStartX.current === null) return;
          const currentX = event.touches[0]?.clientX;
          if (currentX === undefined) return;
          setOffset(Math.max(-100, Math.min(100, currentX - touchStartX.current)));
        }}
        onTouchEnd={finishSwipe}
        onTouchCancel={() => {
          touchStartX.current = null;
          setOffset(0);
        }}
        style={{ transform: `translateX(${offset}px)`, touchAction: 'pan-y' }}
        className="relative z-10 bg-surface p-5 transition-transform duration-200"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            {item.portrait ? (
              <img
                src={item.portrait}
                alt=""
                className="h-12 w-12 shrink-0 rounded-full border-2 border-primary-fixed object-cover"
              />
            ) : (
              <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-bold ${item.avatar}`}>
                {item.initials}
              </span>
            )}
            <div className="min-w-0">
              <p className="truncate text-label-lg text-on-surface">{item.contributor}</p>
              <p className="text-xs text-on-surface-variant">Reported {item.reportedAt}</p>
            </div>
          </div>
          <span className={`shrink-0 rounded px-2 py-1 text-[10px] font-bold uppercase ${badgeColor}`}>
            {badgeLabel}
          </span>
        </div>

        <div className="mb-4">
          <p className="mb-1 text-label-sm text-primary">
            Attraction: {item.attraction}
          </p>
          {item.image ? (
            <div className="flex gap-2 overflow-x-auto">
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg">
                <img
                  src={item.image}
                  alt={`Submitted image for ${item.attraction}`}
                  className="h-full w-full object-cover"
                />
              </div>
              <p className="line-clamp-3 self-center text-sm text-on-surface-variant">
                {item.snippet}
              </p>
            </div>
          ) : (
            <p className={`line-clamp-2 text-sm leading-6 text-on-surface-variant ${item.severity === 'High Risk' ? 'italic' : ''}`}>
              {item.snippet}
            </p>
          )}
          {item.severity === 'High Risk' && (
            <p className="mt-1 text-xs font-bold text-error">{item.contentLabel}</p>
          )}
        </div>

        <div className="flex gap-3">
          <Link
            href={`/admin/content-moderation/${encodeURIComponent(item.id)}`}
            className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-label-lg text-on-primary transition-all active:scale-95"
          >
            Review Details
          </Link>
          <button
            type="button"
            aria-label={`More actions for ${item.attraction}`}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((open) => !open)}
            className="flex h-11 w-12 shrink-0 items-center justify-center rounded-lg border border-outline-variant text-on-surface-variant transition-colors hover:bg-surface-variant"
          >
            <Icon name="more_vert" />
          </button>
        </div>

        {isMenuOpen && (
          <div className="mt-3 grid grid-cols-3 gap-2 border-t border-outline-variant/50 pt-3">
            <button
              type="button"
              onClick={() => onAction(item, 'Approved')}
              className="rounded-lg bg-primary/10 px-2 py-2 text-xs font-semibold text-primary"
            >
              Approve
            </button>
            <button
              type="button"
              onClick={() => onAction(item, 'Rejected')}
              className="rounded-lg bg-error/10 px-2 py-2 text-xs font-semibold text-error"
            >
              Reject
            </button>
            <button
              type="button"
              onClick={() => onAction(item, 'Escalated')}
              className="rounded-lg bg-secondary/10 px-2 py-2 text-xs font-semibold text-secondary"
            >
              Escalate
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

function MobileModerationNavigation() {
  return (
    <nav
      aria-label="Admin navigation"
      className="fixed bottom-0 z-50 flex w-full items-center justify-around border-t border-outline-variant/20 bg-surface px-2 pt-3 shadow-[0px_-4px_20px_rgba(0,0,0,0.05)] [padding-bottom:max(0.75rem,env(safe-area-inset-bottom))] lg:hidden"
    >
      {[
        { label: 'Analytics', icon: 'analytics', href: '/admin' },
        { label: 'Verify', icon: 'verified_user', href: '/admin/operator-verification' },
        { label: 'Mod', icon: 'gavel', href: '/admin/content-moderation' },
        { label: 'Profile', icon: 'person', href: '/admin/settings' },
      ].map((item) => {
        const active = item.label === 'Mod';
        return (
          <a
            key={item.label}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={`flex min-w-16 flex-col items-center justify-center rounded-xl px-3 py-1 ${
              active
                ? 'scale-95 bg-primary-container font-bold text-on-primary-container'
                : 'text-on-surface-variant transition-colors hover:bg-surface-variant'
            }`}
          >
            <Icon name={item.icon} filled={active} />
            <span className="mt-0.5 text-label-sm">{item.label}</span>
          </a>
        );
      })}
    </nav>
  );
}

function EmptyResults() {
  return (
    <div className="px-6 py-12 text-center">
      <Icon name="search_off" className="text-3xl text-outline" />
      <p className="mt-2 font-medium">No content found</p>
      <p className="mt-1 text-sm text-on-surface-variant">Try adjusting your search or filters.</p>
    </div>
  );
}
