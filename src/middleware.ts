import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/config';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed', // '/attractions' works for default locale, '/fr/attractions' for others
});

export const config = {
  // Skip API routes, Next internals, PWA/service worker files, and static assets
  matcher: ['/((?!api|_next|sw.js|manifest.json|icons|.*\\..*).*)'],
};
