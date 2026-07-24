'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { saveOfflineBundle } from '@/lib/offline/db';
import type { Attraction, OfflineBundle } from '@/types';

// FR-29: each attraction page shall be downloadable as an offline bundle.
// This builds the bundle client-side for now — once the backend exposes a
// dedicated /attractions/:id/offline-bundle endpoint (pre-compressed images,
// bundled food guide + language tips), swap the fetch below to call it
// directly instead of constructing the bundle here.
export function DownloadOfflineButton({ attraction }: { attraction: Attraction }) {
  const t = useTranslations('attraction');
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  async function handleDownload() {
    setStatus('saving');
    try {
      const bundle: OfflineBundle = {
        bundleId: `${attraction.attractionId}-v1`,
        attractionId: attraction.attractionId,
        contentJSON: {
          description: attraction.description,
          foodGuide: '', // populate once FR-36 endpoint exists
          languageTips: '', // populate once FR-37 endpoint exists
          gps: { lat: attraction.gpsLatitude, lng: attraction.gpsLongitude },
        },
        compressedImagesURL: [], // populate from Cloudinary once image pipeline exists
        bundleSizeKB: 0,
        lastUpdated: attraction.lastUpdated,
        version: 1,
      };
      await saveOfflineBundle(bundle);
      setStatus('saved');
    } catch {
      setStatus('error');
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={status === 'saving' || status === 'saved'}
      className="mt-6 px-4 py-2 rounded-md bg-accent text-white text-sm disabled:opacity-60"
    >
      {status === 'saved' ? '✓ Saved for offline' : t('downloadOffline')}
    </button>
  );
}
