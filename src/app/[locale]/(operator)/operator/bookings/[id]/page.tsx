import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { OperatorBookingDetails } from '@/components/operator/OperatorBookingDetails';
import { operatorBookings } from '@/components/operator/operatorBookingData';

export default function OperatorBookingDetailsPage({
  params,
}: {
  params: { locale: string; id: string };
}) {
  setRequestLocale(params.locale);
  const booking = operatorBookings.find((item) => item.id === params.id);

  if (!booking) notFound();

  return <OperatorBookingDetails booking={booking} />;
}
