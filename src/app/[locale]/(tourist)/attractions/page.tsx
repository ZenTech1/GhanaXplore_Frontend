import { attractionsApi } from '@/lib/api/attractions';
import { setRequestLocale } from 'next-intl/server';

// Server component: fetches on the server, no client-side loading spinner needed
// for the initial list. Filters (FR-7) will move to client-side URL search params
// once the Figma filter UI is in.
export default async function AttractionsPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const attractions = await attractionsApi.list().catch(() => []);

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="font-display text-3xl mb-6">Attractions</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {attractions.map((attraction) => (
          <article key={attraction.attractionId} className="border border-border rounded-lg p-4">
            <h2 className="font-display text-lg">{attraction.name}</h2>
            <p className="text-text-muted text-sm">{attraction.region}</p>
            <p className="text-sm mt-2">Readiness: {attraction.attractionReadinessScore}/10</p>
          </article>
        ))}
        {attractions.length === 0 && (
          <p className="text-text-muted col-span-full">
            No attractions yet — connect the backend or check offline cache.
          </p>
        )}
      </div>
    </main>
  );
}
