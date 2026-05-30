import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { getEras, getPoems, getPoets } from '@/lib/content';
import {
  buildCards,
  eraFacets,
  emotionFacets,
  typeFacets,
  type ExploreLabels,
} from '@/lib/explore';
import { ExploreBrowser } from '@/components/explore/ExploreBrowser';
import { GoldDivider } from '@/components/ornament/GoldDivider';

type Props = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: 'Explore' });
  return { title: t('title'), description: t('lead') };
}

/**
 * استكشاف — Explore. The diwan's browse surface: every poem joined to its poet
 * and era, surfaced as cards the reader narrows by feeling, age, or form, or by
 * a forgiving Arabic-aware search. The view-model is built (and localized) on
 * the server; the interactive narrowing happens in ExploreBrowser on the client.
 */
export default async function ExplorePage({ params }: Props) {
  const { locale: rawLocale } = await params;
  if (!hasLocale(routing.locales, rawLocale)) notFound();
  const locale = rawLocale;
  setRequestLocale(locale);

  const t = await getTranslations('Explore');

  const labels: ExploreLabels = {
    emotion: (e) => t(`emotions.${e}`),
    type: (ty) => t(`types.${ty}`),
  };

  const eras = getEras();
  const cards = buildCards(getPoems(), getPoets(), eras, locale, labels);

  const facets = {
    era: eraFacets(cards, eras, locale),
    emotion: emotionFacets(cards, labels),
    type: typeFacets(cards, labels),
  };

  return (
    <main className="explore paper-grain mx-auto max-w-6xl px-6 py-20 sm:py-28">
      <header className="mx-auto max-w-2xl text-center">
        <h1 className="font-display text-5xl text-ink sm:text-6xl">{t('title')}</h1>
        <p className="mt-5 font-ui text-lg leading-relaxed text-ink-muted">
          {t('lead')}
        </p>
      </header>

      <GoldDivider className="my-12" />

      <ExploreBrowser
        cards={cards}
        facets={facets}
        labels={{
          search: t('search'),
          all: t('all'),
          era: t('era'),
          emotion: t('emotion'),
          type: t('type'),
          clear: t('clear'),
          empty: t('empty'),
          by: t('by'),
          results: t('results'),
          resultsOne: t('resultsOne'),
        }}
        locale={locale}
        dir={locale === 'ar' ? 'rtl' : 'ltr'}
      />
    </main>
  );
}
