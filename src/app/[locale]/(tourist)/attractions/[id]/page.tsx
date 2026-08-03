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
    <div className="bg-background text-on-surface font-body min-h-screen pb-0">
      {/* Top Header Navigation */}
      <div className="hidden md:block">
        <HeaderNav />
      </div>

      {/* Attraction Detail Content */}
      <main>
        <AttractionDetail id={params.id} />
      </main>

      {/* Footer */}
      <div className="hidden md:block">
        <Footer />
      </div>
    </div>
  );
}
