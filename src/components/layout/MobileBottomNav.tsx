'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function MobileBottomNav() {
  const pathname = usePathname();
  
  // Cleanly extract current locale from pathname
  const segments = pathname.split('/');
  const locale = (segments[1] === 'en' || segments[1] === 'fr') ? segments[1] : 'en';

  const navItems = [
    { label: 'Home', icon: 'home', path: '/' },
    { label: 'Explore', icon: 'explore', path: '/attractions' },
    { label: 'Bookings', icon: 'calendar_month', path: '/bookings' },
    { label: 'Saved', icon: 'favorite', path: '/saved' },
    { label: 'Profile', icon: 'person', path: '/login' },
  ];

  // Helper to generate path with correct locale prefix (as-needed)
  const getHref = (path: string) => {
    if (locale === 'en') return path;
    return `/${locale}${path === '/' ? '' : path}`;
  };

  // Helper to clean paths for comparison
  const getCleanPath = (path: string) => {
    let cleaned = path.replace(/\/$/, '') || '/';
    const parts = cleaned.split('/');
    if (parts.length > 1 && (parts[1] === 'en' || parts[1] === 'fr')) {
      cleaned = '/' + parts.slice(2).join('/');
    }
    return cleaned === '' ? '/' : cleaned;
  };

  const currentCleanPath = getCleanPath(pathname);

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-surface/90 backdrop-blur-xl border-t border-outline-variant/30 px-2 py-2 flex justify-around items-center z-50 md:hidden">
      {navItems.map((item) => {
        const isActive = currentCleanPath === item.path;
        const href = getHref(item.path);
        
        return (
          <Link
            key={item.label}
            href={href}
            className={`flex flex-col items-center gap-1 py-1 px-2 transition-all duration-300 shrink-0 ${
              isActive ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <span
              className="material-symbols-outlined"
              style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              {item.icon}
            </span>
            <span className="font-label-sm">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

