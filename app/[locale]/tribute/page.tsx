import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { getTribute } from '@/lib/content';
import { GoldDivider } from '@/components/ornament/GoldDivider';
import { Portrait } from '@/components/tribute/Portrait';
import { Bio } from '@/components/tribute/Bio';
import { Timeline } from '@/components/tribute/Timeline';
import { Works } from '@/components/tribute/Works';
import { Translations } from '@/components/tribute/Translations';
import { Journalism } from '@/components/tribute/Journalism';
import { Quotes } from '@/components/tribute/Quotes';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = getTribute();
  const isAr = locale === 'ar';
  return {
    title: isAr ? `في ذكرى ${t.nameAr}` : `In Memory of ${t.nameEn}`,
    description: isAr ? t.bioAr.slice(0, 150) : t.bioEn.slice(0, 150),
  };
}

export default async function TributePage({ params }: Props) {
  const { locale: rawLocale } = await params;
  if (!hasLocale(routing.locales, rawLocale)) notFound();
  const locale = rawLocale;
  setRequestLocale(locale);

  const t = await getTranslations('Tribute');
  const tribute = getTribute();
  const isAr = locale === 'ar';

  return (
    <main className="tribute paper-grain">
      {/* Night hero — carries the Doorway's language: the portrait emerges from the dark. */}
      <header className="tribute-hero">
        <div className="tribute-hero__glow" aria-hidden="true" />
        <p className="tribute-hero__kicker font-kufi">{t('title')}</p>
        <Portrait
          src={tribute.portrait}
          name={isAr ? tribute.nameAr : tribute.nameEn}
          birthYear={tribute.birthYear}
          deathYear={tribute.deathYear}
          locale={locale}
        />
        <blockquote className="tribute-hero__creed font-display" lang={isAr ? 'ar' : undefined} dir={isAr ? 'rtl' : undefined}>
          {isAr ? tribute.creedAr : tribute.creedEn}
        </blockquote>
      </header>

      <div className="tribute-body">
        <GoldDivider />
        <Bio heading={t('bio')} text={isAr ? tribute.bioAr : tribute.bioEn} />

        <GoldDivider />
        <Timeline heading={t('timeline')} events={tribute.timeline} locale={locale} />

        <GoldDivider />
        <Works
          heading={t('works')}
          labels={{ novels: t('novels'), stories: t('stories'), study: t('study') }}
          works={tribute.works}
          locale={locale}
        />

        <GoldDivider />
        <Translations heading={t('translations')} translations={tribute.translations} locale={locale} />

        <GoldDivider />
        <Journalism heading={t('journalism')} outlets={tribute.journalism} />

        <GoldDivider />
        <Quotes heading={t('quotes')} quotes={tribute.quotes} locale={locale} />
      </div>
    </main>
  );
}
