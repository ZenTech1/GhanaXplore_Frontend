import { setRequestLocale } from 'next-intl/server';
import { OperatorAttractionEdit } from '@/components/operator/OperatorAttractionEdit';

export default function OperatorAttractionEditPage({
  params,
}: {
  params: { locale: string; id: string };
}) {
  setRequestLocale(params.locale);

  return <OperatorAttractionEdit id={params.id} />;
}
