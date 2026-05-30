'use client';

import { useEffect, useState } from 'react';
import type { Duel, Poet } from '@/lib/schemas';
import { verified } from '@/lib/pending';

export type DuelLabels = {
  next: string;
  prev: string;
  /** `{n}`/`{total}` interpolated, e.g. "Volley {n} of {total}". */
  volleyOf: string;
};

type DuelViewProps = {
  duel: Duel;
  poetsById: Record<string, Poet>;
  locale: string;
  labels: DuelLabels;
};

/**
 * The flyting as an interactive duel. Each volley is a poet's answering salvo,
 * landing on alternating sides of a central seam; the reader steps through them
 * one at a time, the rivals trading verses turn by turn.
 *
 * When the reader prefers reduced motion the stepper is removed and every
 * volley is stacked statically and fully legible. Not-yet-verified verse is
 * replaced with a quiet pending notice so the sentinel never reaches a reader.
 */
export function DuelView({ duel, poetsById, locale, labels }: DuelViewProps) {
  const isAr = locale === 'ar';
  const total = duel.volleys.length;
  const [reducedMotion, setReducedMotion] = useState(false);
  const [revealed, setRevealed] = useState(1);

  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (mq?.matches) {
      setReducedMotion(true);
      setRevealed(total);
    }
  }, [total]);

  const poetA = poetsById[duel.poetAId];
  const poetB = poetsById[duel.poetBId];
  const nameOf = (p: Poet | undefined) =>
    p ? (isAr ? p.nameAr : p.nameEn) : '';

  const fill = (tpl: string) =>
    tpl.replace('{n}', String(revealed)).replace('{total}', String(total));

  return (
    <div
      className="duel"
      data-testid="duel-view"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      <header className="duel__combatants">
        <span className="duel__combatant duel__combatant--a font-display">
          {nameOf(poetA)}
        </span>
        <span className="duel__versus font-kufi" aria-hidden="true">
          ⚔
        </span>
        <span className="duel__combatant duel__combatant--b font-display">
          {nameOf(poetB)}
        </span>
      </header>

      <ol
        className="duel__stage"
        data-testid="duel-stage"
        data-revealed={revealed}
        data-reduced-motion={reducedMotion ? 'true' : 'false'}
      >
        {duel.volleys.map((volley, i) => {
          const side = volley.poetId === duel.poetBId ? 'b' : 'a';
          const poet = poetsById[volley.poetId];
          const isShown = i < revealed;
          const lines = volley.linesAr
            .map((l) => verified(l))
            .filter((l): l is string => Boolean(l));
          const note = verified(volley.note);
          return (
            <li
              key={i}
              className={`duel__volley duel__volley--${side} ${
                isShown ? 'is-revealed' : ''
              }`}
              data-testid="duel-volley"
              data-side={side}
              aria-hidden={isShown ? undefined : true}
            >
              <span className="duel__volley-poet font-kufi">{nameOf(poet)}</span>
              <div className="duel__volley-lines font-display" lang="ar" dir="rtl">
                {lines.length > 0 ? (
                  lines.map((line, li) => <p key={li}>{line}</p>)
                ) : (
                  <p className="duel__volley-pending font-kufi">
                    {isAr ? 'النصّ قيد التحقّق' : 'verse pending verification'}
                  </p>
                )}
              </div>
              {note ? <p className="duel__volley-note font-ui">{note}</p> : null}
            </li>
          );
        })}
      </ol>

      {!reducedMotion && total > 1 ? (
        <div className="duel__stepper">
          <button
            type="button"
            className="duel__step font-kufi"
            data-testid="duel-prev"
            onClick={() => setRevealed((r) => Math.max(1, r - 1))}
            disabled={revealed <= 1}
          >
            <span aria-hidden="true">{isAr ? '→' : '←'}</span> {labels.prev}
          </button>
          <span className="duel__counter font-kufi" data-testid="duel-counter">
            {fill(labels.volleyOf)}
          </span>
          <button
            type="button"
            className="duel__step font-kufi"
            data-testid="duel-next"
            onClick={() => setRevealed((r) => Math.min(total, r + 1))}
            disabled={revealed >= total}
          >
            {labels.next} <span aria-hidden="true">{isAr ? '←' : '→'}</span>
          </button>
        </div>
      ) : null}
    </div>
  );
}
