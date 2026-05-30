import { Fragment } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { GoldDivider } from '@/components/ornament/GoldDivider';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: 'About' });
  return {
    title: t('title'),
    description: t('lead').slice(0, 150),
  };
}

export default async function AboutPage({ params }: Props) {
  const { locale: rawLocale } = await params;
  if (!hasLocale(routing.locales, rawLocale)) notFound();
  const locale = rawLocale;
  setRequestLocale(locale);

  const t = await getTranslations('About');

  const sections = [
    { heading: t('collectionHeading'), body: t('collectionBody') },
    { heading: t('sourcingHeading'), body: t('sourcingBody') },
    { heading: t('integrityHeading'), body: t('integrityBody') },
    { heading: t('creditsHeading'), body: t('creditsBody') },
  ];

  return (
    <main className="tribute paper-grain" data-testid="about-page">
      {/* Night hero — carries the Doorway's language: the title surfaces from the dark. */}
      <header className="tribute-hero">
        <div className="tribute-hero__glow" aria-hidden="true" />
        <p className="tribute-hero__kicker font-kufi">{t('kicker')}</p>
        <h1 className="font-display text-3xl leading-snug text-gold-light md:text-4xl">
          {t('title')}
        </h1>
        <blockquote className="tribute-hero__creed font-display">{t('lead')}</blockquote>
      </header>

      <div className="tribute-body">
        {sections.map((s) => (
          <Fragment key={s.heading}>
            <GoldDivider />
            <section className="tribute-section">
              <h2 className="tribute-section__heading font-kufi">{s.heading}</h2>
              <p className="tribute-bio__text font-ui">{s.body}</p>
            </section>
          </Fragment>
        ))}

        <GoldDivider />
        <nav
          className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 pb-4 font-kufi"
          aria-label={t('kicker')}
        >
          <Link className="return-link" href={`/${locale}/tribute`}>
            {t('toTribute')}
          </Link>
          <Link className="return-link" href={`/${locale}/diwan`}>
            {t('toDiwan')}
          </Link>
        </nav>
      </div>
    </main>
  );
}
