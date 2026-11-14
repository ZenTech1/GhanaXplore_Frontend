import { setRequestLocale } from 'next-intl/server';
import { OperatorDashboard } from '@/components/operator/OperatorDashboard';

export default function OperatorDashboardPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  return <OperatorDashboard />;
}
