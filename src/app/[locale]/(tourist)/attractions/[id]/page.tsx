import { setRequestLocale } from 'next-intl/server';
import { HeaderNav } from '@/components/layout/HeaderNav';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { Footer } from '@/components/layout/Footer';
import { AttractionDetail } from '@/components/attractions/AttractionDetail';

export default async function AttractionDetailPage({
  params,
}: {
  params: { id: string; locale: string };
}) {
  setRequestLocale(params.locale);

  return (
    <div className="bg-background text-on-surface font-body min-h-screen pb-16 md:pb-0">
      {/* Top Header Navigation */}
      <HeaderNav />

      {/* Attraction Detail Content */}
      <main>
        <AttractionDetail id={params.id} />
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
}
