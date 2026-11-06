import { setRequestLocale } from 'next-intl/server';
import { AdminModerationReviewDetail } from '@/components/admin/AdminModerationReviewDetail';

export default function AdminModerationReviewDetailPage({
  params,
}: {
  params: { locale: string; reviewId: string };
}) {
  setRequestLocale(params.locale);

  return <AdminModerationReviewDetail reviewId={params.reviewId} />;
}
