import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  // Arabic first / default — the primary experience.
  locales: ['ar', 'en'],
  defaultLocale: 'ar',
  // Disable Accept-Language negotiation so '/' always redirects to '/ar'.
  localeDetection: false
});
