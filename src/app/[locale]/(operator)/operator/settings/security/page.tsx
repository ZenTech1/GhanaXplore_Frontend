import { setRequestLocale } from 'next-intl/server';
import { OperatorSecuritySettings } from '@/components/operator/OperatorSecuritySettings';

export default function OperatorSecuritySettingsPage({
  params,
}: {
  params: { locale: string };
}) {
  setRequestLocale(params.locale);
  return <OperatorSecuritySettings />;
}
