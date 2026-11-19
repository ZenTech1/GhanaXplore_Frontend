'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { Booking, BookingStatus } from '@/components/operator/operatorBookingData';

function Icon({ name, className = '' }: { name: string; className?: string }) {
  return <span aria-hidden="true" className={`material-symbols-outlined ${className}`}>{name}</span>;
}

function formatDate(date: string, options?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat('en', options ?? { month: 'short', day: 'numeric', year: 'numeric' })
    .format(new Date(`${date}T12:00:00`));
}

function formatTime(time: string) {
  const [hours, minutes] = time.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit' }).format(date);
}

function formatAmount(amount: number) {
  return `GHS ${amount.toLocaleString('en-GH', { minimumFractionDigits: 2 })}`;
}

function statusStyle(status: BookingStatus) {
  if (status === 'Confirmed') return 'bg-primary-container/20 text-primary';
  if (status === 'Pending') return 'bg-secondary-container text-on-secondary-container';
  if (status === 'Cancelled') return 'bg-error-container text-on-error-container';
  return 'bg-surface-container-highest text-on-surface-variant';
}

function BookingQrPreview() {
  return (
    <div
      role="img"
      aria-label="Decorative booking QR preview; scanning is unavailable in this demo"
      className="relative grid h-48 w-48 grid-cols-12 grid-rows-12 gap-1 overflow-hidden rounded-xl border-2 border-dashed border-outline-variant bg-white p-3"
    >
      {Array.from({ length: 144 }, (_, index) => {
        const row = Math.floor(index / 12);
        const column = index % 12;
        const isFinder = (row < 4 && column < 4) || (row < 4 && column > 7) || (row > 7 && column < 4);
        const isPattern = (row * 7 + column * 11 + row * column) % 4 < 2;
        return (
          <span
            key={index}
            className={`rounded-[2px] ${isFinder || isPattern ? 'bg-primary' : 'bg-transparent'}`}
          />
        );
      })}
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-primary shadow-sm">
          <Icon name="qr_code_2" className="text-4xl" />
        </span>
      </span>
    </div>
  );
}

