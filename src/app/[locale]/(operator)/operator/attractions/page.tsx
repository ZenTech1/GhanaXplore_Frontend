import { setRequestLocale } from 'next-intl/server';
import { OperatorAttractions } from '@/components/operator/OperatorAttractions';

export default function OperatorAttractionsPage({
  params,
}: {
  params: { locale: string };
}) {
  setRequestLocale(params.locale);

  return <OperatorAttractions />;
}
