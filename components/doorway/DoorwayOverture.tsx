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
  /** Label for the early-exit link that skips the overture (e.g. «تخطَّ المقدّمة»). */
  skipLabel: string;
  /** Where the gate (and the auto-advance) leads. */
  enterHref: string;
  /**
   * Countdown hint shown while the timer runs; `{n}` is replaced by the seconds
   * remaining. Defaults to the Arabic phrasing.
   */
  countdownTemplate?: string;
  /**
   * Force the static (no-animation) presentation. Tests pass this; in the
   * browser it is derived from prefers-reduced-motion.
   */
  reducedMotion?: boolean;
  /**
   * How the overture moves on to the landing. Defaults to a full navigation
   * (matching the plain-anchor gate). Tests inject a spy.
   */
  navigate?: (href: string) => void;
};

/**
 * The visible countdown: once the gate has appeared, a 5-second timer ticks down
 * beside it and then glides on to the Diwan. Any interaction cancels it, leaving
 * the gate as the explicit way forward. Reduced motion gets no timed redirect.
 * The gate fades in at ~4.5s, so the count starts after the reveal settles.
 */
const COUNTDOWN_START_MS = 4500;
const COUNTDOWN_SECONDS = 5;

export function DoorwayOverture({
  name,
  dates,
  creed,
  dedication,
  intro,
  enterLabel,
  kicker,
  skipLabel,
  enterHref,
  countdownTemplate = 'الدخول إلى الديوان بعد {n}… (حرّك أو انقر للبقاء)',
  reducedMotion = false,
  navigate,
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

  // The visible countdown. `count` is null until the gate has appeared, then
  // ticks 5→0 once per second; reaching 0 glides on to the Diwan. Any interaction
  // cancels it (count → null). Reduced motion never starts it.
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    if (!animate) return;
    const events = ['pointerdown', 'keydown', 'wheel', 'touchstart'];
    let startTimer = 0;
    let tick = 0;
    let cancelled = false;

    const stop = () => {
      cancelled = true;
      window.clearTimeout(startTimer);
      window.clearInterval(tick);
      events.forEach((e) => window.removeEventListener(e, onInteract));
      setCount(null);
    };
    const onInteract = () => stop();

    const go = () => {
      window.clearInterval(tick);
      events.forEach((e) => window.removeEventListener(e, onInteract));
      if (navigate) navigate(enterHref);
      else window.location.assign(enterHref);
    };

    // Wait for the reveal to settle, then run the visible 5→0 countdown.
    startTimer = window.setTimeout(() => {
      if (cancelled) return;
      let remaining = COUNTDOWN_SECONDS;
      setCount(remaining);
      tick = window.setInterval(() => {
        remaining -= 1;
        if (remaining <= 0) {
          setCount(0);
          go();
        } else {
          setCount(remaining);
        }
      }, 1000);
    }, COUNTDOWN_START_MS);

    events.forEach((e) =>
      window.addEventListener(e, onInteract, { passive: true, once: true }),
    );
    return stop;
  }, [animate, enterHref, navigate]);

  const state = revealed ? 'in' : 'out';
  const counting = count !== null && count > 0;

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

      {/* Early exit for those who'd rather not wait out the overture. Present
          only while the scene animates — reduced motion shows the gate at once. */}
      {animate && (
        <a className="doorway__skip font-ui" href={enterHref}>
          {skipLabel}
        </a>
      )}

      <div className="doorway__content relative z-10 flex flex-col items-center gap-6">
        <p className="doorway__kicker font-kufi text-sm text-gold-light/80">
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

        <p className="doorway__intro font-ui max-w-2xl text-balance text-xl leading-relaxed text-cream/85 md:text-2xl">
          {intro}
        </p>

        <a className="doorway__gate group font-kufi" href={enterHref}>
          <span className="doorway__gate-label">{enterLabel}</span>
          {counting ? (
            <span
              className="doorway__gate-count"
              data-testid="doorway-countdown"
              style={{ '--count-secs': `${COUNTDOWN_SECONDS}s` } as React.CSSProperties}
            >
              <svg className="doorway__gate-ring" viewBox="0 0 36 36" aria-hidden="true">
                <circle className="doorway__gate-ring-track" cx="18" cy="18" r="16" />
                <circle className="doorway__gate-ring-progress" cx="18" cy="18" r="16" />
              </svg>
              <span className="doorway__gate-num font-kufi">{count}</span>
            </span>
          ) : (
            <span className="doorway__gate-arrow" aria-hidden="true">
              ←
            </span>
          )}
        </a>

        {counting ? (
          <p className="doorway__gate-hint font-ui" aria-live="polite">
            {countdownTemplate.replace('{n}', String(count))}
          </p>
        ) : null}
      </div>
    </div>
  );
}