export function OperatorBookingDetails({ booking }: { booking: Booking }) {
  const [status, setStatus] = useState<BookingStatus>(booking.status);
  const [notice, setNotice] = useState('');
  const canCheckIn = status === 'Confirmed';

  function cancelBooking() {
    if (status === 'Cancelled' || status === 'Completed') return;
    if (!window.confirm(`Cancel demo booking #${booking.id}?`)) return;
    setStatus('Cancelled');
    setNotice('Booking cancelled in this demo.');
  }

  function checkInGuest() {
    if (!canCheckIn) return;
    setStatus('Checked In');
    setNotice(`${booking.guest} has been checked in.`);
  }

  const guestActions = (
    <div className="flex gap-3">
      <a
        href={`tel:${booking.phone.replace(/[^\d+]/g, '')}`}
        aria-label={`Call ${booking.guest}`}
        className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-container-highest text-primary transition-transform active:scale-90"
      >
        <Icon name="call" />
      </a>
      <a
        href={`mailto:${booking.email}`}
        aria-label={`Email ${booking.guest}`}
        className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-container-highest text-primary transition-transform active:scale-90"
      >
        <Icon name="chat_bubble" />
      </a>
      <button
        type="button"
        aria-label="Share booking"
        onClick={() => setNotice(`Booking #${booking.id} is ready to share.`)}
        className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-container-highest text-primary transition-transform active:scale-90"
      >
        <Icon name="share" />
      </button>
    </div>
  );

  const checkInButton = (
    <button
      type="button"
      onClick={checkInGuest}
      disabled={!canCheckIn}
      className={`flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 font-label-lg font-bold shadow-lg transition-all ${
        canCheckIn
          ? 'bg-secondary-container text-on-secondary-container hover:brightness-95 active:scale-[0.98]'
          : 'cursor-not-allowed bg-surface-container-high text-on-surface-variant'
      }`}
    >
      <Icon name={status === 'Checked In' ? 'verified' : 'check_circle'} />
      {status === 'Checked In' ? 'Guest Checked In' : canCheckIn ? 'Check-in Guest' : status}
    </button>
  );

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-outline-variant/20 bg-surface-container-low p-4 lg:flex">
        <Link href="/dashboard" className="mb-8 px-3 py-4 font-headline-md text-headline-md font-bold text-primary">GhanaXplore</Link>
        <nav aria-label="Operator navigation" className="flex flex-col gap-1">
          {[
            { label: 'Dashboard', icon: 'dashboard', href: '/dashboard' },
            { label: 'Attractions', icon: 'landscape', href: '/operator/attractions' },
            { label: 'Bookings', icon: 'calendar_month', href: '/operator/bookings' },
            { label: 'Analytics', icon: 'analytics', href: '/operator/analytics' },
            { label: 'Settings', icon: 'settings', href: '/operator/settings' },
          ].map((item) => {
            const active = item.label === 'Bookings';
            return (
              <Link
                key={item.label}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={`flex items-center gap-4 rounded-xl px-4 py-3 transition-colors ${
                  active ? 'bg-primary-container font-bold text-on-primary-container' : 'text-on-surface-variant hover:bg-surface-container-high'
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
        <div className="flex items-center gap-3">
          <Link href="/operator/bookings" aria-label="Back to bookings" className="rounded-full p-2 text-on-surface-variant hover:bg-surface-container-high lg:hidden">
            <Icon name="arrow_back" />
          </Link>
          <Link href="/dashboard" className="font-headline-md text-headline-md font-bold text-primary lg:hidden">GhanaXplore</Link>
        </div>
        <div className="hidden items-center gap-3 lg:flex">
          <Icon name="search" className="text-on-surface-variant" />
          <span className="text-sm text-on-surface-variant">Operator Portal</span>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" aria-label="Notifications" onClick={() => setNotice('You are all caught up on notifications.')} className="rounded-full p-2 text-on-surface-variant hover:bg-surface-container-high">
            <Icon name="notifications" />
          </button>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-on-primary">
            <Icon name="person" />
          </span>
        </div>
      </header>

      <main className="min-h-screen pb-64 pt-16 lg:ml-64 lg:pb-10 lg:pt-20">
        <div className="mx-auto max-w-[1600px]">
          <div className="hidden items-center justify-between px-8 py-8 xl:px-16 lg:flex">
            <div className="flex items-center gap-6">
              <Link href="/operator/bookings" className="group flex items-center gap-2 text-on-surface-variant transition-colors hover:text-primary">
                <Icon name="arrow_back" className="transition-transform group-hover:-translate-x-1" />
                <span className="font-label-lg">Back to Bookings</span>
              </Link>
              <span className="h-8 w-px bg-outline-variant/30" />
              <div>
                <h1 className="font-headline-lg text-headline-lg tracking-tight">Booking ID: #{booking.id}</h1>
                <p className="mt-1 text-label-sm uppercase tracking-widest text-on-surface-variant">{status} Reservation</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => window.print()} className="flex items-center gap-2 rounded-xl border border-outline-variant px-4 py-2.5 font-label-lg hover:bg-surface-container">
                <Icon name="print" />
                Print Receipt
              </button>
              <button type="button" onClick={() => setNotice('Rescheduling is not connected in this demo.')} className="flex items-center gap-2 rounded-xl border border-outline-variant px-4 py-2.5 font-label-lg hover:bg-surface-container">
                <Icon name="event_repeat" />
                Reschedule
              </button>
            </div>
          </div>

          <div className="px-4 pt-5 sm:px-6 lg:hidden">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Booking ID: #{booking.id}</p>
                <span className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase ${statusStyle(status)}`}>Status: {status}</span>
              </div>
              {guestActions}
            </div>
          </div>

          {notice && (
            <div role="status" aria-live="polite" className="mx-4 mt-4 flex items-center justify-between gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-primary sm:mx-6 lg:mx-8">
              <span>{notice}</span>
              <button type="button" aria-label="Dismiss notification" onClick={() => setNotice('')} className="shrink-0 rounded p-1 hover:bg-primary/10"><Icon name="close" /></button>
            </div>
          )}

          <div className="grid grid-cols-1 items-start gap-6 px-4 pb-8 pt-5 sm:px-6 lg:grid-cols-12 lg:gap-6 lg:px-8 lg:pb-12 lg:pt-0 xl:gap-8 xl:px-16">
            <div className="space-y-5 lg:col-span-8 lg:space-y-6">
              <section aria-labelledby="guest-name" className="relative flex flex-col gap-5 overflow-hidden rounded-3xl bg-surface-container-low p-5 shadow-sm sm:flex-row sm:items-center sm:gap-6 sm:p-7">
                <span className="absolute right-5 top-5 hidden items-center gap-2 rounded-full bg-secondary-container px-3 py-1.5 text-xs font-bold text-on-secondary-container sm:inline-flex">
                  <Icon name="workspace_premium" className="text-base" />
                  {booking.visitCount}{booking.visitCount === 1 ? 'st' : 'th'} Visit · {booking.memberTier}
                </span>
                <span className={`flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl text-2xl font-bold shadow-lg sm:h-32 sm:w-32 ${booking.avatarClass}`}>
                  {booking.initials}
                </span>
                <div className="min-w-0 flex-1">
                  <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-secondary-container px-3 py-1 text-xs font-bold text-on-secondary-container sm:hidden">
                    <Icon name="workspace_premium" className="text-sm" />
                    {booking.memberTier}
                  </span>
                  <h2 id="guest-name" className="mb-3 font-headline-md text-headline-md">{booking.guest}</h2>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5">
                    <div className="min-w-0">
                      <p className="text-xs font-bold uppercase tracking-wide text-on-surface-variant">Email Address</p>
                      <a href={`mailto:${booking.email}`} className="break-all text-sm hover:text-primary">{booking.email}</a>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-on-surface-variant">Phone Number</p>
                      <a href={`tel:${booking.phone.replace(/[^\d+]/g, '')}`} className="text-sm hover:text-primary">{booking.phone}</a>
                    </div>
                  </div>
                </div>
              </section>

              <section aria-labelledby="experience-title" className="group overflow-hidden rounded-3xl bg-surface-container-lowest shadow-md">
                <div className="relative flex min-h-64 items-end overflow-hidden bg-gradient-to-br from-primary via-primary-container to-tertiary p-5 sm:min-h-80 sm:p-8">
                  <div aria-hidden="true" className="absolute inset-0 opacity-15">
                    <div className="absolute -right-10 -top-20 h-72 w-72 rounded-full border-[32px] border-white/40" />
                    <div className="absolute -bottom-28 left-1/4 h-72 w-72 rounded-full border-[24px] border-white/30" />
                    <Icon name="forest" className="absolute right-8 top-8 text-[100px] text-white/50 sm:text-[140px]" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-on-surface/80 via-transparent to-transparent" />
                  <div className="relative z-10 flex w-full flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div className="min-w-0">
                      <span className="mb-3 inline-block rounded-lg bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">Eco-Adventure</span>
                      <h2 id="experience-title" className="font-display-lg-mobile text-display-lg-mobile text-white sm:text-display-lg">{booking.experience}</h2>
                      <p className="mt-1 text-sm text-white/80">{booking.attraction}</p>
                    </div>
                    <div className="rounded-2xl border border-white/20 bg-white/10 p-4 text-white backdrop-blur-xl sm:text-right">
                      <p className="text-xs uppercase tracking-wide text-white/80">Reservation Time</p>
                      <p className="font-headline-md text-headline-md">{formatTime(booking.time)}</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-3 sm:gap-5 sm:p-7">
                  <div className="flex items-start gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-container/20 text-primary"><Icon name="calendar_today" /></span>
                    <div><p className="text-xs font-bold uppercase text-on-surface-variant">Date</p><p className="font-label-lg font-bold">{formatDate(booking.date)}</p></div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-container/20 text-primary"><Icon name="groups" /></span>
                    <div><p className="text-xs font-bold uppercase text-on-surface-variant">Party Size</p><p className="font-label-lg font-bold">{booking.guests} Guests</p><p className="text-xs text-on-surface-variant">{booking.guestBreakdown}</p></div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-container/20 text-primary"><Icon name="location_on" /></span>
                    <div>
                      <p className="text-xs font-bold uppercase text-on-surface-variant">Location</p>
                      <p className="font-label-lg font-bold">{booking.region}</p>
                      <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(booking.attraction)}`} target="_blank" rel="noreferrer" className="text-xs font-semibold text-primary hover:underline">Get Directions</a>
                    </div>
                  </div>
                </div>
              </section>

              <section aria-labelledby="guest-requests-title" className="rounded-3xl border-l-4 border-primary/30 bg-surface-container p-5 sm:border-l-8 sm:p-7">
                <div className="mb-3 flex items-center gap-3">
                  <Icon name="sticky_note_2" className="text-primary" />
                  <h2 id="guest-requests-title" className="font-headline-md text-headline-md">Guest Requests</h2>
                </div>
                <p className="text-sm italic leading-relaxed text-on-surface-variant">“{booking.guestRequest}”</p>
              </section>
            </div>

            <aside className="space-y-5 lg:sticky lg:top-24 lg:col-span-4 lg:space-y-6">
              <section aria-label="Booking check-in" className="relative overflow-hidden rounded-3xl bg-primary p-5 text-center text-on-primary shadow-xl sm:p-7">
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
                <div className="relative z-10">
                  <div className="mb-5 inline-block rounded-3xl bg-white p-4 shadow-inner sm:p-5">
                    <BookingQrPreview />
                  </div>
                  <p className="mb-4 text-xs uppercase tracking-wide text-on-primary/80">Demo ticket preview · {booking.id}</p>
                  {checkInButton}
                </div>
              </section>

              <section aria-labelledby="payment-title" className="rounded-3xl bg-surface-container-low p-5 shadow-sm sm:p-7">
                <h2 id="payment-title" className="mb-5 font-headline-md text-headline-md">Payment Summary</h2>
                <div className="mb-6 space-y-4">
                  <div className="flex justify-between gap-3 text-sm">
                    <span className="text-on-surface-variant">Base Price ({booking.guests} Guests)</span>
                    <span className="whitespace-nowrap font-semibold">{formatAmount(booking.basePrice)}</span>
                  </div>
                  <div className="flex justify-between gap-3 text-sm">
                    <span className="text-on-surface-variant">Regional Tourism Levy</span>
                    <span className="whitespace-nowrap font-semibold">{formatAmount(booking.tourismLevy)}</span>
                  </div>
                  <div className="h-px bg-outline-variant/40" />
                  <div className="flex justify-between gap-3 font-bold">
                    <span>Total Amount</span>
                    <span className="whitespace-nowrap text-primary">{formatAmount(booking.amount)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-surface-container-highest p-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-on-secondary-container text-secondary-container"><Icon name="account_balance_wallet" /></span>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase text-on-surface-variant">Payment Method</p>
                    <p className="truncate text-sm font-bold">{booking.paymentMethod}</p>
                  </div>
                  <Icon name={status === 'Pending' ? 'schedule' : 'verified_user'} className="ml-auto text-primary" />
                </div>
              </section>

              <section aria-label="Tour popularity today" className="rounded-3xl bg-surface-container-low p-5 shadow-sm sm:p-7">
                <p className="mb-4 text-xs font-bold uppercase tracking-wide text-on-surface-variant">Tour Popularity Today</p>
                <div className="flex h-12 items-end gap-1" aria-hidden="true">
                  {[40, 60, 85, 95, 70, 50, 30].map((height, index) => (
                    <span key={index} className={`flex-1 rounded-t-sm ${index === 3 ? 'bg-primary/40' : 'bg-primary/10'}`} style={{ height: `${height}%` }} />
                  ))}
                </div>
                <p className="mt-4 flex items-center gap-2 text-xs font-semibold text-primary">
                  <Icon name="trending_up" className="text-base" />
                  12% higher than average
                </p>
              </section>
            </aside>
          </div>
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-[68px] z-40 border-t border-outline-variant/20 bg-surface/95 px-4 py-3 backdrop-blur-md lg:hidden">
        <div className="mx-auto flex max-w-lg flex-col gap-2">
          {checkInButton}
          <button type="button" onClick={cancelBooking} disabled={status === 'Cancelled' || status === 'Completed'} className="py-1 text-sm font-semibold text-error hover:underline disabled:cursor-not-allowed disabled:opacity-50">
            {status === 'Cancelled' ? 'Booking Cancelled' : 'Cancel Booking'}
          </button>
        </div>
      </div>

      <nav aria-label="Mobile operator navigation" className="fixed bottom-0 z-50 flex h-[68px] w-full justify-around border-t border-outline-variant/20 bg-surface/95 px-2 shadow-[0_-1px_8px_rgba(0,0,0,0.04)] [padding-bottom:env(safe-area-inset-bottom)] lg:hidden">
        {[
          { label: 'Dashboard', icon: 'dashboard', href: '/dashboard' },
          { label: 'Bookings', icon: 'calendar_month', href: '/operator/bookings' },
          { label: 'Analytics', icon: 'analytics', href: '/operator/analytics' },
          { label: 'Attractions', icon: 'landscape', href: '/operator/attractions' },
          { label: 'Profile', icon: 'person', href: '/operator/settings' },
        ].map((item) => (
          <Link key={item.label} href={item.href} aria-current={item.label === 'Bookings' ? 'page' : undefined} className={`flex flex-1 flex-col items-center justify-center gap-0.5 text-[10px] ${item.label === 'Bookings' ? 'font-bold text-primary' : 'text-on-surface-variant'}`}>
            <Icon name={item.icon} />
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
