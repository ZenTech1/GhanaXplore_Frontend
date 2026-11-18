import { setRequestLocale } from 'next-intl/server';
import { OperatorBookings } from '@/components/operator/OperatorBookings';

export default function OperatorBookingsPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  return <OperatorBookings />;
}
