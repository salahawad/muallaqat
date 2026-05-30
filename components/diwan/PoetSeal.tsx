import type { Poet, Poem } from '@/lib/schemas';

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
  const href = poem ? `/${locale}/poem/${poem.slug}` : `/${locale}/poet/${poet.slug}`;
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
        <svg className="poet-cartouche__robe" viewBox="0 0 120 140" preserveAspectRatio="xMidYMax meet">
          {/* head + shoulders + a seated robe silhouette */}
          <circle cx="60" cy="34" r="16" />
          <path d="M60 50 q-10 0 -16 8 q-14 16 -18 50 q-2 18 -2 32 h72 q0 -14 -2 -32 q-4 -34 -18 -50 q-6 -8 -16 -8 Z" />
          {/* a suggestion of the headdress drape */}
          <path d="M44 30 q16 -22 32 0 q-4 -6 -16 -6 q-12 0 -16 6 Z" />
        </svg>
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
        {poem?.isMuallaqa
          ? isAr
            ? 'اقرأ المعلّقة'
            : 'Read the Muʿallaqa'
          : isAr
            ? 'اقرأ القصيدة'
            : 'Read the poem'}
        <span aria-hidden="true"> ←</span>
      </span>
    </a>
  );
}
