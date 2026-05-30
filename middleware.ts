import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except for:
  // - /api, /trpc (API routes)
  // - /_next, /_vercel (internals)
  // - files containing a dot (favicon.ico, fonts, images)
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};
