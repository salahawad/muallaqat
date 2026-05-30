import type { Era, Poem, Poet, Emotion, PoemType } from '@/lib/schemas';

/**
 * استكشاف — Explore: pure, framework-free logic for browsing the diwan by
 * era, emotion, and form, with a forgiving Arabic-aware search.
 *
 * Everything here is a plain function over plain data so it can be unit-tested
 * in isolation and reused on both the server (to build the view-model) and the
 * client (to re-filter as the reader toggles chips and types).
 */

/** Canonical emotion order (mirrors EmotionSchema) — drives chip ordering. */
export const EMOTIONS: Emotion[] = [
  'ghazal',
  'fakhr',
  'ritha',
  'hija',
  'hikma',
  'hamasa',
];

/** Canonical poem-type order (mirrors PoemTypeSchema). */
export const POEM_TYPES: PoemType[] = [
  'qasida',
  'muallaqa',
  'nathr',
  'hija',
  'muwashshah',
  'free',
];

/**
 * Arabic diacritics & joiners to drop before matching: the harakat block
 * (fatha…sukun, shadda, tanwin), Quranic annotation marks, the superscript
 * alef, and the tatweel elongation.
 */
const AR_DIACRITICS =
  /[ؐ-ًؚ-ٰٟۖ-ۜ۟-۪ۨ-ۭـ]/g;

/**
 * Fold Arabic/Latin text into a forgiving search key: strip tashkīl, unify the
 * alef-hamza forms, taa-marbuta→haa and alef-maqsura→yaa, lowercase Latin, and
 * collapse whitespace. So "امرؤ القيس", "امرئ القيس", and "Imru al qais" all
 * become comparable substrings.
 */
export function normalizeArabic(input: string): string {
  return input
    .replace(AR_DIACRITICS, '')
    .replace(/[آأإٱ]/g, 'ا') // آ أ إ ٱ → ا
    .replace(/ؤ/g, 'و') // ؤ → و
    .replace(/ئ/g, 'ي') // ئ → ي
    .replace(/ة/g, 'ه') // ة → ه
    .replace(/ى/g, 'ي') // ى → ي
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

/** Localizers supplied by the caller (server resolves them via next-intl). */
export type ExploreLabels = {
  emotion: (e: Emotion) => string;
  type: (t: PoemType) => string;
};

/**
 * A fully localized, serializable card — safe to pass from a Server Component
 * to the client browser. Filter keys (eraId, type, emotions) live alongside the
 * display strings, and `search` is a pre-normalized haystack.
 */
export type ExploreCard = {
  id: string;
  slug: string;
  href: string;
  poetSlug?: string;
  poetHref?: string;
  title: string;
  poetName: string;
  eraId: string;
  eraName: string;
  type: PoemType;
  typeLabel: string;
  emotions: Emotion[];
  emotionLabels: string[];
  firstLine: string;
  search: string;
};

/** Join each poem to its poet and era and localize it into a card. */
export function buildCards(
  poems: Poem[],
  poets: Poet[],
  eras: Era[],
  locale: string,
  labels: ExploreLabels,
): ExploreCard[] {
  const ar = locale === 'ar';
  return poems.map((poem) => {
    const poet = poets.find((p) => p.id === poem.poetId);
    const era = eras.find((e) => e.id === poem.eraId);

    const haystack = [
      poem.titleAr,
      poem.titleEn,
      poet?.nameAr,
      poet?.nameEn,
      poem.meter,
      poem.rhyme,
      ...poem.linesAr,
    ]
      .filter((s): s is string => Boolean(s))
      .join(' ');

    return {
      id: poem.id,
      slug: poem.slug,
      href: `/${locale}/poem/${poem.slug}`,
      poetSlug: poet?.slug,
      poetHref: poet ? `/${locale}/poet/${poet.slug}` : undefined,
      title: ar ? poem.titleAr : poem.titleEn,
      poetName: poet ? (ar ? poet.nameAr : poet.nameEn) : '',
      eraId: poem.eraId,
      eraName: era ? (ar ? era.nameAr : era.nameEn) : '',
      type: poem.type,
      typeLabel: labels.type(poem.type),
      emotions: poem.themes,
      emotionLabels: poem.themes.map(labels.emotion),
      firstLine: poem.linesAr[0] ?? '',
      search: normalizeArabic(haystack),
    };
  });
}

export type ExploreCriteria = {
  eraId?: string | null;
  emotion?: Emotion | null;
  type?: PoemType | null;
  query?: string;
};

/** Filter cards by all set criteria (AND across dimensions). */
export function filterCards(
  cards: ExploreCard[],
  criteria: ExploreCriteria,
): ExploreCard[] {
  const q = criteria.query ? normalizeArabic(criteria.query) : '';
  return cards.filter((card) => {
    if (criteria.eraId && card.eraId !== criteria.eraId) return false;
    if (criteria.emotion && !card.emotions.includes(criteria.emotion)) {
      return false;
    }
    if (criteria.type && card.type !== criteria.type) return false;
    if (q && !card.search.includes(q)) return false;
    return true;
  });
}

/** A single filter chip: its key, its localized label, and how many it matches. */
export type Facet<K extends string> = {
  key: K;
  label: string;
  count: number;
};

/** Era chips, in era order, only for eras that actually have poems. */
export function eraFacets(
  cards: ExploreCard[],
  eras: Era[],
  locale: string,
): Facet<string>[] {
  const ar = locale === 'ar';
  return eras
    .map((era) => ({
      key: era.id,
      label: ar ? era.nameAr : era.nameEn,
      count: cards.filter((c) => c.eraId === era.id).length,
    }))
    .filter((f) => f.count > 0);
}

/** Emotion chips, in canonical order, only for emotions that appear. */
export function emotionFacets(
  cards: ExploreCard[],
  labels: ExploreLabels,
): Facet<Emotion>[] {
  return EMOTIONS.map((emotion) => ({
    key: emotion,
    label: labels.emotion(emotion),
    count: cards.filter((c) => c.emotions.includes(emotion)).length,
  })).filter((f) => f.count > 0);
}

/** Form (type) chips, in canonical order, only for types that appear. */
export function typeFacets(
  cards: ExploreCard[],
  labels: ExploreLabels,
): Facet<PoemType>[] {
  return POEM_TYPES.map((type) => ({
    key: type,
    label: labels.type(type),
    count: cards.filter((c) => c.type === type).length,
  })).filter((f) => f.count > 0);
}
