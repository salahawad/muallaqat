import { z } from 'zod';

/**
 * The content model for مُعلّقات — The Living Diwan.
 * Every content module is validated against these schemas at load time, so a
 * malformed or missing entry fails the build, not the visitor.
 */

export const EmotionSchema = z.enum([
  'ghazal', // غزل — love
  'fakhr', // فخر — pride / boasting
  'ritha', // رثاء — elegy / lament
  'hija', // هجاء — satire / invective
  'hikma', // حكمة — wisdom
  'hamasa', // حماسة — valour
]);
export type Emotion = z.infer<typeof EmotionSchema>;

export const PoemTypeSchema = z.enum([
  'qasida',
  'muallaqa',
  'nathr',
  'hija',
  'muwashshah',
  'free',
]);
export type PoemType = z.infer<typeof PoemTypeSchema>;

export const EraSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  nameAr: z.string().min(1),
  nameEn: z.string().min(1),
  order: z.number().int(),
  startYear: z.number().int(),
  endYear: z.number().int(),
  descriptionAr: z.string().min(1),
  descriptionEn: z.string().min(1),
  scene: z.object({
    palette: z.array(z.string()),
    motif: z.string(),
    motion: z.string(),
  }),
});
export type Era = z.infer<typeof EraSchema>;

export const PoetSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  nameAr: z.string().min(1),
  nameEn: z.string().min(1),
  eraId: z.string().min(1),
  birthYear: z.number().int().optional(),
  deathYear: z.number().int().optional(),
  region: z.string(),
  bioAr: z.string().min(1),
  bioEn: z.string().min(1),
  humanStoryAr: z.string(),
  humanStoryEn: z.string(),
  themes: z.array(EmotionSchema),
  emblem: z.string().optional(),
  portrait: z.string().optional(),
  signaturePoemIds: z.array(z.string()),
});
export type Poet = z.infer<typeof PoetSchema>;

export const PoemSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  titleAr: z.string().min(1),
  titleEn: z.string().min(1),
  poetId: z.string().min(1),
  eraId: z.string().min(1),
  type: PoemTypeSchema,
  meter: z.string().optional(),
  rhyme: z.string().optional(),
  themes: z.array(EmotionSchema),
  linesAr: z.array(z.string().min(1)).min(1),
  linesEn: z.array(z.string()).optional(),
  transliteration: z.array(z.string()).optional(),
  contextAr: z.string().optional(),
  contextEn: z.string().optional(),
  recitationUrl: z.string().optional(),
  isMuallaqa: z.boolean(),
  source: z.array(z.string()),
});
export type Poem = z.infer<typeof PoemSchema>;

export const DuelVolleySchema = z.object({
  poetId: z.string().min(1),
  linesAr: z.array(z.string().min(1)).min(1),
  linesEn: z.array(z.string()).optional(),
  note: z.string().optional(),
});
export type DuelVolley = z.infer<typeof DuelVolleySchema>;

export const DuelSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  titleAr: z.string().min(1),
  titleEn: z.string().min(1),
  poetAId: z.string().min(1),
  poetBId: z.string().min(1),
  contextAr: z.string(),
  contextEn: z.string(),
  volleys: z.array(DuelVolleySchema),
});
export type Duel = z.infer<typeof DuelSchema>;

export const TributeWorkSchema = z.object({
  titleAr: z.string().min(1),
  titleEn: z.string().optional(),
  year: z.number().int(),
  type: z.enum(['novel', 'stories', 'study']),
  note: z.string().optional(),
});
export type TributeWork = z.infer<typeof TributeWorkSchema>;

export const TributeTranslationSchema = z.object({
  author: z.string().min(1),
  year: z.number().int().optional(),
  note: z.string().optional(),
});
export type TributeTranslation = z.infer<typeof TributeTranslationSchema>;

export const TributeQuoteSchema = z.object({
  textAr: z.string().min(1),
  textEn: z.string().optional(),
});
export type TributeQuote = z.infer<typeof TributeQuoteSchema>;

export const TributeEventSchema = z.object({
  year: z.number().int(),
  eventAr: z.string().min(1),
  eventEn: z.string().min(1),
});
export type TributeEvent = z.infer<typeof TributeEventSchema>;

export const TributeSchema = z.object({
  nameAr: z.string().min(1),
  nameEn: z.string().min(1),
  birthYear: z.number().int(),
  deathYear: z.number().int(),
  portrait: z.string().min(1),
  creedAr: z.string().min(1),
  creedEn: z.string().min(1),
  dedicationAr: z.string().min(1),
  bioAr: z.string().min(1),
  bioEn: z.string().min(1),
  timeline: z.array(TributeEventSchema),
  works: z.array(TributeWorkSchema),
  translations: z.array(TributeTranslationSchema),
  journalism: z.array(z.string()),
  quotes: z.array(TributeQuoteSchema),
});
export type Tribute = z.infer<typeof TributeSchema>;
