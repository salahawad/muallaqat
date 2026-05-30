import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { getMuallaqat, getPoets, getEras } from '@/lib/content';
import { MuallaqatGallery, type GalleryPanel } from '@/components/muallaqat/MuallaqatGallery';

type Props = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as 'ar' | 'en', namespace: 'Muallaqat' });
  return { title: t('title'), description: t('lede') };
}

/**
 * المعلقات — the hanging gallery of the Seven. The legend made literal: each of
 * the seven great odes is an illuminated panel that hangs from a cord and
 * unfurls as the reader approaches, in the traditional classical sequence.
 */
export default async function MuallaqatPage({ params }: Props) {
  const { locale: rawLocale } = await params;
  if (!hasLocale(routing.locales, rawLocale)) notFound();
  const locale = rawLocale;
  setRequestLocale(locale);
  const isAr = locale === 'ar';
  const t = await getTranslations('Muallaqat');

  const muallaqat = getMuallaqat();
  const poets = getPoets();
  const eras = getEras();

  const panels: GalleryPanel[] = muallaqat.map((poem) => {
    const poet = poets.find((p) => p.id === poem.poetId)!;
    const era = eras.find((e) => e.id === poem.eraId);
    return {
      poem,
      poet,
      eraNameAr: era?.nameAr ?? '',
      eraNameEn: era?.nameEn ?? '',
    };
  });

  return (
    <main className="muallaqat paper-grain" data-testid="muallaqat">
      <header className="muallaqat__intro">
        <div className="muallaqat__intro-glow" aria-hidden="true" />
        <p className="muallaqat__kicker font-kufi">
          {isAr ? 'القصائد المعلّقة' : 'The Suspended Odes'}
        </p>
        <h1 className="muallaqat__title font-display">{t('title')}</h1>
        <p className="muallaqat__lede font-display">{t('lede')}</p>
        <p className="muallaqat__legend font-ui">{t('legend')}</p>
      </header>

      <MuallaqatGallery panels={panels} locale={locale} />

      <nav className="muallaqat__return">
        <a className="return-link font-kufi" href={`/${locale}/diwan`}>
          <span aria-hidden="true">{isAr ? '→' : '←'}</span> {t('backToDiwan')}
        </a>
      </nav>
    </main>
  );
}
