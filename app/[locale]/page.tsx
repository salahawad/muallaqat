import {notFound} from 'next/navigation';
import {hasLocale} from 'next-intl';
import {setRequestLocale, getTranslations} from 'next-intl/server';
import {routing} from '@/i18n/routing';

type Props = {
  params: Promise<{locale: string}>;
};

export default async function DoorwayPage({params}: Props) {
  const {locale: rawLocale} = await params;
  if (!hasLocale(routing.locales, rawLocale)) notFound();
  const locale = rawLocale;
  // Must be called before any other next-intl API to keep this route static.
  setRequestLocale(locale);

  // Async server component -> use getTranslations (awaited).
  const t = await getTranslations('Doorway');
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="font-display text-6xl text-gold">{t('title')}</h1>
      <p className="font-kufi text-lg text-ink-muted">{t('dedication')}</p>
    </main>
  );
}
