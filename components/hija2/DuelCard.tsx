import type { Duel, Poet } from '@/lib/schemas';
import { verified } from '@/lib/pending';

/**
 * A duel summarized as an entry in the hija2 index — the two combatants facing
 * across a gold seam, the flyting's title between them, the whole card a
 * tap-target into the full back-and-forth. Any not-yet-verified context is
 * suppressed so the sentinel never reaches the reader.
 */
type DuelCardProps = {
  duel: Duel;
  poetA: Poet;
  poetB: Poet;
  locale: string;
};

export function DuelCard({ duel, poetA, poetB, locale }: DuelCardProps) {
  const isAr = locale === 'ar';
  const title = isAr ? duel.titleAr : duel.titleEn;
  const context = verified(isAr ? duel.contextAr : duel.contextEn);
  const nameA = isAr ? poetA.nameAr : poetA.nameEn;
  const nameB = isAr ? poetB.nameAr : poetB.nameEn;

  return (
    <a
      className="duel-card"
      data-testid="duel-card"
      href={`/${locale}/hija2/${duel.slug}`}
    >
      <span className="duel-card__combatants">
        <span className="duel-card__combatant duel-card__combatant--a font-display">
          {nameA}
        </span>
        <span className="duel-card__versus font-kufi" aria-hidden="true">
          ⚔
        </span>
        <span className="duel-card__combatant duel-card__combatant--b font-display">
          {nameB}
        </span>
      </span>
      <span className="duel-card__title font-display">{title}</span>
      {context ? <span className="duel-card__context font-ui">{context}</span> : null}
      <span className="duel-card__cta font-kufi">
        {isAr ? 'ادخل المساجلة' : 'Enter the flyting'}
        <span aria-hidden="true"> ←</span>
      </span>
    </a>
  );
}
