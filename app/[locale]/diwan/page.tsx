import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { getEras, getPoets, getPoems } from '@/lib/content';
import { PoetSeal } from '@/components/diwan/PoetSeal';
import { EraDiorama } from '@/components/diwan/EraDiorama';
import { Campfire } from '@/components/diwan/Campfire';

const DIORAMA_VARIANT: Record<string, 'desert-night' | 'duel' | 'golden-court' | 'garden' | 'nahda'> = {
  jahili: 'desert-night',
  umawi: 'duel',
  abbasi: 'golden-court',
  andalusi: 'garden',
  hadith: 'nahda',
};

type Props = {
  params: Promise<{ locale: string }>;
};

/**
 * The Living Diwan — a scroll through the eras. Each era is a full-height scene
 * carrying its own night-palette and motif; the poets seeded into an era step
 * forward as illuminated seals, each bearing their own opening verse, so the
 * masters greet the reader rather than sitting as labels.
 */
export default async function DiwanPage({ params }: Props) {
  const { locale: rawLocale } = await params;
  if (!hasLocale(routing.locales, rawLocale)) notFound();
  const locale = rawLocale;
  setRequestLocale(locale);
  const isAr = locale === 'ar';

  const eras = getEras();
  const poets = getPoets();
  const poems = getPoems();
  const poetCount = poets.length;

  return (
    <main className="diwan" data-testid="diwan">
      <header className="diwan__intro diwan__intro--majlis">
        <EraDiorama variant="desert-night" />
        <Campfire />
        <div className="diwan__intro-veil" aria-hidden="true" />
        <div className="diwan__intro-content">
          <p className="diwan__intro-kicker font-kufi">
            {isAr ? 'اجلِس في مجلس العرب' : 'Take your seat in the majlis'}
          </p>
          <h1 className="diwan__title font-display">{isAr ? 'الديوان' : 'The Diwan'}</h1>
          <p className="diwan__subtitle font-ui">
            {isAr
              ? `حول النار، بين خمسة عصورٍ و${toArabicNumerals(poetCount)} من فحول الشعراء — من معلّقات الجاهلية إلى نهضة الحديث.`
              : `Around the fire, through five eras and ${poetCount} master poets — from the odes of the Jahiliyya to the modern Nahda.`}
          </p>
          <span className="diwan__scroll-hint font-kufi" aria-hidden="true">
            {isAr ? 'تابِع النزول ↓' : 'scroll ↓'}
          </span>
        </div>
      </header>

      {eras.map((era) => {
        const eraPoets = poets.filter((p) => p.eraId === era.id);
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
            <EraDiorama variant={DIORAMA_VARIANT[era.id] ?? 'desert-night'} />
            {era.id === 'jahili' ? <Campfire /> : null}
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
                <div className="era-scene__poets">
                  {eraPoets.map((poet) => {
                    const sig = poems.find(
                      (p) => p.id === poet.signaturePoemIds[0] && p.poetId === poet.id,
                    );
                    return (
                      <PoetSeal key={poet.id} poet={poet} poem={sig} locale={locale} />
                    );
                  })}
                </div>
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

function toArabicNumerals(n: number): string {
  return new Intl.NumberFormat('ar-EG', { useGrouping: false }).format(n);
}
