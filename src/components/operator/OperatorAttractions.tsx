'use client';

import Link from 'next/link';
import { type FormEvent, useEffect, useMemo, useState } from 'react';
import {
  type Attraction,
  type AttractionCategory,
  type AttractionStatus,
  initialAttractions,
} from './operatorAttractionData';
import { getAttractionsWithEdits } from './operatorAttractionStorage';

type StatusFilter = 'All' | AttractionStatus;

const operatorNavigation = [
  { label: 'Dashboard', icon: 'dashboard', href: '/dashboard' },
  { label: 'Attractions', icon: 'landscape', href: '/operator/attractions' },
  { label: 'Bookings', icon: 'calendar_month', href: '/dashboard#recent-bookings' },
  { label: 'Analytics', icon: 'analytics', href: '/operator/analytics' },
  { label: 'Settings', icon: 'settings', href: '#' },
];

const statusStyles: Record<AttractionStatus, string> = {
  Live: 'bg-primary/90 text-on-primary',
  Pending: 'bg-secondary-container/90 text-on-secondary-container',
  Draft: 'bg-surface-container-high text-on-surface-variant',
  Paused: 'bg-on-surface-variant text-white',
};

const categoryStyles: Record<AttractionCategory, string> = {
  Nature: 'bg-primary/10 text-primary',
  Culture: 'bg-secondary-container/20 text-on-secondary-container',
  History: 'bg-tertiary-container/20 text-tertiary',
};

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

function formatBookings(bookings: number | null) {
  if (bookings === null) return '—';
  return bookings >= 1000 ? `${(bookings / 1000).toFixed(1)}k` : String(bookings);
}

