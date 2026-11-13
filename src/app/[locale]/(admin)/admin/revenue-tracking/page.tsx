import { setRequestLocale } from 'next-intl/server';
import { AdminTourismReports } from '@/components/admin/AdminTourismReports';

export default function AdminTourismReportsPage({
  params,
}: {
  params: { locale: string };
}) {
  setRequestLocale(params.locale);

  return <AdminTourismReports />;
}
