import {
  EraSchema,
  PoetSchema,
  PoemSchema,
  DuelSchema,
  TributeSchema,
  type Era,
  type Poet,
  type Poem,
  type Duel,
  type Tribute,
} from '@/lib/schemas';
import { eras as rawEras } from '@/content/eras';
import { poets as rawPoets } from '@/content/poets';
import { poems as rawPoems } from '@/content/poems';
import { duels as rawDuels } from '@/content/duels';
import { tribute as rawTribute } from '@/content/tribute';
import { z } from 'zod';

/**
 * Validating content loaders. Each source module is parsed through its Zod
 * schema at import time, so malformed or missing content fails the build with a
 * clear message rather than reaching a visitor.
 */
function validate<T>(schema: z.ZodType<T>, data: unknown, label: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Error(
      `Invalid content in ${label}:\n${JSON.stringify(result.error.flatten(), null, 2)}`,
    );
  }
  return result.data;
}

const eras = validate(z.array(EraSchema), rawEras, 'content/eras.ts');
const poets = validate(z.array(PoetSchema), rawPoets, 'content/poets.ts');
const poems = validate(z.array(PoemSchema), rawPoems, 'content/poems.ts');
const duels = validate(z.array(DuelSchema), rawDuels, 'content/duels.ts');
const tribute = validate(TributeSchema, rawTribute, 'content/tribute.ts');

/**
 * The traditional sequence of the Seven Mu'allaqat, as transmitted in the
 * classical anthologies — the order in which they "hang" in the gallery.
 */
const MUALLAQAT_ORDER = [
  'imru-al-qais',
  'tarafa',
  'zuhayr',
  'labid',
  'amr-ibn-kulthum',
  'antara',
  'al-harith',
] as const;

export function getEras(): Era[] {
  return [...eras].sort((a, b) => a.order - b.order);
}

export function getPoets(): Poet[] {
  return poets;
}

export function getPoetBySlug(slug: string): Poet | undefined {
  return poets.find((p) => p.slug === slug);
}

export function getPoems(): Poem[] {
  return poems;
}

export function getPoemBySlug(slug: string): Poem | undefined {
  return poems.find((p) => p.slug === slug);
}

export function getDuels(): Duel[] {
  return duels;
}

export function getDuelBySlug(slug: string): Duel | undefined {
  return duels.find((d) => d.slug === slug);
}

/**
 * The Seven Mu'allaqat that hang in the gallery, ordered by their traditional
 * classical sequence. Scoped to the canonical Seven (by poet) so that other
 * Mu'allaqa-marked odes in the collection (e.g. al-Nabigha, of the later
 * "Ten") remain browsable on their poem pages without crowding the Seven.
 */
export function getMuallaqat(): Poem[] {
  const rank = (poetId: string) =>
    MUALLAQAT_ORDER.indexOf(poetId as (typeof MUALLAQAT_ORDER)[number]);
  return poems
    .filter((p) => p.isMuallaqa === true && rank(p.poetId) !== -1)
    .sort((a, b) => rank(a.poetId) - rank(b.poetId));
}

export function getTribute(): Tribute {
  return tribute;
}
