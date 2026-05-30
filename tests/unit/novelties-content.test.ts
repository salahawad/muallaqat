import { describe, it, expect } from 'vitest';
import {
  getDuels,
  getDuelBySlug,
  getMuallaqat,
  getPoets,
  getPoetBySlug,
  getPoems,
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

  it('resolves a duel by slug with alternating volleys referencing real poets', () => {
    const duel = getDuelBySlug('jarir-farazdaq');
    expect(duel).toBeDefined();
    expect(duel!.poetAId).toBe('jarir');
    expect(duel!.poetBId).toBe('al-farazdaq');
    // A flyting is a back-and-forth: at least two volleys, each from one of the two duelists.
    expect(duel!.volleys.length).toBeGreaterThanOrEqual(2);
    for (const volley of duel!.volleys) {
      expect([duel!.poetAId, duel!.poetBId]).toContain(volley.poetId);
      expect(volley.linesAr.length).toBeGreaterThan(0);
    }
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

  it('seeds al-Akhtal in the Umayyad era with three resolvable signature poems', () => {
    const poet = getPoetBySlug('al-akhtal');
    expect(poet).toBeDefined();
    expect(poet!.eraId).toBe('umawi');
    expect(poet!.signaturePoemIds.length).toBeGreaterThanOrEqual(3);
    const poemIds = new Set(getPoems().map((p) => p.id));
    for (const id of poet!.signaturePoemIds) expect(poemIds.has(id)).toBe(true);
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
