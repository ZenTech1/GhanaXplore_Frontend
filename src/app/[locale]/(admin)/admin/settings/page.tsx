import { setRequestLocale } from 'next-intl/server';
import { AdminPortalSettings } from '@/components/admin/AdminPortalSettings';

export default function AdminPortalSettingsPage({
  params,
}: {
  params: { locale: string };
}) {
  setRequestLocale(params.locale);

  return <AdminPortalSettings />;
}
