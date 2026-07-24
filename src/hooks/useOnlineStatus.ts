'use client';

import { useEffect, useState } from 'react';
import { syncPendingBookings } from '@/lib/offline/sync';

export function useOnlineStatus() {
  // Assume online during SSR/first paint to avoid layout flash; corrected on mount.
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      // Fire and forget — the booking UI should re-read queue state itself
      // (e.g. via a query invalidation) rather than await this here.
      syncPendingBookings().catch(() => {
        // Errors are recorded per-booking in IndexedDB; nothing to surface here.
      });
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}
