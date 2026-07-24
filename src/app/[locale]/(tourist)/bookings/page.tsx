// FR-11 to FR-16: booking list + queued-offline bookings surface here.
// Wire this up once the booking creation flow (with QR ticket display) exists.
import { setRequestLocale } from 'next-intl/server';

export default function BookingsPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="font-display text-3xl">My Bookings</h1>
      <p className="text-text-muted mt-2">
        Placeholder — list confirmed bookings + any queued offline bookings from IndexedDB here.
      </p>
    </main>
  );
}
