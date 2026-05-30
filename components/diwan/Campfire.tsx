'use client';

import { useEffect, useRef } from 'react';

/**
 * A campfire glow with rising embers, drawn on a single canvas — the night-majlis
 * fire the desert poets recited around. Warm flickering light pools at the base of
 * the scene and gold embers drift upward.
 *
 * Honors prefers-reduced-motion: paints ONE static warm glow and stops (no loop,
 * no embers in motion). Decorative only (aria-hidden).
 */
type Ember = { x: number; y: number; r: number; vy: number; drift: number; life: number; max: number };

export function Campfire({ reducedMotion = false }: { reducedMotion?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduce =
      reducedMotion ||
      (typeof window.matchMedia === 'function' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches);

    let w = 0;
    let h = 0;
    let raf = 0;
    let t = 0;
    let embers: Ember[] = [];
    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    function resize() {
      const c = canvas as HTMLCanvasElement;
      const rect = c.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      c.width = Math.floor(w * dpr);
      c.height = Math.floor(h * dpr);
      (ctx as CanvasRenderingContext2D).setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function spawn(): Ember {
      return {
        x: w / 2 + rand(-30, 30),
        y: h - rand(10, 40),
        r: rand(0.8, 2.4),
        vy: rand(0.4, 1.1),
        drift: rand(-0.4, 0.4),
        life: 0,
        max: rand(80, 180),
      };
    }

    function glow(context: CanvasRenderingContext2D, flick: number) {
      const cx = w / 2;
      const cy = h - 8;
      const R = Math.min(w * 0.5, 340) * (0.92 + flick * 0.08);
      const g = context.createRadialGradient(cx, cy, 0, cx, cy, R);
      g.addColorStop(0, `rgba(255, 196, 92, ${0.55 * (0.9 + flick * 0.1)})`);
      g.addColorStop(0.25, 'rgba(212, 140, 58, 0.32)');
      g.addColorStop(0.6, 'rgba(120, 50, 40, 0.16)');
      g.addColorStop(1, 'rgba(7, 10, 20, 0)');
      context.fillStyle = g;
      context.fillRect(0, 0, w, h);
      // the bright core of the fire
      const core = context.createRadialGradient(cx, cy, 0, cx, cy, 60 * (0.9 + flick * 0.15));
      core.addColorStop(0, `rgba(255, 240, 200, ${0.7 * (0.85 + flick * 0.15)})`);
      core.addColorStop(1, 'rgba(255, 180, 80, 0)');
      context.fillStyle = core;
      context.fillRect(0, 0, w, h);
    }

    function frame() {
      const context = ctx as CanvasRenderingContext2D;
      t += 1;
      context.clearRect(0, 0, w, h);
      const flick = 0.5 + 0.5 * Math.sin(t * 0.18) * Math.sin(t * 0.07 + 1.3);
      glow(context, flick);

      if (embers.length < 46 && t % 3 === 0) embers.push(spawn());
      for (const e of embers) {
        e.life += 1;
        e.y -= e.vy;
        e.x += e.drift + Math.sin((e.life + e.x) * 0.05) * 0.3;
        const k = 1 - e.life / e.max;
        context.beginPath();
        context.arc(e.x, e.y, e.r, 0, Math.PI * 2);
        context.fillStyle = `rgba(255, ${Math.floor(180 + 60 * k)}, 90, ${0.7 * k})`;
        context.fill();
      }
      embers = embers.filter((e) => e.life < e.max && e.y > -8);
      raf = requestAnimationFrame(frame);
    }

    resize();
    if (reduce) {
      glow(ctx as CanvasRenderingContext2D, 0.6);
    } else {
      raf = requestAnimationFrame(frame);
    }
    const onResize = () => {
      resize();
      if (reduce) glow(ctx as CanvasRenderingContext2D, 0.6);
    };
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, [reducedMotion]);

  return <canvas ref={ref} className="era-campfire" data-testid="campfire" aria-hidden="true" />;
}
