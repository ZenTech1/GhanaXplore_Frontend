'use client';

import { useTranslations } from 'next-intl';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

export function OfflineBanner() {
  const isOnline = useOnlineStatus();
  const t = useTranslations('offline');

  if (isOnline) return null;

  return (
    <div className="w-full bg-accent/10 text-text-primary text-sm text-center py-2 px-4" role="status">
      {t('banner')}
    </div>
  );
}
