'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function HeaderNav() {
  const pathname = usePathname();
  
  // Cleanly extract current locale from pathname
  const segments = pathname.split('/');
  const locale = (segments[1] === 'en' || segments[1] === 'fr') ? segments[1] : 'en';

  const getHref = (path: string) => {
    if (locale === 'en') return path;
    return `/${locale}${path === '/' ? '' : path}`;
  };

  return (
    <header className="bg-surface sticky top-0 z-50 border-b border-outline-variant/30 shadow-sm backdrop-blur-md">
      <div className="flex justify-between items-center w-full px-container-padding-mobile md:px-container-padding-desktop py-4 max-w-7xl mx-auto">
        {/* Logo & Desktop Nav Links */}
        <div className="flex items-center gap-8">
          <Link href={getHref('/')} className="font-headline-md text-headline-md font-bold text-primary">
            GhanaXplore
          </Link>
          <nav className="hidden md:flex items-center gap-6">
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
          </nav>
        </div>

        {/* Right Section Desktop */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center bg-surface-container rounded-full px-4 py-2 border border-outline-variant/20">
            <span className="material-symbols-outlined text-outline">search</span>
            <input
              type="text"
              placeholder="Search experiences..."
              className="bg-transparent border-none focus:ring-0 text-label-lg px-2 w-48 text-on-surface placeholder:text-outline"
            />
          </div>
          <Link
            href={getHref('/login')}
            className="font-label-lg text-label-lg text-on-surface-variant hover:text-primary transition-colors"
          >
            Login
          </Link>
          <Link
            href={getHref('/login')}
            className="bg-primary text-on-primary px-6 py-2.5 rounded-lg font-label-lg text-label-lg hover:opacity-90 transition-all active:scale-95"
          >
            Profile
          </Link>
        </div>

        {/* Right Section Mobile (Matches HTML Snippet 2 & Image 2) */}
        <div className="flex md:hidden items-center gap-4">
          <button
            aria-label="Notifications"
            className="p-2 rounded-full hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-on-surface">notifications</span>
          </button>
          <Link
            href={getHref('/login')}
            className="w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center border border-secondary shrink-0"
            aria-label="User Profile"
          >
            <span className="material-symbols-outlined text-on-secondary-fixed text-sm">person</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
