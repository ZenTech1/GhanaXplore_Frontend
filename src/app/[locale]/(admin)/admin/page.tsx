import { setRequestLocale } from 'next-intl/server';
import { AdminDashboard } from '@/components/admin/AdminDashboard';

export default function AdminPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);

  return <AdminDashboard />;
}
