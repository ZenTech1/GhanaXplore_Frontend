import { setRequestLocale } from 'next-intl/server';
import { OperatorAnalytics } from '@/components/operator/OperatorAnalytics';

export default function OperatorAnalyticsPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  return <OperatorAnalytics />;
}
