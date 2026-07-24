import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { OfflineBundle } from '@/types';

// Section 9.3: last 30 visited attraction pages cached, offline bundles under
// 500KB, queued bookings auto-submitted on reconnect. This file is the single
// source of truth for that local storage — don't reach for raw IndexedDB
// calls elsewhere, go through these helpers.

export interface QueuedBooking {
  localId: string; // client-generated (crypto.randomUUID()), replaced by server bookingReference on sync
  attractionId?: string;
  packageId?: string;
  guideId?: string | null;
  visitDate: string;
  partySize: number;
  createdAt: string;
  syncStatus: 'pending' | 'syncing' | 'failed';
  syncError?: string;
}

interface GhanaXploreDB extends DBSchema {
  offlineBundles: {
    key: string; // attractionId
    value: OfflineBundle;
    indexes: { 'by-lastUpdated': string };
  };
  bookingQueue: {
    key: string; // localId
    value: QueuedBooking;
  };
  recentAttractions: {
    key: string; // attractionId
    value: { attractionId: string; visitedAt: string };
    indexes: { 'by-visitedAt': string };
  };
}

const DB_NAME = 'ghanaxplore';
const DB_VERSION = 1;
const MAX_RECENT_ATTRACTIONS = 30;

let dbPromise: Promise<IDBPDatabase<GhanaXploreDB>> | null = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<GhanaXploreDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        const bundles = db.createObjectStore('offlineBundles', { keyPath: 'attractionId' });
        bundles.createIndex('by-lastUpdated', 'lastUpdated');

        db.createObjectStore('bookingQueue', { keyPath: 'localId' });

        const recent = db.createObjectStore('recentAttractions', { keyPath: 'attractionId' });
        recent.createIndex('by-visitedAt', 'visitedAt');
      },
    });
  }
  return dbPromise;
}

// --- Offline bundles (FR-29 to FR-31) ---

export async function saveOfflineBundle(bundle: OfflineBundle) {
  const db = await getDB();
  await db.put('offlineBundles', bundle);
}

export async function getOfflineBundle(attractionId: string) {
  const db = await getDB();
  return db.get('offlineBundles', attractionId);
}

export async function listOfflineBundles() {
  const db = await getDB();
  return db.getAll('offlineBundles');
}

export async function deleteOfflineBundle(attractionId: string) {
  const db = await getDB();
  await db.delete('offlineBundles', attractionId);
}

// --- Recently visited attractions cache (max 30, per Section 9.3) ---

export async function trackAttractionVisit(attractionId: string) {
  const db = await getDB();
  await db.put('recentAttractions', { attractionId, visitedAt: new Date().toISOString() });

  const all = await db.getAllFromIndex('recentAttractions', 'by-visitedAt');
  if (all.length > MAX_RECENT_ATTRACTIONS) {
    const overflow = all.slice(0, all.length - MAX_RECENT_ATTRACTIONS);
    const tx = db.transaction('recentAttractions', 'readwrite');
    await Promise.all(overflow.map((entry) => tx.store.delete(entry.attractionId)));
    await tx.done;
  }
}

// --- Booking queue (FR-32: offline bookings queued, auto-submitted on reconnect) ---

export async function queueBooking(booking: Omit<QueuedBooking, 'localId' | 'syncStatus' | 'createdAt'>) {
  const db = await getDB();
  const record: QueuedBooking = {
    ...booking,
    localId: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    syncStatus: 'pending',
  };
  await db.put('bookingQueue', record);
  return record;
}

export async function getPendingBookings() {
  const db = await getDB();
  const all = await db.getAll('bookingQueue');
  return all.filter((b) => b.syncStatus === 'pending' || b.syncStatus === 'failed');
}

export async function updateQueuedBookingStatus(
  localId: string,
  syncStatus: QueuedBooking['syncStatus'],
  syncError?: string
) {
  const db = await getDB();
  const existing = await db.get('bookingQueue', localId);
  if (!existing) return;
  await db.put('bookingQueue', { ...existing, syncStatus, syncError });
}

export async function removeQueuedBooking(localId: string) {
  const db = await getDB();
  await db.delete('bookingQueue', localId);
}
