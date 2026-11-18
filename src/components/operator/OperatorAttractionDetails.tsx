'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  type Attraction,
  initialAttractions,
} from './operatorAttractionData';
import { getAttraction } from './operatorAttractionStorage';

const navigation = [
  { label: 'Dashboard', icon: 'dashboard', href: '/dashboard' },
  { label: 'Attractions', icon: 'landscape', href: '/operator/attractions' },
  { label: 'Bookings', icon: 'calendar_month', href: '/dashboard#recent-bookings' },
  { label: 'Analytics', icon: 'analytics', href: '/operator/analytics' },
  { label: 'Settings', icon: 'settings', href: '#' },
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

function formatBookings(bookings: number | null) {
  if (bookings === null) return '—';
  return bookings >= 1000 ? `${(bookings / 1000).toFixed(1)}k` : String(bookings);
}

function formatRevenue(revenue: number | null | undefined) {
  if (revenue == null) return '—';
  return `GH₵${new Intl.NumberFormat('en-GH', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(revenue)}`;
}

function statusStyle(attraction: Attraction) {
  switch (attraction.status) {
    case 'Live':
      return 'bg-primary text-on-primary';
    case 'Pending':
      return 'bg-secondary-container text-on-secondary-container';
    case 'Paused':
      return 'bg-surface-container-high text-on-surface-variant';
    case 'Draft':
      return 'bg-tertiary-container/20 text-tertiary';
  }
}

export function OperatorAttractionDetails({ id }: { id: string }) {
  const [attraction, setAttraction] = useState<Attraction | undefined>(
    () => initialAttractions.find((item) => item.id === id),
  );
  const [loadError, setLoadError] = useState('');
  const [openSections, setOpenSections] = useState({
    description: false,
    gallery: false,
    reviews: false,
  });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showAllReviews, setShowAllReviews] = useState(false);

  useEffect(() => {
    try {
      setAttraction(getAttraction(id));
    } catch (caught) {
      setLoadError(caught instanceof Error ? caught.message : 'Unable to load saved attraction edits.');
    }
  }, [id]);

  if (loadError) {
    return <div role="alert" className="p-8 text-center text-error">{loadError}</div>;
  }

  if (!attraction) {
    return (
      <div className="min-h-screen bg-surface px-6 py-20 text-center">
        <Icon name="location_off" className="text-5xl text-outline" />
        <h1 className="mt-4 font-headline-md text-headline-md">Attraction not found</h1>
        <p className="mt-2 text-on-surface-variant">This listing may have been removed or the link may be incorrect.</p>
        <Link
          href="/operator/attractions"
          className="mt-6 inline-flex rounded-xl bg-primary px-5 py-3 font-semibold text-on-primary"
        >
          Back to My Attractions
        </Link>
      </div>
    );
  }

  const gallery = attraction.gallery?.length ? attraction.gallery : attraction.image
    ? [{ src: attraction.image, alt: attraction.imageAlt }]
    : [];
  const reviews = attraction.reviews ?? [];
  const reviewCount = attraction.reviewCount ?? reviews.length;
  const name = attraction.detailTitle ?? attraction.name;
  const location = attraction.location;
  const description = attraction.description ?? '';

  function toggleSection(section: keyof typeof openSections) {
    setOpenSections((current) => ({ ...current, [section]: !current[section] }));
  }

  const statCards = [
    { label: 'Total Bookings', value: formatBookings(attraction.bookings), icon: 'confirmation_number' },
    { label: 'Average Rating', value: attraction.rating?.toFixed(1) ?? '—', icon: 'star' },
    { label: 'Revenue this month', value: formatRevenue(attraction.revenue), icon: 'payments' },
  ];

  const accordionButton = (
    title: string,
    subtitle: string,
    icon: string,
    expanded: boolean,
    onClick: () => void,
  ) => (
    <button
      type="button"
      aria-expanded={expanded}
      onClick={onClick}
      className="flex w-full items-center gap-4 px-5 py-4 text-left sm:px-6"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon name={icon} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-semibold text-on-surface">{title}</span>
        <span className="mt-0.5 block text-sm text-on-surface-variant">{subtitle}</span>
      </span>
      <Icon name={expanded ? 'expand_less' : 'expand_more'} className="text-on-surface-variant" />
    </button>
  );

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col bg-surface-container-low shadow-sm lg:flex">
        <Link href="/dashboard" className="flex flex-col gap-1 p-8">
          <span className="font-headline-md text-headline-md text-primary">GhanaXplore</span>
          <span className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">Operator Portal</span>
        </Link>
        <nav className="mt-4 flex-1 space-y-2 px-4" aria-label="Operator navigation">
          {navigation.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              aria-current={item.label === 'Attractions' ? 'page' : undefined}
              className={`flex items-center rounded-xl px-4 py-3 transition-colors ${
                item.label === 'Attractions'
                  ? 'bg-primary-container font-bold text-on-primary-container'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
            >
              <Icon name={item.icon} className="mr-3" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="min-h-screen lg:pl-72">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between bg-surface/90 px-4 shadow-sm backdrop-blur-xl sm:px-8 lg:h-20">
          <Link href="/operator/attractions" className="flex items-center gap-2 text-sm font-semibold text-on-surface-variant hover:text-primary">
            <Icon name="arrow_back" />
            <span className="hidden sm:inline">My Attractions</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden text-right sm:block">
              <span className="block text-sm font-medium">Kofi Mensah</span>
              <span className="block text-xs text-on-surface-variant">Operator</span>
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-on-primary">
              <Icon name="person" />
            </span>
          </div>
        </header>

        <main className="mx-auto max-w-[1440px] px-4 pb-32 pt-5 sm:px-8 sm:pt-8 lg:px-10 lg:pb-12">
          <div className="mb-5 flex flex-wrap items-center gap-2 text-sm text-on-surface-variant">
            <Link href="/operator/attractions" className="hover:text-primary">My Attractions</Link>
            <Icon name="chevron_right" className="text-base" />
            <span className="truncate text-on-surface">{name}</span>
          </div>

          <section aria-label={`${name} listing overview`} className="relative overflow-hidden rounded-3xl bg-surface-container-low">
            <div className="relative h-64 sm:h-80 lg:h-[440px]">
              {attraction.image ? (
                <img
                  src={attraction.image}
                  alt={attraction.imageAlt}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-primary/30 via-primary/10 to-secondary-container/60" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/20" />
              <span className="absolute left-4 top-4 rounded-full bg-black/45 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur sm:left-6 sm:top-6 sm:text-sm">
                {attraction.category}
              </span>
              <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-5 text-white sm:p-8 lg:flex-row lg:items-end lg:justify-between lg:p-10">
                <div>
                  <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ${statusStyle(attraction)}`}>
                    <span className="h-2 w-2 rounded-full bg-current" />
                    {attraction.status === 'Pending' ? 'Pending Verification' : attraction.status}
                  </span>
                  <h1 className="mt-3 font-headline-md text-3xl font-semibold sm:text-4xl lg:text-5xl">{name}</h1>
                  <p className="mt-2 flex items-center gap-1.5 text-sm text-white/85 sm:text-base">
                    <Icon name="location_on" />
                    {location}
                  </p>
                </div>
                <Link
                  href={`/operator/attractions/${id}/edit`}
                  className="hidden items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-primary shadow-lg transition hover:bg-primary-container hover:text-on-primary-container lg:inline-flex"
                >
                  <Icon name="edit" />
                  Edit Listing
                </Link>
              </div>
            </div>
          </section>

          <section id="attraction-analytics" aria-label="Performance summary" className="relative z-10 -mt-2 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4 lg:-mt-6 lg:px-8">
            {statCards.map((stat) => (
              <div key={stat.label} className="flex items-center gap-4 rounded-2xl bg-surface-container-low p-4 shadow-sm sm:p-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon name={stat.icon} filled={stat.icon === 'star'} />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">{stat.label}</p>
                  <p className="mt-1 truncate font-headline-md text-xl text-on-surface sm:text-2xl">{stat.value}</p>
                </div>
              </div>
            ))}
          </section>

          <div className="mt-7 grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.8fr)] lg:gap-8">
            <div className="space-y-4">
              <section className="overflow-hidden rounded-2xl bg-surface-container-low">
                {accordionButton(
                  'About this attraction',
                  'Description and visitor information',
                  'description',
                  openSections.description,
                  () => toggleSection('description'),
                )}
                {openSections.description && (
                  <div className="border-t border-outline-variant/30 px-5 py-5 text-sm leading-7 text-on-surface-variant sm:px-6">
                    {description || 'No description has been added to this listing yet.'}
                  </div>
                )}
              </section>

              <section className="overflow-hidden rounded-2xl bg-surface-container-low">
                {accordionButton(
                  'Photo gallery',
                  `${gallery.length} listing ${gallery.length === 1 ? 'photo' : 'photos'}`,
                  'photo_library',
                  openSections.gallery,
                  () => toggleSection('gallery'),
                )}
                {openSections.gallery && (
                  <div className="grid grid-cols-2 gap-3 border-t border-outline-variant/30 p-4 sm:grid-cols-3 sm:p-5">
                    {gallery.length ? gallery.map((image, index) => (
                      <button
                        key={`${image.src}-${index}`}
                        type="button"
                        onClick={() => setSelectedImage(image.src)}
                        aria-label={`View photo: ${image.alt}`}
                        className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-surface-container"
                      >
                        <img src={image.src} alt={image.alt} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                        <span className="absolute inset-0 flex items-center justify-center bg-black/0 text-white opacity-0 transition group-hover:bg-black/25 group-hover:opacity-100">
                          <Icon name="zoom_in" />
                        </span>
                      </button>
                    )) : (
                      <p className="col-span-full py-4 text-sm text-on-surface-variant">No photos have been added to this listing yet.</p>
                    )}
                  </div>
                )}
              </section>

              <section className="overflow-hidden rounded-2xl bg-surface-container-low">
                {accordionButton(
                  'Visitor reviews',
                  `${reviewCount} reviews${attraction.rating ? ` · ${attraction.rating.toFixed(1)} average rating` : ''}`,
                  'reviews',
                  openSections.reviews,
                  () => toggleSection('reviews'),
                )}
                {openSections.reviews && (
                  <div className="border-t border-outline-variant/30 px-4 py-2 sm:px-5">
                    {reviews.length ? (
                      <>
                        {(showAllReviews ? reviews : reviews.slice(0, 2)).map((review) => (
                          <article key={review.id} className="border-b border-outline-variant/30 py-4 last:border-b-0">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <h3 className="font-semibold">{review.author}</h3>
                                <div className="mt-1 flex items-center gap-0.5 text-secondary" aria-label={`${review.rating} out of 5 stars`}>
                                  {Array.from({ length: 5 }, (_, index) => (
                                    <Icon key={index} name="star" className="text-base" filled={index < review.rating} />
                                  ))}
                                </div>
                              </div>
                              <span className="text-xs text-on-surface-variant">Verified visitor</span>
                            </div>
                            <p className="mt-3 text-sm leading-6 text-on-surface-variant">{review.text}</p>
                          </article>
                        ))}
                        {reviewCount > reviews.length && (
                          <button
                            type="button"
                            onClick={() => setShowAllReviews((show) => !show)}
                            className="my-3 font-semibold text-primary hover:underline"
                          >
                            {showAllReviews ? 'Show recent reviews' : `View all ${reviewCount} reviews`}
                          </button>
                        )}
                      </>
                    ) : (
                      <p className="py-5 text-sm text-on-surface-variant">Reviews will appear here after visitors share their experience.</p>
                    )}
                  </div>
                )}
              </section>
            </div>

            <aside className="h-fit rounded-2xl bg-surface-container-low p-5 sm:p-6">
              <h2 className="font-headline-md text-headline-md">Listing details</h2>
              <dl className="mt-5 divide-y divide-outline-variant/30">
                <div className="flex justify-between gap-4 py-3">
                  <dt className="text-sm text-on-surface-variant">Category</dt>
                  <dd className="text-right text-sm font-semibold">{attraction.category}</dd>
                </div>
                <div className="flex justify-between gap-4 py-3">
                  <dt className="text-sm text-on-surface-variant">Region</dt>
                  <dd className="text-right text-sm font-semibold">{location}</dd>
                </div>
                <div className="flex justify-between gap-4 py-3">
                  <dt className="text-sm text-on-surface-variant">Listing status</dt>
                  <dd className="text-right text-sm font-semibold">{attraction.status}</dd>
                </div>
              </dl>
              <Link
                href={`/operator/attractions/${id}/edit`}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-primary px-4 py-3 font-semibold text-primary transition hover:bg-primary hover:text-on-primary"
              >
                <Icon name="edit" />
                Edit listing details
              </Link>
            </aside>
          </div>
        </main>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-3 border-t border-outline-variant/40 bg-surface/95 p-4 backdrop-blur lg:hidden">
        <button
          type="button"
          onClick={() => document.getElementById('attraction-analytics')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-surface-container-high text-on-surface-variant"
          aria-label="View performance summary"
        >
          <Icon name="analytics" />
        </button>
        <Link href={`/operator/attractions/${id}/edit`} className="flex-1 rounded-xl bg-primary px-4 py-3 text-center font-semibold text-on-primary">
          Edit Listing
        </Link>
      </div>

      {selectedImage && (
        <div
          role="presentation"
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
        >
          <button type="button" aria-label="Close photo" onClick={() => setSelectedImage(null)} className="absolute right-4 top-4 rounded-full bg-white/10 p-3 text-white">
            <Icon name="close" />
          </button>
          <img src={selectedImage} alt="Selected attraction gallery photo" className="max-h-[90vh] max-w-full rounded-xl object-contain" />
        </div>
      )}
    </div>
  );
}
