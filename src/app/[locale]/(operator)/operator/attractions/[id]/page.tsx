import { setRequestLocale } from 'next-intl/server';
import { OperatorAttractionDetails } from '@/components/operator/OperatorAttractionDetails';

export default function OperatorAttractionDetailsPage({
  params,
}: {
  params: { locale: string; id: string };
}) {
  setRequestLocale(params.locale);

  return <OperatorAttractionDetails id={params.id} />;
}
