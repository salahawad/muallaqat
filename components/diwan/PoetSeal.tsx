import type { Poet, Poem } from '@/lib/schemas';
import { verified } from '@/lib/pending';

/**
 * A poet brought forward as an illuminated presence: a gold seal bearing the
 * first letter of the name in Kufi, the name monumental beneath, their epithet,
 * and their own opening verse (matlaʿ) — so the figure greets the reader rather
 * than sitting as a label. Links into the poet's signature poem (or page).
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
  // The seal carries the first Arabic letter of the name — always Arabic, even
  // in the English UI, because the letterform itself is the emblem.
  const seal = poet.nameAr.replace(/^(ال|أبو |ابن )/, '').trim().charAt(0);
  const matla = verified(poem?.linesAr?.[0]);
  const href = poem ? `/${locale}/poem/${poem.slug}` : `/${locale}/poet/${poet.slug}`;

  return (
    <a className="poet-seal" data-testid="poet-seal" href={href}>
      <span className="poet-seal__medallion" aria-hidden="true">
        <span className="poet-seal__letter font-kufi">{seal}</span>
      </span>
      <span className="poet-seal__name font-display">{name}</span>
      {matla ? (
        <span className="poet-seal__matla font-display" lang="ar" dir="rtl">
          {matla}
        </span>
      ) : null}
      <span className="poet-seal__cta font-kufi">
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
