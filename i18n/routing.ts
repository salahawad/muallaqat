import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  // Arabic first / default — the primary experience.
  locales: ['ar', 'en'],
  defaultLocale: 'ar'
});
