import { describe, it, expect } from 'vitest';
import {
  getEras,
  getPoets,
  getPoems,
  getTribute,
  getPoetBySlug,
  getPoemBySlug,
} from '@/lib/content';

describe('content loaders', () => {
  it('returns the five eras in ascending order', () => {
    const eras = getEras();
    expect(eras).toHaveLength(5);
    const orders = eras.map((e) => e.order);
    expect(orders).toEqual([...orders].sort((a, b) => a - b));
    expect(eras[0].id).toBe('jahili');
  });

  it('includes the modern era where the father stands', () => {
    expect(getEras().some((e) => e.id === 'hadith')).toBe(true);
  });

  it('seeds Imru al-Qais', () => {
    const poet = getPoetBySlug('imru-al-qais');
    expect(poet).toBeDefined();
    expect(poet!.eraId).toBe('jahili');
    expect(getPoets().length).toBeGreaterThanOrEqual(1);
  });

  it("includes Imru al-Qais's Mu'allaqa with its verified opening", () => {
    const poem = getPoemBySlug('muallaqat-imru-al-qais');
    expect(poem).toBeDefined();
    expect(poem!.isMuallaqa).toBe(true);
    expect(poem!.linesAr.length).toBeGreaterThanOrEqual(8);
    expect(poem!.linesAr[0]).toContain('قِفَا نَبْكِ');
    expect(poem!.source.length).toBeGreaterThanOrEqual(2);
  });

  it('every poem references an existing poet and era', () => {
    const poetIds = new Set(getPoets().map((p) => p.id));
    const eraIds = new Set(getEras().map((e) => e.id));
    for (const poem of getPoems()) {
      expect(poetIds.has(poem.poetId)).toBe(true);
      expect(eraIds.has(poem.eraId)).toBe(true);
    }
  });
});

describe('tribute content (Awad Shaaban)', () => {
  const t = getTribute();

  it('carries the verified name and dates', () => {
    expect(t.nameAr).toBe('عوض شعبان');
    expect(t.nameEn).toBe('Awad Shaaban');
    expect(t.birthYear).toBe(1931);
    expect(t.deathYear).toBe(2025);
  });

  it('points at the public portrait', () => {
    expect(t.portrait).toBe('/awad-shaaban-portrait.jpg');
  });

  it('carries the verbatim creed', () => {
    expect(t.creedAr).toBe(
      'الكتابة ليست موهبة فحسب، بل هي مسؤولية تجاه الكلمة والإنسان.',
    );
  });

  it('lists 7 novels, 6 story collections, 1 study, and 12 translations', () => {
    expect(t.works.filter((w) => w.type === 'novel')).toHaveLength(7);
    expect(t.works.filter((w) => w.type === 'stories')).toHaveLength(6);
    expect(t.works.filter((w) => w.type === 'study')).toHaveLength(1);
    expect(t.works).toHaveLength(14);
    expect(t.translations).toHaveLength(12);
  });

  it('includes درب الجنوب among the novels and in the timeline', () => {
    expect(t.works.some((w) => w.titleAr === 'درب الجنوب' && w.type === 'novel')).toBe(true);
    expect(t.timeline.some((e) => e.year === 1988 && e.eventAr.includes('درب الجنوب'))).toBe(true);
  });
});