export function OperatorAttractions() {
  const [attractions, setAttractions] = useState(initialAttractions);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [categoryFilter, setCategoryFilter] = useState<AttractionCategory | 'All Categories'>('All Categories');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notice, setNotice] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [formName, setFormName] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formCategory, setFormCategory] = useState<AttractionCategory>('Nature');
  const [deletingAttraction, setDeletingAttraction] = useState<Attraction | null>(null);

  useEffect(() => {
    try {
      setAttractions(getAttractionsWithEdits());
    } catch (caught) {
      setNotice(caught instanceof Error ? caught.message : 'Unable to load saved attraction edits.');
    }
  }, []);

  const filteredAttractions = useMemo(() => {
    const query = search.trim().toLowerCase();
    return attractions.filter((attraction) => {
      const matchesSearch = !query ||
        `${attraction.name} ${attraction.location} ${attraction.category}`.toLowerCase().includes(query);
      const matchesStatus = statusFilter === 'All' || attraction.status === statusFilter;
      const matchesCategory = categoryFilter === 'All Categories' || attraction.category === categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [attractions, categoryFilter, search, statusFilter]);

  const liveCount = attractions.filter((attraction) => attraction.status === 'Live').length;
  const ratedAttractions = attractions.filter(
    (attraction) => attraction.status === 'Live' && attraction.rating !== null,
  );
  const averageRating = ratedAttractions.length
    ? (ratedAttractions.reduce((sum, attraction) => sum + (attraction.rating ?? 0), 0) / ratedAttractions.length).toFixed(1)
    : '—';

  function openCreateForm() {
    setFormName('');
    setFormLocation('');
    setFormCategory('Nature');
    setFormOpen(true);
  }

  function saveAttraction(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = formName.trim();
    const location = formLocation.trim();
    if (!name || !location) return;

    setAttractions((current) => [
      {
        id: `draft-${Date.now()}`,
        name,
        location,
        category: formCategory,
        status: 'Draft',
        bookings: null,
        rating: null,
        trend: null,
        imageAlt: `Image preview for ${name}.`,
      },
      ...current,
    ]);
    setStatusFilter('All');
    setCategoryFilter('All Categories');
    setSearch('');
    setNotice(`${name} saved as a draft in this demo.`);
    setFormOpen(false);
  }

  function toggleListing(attraction: Attraction) {
    const status: AttractionStatus = attraction.status === 'Live' ? 'Paused' : 'Live';
    setAttractions((current) =>
      current.map((item) => (item.id === attraction.id ? { ...item, status } : item)),
    );
    setNotice(`${attraction.name} is now ${status.toLowerCase()} in this demo.`);
  }

  function deleteListing() {
    if (!deletingAttraction) return;
    setAttractions((current) => current.filter((item) => item.id !== deletingAttraction.id));
    setNotice(`${deletingAttraction.name} was removed from this demo.`);
    setDeletingAttraction(null);
  }

  function renderAttractionCard(attraction: Attraction) {
    const needsReview = attraction.status === 'Pending' || attraction.status === 'Draft';
    return (
      <article
        key={attraction.id}
        className="group flex flex-col overflow-hidden rounded-2xl bg-surface-container-low shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:rounded-[28px]"
      >
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/20 via-tertiary/10 to-secondary/20 sm:h-64">
          {attraction.image && (
            <img
              src={attraction.image}
              alt={attraction.imageAlt}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          )}
          {!attraction.image && (
            <div className="flex h-full items-center justify-center text-primary/50">
              <Icon name="landscape" className="text-6xl" />
            </div>
          )}
          <div className="absolute right-3 top-3 flex flex-wrap justify-end gap-2 sm:right-4 sm:top-4">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold backdrop-blur-md ${statusStyles[attraction.status]}`}>
              <span className={`h-2 w-2 rounded-full ${attraction.status === 'Live' ? 'animate-pulse bg-primary-fixed-dim' : attraction.status === 'Pending' ? 'animate-pulse bg-secondary' : 'bg-current'}`} />
              {attraction.status === 'Pending' ? 'Pending Verification' : attraction.status}
            </span>
            <span className="rounded-full bg-black/40 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
              {attraction.category}
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-5 sm:p-8">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <Link
                href={`/operator/attractions/${attraction.id}`}
                className="block truncate font-headline-md text-[18px] text-on-surface hover:text-primary sm:text-headline-md"
              >
                {attraction.name}
              </Link>
              <p className="mt-1 flex items-center gap-1 text-label-sm text-on-surface-variant">
                <Icon name="location_on" className="text-[14px]" />
                <span className="truncate">{attraction.location}</span>
              </p>
            </div>
            {attraction.trend !== null ? (
              <div className={`shrink-0 text-right ${attraction.trend < 0 ? 'text-error' : 'text-primary'}`}>
                <span className="flex items-center justify-end gap-1">
                  <Icon name={attraction.trend < 0 ? 'trending_down' : 'trending_up'} className="text-[16px]" />
                  <span className="text-label-sm">{attraction.trend > 0 ? '+' : ''}{attraction.trend}%</span>
                </span>
                <span className="text-[10px] uppercase text-outline">This Month</span>
              </div>
            ) : (
              <span className="shrink-0 text-right text-[10px] uppercase text-outline">Under review</span>
            )}
          </div>

          {attraction.chartPath ? (
            <div className="mb-4 h-10 w-full" aria-label="Monthly bookings trend">
              <svg viewBox="0 0 100 20" role="img" aria-label={`${attraction.trend}% monthly booking change`} className={`h-full w-full fill-none stroke-2 ${attraction.trend !== null && attraction.trend < 0 ? 'stroke-error' : 'stroke-primary'}`}>
                <path d={attraction.chartPath} />
              </svg>
            </div>
          ) : (
            <div className="mb-4 flex h-10 items-center text-xs text-on-surface-variant">Metrics available after verification</div>
          )}

          <div className="mb-6 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-surface-container p-3 sm:rounded-2xl sm:p-4">
              <p className="mb-1 text-[10px] uppercase text-on-surface-variant sm:text-label-sm">Bookings</p>
              <p className="font-headline-md text-primary">{formatBookings(attraction.bookings)}</p>
            </div>
            <div className="rounded-xl bg-surface-container p-3 sm:rounded-2xl sm:p-4">
              <p className="mb-1 text-[10px] uppercase text-on-surface-variant sm:text-label-sm">Rating</p>
              <p className={`flex items-center gap-1 font-headline-md ${attraction.rating === null ? 'text-on-surface-variant/50' : 'text-secondary'}`}>
                {attraction.rating?.toFixed(1) ?? '—'}
                {attraction.rating !== null && <Icon name="star" className="text-[18px]" filled />}
              </p>
            </div>
          </div>

          <div className="mt-auto flex flex-wrap gap-2 border-t border-outline-variant/30 pt-5">
            <Link
              href={`/operator/attractions/${attraction.id}/edit`}
              className="min-w-[100px] flex-1 rounded-xl bg-primary py-3 text-center font-label-lg text-on-primary transition-colors hover:bg-primary-container hover:text-on-primary-container"
            >
              {needsReview ? 'Review Draft' : 'Edit'}
            </Link>
            <Link
              href={`/operator/attractions/${attraction.id}`}
              aria-label={`View analytics for ${attraction.name}`}
              title={needsReview ? 'Preview listing' : 'View analytics'}
              className="rounded-xl bg-surface-container p-3 text-on-surface-variant transition-colors hover:bg-surface-container-high"
            >
              <Icon name={needsReview ? 'visibility' : 'analytics'} />
            </Link>
            {!needsReview && (
              <button
                type="button"
                onClick={() => toggleListing(attraction)}
                aria-label={`${attraction.status === 'Live' ? 'Pause' : 'Resume'} ${attraction.name}`}
                title={attraction.status === 'Live' ? 'Pause listing' : 'Resume listing'}
                className="rounded-xl bg-surface-container p-3 text-on-surface-variant transition-colors hover:bg-surface-container-high"
              >
                <Icon name={attraction.status === 'Live' ? 'pause_circle' : 'play_circle'} />
              </button>
            )}
            {needsReview && (
              <button
                type="button"
                onClick={() => setDeletingAttraction(attraction)}
                aria-label={`Delete ${attraction.name}`}
                title="Delete listing"
                className="rounded-xl bg-error-container p-3 text-on-error-container transition-colors hover:bg-error hover:text-on-error"
              >
                <Icon name="delete" />
              </button>
            )}
          </div>
        </div>
      </article>
    );
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-72 flex-col bg-surface-container-low shadow-[0_1px_8px_rgba(0,0,0,0.04)] lg:flex">
        <div className="flex flex-col gap-1 p-8">
          <a href="/dashboard" className="font-headline-md text-headline-md text-primary">GhanaXplore</a>
          <span className="font-label-sm uppercase tracking-widest text-on-surface-variant">Operator Portal</span>
        </div>
        <nav aria-label="Operator navigation" className="mt-4 flex-1 space-y-2 px-4">
          {operatorNavigation.map((item) => {
            const active = item.label === 'Attractions';
            return item.href === '#' ? (
              <button
                key={item.label}
                type="button"
                onClick={() => setNotice(`${item.label} is not available in this demo.`)}
                className="flex w-full items-center rounded-xl px-4 py-3 text-left text-on-surface-variant transition-all hover:bg-surface-container-high hover:text-on-surface"
              >
                <Icon name={item.icon} className="mr-3" />
                {item.label}
              </button>
            ) : (
              <a
                key={item.label}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={`flex items-center rounded-xl px-4 py-3 transition-all ${
                  active
                    ? 'bg-primary-container font-bold text-on-primary-container'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
              >
                <Icon name={item.icon} className="mr-3" filled={active} />
                {item.label}
              </a>
            );
          })}
        </nav>
        <div className="mt-auto p-6">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-on-primary">
              <Icon name="person" />
            </span>
            <div className="min-w-0">
              <p className="truncate font-label-lg font-bold">Kwame Mensah</p>
              <p className="truncate text-[10px] text-on-surface-variant">Labadi Beach Resort</p>
            </div>
          </div>
          <a
            href="#add-attraction"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-label-lg font-bold text-on-primary transition-all hover:shadow-lg hover:shadow-primary/20"
          >
            <Icon name="add" />
            Add New Attraction
          </a>
        </div>
      </aside>

      <header className="fixed inset-x-0 top-0 z-50 border-b border-outline-variant/30 bg-surface/90 pt-[env(safe-area-inset-top)] shadow-[0_1px_8px_rgba(0,0,0,0.04)] backdrop-blur-xl lg:hidden">
        <div className="flex h-16 items-center justify-between px-4">
          <button
            type="button"
            aria-label={isMobileMenuOpen ? 'Close operator menu' : 'Open operator menu'}
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            className="flex h-11 w-11 items-center justify-center"
          >
            <Icon name={isMobileMenuOpen ? 'close' : 'menu'} />
          </button>
          <div className="flex flex-col items-center">
            <a href="/dashboard" className="font-display-lg-mobile text-[24px] tracking-tight text-primary">GhanaXplore</a>
            <span className="-mt-1 text-[10px] uppercase tracking-widest text-secondary">Operator</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Notifications"
              onClick={() => setNotice('You are all caught up on notifications.')}
              className="relative flex h-11 w-11 items-center justify-center"
            >
              <Icon name="notifications" />
              <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-error" />
            </button>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-on-primary">
              <Icon name="person" className="text-[18px]" />
            </span>
          </div>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-[60] bg-on-surface/40 lg:hidden"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsMobileMenuOpen(false);
          }}
        >
          <nav aria-label="Operator navigation" className="mt-[calc(4rem+env(safe-area-inset-top))] flex h-[calc(100%-4rem-env(safe-area-inset-top))] w-[min(20rem,85vw)] flex-col bg-surface p-5 shadow-xl">
            <div className="mb-5 border-b border-outline-variant/30 pb-5">
              <p className="font-headline-md text-headline-md text-primary">GhanaXplore</p>
              <p className="text-label-sm uppercase tracking-widest text-on-surface-variant">Operator Portal</p>
            </div>
            <div className="space-y-1">
              {operatorNavigation.map((item) => {
                const active = item.label === 'Attractions';
                return item.href === '#' ? (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      setNotice(`${item.label} is not available in this demo.`);
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-on-surface-variant"
                  >
                    <Icon name={item.icon} />
                    {item.label}
                  </button>
                ) : (
                  <a
                    key={item.label}
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 ${
                      active ? 'bg-primary-container font-bold text-on-primary-container' : 'text-on-surface-variant'
                    }`}
                  >
                    <Icon name={item.icon} filled={active} />
                    {item.label}
                  </a>
                );
              })}
            </div>
          </nav>
        </div>
      )}

      <main className="min-h-screen pt-16 lg:ml-72 lg:pt-20">
        <header className="fixed left-72 right-0 top-0 z-40 hidden h-20 items-center justify-between bg-surface/80 px-8 shadow-[0_1px_8px_rgba(0,0,0,0.04)] backdrop-blur-xl xl:px-16 lg:flex">
          <div className="max-w-md flex-1">
            <label className="relative flex items-center">
              <Icon name="search" className="absolute left-3 text-on-surface-variant" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                aria-label="Search bookings or attractions"
                placeholder="Search bookings or attractions..."
                className="w-full rounded-full border-none bg-surface-container-low py-2 pl-10 pr-4 font-label-lg focus:ring-2 focus:ring-primary"
              />
            </label>
          </div>
          <div className="flex items-center gap-6">
            <button
              type="button"
              aria-label="Notifications"
              onClick={() => setNotice('You are all caught up on notifications.')}
              className="relative rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container-high"
            >
              <Icon name="notifications" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-error" />
            </button>
            <div className="flex items-center gap-3 border-l border-outline-variant pl-4">
              <div className="hidden text-right sm:block">
                <p className="font-label-lg leading-none">Kwame Mensah</p>
                <p className="mt-1 text-label-sm text-on-surface-variant">Tourism Operator</p>
              </div>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-on-primary">
                <Icon name="person" className="text-[18px]" />
              </span>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-[1600px] pb-28 lg:px-8 lg:pb-12 xl:px-16">
          <section className="flex flex-col gap-4 px-4 pt-6 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-0 lg:pb-2 lg:pt-8">
            <div className="space-y-2">
              <div className="hidden items-center gap-3 lg:flex">
                <span className="h-[2px] w-8 bg-primary" />
                <span className="text-label-sm uppercase tracking-[0.2em] text-primary">Management Suite</span>
              </div>
              <div className="flex items-center justify-between">
                <h1 className="font-headline-md text-headline-md text-on-surface lg:font-display-lg lg:text-display-lg">My Attractions</h1>
                <button
                  type="button"
                  aria-label="Add new attraction"
                  onClick={openCreateForm}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-container text-on-primary-container shadow-sm transition-transform hover:scale-105 active:scale-95 lg:hidden"
                >
                  <Icon name="add" />
                </button>
              </div>
              <p className="hidden max-w-xl font-body-lg text-on-surface-variant lg:block">
                Curate and manage your cultural and natural landmarks. Review performance metrics and update listing details in real time.
              </p>
            </div>
            <button
              type="button"
              onClick={openCreateForm}
              className="hidden items-center gap-3 rounded-xl bg-primary px-8 py-4 font-label-lg text-on-primary shadow-lg transition-all hover:shadow-primary/20 lg:flex"
            >
              <Icon name="add" />
              Add New Attraction
            </button>
          </section>

          {notice && (
            <div role="status" className="mx-4 mt-4 flex items-center justify-between gap-4 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-on-primary-fixed-variant sm:mx-6 lg:mx-0">
              <span>{notice}</span>
              <button type="button" aria-label="Dismiss notification" onClick={() => setNotice('')} className="rounded p-1 hover:bg-primary/10">
                <Icon name="close" />
              </button>
            </div>
          )}

          <section aria-label="Attraction statistics" className="mt-8 hidden grid-cols-1 gap-6 px-8 md:grid-cols-3 lg:px-0">
            <article className="group relative flex h-48 flex-col justify-between overflow-hidden rounded-3xl bg-surface-container-low p-8">
              <div className="relative z-10">
                <p className="mb-2 text-label-sm uppercase tracking-widest text-on-surface-variant">Total Managed</p>
                <p className="font-display-lg text-display-lg text-primary">{attractions.length}</p>
              </div>
              <div className="relative z-10 flex items-center gap-2 text-primary">
                <Icon name="inventory" className="text-[18px]" />
                <span className="font-label-lg">All Locations</span>
              </div>
              <Icon name="castle" className="absolute -bottom-4 -right-4 text-[160px] opacity-5 transition-transform duration-700 group-hover:scale-110" />
            </article>
            <article className="group relative flex h-48 flex-col justify-between overflow-hidden rounded-3xl bg-primary-container p-8">
              <div className="relative z-10">
                <p className="mb-2 text-label-sm uppercase tracking-widest text-on-primary-container/80">Active Listings</p>
                <p className="font-display-lg text-display-lg text-on-primary-container">{liveCount}</p>
              </div>
              <div className="relative z-10 flex items-center gap-2 text-on-primary-container">
                <Icon name="online_prediction" className="text-[18px]" />
                <span className="font-label-lg">Live on Platform</span>
              </div>
              <Icon name="travel_explore" className="absolute -bottom-4 -right-4 text-[160px] text-on-primary-container opacity-10 transition-transform duration-700 group-hover:scale-110" />
            </article>
            <article className="group relative flex h-48 flex-col justify-between overflow-hidden rounded-3xl bg-secondary-container p-8">
              <div className="relative z-10">
                <p className="mb-2 text-label-sm uppercase tracking-widest text-on-secondary-container">Avg Rating</p>
                <p className="flex items-center gap-2 font-display-lg text-display-lg text-on-secondary-container">
                  {averageRating}<Icon name="star" className="text-2xl" filled />
                </p>
              </div>
              <div className="relative z-10 flex items-center gap-2 text-on-secondary-container">
                <Icon name="trending_up" className="text-[18px]" />
                <span className="font-label-lg">Across live listings</span>
              </div>
              <Icon name="grade" className="absolute -bottom-4 -right-4 text-[160px] text-on-secondary-container opacity-10 transition-transform duration-700 group-hover:scale-110" />
            </article>
          </section>

          <section aria-label="Search and filter attractions" className="mt-6 px-4 sm:px-6 lg:mb-8 lg:mt-10 lg:px-0">
            <div className="rounded-2xl bg-surface-container-highest/30 p-4 backdrop-blur-md">
              <label className="relative block w-full">
                <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  aria-label="Search attractions by name, region or category"
                  placeholder="Search by name, region or tag..."
                  className="w-full rounded-xl border-none bg-surface-container py-3 pl-12 pr-4 font-body-md outline-none focus:ring-2 focus:ring-primary"
                />
              </label>

              <div className="mt-4 hidden items-center gap-2 overflow-x-auto lg:flex">
                {(['All Categories', 'Nature', 'Culture', 'History'] as const).map((category) => {
                  const active = categoryFilter === category;
                  return (
                    <button
                      key={category}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setCategoryFilter(category)}
                      className={`whitespace-nowrap rounded-full px-5 py-3 font-label-lg transition-colors ${
                        active ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                      }`}
                    >
                      {category}
                    </button>
                  );
                })}
                <span className="mx-2 h-8 w-px shrink-0 bg-outline-variant" />
                <button
                  type="button"
                  aria-expanded={showAdvancedFilters}
                  onClick={() => setShowAdvancedFilters((open) => !open)}
                  className="flex items-center gap-2 px-4 font-label-lg text-primary"
                >
                  <Icon name="filter_list" />
                  Advanced
                </button>
              </div>

              <div className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:hidden">
                {(['All', 'Live', 'Pending', 'Draft'] as const).map((status) => {
                  const active = statusFilter === status;
                  return (
                    <button
                      key={status}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setStatusFilter(status)}
                      className={`shrink-0 whitespace-nowrap rounded-full px-5 py-2 font-label-lg transition-colors ${
                        active ? 'bg-primary text-on-primary shadow-md' : 'bg-surface-container-high text-on-surface-variant'
                      }`}
                    >
                      {status}
                    </button>
                  );
                })}
                <button
                  type="button"
                  aria-label="Open advanced filters"
                  aria-expanded={showAdvancedFilters}
                  onClick={() => setShowAdvancedFilters((open) => !open)}
                  className="flex shrink-0 items-center gap-1 rounded-full bg-surface-container-high px-4 py-2 font-label-lg text-on-surface-variant"
                >
                  <Icon name="filter_list" />
                  Filter
                </button>
              </div>

              {showAdvancedFilters && (
                <div className="mt-4 grid grid-cols-1 gap-3 border-t border-outline-variant/30 pt-4 sm:grid-cols-2">
                  <label className="space-y-1 text-sm font-semibold">
                    <span>Status</span>
                    <select
                      value={statusFilter}
                      onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
                      className="w-full rounded-lg border-outline-variant bg-white px-3 py-2 font-normal focus:border-primary focus:ring-primary"
                    >
                      {(['All', 'Live', 'Pending', 'Draft', 'Paused'] as const).map((status) => (
                        <option key={status} value={status}>{status === 'All' ? 'All statuses' : status}</option>
                      ))}
                    </select>
                  </label>
                  <label className="space-y-1 text-sm font-semibold">
                    <span>Category</span>
                    <select
                      value={categoryFilter}
                      onChange={(event) => setCategoryFilter(event.target.value as AttractionCategory | 'All Categories')}
                      className="w-full rounded-lg border-outline-variant bg-white px-3 py-2 font-normal focus:border-primary focus:ring-primary"
                    >
                      {(['All Categories', 'Nature', 'Culture', 'History'] as const).map((category) => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </label>
                </div>
              )}
            </div>
          </section>

          <section aria-label="Attraction listings" className="px-4 pb-8 pt-6 sm:px-6 lg:px-0 lg:pt-0">
            {filteredAttractions.length ? (
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-3 xl:gap-8">
                {filteredAttractions.map(renderAttractionCard)}
              </div>
            ) : (
              <div className="flex flex-col items-center px-4 py-16 text-center sm:py-20">
                <span className="mb-6 flex h-28 w-28 items-center justify-center rounded-full bg-surface-container">
                  <Icon name="location_off" className="text-[56px] text-outline" />
                </span>
                <h2 className="font-headline-md text-on-surface">No hidden gems found?</h2>
                <p className="mt-2 max-w-sm text-body-md text-on-surface-variant">
                  Try a different search or add a new attraction to the map.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearch('');
                    setStatusFilter('All');
                    setCategoryFilter('All Categories');
                  }}
                  className="mt-5 font-label-lg font-semibold text-primary hover:underline"
                >
                  Clear filters
                </button>
              </div>
            )}
          </section>

          <section id="add-attraction" className="px-4 pb-12 sm:px-6 lg:px-0 lg:pb-20">
            <div className="group flex cursor-pointer flex-col items-center justify-center rounded-[32px] border-2 border-dashed border-outline-variant p-8 text-center transition-colors hover:bg-primary/5 sm:p-12">
              <span className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-surface-container text-primary transition-transform duration-500 group-hover:scale-110">
                <Icon name="add_location_alt" className="text-[40px]" />
              </span>
              <h2 className="mb-2 font-headline-md text-on-surface">Expand Your Portfolio</h2>
              <p className="mb-6 max-w-sm text-body-md text-on-surface-variant">
                You have {Math.max(0, 5 - attractions.length)} slot{5 - attractions.length === 1 ? '' : 's'} remaining in your Basic Tier. Add another site now.
              </p>
              <button
                type="button"
                onClick={openCreateForm}
                className="flex items-center gap-2 font-label-lg text-primary transition-transform group-hover:translate-x-1"
              >
                Get started with a new listing
                <Icon name="arrow_forward" />
              </button>
            </div>
          </section>
        </div>
      </main>

      <button
        type="button"
        aria-label="Add attraction"
        onClick={openCreateForm}
        className="fixed bottom-24 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container shadow-xl transition-transform active:scale-90 lg:hidden"
      >
        <Icon name="add_location_alt" className="text-[28px]" />
      </button>

      <nav
        aria-label="Mobile operator navigation"
        className="fixed inset-x-0 bottom-0 z-50 bg-surface/90 pb-[env(safe-area-inset-bottom)] shadow-[0_-1px_8px_rgba(0,0,0,0.04)] backdrop-blur-xl lg:hidden"
      >
        <div className="flex h-20 items-center justify-around px-2">
          {[
            { label: 'Dashboard', icon: 'dashboard', href: '/dashboard' },
            { label: 'Attractions', icon: 'location_on', href: '/operator/attractions' },
            { label: 'Bookings', icon: 'calendar_month', href: '/dashboard#recent-bookings' },
            { label: 'Analytics', icon: 'analytics', href: '/operator/analytics' },
            { label: 'Profile', icon: 'account_circle', href: '#' },
          ].map((item) => {
            const active = item.label === 'Attractions';
            return item.href === '#' ? (
              <button
                key={item.label}
                type="button"
                onClick={() => setNotice('Profile settings are not available in this demo.')}
                className="flex h-16 w-16 flex-col items-center justify-center gap-1 text-on-surface-variant"
              >
                <Icon name={item.icon} />
                <span className="text-label-sm">{item.label}</span>
              </button>
            ) : (
              <a
                key={item.label}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={`flex h-16 w-16 flex-col items-center justify-center gap-1 transition-all ${
                  active ? 'font-semibold text-primary' : 'text-on-surface-variant'
                }`}
              >
                <Icon name={item.icon} filled={active} />
                <span className="text-label-sm">{item.label}</span>
              </a>
            );
          })}
        </div>
      </nav>

      {(formOpen || deletingAttraction) && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto bg-on-surface/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setFormOpen(false);
              setDeletingAttraction(null);
            }
          }}
        >
          {formOpen && (
            <form
              onSubmit={saveAttraction}
              aria-labelledby="attraction-form-title"
              className="my-auto w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
            >
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <p className="text-label-sm uppercase tracking-widest text-primary">Listing details</p>
                  <h2 id="attraction-form-title" className="mt-1 font-headline-md text-headline-md">
                    Add New Attraction
                  </h2>
                </div>
                <button type="button" aria-label="Close form" onClick={() => setFormOpen(false)} className="rounded-lg p-2 text-outline hover:bg-surface-container">
                  <Icon name="close" />
                </button>
              </div>
              <div className="space-y-4">
                <label className="block space-y-1 text-sm font-semibold">
                  <span>Attraction name</span>
                  <input
                    autoFocus
                    required
                    maxLength={100}
                    value={formName}
                    onChange={(event) => setFormName(event.target.value)}
                    className="w-full rounded-lg border-outline-variant bg-surface-container-low px-3 py-2.5 font-normal focus:border-primary focus:ring-primary"
                  />
                </label>
                <label className="block space-y-1 text-sm font-semibold">
                  <span>Location</span>
                  <input
                    required
                    maxLength={100}
                    value={formLocation}
                    onChange={(event) => setFormLocation(event.target.value)}
                    placeholder="Region, Ghana"
                    className="w-full rounded-lg border-outline-variant bg-surface-container-low px-3 py-2.5 font-normal focus:border-primary focus:ring-primary"
                  />
                </label>
                <label className="block space-y-1 text-sm font-semibold">
                  <span>Category</span>
                  <select
                    value={formCategory}
                    onChange={(event) => setFormCategory(event.target.value as AttractionCategory)}
                    className="w-full rounded-lg border-outline-variant bg-surface-container-low px-3 py-2.5 font-normal focus:border-primary focus:ring-primary"
                  >
                    <option>Nature</option>
                    <option>Culture</option>
                    <option>History</option>
                  </select>
                </label>
              </div>
              <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button type="button" onClick={() => setFormOpen(false)} className="rounded-lg border border-outline-variant px-5 py-2.5 font-semibold text-on-surface-variant hover:bg-surface-container">
                  Cancel
                </button>
                <button type="submit" className="rounded-lg bg-primary px-5 py-2.5 font-semibold text-on-primary hover:bg-primary-container">
                  Save as Draft
                </button>
              </div>
            </form>
          )}

          {deletingAttraction && (
            <section aria-labelledby="delete-attraction-title" className="my-auto w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
              <div className="mb-4 flex items-start justify-between gap-4">
                <h2 id="delete-attraction-title" className="font-headline-md text-headline-md">Delete attraction?</h2>
                <button type="button" aria-label="Close delete confirmation" onClick={() => setDeletingAttraction(null)} className="rounded-lg p-2 text-outline hover:bg-surface-container">
                  <Icon name="close" />
                </button>
              </div>
              <p className="text-sm text-on-surface-variant">
                Remove <span className="font-semibold text-on-surface">{deletingAttraction.name}</span> from this demo listing?
              </p>
              <div className="mt-7 flex justify-end gap-3">
                <button type="button" onClick={() => setDeletingAttraction(null)} className="rounded-lg border border-outline-variant px-5 py-2.5 font-semibold text-on-surface-variant">
                  Keep listing
                </button>
                <button type="button" onClick={deleteListing} className="rounded-lg bg-error px-5 py-2.5 font-semibold text-on-error">
                  Delete
                </button>
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
