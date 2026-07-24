'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function HeaderNav() {
  const pathname = usePathname();
  
  // Cleanly extract current locale from pathname
  const segments = pathname.split('/');
  const locale = (segments[1] === 'en' || segments[1] === 'fr') ? segments[1] : 'en';

  // Helper to generate path with correct locale prefix (as-needed)
  const getHref = (path: string) => {
    if (locale === 'en') return path;
    return `/${locale}${path === '/' ? '' : path}`;
  };

  return (
    <header className="fixed md:sticky top-0 left-0 w-full z-50 bg-surface/80 md:bg-surface backdrop-blur-md dark:bg-surface-container-high border-b border-outline-variant/30 shadow-sm transition-all duration-300">
      <nav className="flex justify-between items-center w-full px-container-padding-mobile md:px-container-padding-desktop py-4 max-w-7xl mx-auto">
        <Link href={getHref('/')} className="flex items-center gap-2">
          <span className="font-headline-md text-headline-md font-bold text-primary">
            GhanaXplore
          </span>
        </Link>
        
        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href={getHref('/')}
            className="font-label-lg text-label-lg text-primary border-b-2 border-primary pb-1 transition-colors"
          >
            Regions
          </Link>
          <Link
            href={getHref('/bookings')}
            className="font-label-lg text-label-lg text-on-surface-variant hover:text-primary transition-colors"
          >
            Host an Attraction
          </Link>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Mobile Search Button */}
          <button
            aria-label="Search"
            className="md:hidden text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-2xl">search</span>
          </button>
          
          {/* Desktop Login Link */}
          <Link
            href={getHref('/login')}
            className="hidden md:inline font-label-lg text-label-lg text-on-surface-variant hover:text-primary transition-colors"
          >
            Login
          </Link>
          
          {/* Desktop Avatar Profile */}
          <Link
            href={getHref('/login')}
            className="hidden md:flex w-10 h-10 rounded-full bg-surface-container-highest items-center justify-center cursor-pointer overflow-hidden border border-outline-variant hover:border-primary transition-all shrink-0"
            aria-label="User Profile"
          >
            <span className="material-symbols-outlined text-on-surface-variant">person</span>
          </Link>

          {/* Mobile Avatar Profile */}
          <Link
            href={getHref('/login')}
            className="md:hidden w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center cursor-pointer overflow-hidden border border-outline-variant shrink-0"
            aria-label="User Profile"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwzEmNYhvL-wUB3JWBg22fJCH6czO4eh_pv0rw-rFjZTUjwOq2Z8Bqm2kmDDxhn_n6k1sDFbfSyPQ82REFUA8ZkWwyvafoqycMDL8cs_flX79Y5qWOZ_qnAYlV1WKUmw4UDOvR8UslEovoYyIQzmL0PpIS4oBSlTrwkobeT0pRdRYEbgvFo-C4NBT2yrBNrvJ7J0SR4cnmFGWiTrQFbsq3D_9LybBwDovNCJGXyDIpLsyHvVRoIDQMad0fLmmPfhLN4BcoiolODr_V"
              alt="User profile avatar"
              className="w-full h-full object-cover"
            />
          </Link>
        </div>
      </nav>
    </header>
  );
}

