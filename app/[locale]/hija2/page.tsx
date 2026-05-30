import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { getDuels, getPoetBySlug } from '@/lib/content';
import { DuelCard } from '@/components/hija2/DuelCard';

type Props = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as 'ar' | 'en', namespace: 'Hija2' });
  return { title: t('title'), description: t('lede') };
}

/**
 * الهجاء / النقائض — the great poetic feuds as a gallery of interactive duels.
 * Each card opens into the full back-and-forth of a flyting.
 */
export default async function Hija2Page({ params }: Props) {
  const { locale: rawLocale } = await params;
  if (!hasLocale(routing.locales, rawLocale)) notFound();
  const locale = rawLocale;
  setRequestLocale(locale);
  const isAr = locale === 'ar';
  const t = await getTranslations('Hija2');

  const duels = getDuels();

  return (
    <main className="hija2 paper-grain" data-testid="hija2">
      <header className="hija2__intro">
        <div className="hija2__intro-glow" aria-hidden="true" />
        <p className="hija2__kicker font-kufi">
          {isAr ? 'النقائض' : 'The Naqā\'iḍ'}
        </p>
        <h1 className="hija2__title font-display">{t('title')}</h1>
        <p className="hija2__lede font-display">{t('lede')}</p>
      </header>

      <ul className="hija2__list" data-testid="hija2-list">
        {duels.map((duel) => {
          const poetA = getPoetBySlug(duel.poetAId);
          const poetB = getPoetBySlug(duel.poetBId);
          if (!poetA || !poetB) return null;
          return (
            <li key={duel.id} className="hija2__item">
              <DuelCard duel={duel} poetA={poetA} poetB={poetB} locale={locale} />
            </li>
          );
        })}
      </ul>

      <nav className="hija2__return">
        <a className="return-link font-kufi" href={`/${locale}/diwan`}>
          <span aria-hidden="true">{isAr ? '→' : '←'}</span> {t('backToDiwan')}
        </a>
      </nav>
    </main>
  );
}
