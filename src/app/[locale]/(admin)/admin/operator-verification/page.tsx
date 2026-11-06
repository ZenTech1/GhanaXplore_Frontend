import { setRequestLocale } from 'next-intl/server';
import { AdminOperatorVerification } from '@/components/admin/AdminOperatorVerification';

export default function AdminOperatorVerificationPage({
  params,
}: {
  params: { locale: string };
}) {
  setRequestLocale(params.locale);

  return <AdminOperatorVerification />;
}
