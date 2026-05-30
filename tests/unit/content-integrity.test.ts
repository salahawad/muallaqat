import { describe, it, expect } from 'vitest';
import { getEras, getPoets, getPoems } from '@/lib/content';

/**
 * Content-integrity guarantees for the Diwan. These encode the invariants that
 * keep every poem reflected consistently across every page:
 *  - poets are unique (no duplicate seals in the Diwan, no double-counted total);
 *  - every poet carries at least three works (its three most famous);
 *  - every cross-reference resolves (poems → poet/era, poets → signature poems);
 *  - every poem cites at least two sources.
 */
describe('content integrity', () => {
  const poets = getPoets();
  const poems = getPoems();
  const eras = getEras();
  const poetIds = new Set(poets.map((p) => p.id));
  const eraIds = new Set(eras.map((e) => e.id));
  const poemById = new Map(poems.map((p) => [p.id, p]));

  it('has no duplicate poet id or slug', () => {
    const ids = poets.map((p) => p.id);
    const slugs = poets.map((p) => p.slug);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('gives every poet at least three works', () => {
    for (const poet of poets) {
      const count = poems.filter((p) => p.poetId === poet.id).length;
      expect(count, `${poet.id} has ${count} poems`).toBeGreaterThanOrEqual(3);
    }
  });

  it('resolves every poem to an existing poet and era', () => {
    for (const poem of poems) {
      expect(poetIds.has(poem.poetId), `${poem.slug} → ${poem.poetId}`).toBe(true);
      expect(eraIds.has(poem.eraId), `${poem.slug} → ${poem.eraId}`).toBe(true);
    }
  });

  it("resolves every poet's signature poems to its own poems", () => {
    for (const poet of poets) {
      for (const id of poet.signaturePoemIds) {
        const poem = poemById.get(id);
        expect(poem, `${poet.id} → ${id}`).toBeDefined();
        expect(poem!.poetId, `${id} belongs to ${poem!.poetId}, not ${poet.id}`).toBe(poet.id);
      }
    }
  });

  it('cites at least two sources for every poem', () => {
    for (const poem of poems) {
      expect(poem.source.length, `${poem.slug} has ${poem.source.length} source(s)`).toBeGreaterThanOrEqual(2);
    }
  });
});
