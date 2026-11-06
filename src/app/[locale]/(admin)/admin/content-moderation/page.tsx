import { setRequestLocale } from 'next-intl/server';
import { AdminContentModeration } from '@/components/admin/AdminContentModeration';

export default function AdminContentModerationPage({
  params,
}: {
  params: { locale: string };
}) {
  setRequestLocale(params.locale);

  return <AdminContentModeration />;
}
