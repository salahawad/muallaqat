import type { Poet, Poem } from '@/lib/schemas';
import { RobedFigure } from '@/components/diwan/RobedFigure';

/** A stable pose (0|1|2) per poet, derived from the id so the row varies but
 *  never shuffles between renders. */
function poseFor(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h % 3;
}

/**
 * A poet brought forward as an illuminated cartouche: a robed figure seated in
 * shadow within a gilt arabesque frame, the name on an illuminated plate, and
 * the poet's own opening verse (matlaʿ) glowing in a pool of lamplight — presence
 * and dignity without inventing a face. Links into the signature poem (or page).
 */
type PoetSealProps = {
  poet: Poet;
  /** The poet's signature poem, if seeded — supplies the matlaʿ and the link. */
  poem?: Poem;
  locale: string;
};

export function PoetSeal({ poet, poem, locale }: PoetSealProps) {
  const isAr = locale === 'ar';
  const name = isAr ? poet.nameAr : poet.nameEn;
  const matla = poem?.linesAr?.[0];
  const href = `/${locale}/poet/${poet.slug}`;
  const years =
    poet.birthYear || poet.deathYear
      ? `${poet.birthYear ?? ''}${poet.deathYear ? `–${poet.deathYear}` : ''}`
      : poet.region;

  return (
    <a className="poet-cartouche" data-testid="poet-seal" href={href}>
      {/* Gilt arabesque corners frame the figure like a manuscript illumination. */}
      <span className="poet-cartouche__corner poet-cartouche__corner--tr" aria-hidden="true" />
      <span className="poet-cartouche__corner poet-cartouche__corner--tl" aria-hidden="true" />
      <span className="poet-cartouche__corner poet-cartouche__corner--br" aria-hidden="true" />
      <span className="poet-cartouche__corner poet-cartouche__corner--bl" aria-hidden="true" />

      {/* The robed presence, seated in shadow under a pool of lamplight. */}
      <span className="poet-cartouche__figure" aria-hidden="true">
        <span className="poet-cartouche__lamp" />
        <RobedFigure pose={poseFor(poet.id)} className="poet-cartouche__robe" />
      </span>

      <span className="poet-cartouche__plate">
        <span className="poet-cartouche__name font-display">{name}</span>
        <span className="poet-cartouche__years font-kufi">{years}</span>
      </span>

      {matla ? (
        <span className="poet-cartouche__matla font-display" lang="ar" dir="rtl">
          {matla}
        </span>
      ) : null}

      <span className="poet-cartouche__cta font-kufi">
        {isAr ? 'اقرأ ديوانه' : 'Read his verse'}
        <span aria-hidden="true"> ←</span>
      </span>
    </a>
  );
}
