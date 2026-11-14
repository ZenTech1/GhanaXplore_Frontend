'use client';

import { useState } from 'react';

type BookingStatus = 'Confirmed' | 'Pending' | 'Cancelled';

interface Booking {
  id: string;
  visitor: string;
  initials: string;
  attraction: string;
  date: string;
  amount: string;
  status: BookingStatus;
  avatarClass: string;
}

const initialBookings: Booking[] = [
  {
    id: 'BK-1248',
    visitor: 'Abena Mansa',
    initials: 'AM',
    attraction: 'Kakum Canopy Walk',
    date: 'Aug 14, 2024',
    amount: '₵150.00',
    status: 'Confirmed',
    avatarClass: 'bg-secondary-container/20 text-secondary',
  },
  {
    id: 'BK-1247',
    visitor: 'John Doe',
    initials: 'JD',
    attraction: 'Elmina Castle Tour',
    date: 'Aug 15, 2024',
    amount: '₵200.00',
    status: 'Pending',
    avatarClass: 'bg-tertiary-container/20 text-tertiary',
  },
  {
    id: 'BK-1246',
    visitor: 'Sarah Appiah',
    initials: 'SA',
    attraction: 'Mole Safari Park',
    date: 'Aug 12, 2024',
    amount: '₵320.00',
    status: 'Cancelled',
    avatarClass: 'bg-error-container/40 text-error',
  },
  {
    id: 'BK-1245',
    visitor: 'Elena Grant',
    initials: 'EG',
    attraction: 'Kakum Canopy Walk',
    date: 'Aug 11, 2024',
    amount: '₵150.00',
    status: 'Confirmed',
    avatarClass: 'bg-primary-fixed/50 text-on-primary-fixed-variant',
  },
];

