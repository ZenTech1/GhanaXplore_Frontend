import { setRequestLocale } from 'next-intl/server';
import { HeaderNav } from '@/components/layout/HeaderNav';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/home/HeroSection';
import { TopRegions } from '@/components/home/TopRegions';
import { MustSeeAttractions } from '@/components/home/MustSeeAttractions';
import { WhyGhanaXplore } from '@/components/home/WhyGhanaXplore';
import { CommunityExperiences } from '@/components/home/CommunityExperiences';

export default function HomePage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);

  return (
    <div className="bg-surface text-on-surface font-body min-h-screen pb-16 md:pb-0">
      {/* Top Navbar */}
      <HeaderNav />

      {/* Main Content Sections */}
      <main>
        <HeroSection />
        <TopRegions />
        <MustSeeAttractions />
        <WhyGhanaXplore />
        <CommunityExperiences />
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
}
