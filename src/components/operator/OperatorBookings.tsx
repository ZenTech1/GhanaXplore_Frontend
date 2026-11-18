'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { operatorBookings, type BookingStatus } from '@/components/operator/operatorBookingData';

const statusStyles: Record<BookingStatus, string> = {
  Confirmed: 'bg-primary/10 text-primary',
  Pending: 'bg-secondary-container text-on-secondary-container',
  'Checked In': 'bg-surface-container-highest text-on-surface-variant',
  Completed: 'bg-surface-container-highest text-on-surface-variant',
  Cancelled: 'bg-error-container text-on-error-container',
};

function Icon({ name, className = '' }: { name: string; className?: string }) {
  return <span aria-hidden="true" className={`material-symbols-outlined ${className}`}>{name}</span>;
}

function formatDate(date: string, options?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat('en', options ?? { month: 'short', day: 'numeric', year: 'numeric' })
    .format(new Date(`${date}T12:00:00`));
}

function formatAmount(amount: number) {
  return `GHS ${amount.toLocaleString('en-GH', { minimumFractionDigits: 2 })}`;
}

export function OperatorBookings() {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All statuses');
  const [attractionFilter, setAttractionFilter] = useState('All attractions');
  const [notice, setNotice] = useState('');

  const attractions = useMemo(() => [...new Set(operatorBookings.map((booking) => booking.attraction))], []);
  const filteredBookings = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return operatorBookings.filter((booking) => {
      const matchesQuery =
        !normalizedQuery ||
        [booking.guest, booking.id, booking.email, booking.attraction, booking.experience]
          .join(' ')
          .toLowerCase()
          .includes(normalizedQuery);
      return (
        matchesQuery &&
        (statusFilter === 'All statuses' || booking.status === statusFilter) &&
        (attractionFilter === 'All attractions' || booking.attraction === attractionFilter)
      );
    });
  }, [attractionFilter, query, statusFilter]);
  const pendingCount = operatorBookings.filter((booking) => booking.status === 'Pending').length;
  const arrivingToday = operatorBookings.filter(
    (booking) => booking.date === '2024-10-24' && booking.status !== 'Cancelled',
  ).length;

  function exportBookings() {
    const columns = ['Booking ID', 'Guest', 'Email', 'Attraction', 'Experience', 'Date', 'Time', 'Guests', 'Amount (GHS)', 'Status'];
    const rows = filteredBookings.map((booking) => [
      booking.id,
      booking.guest,
      booking.email,
      booking.attraction,
      booking.experience,
      booking.date,
      booking.time,
      String(booking.guests),
      booking.amount.toFixed(2),
      booking.status,
    ]);
    const csv = [columns, ...rows]
      .map((row) => row.map((value) => `"${value.replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ghanaxplore-bookings.csv';
    link.click();
    URL.revokeObjectURL(url);
  }

  function clearFilters() {
    setQuery('');
    setStatusFilter('All statuses');
    setAttractionFilter('All attractions');
  }

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-outline-variant/20 bg-surface-container-low p-4 lg:flex">
        <Link href="/dashboard" className="mb-8 px-3 py-4 font-headline-md text-headline-md font-bold text-primary">
          GhanaXplore
        </Link>
        <nav aria-label="Operator navigation" className="flex flex-col gap-1">
          {[
            { label: 'Dashboard', icon: 'dashboard', href: '/dashboard' },
            { label: 'Attractions', icon: 'landscape', href: '/operator/attractions' },
            { label: 'Bookings', icon: 'calendar_month', href: '/operator/bookings' },
            { label: 'Analytics', icon: 'analytics', href: '/operator/analytics' },
          ].map((item) => {
            const active = item.label === 'Bookings';
            return (
              <Link
                key={item.label}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={`flex items-center gap-4 rounded-xl px-4 py-3 transition-colors ${
                  active
                    ? 'bg-primary-container font-bold text-on-primary-container'
                    : 'text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                <Icon name={item.icon} />
                <span className="font-label-lg">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto border-t border-outline-variant/20 p-3">
          <p className="font-label-lg font-bold">Kwame Mensah</p>
          <p className="text-xs text-on-surface-variant">Labadi Beach Resort</p>
        </div>
      </aside>

      <header className="fixed inset-x-0 top-0 z-30 flex h-16 items-center justify-between border-b border-outline-variant/20 bg-surface/90 px-4 backdrop-blur-xl lg:left-64 lg:h-20 lg:px-8">
        <Link href="/dashboard" className="font-headline-md text-headline-md font-bold text-primary lg:hidden">
          GhanaXplore
        </Link>
        <div className="hidden w-full max-w-sm items-center gap-3 rounded-full bg-surface-container px-5 py-3 lg:flex">
          <Icon name="search" className="text-on-surface-variant" />
          <input
            aria-label="Search bookings"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search bookings or attractions..."
            className="w-full bg-transparent text-label-lg outline-none placeholder:text-on-surface-variant/60"
          />
        </div>
        <button
          type="button"
          aria-label="Notifications"
          onClick={() => setNotice('You are all caught up on notifications.')}
          className="ml-auto rounded-full p-2 text-on-surface-variant hover:bg-surface-container-high hover:text-primary"
        >
          <Icon name="notifications" />
        </button>
        <div className="ml-4 hidden items-center gap-3 border-l border-outline-variant/30 pl-5 lg:flex">
          <div className="text-right">
            <p className="font-label-lg leading-tight">Kwame Mensah</p>
            <p className="text-label-sm text-on-surface-variant">Port Authority</p>
          </div>
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-on-primary">
            <Icon name="person" />
          </span>
        </div>
      </header>

      <main className="min-h-screen pb-28 pt-16 lg:ml-64 lg:pb-10 lg:pt-20">
        <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
          {notice && (
            <div role="status" className="mb-5 flex items-center justify-between rounded-xl bg-primary/5 px-4 py-3 text-sm text-primary">
              {notice}
              <button type="button" aria-label="Dismiss notification" onClick={() => setNotice('')}>
                <Icon name="close" />
              </button>
            </div>
          )}

          <section aria-labelledby="bookings-title" className="mb-6 space-y-5 lg:mb-8 lg:space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="mb-1 text-label-sm font-bold uppercase tracking-widest text-primary">Operator Console</p>
                <h1 id="bookings-title" className="font-display-lg-mobile text-display-lg-mobile text-on-surface sm:text-[44px] sm:leading-tight">
                  Booking Management
                </h1>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setNotice('Manual booking creation is not connected in this demo.')}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-label-lg text-on-primary shadow-sm transition-colors hover:bg-primary/90 sm:flex-none sm:px-5"
                >
                  <Icon name="add" className="text-xl" />
                  Create Manual Booking
                </button>
                <button
                  type="button"
                  aria-label="Export bookings as CSV"
                  onClick={exportBookings}
                  className="hidden rounded-xl bg-surface-container px-3 py-3 text-on-surface-variant hover:bg-surface-container-high sm:block"
                >
                  <Icon name="download" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5">
              <article className="rounded-2xl bg-surface-container-low p-4 sm:rounded-3xl sm:p-6">
                <p className="text-xs font-semibold text-on-surface-variant sm:text-label-lg">Total Reservations</p>
                <p className="mt-2 font-headline-md text-2xl text-on-surface sm:text-display-lg">1,428</p>
              </article>
              <article className="rounded-2xl bg-primary-container p-4 text-on-primary-container sm:rounded-3xl sm:p-6">
                <p className="text-xs font-semibold text-on-primary-container/80 sm:text-label-lg">Arriving Today</p>
                <div className="mt-2 flex items-center gap-2">
                  <p className="font-headline-md text-2xl sm:text-display-lg">{arrivingToday}</p>
                  <span className="rounded bg-on-primary-container/10 px-2 py-1 text-[10px] font-bold uppercase">Live now</span>
                </div>
              </article>
              <article className="col-span-2 rounded-2xl border border-secondary/20 bg-secondary-container p-4 text-on-secondary-container sm:col-span-1 sm:rounded-3xl sm:p-6">
                <p className="text-xs font-semibold text-on-secondary-container/80 sm:text-label-lg">Pending Confirmation</p>
                <p className="mt-2 font-headline-md text-2xl sm:text-display-lg">{String(pendingCount).padStart(2, '0')}</p>
              </article>
            </div>
          </section>

          <section aria-label="Search and filter bookings" className="mb-5 rounded-2xl bg-surface-container-lowest p-3 shadow-sm sm:p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <div className="flex h-12 items-center gap-3 rounded-xl bg-surface-container-low px-4 lg:flex-1">
                <Icon name="search" className="text-on-surface-variant" />
                <input
                  aria-label="Search by guest, booking ID, or email"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search by Guest Name, Booking ID, or Email..."
                  className="w-full bg-transparent text-body-md outline-none placeholder:text-on-surface-variant/60"
                />
              </div>
              <div className="grid grid-cols-2 gap-2 lg:flex">
                <label className="sr-only" htmlFor="booking-attraction">Attraction</label>
                <select
                  id="booking-attraction"
                  value={attractionFilter}
                  onChange={(event) => setAttractionFilter(event.target.value)}
                  className="min-w-0 rounded-lg bg-surface-container px-3 py-3 text-sm text-on-surface-variant outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option>All attractions</option>
                  {attractions.map((attraction) => <option key={attraction}>{attraction}</option>)}
                </select>
                <label className="sr-only" htmlFor="booking-status">Status</label>
                <select
                  id="booking-status"
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="rounded-lg bg-surface-container px-3 py-3 text-sm text-on-surface-variant outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option>All statuses</option>
                  {(['Confirmed', 'Pending', 'Checked In', 'Completed', 'Cancelled'] as BookingStatus[]).map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="col-span-2 px-2 py-2 text-left text-sm font-semibold text-primary hover:underline lg:col-span-1"
                >
                  Clear filters
                </button>
              </div>
            </div>
          </section>

          <section aria-label="Booking results" className="overflow-hidden rounded-2xl border border-outline-variant/10 bg-surface-container-lowest shadow-sm sm:rounded-3xl">
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[900px] border-collapse text-left">
                <thead className="bg-surface-container-low">
                  <tr>
                    {['Guest', 'Attraction', 'Date & Time', 'Guests', 'Amount', 'Status', ''].map((heading) => (
                      <th key={heading} scope="col" className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant lg:px-6">
                        {heading || <span className="sr-only">Actions</span>}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id} className="transition-colors hover:bg-surface">
                      <td className="px-5 py-4 lg:px-6">
                        <div className="flex items-center gap-3">
                          <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${booking.avatarClass}`}>{booking.initials}</span>
                          <div className="min-w-0">
                            <p className="truncate font-label-lg">{booking.guest}</p>
                            <p className="text-xs text-on-surface-variant">#{booking.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 lg:px-6">
                        <p>{booking.attraction}</p>
                        <p className="text-xs text-primary">{booking.experience}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p>{formatDate(booking.date)}</p>
                        <p className="text-xs text-on-surface-variant">{booking.time}</p>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <p>{booking.guests}</p>
                        <p className="text-xs text-on-surface-variant">{booking.guestBreakdown}</p>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 font-semibold">{formatAmount(booking.amount)}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[booking.status]}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Link
                          href={`/operator/bookings/${booking.id}`}
                          className="rounded-lg bg-surface-container-high px-4 py-2 text-sm font-semibold hover:bg-outline-variant/30"
                        >
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-3 p-3 lg:hidden">
              {filteredBookings.map((booking) => (
                <article key={booking.id} className="flex flex-col gap-3 rounded-xl bg-surface-container-lowest p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex min-w-0 gap-3">
                      <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${booking.avatarClass}`}>{booking.initials}</span>
                      <div className="min-w-0">
                        <h2 className="truncate font-label-lg">{booking.guest}</h2>
                        <p className="flex items-center gap-1 truncate text-xs text-on-surface-variant">
                          <Icon name="location_on" className="text-sm" />
                          {booking.experience}
                        </p>
                        <p className="mt-1 text-xs text-on-surface-variant">#{booking.id}</p>
                      </div>
                    </div>
                    <span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-bold uppercase ${statusStyles[booking.status]}`}>
                      {booking.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2 border-t border-surface-container-highest/60 pt-3">
                    <div className="flex min-w-0 flex-wrap gap-x-3 gap-y-1 text-xs">
                      <span className="flex items-center gap-1"><Icon name="calendar_today" className="text-base text-primary" />{formatDate(booking.date, { month: 'short', day: 'numeric' })}, {booking.time}</span>
                      <span className="flex items-center gap-1"><Icon name="group" className="text-base text-primary" />{booking.guests} guests</span>
                    </div>
                    <Link
                      aria-label={`View details for booking ${booking.id}`}
                      href={`/operator/bookings/${booking.id}`}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-container"
                    >
                      <Icon name="chevron_right" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {filteredBookings.length === 0 && (
              <div className="px-6 py-16 text-center">
                <Icon name="event_busy" className="mb-3 text-4xl text-outline" />
                <h2 className="font-headline-md text-on-surface">No bookings found</h2>
                <p className="mt-1 text-sm text-on-surface-variant">Try changing your search or filters.</p>
              </div>
            )}

            <div className="flex items-center justify-between gap-3 border-t border-outline-variant/10 bg-surface-container-low/30 px-4 py-4 sm:px-6">
              <p className="text-xs text-on-surface-variant">
                Showing {filteredBookings.length ? 1 : 0}–{filteredBookings.length} of {filteredBookings.length} bookings
              </p>
              <button type="button" onClick={exportBookings} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-primary hover:bg-surface-container sm:hidden">
                <Icon name="download" />
                Export
              </button>
              <p className="hidden text-xs text-on-surface-variant sm:block">Demo data</p>
            </div>
          </section>
        </div>
      </main>

      <nav aria-label="Mobile operator navigation" className="fixed bottom-0 z-50 flex w-full justify-around border-t border-outline-variant/20 bg-surface/90 px-2 pt-2 shadow-[0_-1px_8px_rgba(0,0,0,0.04)] [padding-bottom:max(0.5rem,env(safe-area-inset-bottom))] lg:hidden">
        {[
          { label: 'Dashboard', icon: 'dashboard', href: '/dashboard' },
          { label: 'Bookings', icon: 'calendar_month', href: '/operator/bookings' },
          { label: 'Analytics', icon: 'analytics', href: '/operator/analytics' },
          { label: 'Attractions', icon: 'landscape', href: '/operator/attractions' },
          { label: 'Profile', icon: 'person', href: '/dashboard#profile' },
        ].map((item) => {
          const active = item.label === 'Bookings';
          return (
            <Link
              key={item.label}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={`flex min-w-[64px] flex-col items-center justify-center gap-1 rounded-xl px-3 py-2 ${
                active ? 'font-bold text-primary' : 'text-on-surface-variant'
              }`}
            >
              <Icon name={item.icon} />
              <span className="text-[10px]">{item.label}</span>
            </Link>
          );
        })}
      </nav>

    </div>
  );
}
