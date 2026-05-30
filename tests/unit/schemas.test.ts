import { describe, it, expect } from 'vitest';
import { TributeSchema, PoemSchema, EraSchema } from '@/lib/schemas';

const validPoem = {
  id: 'p1',
  slug: 'p1',
  titleAr: 'عنوان',
  titleEn: 'Title',
  poetId: 'poet1',
  eraId: 'jahili',
  type: 'muallaqa' as const,
  themes: ['ghazal' as const],
  linesAr: ['بيت شعر'],
  isMuallaqa: true,
  source: ['https://example.org'],
};

describe('schemas', () => {
  it('accepts a valid Poem', () => {
    expect(PoemSchema.safeParse(validPoem).success).toBe(true);
  });

  it('rejects a Poem missing isMuallaqa', () => {
    const { isMuallaqa, ...missing } = validPoem;
    expect(PoemSchema.safeParse(missing).success).toBe(false);
  });

  it('rejects a Poem with an unknown emotion', () => {
    const bad = { ...validPoem, themes: ['joy'] };
    expect(PoemSchema.safeParse(bad).success).toBe(false);
  });

  it('rejects a Poem with empty linesAr', () => {
    const bad = { ...validPoem, linesAr: [] };
    expect(PoemSchema.safeParse(bad).success).toBe(false);
  });

  it('rejects an Era missing a required field', () => {
    expect(EraSchema.safeParse({ id: 'x' }).success).toBe(false);
  });

  it('requires the core Tribute fields', () => {
    expect(TributeSchema.safeParse({ nameAr: 'x' }).success).toBe(false);
  });
});
