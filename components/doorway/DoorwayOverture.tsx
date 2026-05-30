'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * القلم والليل — The Pen and the Night.
 *
 * The overture that greets every visitor. It opens in deep night; the father's
 * name writes itself right-to-left in gold (a reed-pen glow tracing each stroke);
 * a gold rule draws beneath it; his creed rises from the dark; then warm dawn
 * light blooms and the gate to the Diwan opens — night becoming dawn.
 *
 * Honors prefers-reduced-motion: when reduced motion is requested (or JS hasn't
 * hydrated yet) every element is rendered final and visible, no animation — the
 * full tribute is always legible.
 */

type DoorwayOvertureProps = {
  /** The name, written in gold (e.g. «عوض شعبان»). */
  name: string;
  /** Life dates beneath the name. */
  dates: string;
  /** His creed — the soul of the project. */
  creed: string;
  /** The dedication line from the son. */
  dedication: string;
  /** One-line description of the collection. */
  intro: string;
  /** Label for the gate into the Diwan. */
  enterLabel: string;
  /** Small kicker above the title (e.g. «ديوانٌ حيّ»). */
  kicker: string;
  /** Where the gate leads. */
  enterHref: string;
  /**
   * Force the static (no-animation) presentation. Tests pass this; in the
   * browser it is derived from prefers-reduced-motion.
   */
  reducedMotion?: boolean;
};

export function DoorwayOverture({
  name,
  dates,
  creed,
  dedication,
  intro,
  enterLabel,
  kicker,
  enterHref,
  reducedMotion = false,
}: DoorwayOvertureProps) {
  // Start "unrevealed" only if we will actually animate. If reducedMotion is
  // forced (tests / SSR fallback), render everything visible from the first paint.
  const [revealed, setRevealed] = useState(reducedMotion);
  const [prefersReduced, setPrefersReduced] = useState(reducedMotion);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Guard: some environments (older browsers, certain test runners) lack
    // matchMedia. Without it we simply present the scene final and legible.
    const mq =
      typeof window.matchMedia === 'function'
        ? window.matchMedia('(prefers-reduced-motion: reduce)')
        : null;
    if (!mq || mq.matches) {
      setPrefersReduced(true);
      setRevealed(true);
      return;
    }
    // Kick the staged reveal on the next frame so transitions run.
    const id = requestAnimationFrame(() => setRevealed(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const animate = !prefersReduced && !reducedMotion;
  const state = revealed ? 'in' : 'out';

  return (
    <div
      ref={rootRef}
      data-testid="doorway-overture"
      data-animate={animate ? 'true' : 'false'}
      data-state={state}
      className="doorway relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 text-center"
    >
      {/* Night sky → dawn. The radial "dawn" warms in as the scene reveals. */}
      <div className="doorway__night" aria-hidden="true" />
      <div className="doorway__dawn" aria-hidden="true" />
      <div className="doorway__stars" aria-hidden="true" />

      <div className="doorway__content relative z-10 flex flex-col items-center gap-6">
        <p className="doorway__kicker font-kufi text-xs tracking-[0.4em] text-gold-light/80 uppercase">
          {kicker}
        </p>

        {/* The name — written in gold. The qalam glow traces it (see CSS). */}
        <h1 className="doorway__name font-display text-gold" lang="ar" dir="rtl">
          <span className="doorway__name-ink">{name}</span>
          <span className="doorway__qalam" aria-hidden="true" />
        </h1>

        {/* Self-drawing gold rule beneath the name. */}
        <span className="doorway__rule" aria-hidden="true" />

        <p className="doorway__dates font-kufi text-sm tracking-[0.3em] text-gold-pale/70">
          {dates}
        </p>

        {/* The creed, rising from the dark. */}
        <blockquote
          className="doorway__creed font-display text-balance text-2xl leading-relaxed text-cream md:text-3xl"
          lang="ar"
          dir="rtl"
        >
          {creed}
        </blockquote>

        <p className="doorway__dedication font-ui text-sm text-gold-pale/60">
          {dedication}
        </p>

        <p className="doorway__intro font-ui max-w-xl text-balance text-base leading-relaxed text-cream/70">
          {intro}
        </p>

        <a className="doorway__gate group font-kufi" href={enterHref}>
          <span className="doorway__gate-label">{enterLabel}</span>
          <span className="doorway__gate-arrow" aria-hidden="true">
            ←
          </span>
        </a>
      </div>
    </div>
  );
}
