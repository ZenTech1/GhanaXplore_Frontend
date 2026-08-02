import { setRequestLocale } from 'next-intl/server';
import { HeaderNav } from '@/components/layout/HeaderNav';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { Footer } from '@/components/layout/Footer';
import { AttractionsCatalog } from '@/components/attractions/AttractionsCatalog';

export default async function AttractionsPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);

  return (
    <div className="bg-background text-on-surface font-body min-h-screen pb-16 md:pb-0">
      {/* Top Header Navigation */}
      <HeaderNav />

      {/* Attractions Catalog Content */}
      <main>
        <AttractionsCatalog />
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
}
