import { setRequestLocale } from 'next-intl/server';
import { OperatorPaymentSettings } from '@/components/operator/OperatorPaymentSettings';

export default function OperatorPaymentSettingsPage({
  params,
}: {
  params: { locale: string };
}) {
  setRequestLocale(params.locale);
  return <OperatorPaymentSettings />;
}
