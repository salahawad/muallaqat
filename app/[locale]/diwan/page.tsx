import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { getEras, getPoets, getPoems } from '@/lib/content';

type Props = {
  params: Promise<{ locale: string }>;
};

/**
 * The Living Diwan — a scroll through the eras. Each era is a full-height scene
 * carrying its own night-palette and motif; the poets and poems seeded into an
 * era surface as gold thresholds the reader can step through. Later milestones
 * deepen each scene (calligraphy, recitation); this is the cinematic spine.
 */
export default async function DiwanPage({ params }: Props) {
  const { locale: rawLocale } = await params;
  if (!hasLocale(routing.locales, rawLocale)) notFound();
  const locale = rawLocale;
  setRequestLocale(locale);
  const isAr = locale === 'ar';
  const t = await getTranslations('Doorway');

  const eras = getEras();
  const poets = getPoets();
  const poems = getPoems();

  return (
    <main className="diwan" data-testid="diwan">
      <header className="diwan__intro">
        <h1 className="diwan__title font-display">{isAr ? 'الديوان' : 'The Diwan'}</h1>
        <p className="diwan__subtitle font-ui">{t('intro')}</p>
        <span className="diwan__scroll-hint font-kufi" aria-hidden="true">
          {isAr ? '↓ تابع النزول' : '↓ scroll'}
        </span>
      </header>

      {eras.map((era) => {
        const eraPoets = poets.filter((p) => p.eraId === era.id);
        const eraPoems = poems.filter((p) => p.eraId === era.id);
        return (
          <section
            key={era.id}
            className="era-scene"
            data-testid="era-scene"
            style={
              {
                '--era-a': era.scene.palette[0],
                '--era-b': era.scene.palette[1],
                '--era-accent': era.scene.palette[2] ?? '#b8873a',
              } as React.CSSProperties
            }
          >
            <div className="era-scene__bg" aria-hidden="true" />
            <div className="era-scene__inner">
              <p className="era-scene__order font-kufi">
                {new Intl.NumberFormat(isAr ? 'ar-EG' : 'en').format(era.order)}
              </p>
              <h2 className="era-scene__name font-display">
                {isAr ? era.nameAr : era.nameEn}
              </h2>
              <p className="era-scene__range font-kufi">
                {isAr ? era.nameEn : era.nameAr}
              </p>
              <p className="era-scene__desc font-ui">
                {isAr ? era.descriptionAr : era.descriptionEn}
              </p>

              {eraPoets.length > 0 ? (
                <ul className="era-scene__poets">
                  {eraPoets.map((poet) => {
                    const sig = eraPoems.find((p) => p.poetId === poet.id);
                    const href = sig
                      ? `/${locale}/poem/${sig.slug}`
                      : `/${locale}/poet/${poet.slug}`;
                    return (
                      <li key={poet.id}>
                        <a className="era-scene__poet font-display" href={href}>
                          {isAr ? poet.nameAr : poet.nameEn}
                          {sig?.isMuallaqa ? (
                            <span className="era-scene__muallaqa font-kufi">مُعلّقة</span>
                          ) : null}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="era-scene__soon font-kufi">
                  {isAr ? 'قريبًا' : 'coming soon'}
                </p>
              )}
            </div>
          </section>
        );
      })}
    </main>
  );
}
