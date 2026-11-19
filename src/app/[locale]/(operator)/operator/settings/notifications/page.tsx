import { setRequestLocale } from 'next-intl/server';
import { OperatorNotificationPreferences } from '@/components/operator/OperatorNotificationPreferences';

export default function OperatorNotificationPreferencesPage({
  params,
}: {
  params: { locale: string };
}) {
  setRequestLocale(params.locale);
  return <OperatorNotificationPreferences />;
}
