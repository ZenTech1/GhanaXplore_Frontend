import { attractionsApi } from '@/lib/api/attractions';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { DownloadOfflineButton } from '@/components/attractions/DownloadOfflineButton';

export default async function AttractionDetailPage({
  params,
}: {
  params: { id: string; locale: string };
}) {
  setRequestLocale(params.locale);
  const attraction = await attractionsApi.getById(params.id).catch(() => null);
  if (!attraction) notFound();

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="font-display text-3xl">{attraction.name}</h1>
      <p className="text-text-muted mt-1">
        {attraction.region} · {attraction.district}
      </p>
      <p className="mt-4">{attraction.description}</p>
      <div className="mt-6 flex items-center gap-4">
        <span className="text-sm">Readiness Score: {attraction.attractionReadinessScore}/10</span>
        <span className="text-sm text-text-muted">
          Last updated {new Date(attraction.lastUpdated).toLocaleDateString()}
        </span>
      </div>
      <DownloadOfflineButton attraction={attraction} />
    </main>
  );
}
