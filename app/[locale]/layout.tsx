import type {ReactNode} from 'react';
import {notFound} from 'next/navigation';
import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {setRequestLocale} from 'next-intl/server';
import {routing} from '@/i18n/routing';
import {amiri, cairo, reemKufi} from '@/lib/fonts';
import '../globals.css';

type Props = {
  children: ReactNode;
  params: Promise<{locale: string}>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({children, params}: Props) {
  // Next.js 15: params is async and must be awaited.
  const {locale} = await params;

  // Reject unknown locales -> 404.
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enable static rendering for this locale (stable API in v4).
  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
      className={`${amiri.variable} ${cairo.variable} ${reemKufi.variable}`}
    >
      <body className="paper-grain bg-cream text-ink font-ui antialiased">
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
