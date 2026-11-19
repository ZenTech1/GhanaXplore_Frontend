import { setRequestLocale } from 'next-intl/server';
import { OperatorBusinessVerification } from '@/components/operator/OperatorBusinessVerification';

export default function OperatorBusinessVerificationPage({
  params,
}: {
  params: { locale: string };
}) {
  setRequestLocale(params.locale);
  return <OperatorBusinessVerification />;
}
