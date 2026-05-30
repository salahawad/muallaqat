'use client';

import { useEffect, useRef, useState } from 'react';
import type { Poem, Poet } from '@/lib/schemas';
import { HangingPanel } from './HangingPanel';

export type GalleryPanel = {
  poem: Poem;
  poet: Poet;
  eraNameAr: string;
  eraNameEn: string;
};

type MuallaqatGalleryProps = {
  panels: GalleryPanel[];
  locale: string;
};

/**
 * The hanging gallery of the Seven. The client wrapper owns the scroll
 * choreography: each panel unfurls and brightens as it enters the viewport.
 *
 * GSAP/Lenis are intentionally not dependencies, so the effect is built from
 * an IntersectionObserver toggling an `is-unfurled` class that CSS transitions
 * animate. When the reader prefers reduced motion — or the browser lacks
 * IntersectionObserver — every panel is rendered unfurled and fully legible
 * from the start.
 */
export function MuallaqatGallery({ panels, locale }: MuallaqatGalleryProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    const reduced = !!mq?.matches;
    setReducedMotion(reduced);

    const root = rootRef.current;
    if (!root) return;
    const items = Array.from(
      root.querySelectorAll<HTMLElement>('[data-testid="hanging-panel"]'),
    );

    // No motion, or no observer support → reveal everything immediately.
    if (reduced || typeof IntersectionObserver === 'undefined') {
      items.forEach((el) => el.classList.add('is-unfurled'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-unfurled');
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.25, rootMargin: '0px 0px -10% 0px' },
    );
    items.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [panels.length]);

  return (
    <div
      ref={rootRef}
      className="muallaqat-gallery"
      data-testid="muallaqat-gallery"
      data-reduced-motion={reducedMotion ? 'true' : 'false'}
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
    >
      {panels.map(({ poem, poet, eraNameAr, eraNameEn }, index) => (
        <HangingPanel
          key={poem.id}
          poem={poem}
          poet={poet}
          eraNameAr={eraNameAr}
          eraNameEn={eraNameEn}
          locale={locale}
          index={index}
        />
      ))}
    </div>
  );
}
