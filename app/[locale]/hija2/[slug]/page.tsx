import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { getDuels, getDuelBySlug, getPoetBySlug } from '@/lib/content';
import type { Poet } from '@/lib/schemas';
import { DuelView } from '@/components/hija2/DuelView';
import { verified } from '@/lib/pending';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getDuels().map((duel) => ({ locale, slug: duel.slug })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const duel = getDuelBySlug(slug);
  if (!duel) return {};
  const isAr = locale === 'ar';
  return {
    title: isAr ? duel.titleAr : duel.titleEn,
    description: verified(isAr ? duel.contextAr : duel.contextEn),
  };
}

/**
 * A single flyting — the النقيضة played out as an interactive duel of volleys.
 */
export default async function Hija2DuelPage({ params }: Props) {
  const { locale: rawLocale, slug } = await params;
  if (!hasLocale(routing.locales, rawLocale)) notFound();
  const locale = rawLocale;
  setRequestLocale(locale);
  const isAr = locale === 'ar';
  const t = await getTranslations('Hija2');

  const duel = getDuelBySlug(slug);
  if (!duel) notFound();

  // Gather every poet referenced by the duel (combatants + volley speakers).
  const ids = new Set<string>([
    duel.poetAId,
    duel.poetBId,
    ...duel.volleys.map((v) => v.poetId),
  ]);
  const poetsById: Record<string, Poet> = {};
  for (const id of ids) {
    const poet = getPoetBySlug(id);
    if (poet) poetsById[id] = poet;
  }

  const context = verified(isAr ? duel.contextAr : duel.contextEn);

  return (
    <main className="hija2-duel paper-grain" data-testid="hija2-duel">
      <div className="hija2-duel__glow" aria-hidden="true" />
      <header className="hija2-duel__header">
        <h1 className="hija2-duel__title font-display">
          {isAr ? duel.titleAr : duel.titleEn}
        </h1>
        {context ? <p className="hija2-duel__context font-ui">{context}</p> : null}
      </header>

      <DuelView
        duel={duel}
        poetsById={poetsById}
        locale={locale}
        labels={{
          next: t('next'),
          prev: t('prev'),
          volleyOf: t('volleyOf'),
        }}
      />

      <nav className="hija2-duel__return">
        <a className="return-link font-kufi" href={`/${locale}/hija2`}>
          <span aria-hidden="true">{isAr ? '→' : '←'}</span> {t('backToHija2')}
        </a>
      </nav>
    </main>
  );
}
