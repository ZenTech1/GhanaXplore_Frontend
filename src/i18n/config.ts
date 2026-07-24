// NFR-7 requires English, French, and major Ghanaian languages.
// Starting with en/fr; add locale codes here as translated message files land
// (e.g. 'tw' for Twi, 'ga' for Ga, 'ee' for Ewe, 'ha' for Hausa).
export const locales = ['en', 'fr'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';
