import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MuallaqatGallery } from '@/components/muallaqat/MuallaqatGallery';
import { getMuallaqat, getPoetBySlug, getEras } from '@/lib/content';
import type { Poet } from '@/lib/schemas';

const muallaqat = getMuallaqat();
const eras = getEras();
const poetById = (id: string) => getPoetBySlug(id) as Poet;
const panels = muallaqat.map((poem) => {
  const poet = poetById(poem.poetId);
  const era = eras.find((e) => e.id === poem.eraId)!;
  return { poem, poet, eraNameAr: era.nameAr, eraNameEn: era.nameEn };
});

describe('MuallaqatGallery', () => {
  beforeEach(() => {
    // jsdom lacks IntersectionObserver; provide a no-op so the effect is safe.
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        observe = vi.fn();
        unobserve = vi.fn();
        disconnect = vi.fn();
        takeRecords = vi.fn(() => []);
      },
    );
  });

  it('renders a panel for each of the seven odes, in RTL', () => {
    const { container } = render(<MuallaqatGallery panels={panels} locale="ar" />);
    expect(screen.getAllByTestId('hanging-panel')).toHaveLength(7);
    expect(container.querySelector('[dir="rtl"]')).not.toBeNull();
  });

  it('renders every panel statically legible when reduced motion is preferred', () => {
    // matchMedia is polyfilled to "matches: false"; force the reduced query true.
    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockImplementation((q: string) => ({
        matches: q.includes('reduce'),
        media: q,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
        onchange: null,
      })),
    );
    const { container } = render(<MuallaqatGallery panels={panels} locale="ar" />);
    // With reduced motion, the gallery marks itself static and shows all panels.
    expect(container.querySelector('.muallaqat-gallery')).toHaveAttribute(
      'data-reduced-motion',
      'true',
    );
    expect(screen.getAllByTestId('hanging-panel')).toHaveLength(7);
  });

  it('shows the seven poet names', () => {
    render(<MuallaqatGallery panels={panels} locale="ar" />);
    for (const { poet } of panels) {
      expect(screen.getByText(poet.nameAr)).toBeInTheDocument();
    }
  });
});
