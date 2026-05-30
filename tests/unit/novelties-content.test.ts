import { describe, it, expect } from 'vitest';
import {
  getDuels,
  getDuelBySlug,
  getMuallaqat,
  getPoetBySlug,
  getPoemBySlug,
} from '@/lib/content';

describe('the Mu\'allaqat (getMuallaqat)', () => {
  const muallaqat = getMuallaqat();

  it('returns the seven hanging odes', () => {
    expect(muallaqat).toHaveLength(7);
    expect(muallaqat.every((p) => p.isMuallaqa)).toBe(true);
  });

  it('orders them by the traditional sequence of the Seven', () => {
    expect(muallaqat.map((p) => p.poetId)).toEqual([
      'imru-al-qais',
      'tarafa',
      'zuhayr',
      'labid',
      'amr-ibn-kulthum',
      'antara',
      'al-harith',
    ]);
  });

  it('includes the four newly seeded odes', () => {
    const ids = muallaqat.map((p) => p.id);
    expect(ids).toContain('muallaqat-tarafa');
    expect(ids).toContain('muallaqat-labid');
    expect(ids).toContain('muallaqat-amr-ibn-kulthum');
    expect(ids).toContain('muallaqat-al-harith');
  });
});

describe('the duels (getDuels / getDuelBySlug)', () => {
  it('returns the two naqā\'iḍ duels', () => {
    const duels = getDuels();
    expect(duels).toHaveLength(2);
    expect(duels.map((d) => d.slug).sort()).toEqual([
      'jarir-akhtal',
      'jarir-farazdaq',
    ]);
  });

  it('resolves a duel by slug with two volleys referencing real poets', () => {
    const duel = getDuelBySlug('jarir-farazdaq');
    expect(duel).toBeDefined();
    expect(duel!.poetAId).toBe('jarir');
    expect(duel!.poetBId).toBe('al-farazdaq');
    expect(duel!.volleys).toHaveLength(2);
    expect(getPoetBySlug('jarir')).toBeDefined();
    expect(getPoetBySlug('al-farazdaq')).toBeDefined();
  });

  it('returns undefined for an unknown duel slug', () => {
    expect(getDuelBySlug('nope')).toBeUndefined();
  });

  it('every duel references existing poets', () => {
    for (const duel of getDuels()) {
      expect(getPoetBySlug(duel.poetAId)).toBeDefined();
      expect(getPoetBySlug(duel.poetBId)).toBeDefined();
      for (const v of duel.volleys) {
        expect(getPoetBySlug(v.poetId)).toBeDefined();
      }
    }
  });
});

describe('newly seeded poets and poems parse', () => {
  it('seeds the four Jahili Muʿallaqa poets', () => {
    for (const slug of ['tarafa', 'labid', 'amr-ibn-kulthum', 'al-harith']) {
      const poet = getPoetBySlug(slug);
      expect(poet).toBeDefined();
      expect(poet!.eraId).toBe('jahili');
    }
  });

  it('seeds al-Akhtal in the Umayyad era with no signature poem', () => {
    const poet = getPoetBySlug('al-akhtal');
    expect(poet).toBeDefined();
    expect(poet!.eraId).toBe('umawi');
    expect(poet!.signaturePoemIds).toHaveLength(0);
  });

  it('seeds the four new Muʿallaqat as poems', () => {
    for (const slug of [
      'muallaqat-tarafa',
      'muallaqat-labid',
      'muallaqat-amr-ibn-kulthum',
      'muallaqat-al-harith',
    ]) {
      const poem = getPoemBySlug(slug);
      expect(poem).toBeDefined();
      expect(poem!.isMuallaqa).toBe(true);
      expect(poem!.eraId).toBe('jahili');
    }
  });
});
