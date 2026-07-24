import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Playfair_Display, Lexend } from 'next/font/google';
import { locales, type Locale } from '@/i18n/config';
import { OfflineBanner } from '@/components/offline/OfflineBanner';
import '../globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const lexend = Lexend({
  subsets: ['latin'],
  variable: '--font-lexend',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'GhanaXplore — Your Master Guide to Explore Ghana',
  description:
    'Discover, book, and experience Ghana\'s cultural, historical, and natural attractions. In partnership with Ghana Tourism Authority.',
  manifest: '/manifest.json',
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(params.locale as Locale)) notFound();

  setRequestLocale(params.locale);

  const messages = await getMessages();

  return (
    <html lang={params.locale} className={`${playfair.variable} ${lexend.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>
      <body className="bg-background text-on-surface font-body min-h-screen selection:bg-secondary-container">
        <NextIntlClientProvider messages={messages}>
          <OfflineBanner />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
