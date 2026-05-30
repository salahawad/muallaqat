import {
  EraSchema,
  PoetSchema,
  PoemSchema,
  TributeSchema,
  type Era,
  type Poet,
  type Poem,
  type Tribute,
} from '@/lib/schemas';
import { eras as rawEras } from '@/content/eras';
import { poets as rawPoets } from '@/content/poets';
import { poems as rawPoems } from '@/content/poems';
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
const tribute = validate(TributeSchema, rawTribute, 'content/tribute.ts');

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

export function getTribute(): Tribute {
  return tribute;
}
