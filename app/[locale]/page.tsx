import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { DoorwayOverture } from '@/components/doorway/DoorwayOverture';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function DoorwayPage({ params }: Props) {
  const { locale: rawLocale } = await params;
  if (!hasLocale(routing.locales, rawLocale)) notFound();
  const locale = rawLocale;
  // Must be called before any other next-intl API to keep this route static.
  setRequestLocale(locale);

  const t = await getTranslations('Doorway');

  return (
    <main>
      <DoorwayOverture
        kicker={t('kicker')}
        name={t('name')}
        dates={t('dates')}
        creed={t('creed')}
        dedication={t('dedication')}
        intro={t('intro')}
        enterLabel={t('enter')}
        enterHref={`/${locale}/diwan`}
      />
    </main>
  );
}