const operatorNavigation = [
  { label: 'Dashboard', icon: 'dashboard', href: '#dashboard', section: true },
  { label: 'Attractions', icon: 'landscape', href: '#attractions', section: false },
  { label: 'Bookings', icon: 'calendar_month', href: '#recent-bookings', section: true },
  { label: 'Analytics', icon: 'analytics', href: '#analytics', section: true },
  { label: 'Settings', icon: 'settings', href: '#', section: false },
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

function BookingStatusPill({ status }: { status: BookingStatus }) {
  const styles: Record<BookingStatus, string> = {
    Confirmed: 'bg-primary/10 text-primary',
    Pending: 'bg-secondary-container/20 text-on-secondary-container',
    Cancelled: 'bg-error/10 text-error',
  };
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${styles[status]}`}>
      {status}
    </span>
  );
}

export function OperatorDashboard() {
  const [bookings, setBookings] = useState(initialBookings);
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);
  const [showAllBookings, setShowAllBookings] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notice, setNotice] = useState('');
  const visibleBookings = showAllBookings ? bookings : bookings.slice(0, 3);

  function updateBookingStatus(id: string, status: BookingStatus) {
    setBookings((current) =>
      current.map((booking) => (booking.id === id ? { ...booking, status } : booking)),
    );
    setActionMenuId(null);
    setNotice(`Booking ${id} marked ${status.toLowerCase()} in this demo.`);
  }

  function scrollTo(sectionId: string) {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function handleNavigation(label: string, section: boolean) {
    if (section) return;
    setNotice(
      label === 'Attractions'
        ? 'Attraction management is not connected in this demo.'
        : `${label} is not available in this dashboard demo.`,
    );
    setIsMobileMenuOpen(false);
  }

  function bookingActions(booking: Booking) {
    return (
      <div className="relative">
        <button
          type="button"
          aria-label={`Actions for booking ${booking.id}`}
          aria-expanded={actionMenuId === booking.id}
          onClick={() => setActionMenuId((current) => (current === booking.id ? null : booking.id))}
          className="rounded-full p-2 text-outline transition-colors hover:bg-surface-container-high hover:text-primary"
        >
          <Icon name="more_vert" />
        </button>
        {actionMenuId === booking.id && (
          <div className="absolute right-0 top-full z-20 mt-1 min-w-40 rounded-xl border border-outline-variant bg-white p-1 shadow-xl">
            {booking.status === 'Pending' && (
              <button
                type="button"
                onClick={() => updateBookingStatus(booking.id, 'Confirmed')}
                className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-primary/5 hover:text-primary"
              >
                Mark confirmed
              </button>
            )}
            {booking.status !== 'Cancelled' && (
              <button
                type="button"
                onClick={() => updateBookingStatus(booking.id, 'Cancelled')}
                className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-error/5 hover:text-error"
              >
                Cancel booking
              </button>
            )}
            {booking.status === 'Cancelled' && (
              <p className="px-3 py-2 text-sm text-on-surface-variant">No actions available</p>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col gap-2 border-r border-outline-variant/20 bg-surface-container-low p-2 lg:flex">
        <div className="flex flex-col gap-3 px-4 py-6">
          <a href="/dashboard" className="font-headline-md text-headline-md font-bold text-primary">GhanaXplore</a>
          <span className="flex w-fit items-center gap-2 rounded-lg border border-primary/20 bg-primary-container/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-primary">
            <Icon name="verified" className="text-sm" filled />
            GTA Verified
          </span>
        </div>

        <nav aria-label="Operator navigation" className="flex flex-grow flex-col gap-1 overflow-y-auto px-2">
          {operatorNavigation.map((item) => {
            const active = item.label === 'Dashboard';
            const className = `flex items-center gap-4 rounded-xl px-4 py-3 text-left transition-all duration-200 ${
              active
                ? 'bg-primary-container font-bold text-on-primary-container'
                : 'text-on-surface-variant hover:bg-surface-variant'
            }`;
            const contents = (
              <>
                <Icon name={item.icon} filled={active} />
                <span className="font-label-lg">{item.label}</span>
              </>
            );
            return item.section ? (
              <a
                key={item.label}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={className}
              >
                {contents}
              </a>
            ) : (
              <button
                key={item.label}
                type="button"
                onClick={() => handleNavigation(item.label, item.section)}
                className={className}
              >
                {contents}
              </button>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-outline-variant/10 p-4">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-fixed font-bold text-primary">KM</span>
            <span className="flex min-w-0 flex-col">
              <span className="truncate font-label-lg font-bold text-on-surface">Kwame Mensah</span>
              <span className="truncate text-[10px] text-on-surface-variant">Labadi Beach Resort</span>
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              setNotice('Attraction management is not connected in this demo.');
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-secondary-container py-3 font-label-lg font-bold text-on-secondary-container transition-opacity hover:opacity-90"
          >
            <Icon name="add" />
            Add New Attraction
          </button>
        </div>
      </aside>

      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-outline-variant/30 bg-surface px-4 py-4 shadow-sm lg:hidden">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label={isMobileMenuOpen ? 'Close operator menu' : 'Open operator menu'}
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            className="text-on-surface-variant transition-colors hover:text-primary active:scale-95"
          >
            <Icon name={isMobileMenuOpen ? 'close' : 'menu'} />
          </button>
          <a href="/dashboard" className="font-headline-md text-headline-md font-bold tracking-tight text-primary">GhanaXplore</a>
        </div>
        <button
          type="button"
          aria-label="Notifications"
          onClick={() => setNotice('You are all caught up on notifications.')}
          className="relative text-on-surface-variant hover:text-primary"
        >
          <Icon name="notifications" />
          <span className="absolute right-0 top-0 h-2 w-2 rounded-full border-2 border-surface bg-error" />
        </button>
      </header>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-[60] bg-on-surface/40 lg:hidden"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsMobileMenuOpen(false);
          }}
        >
          <nav aria-label="Operator navigation" className="flex h-full w-[min(20rem,85vw)] flex-col bg-surface p-5 shadow-xl">
            <div className="mb-6 border-b border-outline-variant/50 pb-5">
              <p className="font-headline-md text-headline-md font-bold text-primary">GhanaXplore</p>
              <span className="mt-2 inline-flex items-center gap-2 rounded-lg bg-primary-container/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                <Icon name="verified" className="text-sm" filled />
                GTA Verified
              </span>
            </div>
            <div className="space-y-1">
              {operatorNavigation.map((item) => {
                const active = item.label === 'Dashboard';
                const className = `flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left ${
                  active ? 'bg-primary-container font-bold text-on-primary-container' : 'text-on-surface-variant hover:bg-surface-variant'
                }`;
                const contents = (
                  <>
                    <Icon name={item.icon} filled={active} />
                    {item.label}
                  </>
                );
                return item.section ? (
                  <a
                    key={item.label}
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={className}
                  >
                    {contents}
                  </a>
                ) : (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => handleNavigation(item.label, item.section)}
                    className={className}
                  >
                    {contents}
                  </button>
                );
              })}
            </div>
            <div className="mt-auto border-t border-outline-variant/30 pt-4">
              <p className="font-label-lg font-bold">Kwame Mensah</p>
              <p className="text-xs text-on-surface-variant">Labadi Beach Resort</p>
              <button
                type="button"
                onClick={() => {
                  setNotice('Attraction management is not connected in this demo.');
                  setIsMobileMenuOpen(false);
                }}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-secondary-container py-3 font-label-lg font-bold text-on-secondary-container"
              >
                <Icon name="add" />
                Add New Attraction
              </button>
            </div>
          </nav>
        </div>
      )}

      <main id="dashboard" className="min-h-screen bg-surface lg:ml-64 lg:h-screen lg:overflow-y-auto">
        <header className="sticky top-0 z-30 hidden items-center justify-between bg-surface/90 px-8 py-5 backdrop-blur-md xl:px-16 lg:flex">
          <div>
            <h1 className="font-headline-md text-headline-md text-on-surface">Operator Portal</h1>
            <p className="text-body-md text-on-surface-variant">Welcome back, your attractions are performing well today.</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              aria-label="Notifications"
              onClick={() => setNotice('You are all caught up on notifications.')}
              className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container-high"
            >
              <Icon name="notifications" />
            </button>
            <button
              type="button"
              onClick={() => setNotice('Date-range filtering is not connected in this demo.')}
              className="flex items-center gap-2 rounded-lg border border-outline-variant/20 bg-surface-container-highest px-4 py-2 font-label-lg text-on-surface"
            >
              <Icon name="calendar_today" className="text-sm" />
              Aug 12 - Aug 19
            </button>
          </div>
        </header>

        <div className="mx-auto max-w-[1600px] px-4 pb-32 pt-6 sm:px-6 lg:px-8 lg:pb-12 lg:pt-4 xl:px-16">
          <section aria-label="Operator welcome" className="mb-6 lg:hidden">
            <h1 className="mb-2 font-display-lg-mobile text-display-lg-mobile text-on-surface">Akwaaba, Kwame</h1>
            <p className="text-body-md leading-snug text-on-surface-variant">
              Welcome back, your attractions are performing well today.
            </p>
          </section>
          <div className="mb-6 flex items-center justify-between lg:hidden">
            <span className="text-label-sm text-on-surface-variant">Dashboard Overview</span>
            <button
              type="button"
              onClick={() => setNotice('Date-range filtering is not connected in this demo.')}
              className="flex items-center gap-1 rounded-lg bg-surface-container-highest px-3 py-2 text-xs font-semibold text-on-surface"
            >
              <Icon name="calendar_today" className="text-sm" />
              Aug 12 - Aug 19
            </button>
          </div>

          {notice && (
            <div role="status" className="mb-5 flex items-center justify-between gap-4 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-on-primary-fixed-variant">
              <span>{notice}</span>
              <button type="button" aria-label="Dismiss notification" onClick={() => setNotice('')} className="rounded p-1 hover:bg-primary/10">
                <Icon name="close" />
              </button>
            </div>
          )}

          <section id="analytics" aria-label="Performance metrics" className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6 lg:mb-12">
            <article className="flex flex-col justify-between rounded-xl border border-outline-variant/20 border-l-4 border-l-primary bg-white p-4 shadow-[0px_4px_20px_rgba(0,0,0,0.05)] sm:rounded-2xl sm:p-6">
              <div className="flex items-start justify-between gap-2">
                <Icon name="confirmation_number" className="rounded-lg bg-primary-container/10 p-2 text-primary" />
                <span className="flex items-center text-sm font-bold text-primary">+12% <Icon name="arrow_upward" className="text-xs" /></span>
              </div>
              <div className="mt-4">
                <h2 className="font-label-lg text-on-surface-variant">Total Bookings</h2>
                <p className="text-[28px] font-bold text-on-surface sm:text-[32px]">1,248</p>
              </div>
            </article>
            <article className="flex flex-col justify-between rounded-xl border border-outline-variant/20 border-l-4 border-l-secondary bg-white p-4 shadow-[0px_4px_20px_rgba(0,0,0,0.05)] sm:rounded-2xl sm:p-6">
              <div className="flex items-start justify-between gap-2">
                <Icon name="payments" className="rounded-lg bg-secondary-container/20 p-2 text-secondary" />
                <span className="flex items-center text-sm font-bold text-primary">+8.4% <Icon name="arrow_upward" className="text-xs" /></span>
              </div>
              <div className="mt-4">
                <h2 className="font-label-lg text-on-surface-variant">Revenue GHS</h2>
                <p className="text-[28px] font-bold text-on-surface sm:text-[32px]">₵42,900</p>
              </div>
            </article>
            <article className="col-span-2 flex flex-col justify-between rounded-xl border border-outline-variant/20 border-l-4 border-l-tertiary bg-white p-4 shadow-[0px_4px_20px_rgba(0,0,0,0.05)] sm:rounded-2xl sm:p-6 md:col-span-1">
              <div className="flex items-start justify-between gap-2">
                <Icon name="trending_up" className="rounded-lg bg-tertiary-container/10 p-2 text-tertiary" />
                <span className="flex items-center gap-1 text-xs font-bold text-tertiary">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-tertiary" />
                  Live Flow
                </span>
              </div>
              <div className="mt-4">
                <h2 className="font-label-lg text-on-surface-variant">Visitor Flow Trend</h2>
                <div aria-label="Visitor flow trending upward" className="mt-2 flex h-10 items-end gap-1">
                  {[
                    { height: '50%', color: 'bg-tertiary/20' },
                    { height: '75%', color: 'bg-tertiary/40' },
                    { height: '66%', color: 'bg-tertiary/60' },
                    { height: '100%', color: 'bg-tertiary' },
                    { height: '83%', color: 'bg-tertiary/80' },
                    { height: '100%', color: 'bg-tertiary/60' },
                  ].map((bar, index) => (
                    <span
                      key={index}
                      className={`w-full rounded-t-sm ${bar.color}`}
                      style={{ height: bar.height }}
                    />
                  ))}
                </div>
              </div>
            </article>
          </section>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-6">
            <section id="recent-bookings" aria-labelledby="bookings-heading" className="min-w-0 overflow-hidden rounded-2xl border border-primary/10 bg-white shadow-sm lg:col-span-2">
              <div className="flex items-center justify-between border-b border-outline-variant/20 px-5 py-5 sm:px-6">
                <h2 id="bookings-heading" className="font-headline-md text-lg text-on-surface">Recent Bookings</h2>
                <button
                  type="button"
                  onClick={() => setShowAllBookings((showingAll) => !showingAll)}
                  className="font-label-lg text-primary transition-colors hover:underline"
                >
                  {showAllBookings ? 'Show Less' : 'View All'}
                </button>
              </div>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[640px] text-left">
                  <thead className="bg-surface-container-low text-label-sm uppercase tracking-wider text-on-surface-variant">
                    <tr>
                      <th scope="col" className="px-6 py-4">Visitor</th>
                      <th scope="col" className="px-6 py-4">Attraction</th>
                      <th scope="col" className="px-6 py-4">Date</th>
                      <th scope="col" className="px-6 py-4">Status</th>
                      <th scope="col" className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10">
                    {visibleBookings.map((booking) => (
                      <tr key={booking.id} className="transition-colors hover:bg-surface-container-low">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <span className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${booking.avatarClass}`}>
                              {booking.initials}
                            </span>
                            <span className="text-body-md text-on-surface">{booking.visitor}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-on-surface-variant">{booking.attraction}</td>
                        <td className="px-6 py-4 text-on-surface-variant">{booking.date}</td>
                        <td className="px-6 py-4"><BookingStatusPill status={booking.status} /></td>
                        <td className="px-6 py-3 text-right">{bookingActions(booking)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="space-y-3 p-4 md:hidden">
                {visibleBookings.map((booking) => (
                  <article key={booking.id} className="flex items-center justify-between gap-3 rounded-2xl border border-outline-variant/10 bg-surface p-4 shadow-sm">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold ${booking.avatarClass}`}>
                        {booking.initials}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-label-lg text-on-surface">{booking.visitor}</p>
                        <p className="truncate text-xs text-on-surface-variant">{booking.attraction}</p>
                        <p className="mt-1 text-xs text-on-surface-variant">{booking.date}</p>
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-2">
                      <p className="font-label-lg font-semibold text-on-surface">{booking.amount}</p>
                      <BookingStatusPill status={booking.status} />
                      {bookingActions(booking)}
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <aside className="space-y-6">
              <section aria-labelledby="quick-actions-heading" className="rounded-2xl border border-primary/10 bg-white p-5 shadow-sm sm:p-6">
                <h2 id="quick-actions-heading" className="mb-4 font-label-lg font-bold text-on-surface">Quick Actions</h2>
                <div className="grid grid-cols-1 gap-3">
                  <button
                    type="button"
                    onClick={() => scrollTo('feedback')}
                    className="group flex w-full items-center gap-3 rounded-xl border border-outline-variant/30 p-4 text-left transition-all hover:border-primary hover:bg-primary/5"
                  >
                    <Icon name="reviews" className="text-primary transition-transform group-hover:scale-110" />
                    <span className="font-label-lg text-on-surface">View Reviews</span>
                    <span className="ml-auto rounded-full bg-primary px-2 py-0.5 text-[10px] text-on-primary">24 New</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNotice('Promotion management is not connected in this demo.')}
                    className="group flex w-full items-center gap-3 rounded-xl border border-outline-variant/30 p-4 text-left transition-all hover:border-primary hover:bg-primary/5"
                  >
                    <Icon name="campaign" className="text-primary transition-transform group-hover:scale-110" />
                    <span className="font-label-lg text-on-surface">Run Promotion</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNotice('GTA Support contact details are not configured in this demo.')}
                    className="group flex w-full items-center gap-3 rounded-xl border border-outline-variant/30 p-4 text-left transition-all hover:border-primary hover:bg-primary/5"
                  >
                    <Icon name="support_agent" className="text-primary transition-transform group-hover:scale-110" />
                    <span className="font-label-lg text-on-surface">GTA Support</span>
                  </button>
                </div>
              </section>

              <section id="feedback" aria-labelledby="feedback-heading" className="rounded-2xl border border-primary/10 bg-gradient-to-br from-primary/5 to-transparent p-5 shadow-sm sm:p-6">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <h2 id="feedback-heading" className="font-label-lg font-bold text-on-surface">Recent Feedback</h2>
                  <div aria-label="5 out of 5 stars" className="flex text-secondary-fixed-dim">
                    {Array.from({ length: 5 }, (_, index) => (
                      <Icon key={index} name="star" className="text-sm" filled />
                    ))}
                  </div>
                </div>
                <p className="mb-4 font-body-md italic text-on-surface-variant">
                  “The canopy walk was breathtaking! The guide was very knowledgeable about the ecosystem.”
                </p>
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-container/10 text-primary">
                    <Icon name="forest" />
                  </span>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-on-surface">Kakum National Park</span>
                    <span className="text-[10px] text-on-surface-variant">Reviewed by Elena G.</span>
                  </div>
                </div>
              </section>
            </aside>
          </div>

          <section id="attractions" aria-label="Add attraction" className="mt-8 lg:hidden">
            <button
              type="button"
              onClick={() => setNotice('Attraction management is not connected in this demo.')}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-secondary-container py-4 font-headline-md text-on-secondary-container shadow-md transition-transform active:scale-95"
            >
              <Icon name="add_circle" />
              Add New Attraction
            </button>
          </section>

          <footer className="mt-12 border-t border-outline-variant/30 py-8 lg:mt-section-gap">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <div className="flex flex-col items-center gap-1 md:items-start">
                <h2 className="font-headline-md text-lg font-bold text-primary">GhanaXplore</h2>
                <p className="text-center text-label-sm text-on-surface-variant md:text-left">
                  © 2024 GhanaXplore. In partnership with Ghana Tourism Authority.
                </p>
              </div>
              <nav aria-label="Footer navigation" className="flex flex-wrap justify-center gap-4 sm:gap-6">
                {['Support Center', 'GTA Partnership', 'Terms of Service', 'Privacy Policy'].map((label) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setNotice(`${label} information is not available in this demo.`)}
                    className="font-label-sm text-on-surface-variant transition-colors hover:text-primary"
                  >
                    {label}
                  </button>
                ))}
              </nav>
            </div>
          </footer>
        </div>
      </main>

      <nav
        aria-label="Mobile operator navigation"
        className="fixed bottom-0 z-50 flex w-full justify-around border-t border-outline-variant/20 bg-surface px-2 pt-3 shadow-[0px_-4px_20px_rgba(0,0,0,0.05)] [padding-bottom:max(0.75rem,env(safe-area-inset-bottom))] lg:hidden"
      >
        {[
          { label: 'Dashboard', icon: 'dashboard', href: '#dashboard', target: 'dashboard' },
          { label: 'Bookings', icon: 'calendar_month', href: '#recent-bookings', target: 'recent-bookings' },
          { label: 'Attractions', icon: 'landscape', href: '#attractions', target: 'attractions' },
          { label: 'Profile', icon: 'person', href: '#profile', target: 'profile' },
        ].map((item) => {
          const active = item.label === 'Dashboard';
          return (
            <a
              key={item.label}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              onClick={(event) => {
                if (item.target === 'profile') {
                  event.preventDefault();
                  setNotice('Profile settings are not available in this dashboard demo.');
                  return;
                }
                event.preventDefault();
                scrollTo(item.target);
              }}
              className={`flex min-w-[64px] flex-col items-center justify-center rounded-xl px-3 py-1 transition-all ${
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
