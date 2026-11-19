import { setRequestLocale } from 'next-intl/server';
import { OperatorSettings } from '@/components/operator/OperatorSettings';

export default function OperatorSettingsPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  return <OperatorSettings />;
}
