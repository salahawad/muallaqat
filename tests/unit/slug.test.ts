import { describe, it, expect } from 'vitest';
import { slugify } from '@/lib/slug';

describe('slugify', () => {
  it('lowercases and hyphenates Latin text', () => {
    expect(slugify('  Imru Al Qais  ')).toBe('imru-al-qais');
  });

  it('strips apostrophes and punctuation', () => {
    expect(slugify("Imru' al-Qais!")).toBe('imru-al-qais');
  });

  it('preserves Arabic text', () => {
    expect(slugify('امرؤ القيس')).toBe('امرؤ-القيس');
  });

  it('collapses repeated separators', () => {
    expect(slugify('a   b___c')).toBe('a-b-c');
  });
});
