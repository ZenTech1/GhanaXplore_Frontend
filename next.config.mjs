import createNextIntlPlugin from 'next-intl/plugin';
import withPWAInit from '@ducanh2912/next-pwa';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const withPWA = withPWAInit({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  // Attraction pages + their assets are the offline-critical routes (FR-29 to FR-32).
  // Runtime caching rules live in public/sw-custom.js once real API routes exist —
  // start here, then layer in stale-while-revalidate for /api/attractions/*.
  workboxOptions: {
    disableDevLogs: true,
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        // Cloudinary hosts attraction imagery per Section 9.1 (File storage)
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
};

export default withPWA(withNextIntl(nextConfig));
