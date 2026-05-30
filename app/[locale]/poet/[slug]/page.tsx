import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { getPoets, getPoetBySlug, getPoems, getEras } from '@/lib/content';
import { GoldDivider } from '@/components/ornament/GoldDivider';
import { verified } from '@/lib/pending';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getPoets().map((poet) => ({ locale, slug: poet.slug })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const poet = getPoetBySlug(slug);
  if (!poet) return {};
  const isAr = locale === 'ar';
  const bio = verified(isAr ? poet.bioAr : poet.bioEn);
  return {
    title: isAr ? poet.nameAr : poet.nameEn,
    description: bio?.slice(0, 150),
  };
}

export default async function PoetPage({ params }: Props) {
  const { locale: rawLocale, slug } = await params;
  if (!hasLocale(routing.locales, rawLocale)) notFound();
  const locale = rawLocale;
  setRequestLocale(locale);

  const poet = getPoetBySlug(slug);
  if (!poet) notFound();
  const isAr = locale === 'ar';
  const era = getEras().find((e) => e.id === poet.eraId);
  const poems = getPoems().filter((p) => p.poetId === poet.id);
  const bio = verified(isAr ? poet.bioAr : poet.bioEn);
  const humanStory = verified(isAr ? poet.humanStoryAr : poet.humanStoryEn);

  return (
    <main className="poet paper-grain">
      <header className="poet__hero">
        <div className="poet__hero-glow" aria-hidden="true" />
        {era ? (
          <p className="poet__era font-kufi">{isAr ? era.nameAr : era.nameEn}</p>
        ) : null}
        <h1 className="poet__name font-display">{isAr ? poet.nameAr : poet.nameEn}</h1>
        <p className="poet__life font-kufi">
          {poet.region}
          {poet.birthYear ? ` · ${poet.birthYear}–${poet.deathYear ?? ''}` : ''}
        </p>
      </header>

      <div className="poet__body">
        <p className="poet__bio font-ui">
          {bio ?? (isAr ? 'السيرة قيد التحقّق.' : 'Biography pending verification.')}
        </p>

        {humanStory ? (
          <>
            <GoldDivider />
            <blockquote className="poet__story font-display" lang={isAr ? 'ar' : undefined} dir={isAr ? 'rtl' : undefined}>
              {humanStory}
            </blockquote>
          </>
        ) : null}

        {poems.length > 0 ? (
          <>
            <GoldDivider />
            <h2 className="poet__poems-heading font-kufi">{isAr ? 'من شعره' : 'His Verse'}</h2>
            <ul className="poet__poems">
              {poems.map((poem) => (
                <li key={poem.id} className="poet__poem">
                  <a className="poet__poem-link font-display" href={`/${locale}/poem/${poem.slug}`}>
                    {isAr ? poem.titleAr : poem.titleEn}
                  </a>
                  {poem.isMuallaqa ? <span className="poet__poem-badge font-kufi">مُعلّقة</span> : null}
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </div>
    </main>
  );
}
