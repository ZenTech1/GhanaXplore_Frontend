import { apiClient } from '@/lib/api/client';
import {
  getPendingBookings,
  updateQueuedBookingStatus,
  removeQueuedBooking,
  type QueuedBooking,
} from './db';
import type { Booking } from '@/types';

// Call this from a 'online' event listener (see useOnlineStatus hook) and once
// on app load. Each queued booking is submitted individually so one failure
// (e.g. slot no longer available) doesn't block the rest of the queue.
export async function syncPendingBookings(token?: string): Promise<{
  succeeded: string[];
  failed: string[];
}> {
  const pending = await getPendingBookings();
  const succeeded: string[] = [];
  const failed: string[] = [];

  for (const booking of pending) {
    await updateQueuedBookingStatus(booking.localId, 'syncing');
    try {
      await submitBooking(booking, token);
      await removeQueuedBooking(booking.localId);
      succeeded.push(booking.localId);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sync failed';
      await updateQueuedBookingStatus(booking.localId, 'failed', message);
      failed.push(booking.localId);
    }
  }

  return { succeeded, failed };
}

async function submitBooking(booking: QueuedBooking, token?: string) {
  return apiClient.post<Booking>(
    '/bookings',
    {
      attractionId: booking.attractionId,
      packageId: booking.packageId,
      guideId: booking.guideId,
      visitDate: booking.visitDate,
      partySize: booking.partySize,
    },
    { token }
  );
}
