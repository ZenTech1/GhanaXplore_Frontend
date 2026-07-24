'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function WhyGhanaXplore() {
  const pathname = usePathname();
  
  // Cleanly extract current locale from pathname
  const segments = pathname.split('/');
  const locale = (segments[1] === 'en' || segments[1] === 'fr') ? segments[1] : 'en';

  // Helper to generate path with correct locale prefix (as-needed)
  const getHref = (path: string) => {
    if (locale === 'en') return path;
    return `/${locale}${path === '/' ? '' : path}`;
  };

  const features = [
    {
      icon: 'signal_wifi_off',
      title: 'Offline Smart Guides',
      description:
        'Don’t let spotty reception stop your adventure. Download curated maps and historical guides to use deep in the savannah or along the coast.',
    },
    {
      icon: 'payments',
      title: 'Native Mobile Money Support',
      description:
        'Book everything from local stays to guided tours using MTN MoMo or Telecel Cash. No foreign card issues, just seamless local payments.',
    },
    {
      icon: 'verified_user',
      title: 'GTA Verified Partners',
      description:
        'In partnership with the Ghana Tourism Authority, every host and experience on our platform is vetted for safety and quality.',
    },
  ];

  return (
    <section className="py-section-gap px-container-padding-mobile md:px-container-padding-desktop max-w-7xl mx-auto hidden md:block">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left Side Lifestyle Image with Decorative Accent Box */}
        <div className="relative">
          <div className="aspect-square rounded-3xl overflow-hidden border-8 border-surface-container-high shadow-2xl relative z-10">
            <div
              className="w-full h-full bg-cover bg-center"
              style={{
                backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAUsrAiz8I_Cy5J32WnWp9fo-WP3ud3e1aCAQD07NTqkAoF822fzfZ_0kuJkuyBKVGv4k76Ek8T8U7UHuqqm6lDBj7ZvC1udI_3O_WJRDlxnOQ89mJvQLFr33gV6cZckohpEtk85n3axyMg51avxuxFeGT690slRm9DPjEWA31pBz-o2vwyqfjKXPXI867oif8BY5CBpdDRNpIrGdqRRxqF5rx1EzNvtaHUXB91FZERY4vki-ApXvumPLkrtAvIealdNzVQqVzANTtw')`,
              }}
            />
          </div>
          <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-secondary-container rounded-3xl -z-0 hidden md:block" />
        </div>

        {/* Right Side Content */}
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-8">Why GhanaXplore?</h2>
          
          <div className="space-y-8">
            {features.map((feature, idx) => (
              <div key={idx} className="flex gap-4 items-start">
                <div className="w-14 h-14 shrink-0 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-3xl">{feature.icon}</span>
                </div>
                <div>
                  <h4 className="font-headline-md text-lg mb-2">{feature.title}</h4>
                  <p className="text-on-surface-variant leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          <Link
            href={getHref('/attractions')}
            className="inline-block mt-12 bg-primary text-on-primary px-10 py-4 rounded-xl font-label-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 active:scale-95"
          >
            Start Planning Your Journey
          </Link>
        </div>
      </div>
    </section>
  );
}

