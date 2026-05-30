import { describe, it, expect } from 'vitest';
import type { Era, Poem, Poet } from '@/lib/schemas';
import {
  normalizeArabic,
  buildCards,
  filterCards,
  eraFacets,
  emotionFacets,
  typeFacets,
  EMOTIONS,
  POEM_TYPES,
  type ExploreLabels,
} from '@/lib/explore';

// Stub labels — deterministic, so tests assert wiring, not translations.
const labels: ExploreLabels = {
  emotion: (e) => `EMO:${e}`,
  type: (t) => `TYP:${t}`,
};

// ---- Fixtures -------------------------------------------------------------

function era(over: Partial<Era> & Pick<Era, 'id' | 'order'>): Era {
  return {
    slug: over.id,
    nameAr: `عصر-${over.id}`,
    nameEn: `Era ${over.id}`,
    startYear: 0,
    endYear: 0,
    descriptionAr: 'و',
    descriptionEn: 'd',
    scene: { palette: [], motif: 'm', motion: 'x' },
    ...over,
  };
}

function poet(over: Partial<Poet> & Pick<Poet, 'id' | 'eraId'>): Poet {
  return {
    slug: over.id,
    nameAr: `شاعر-${over.id}`,
    nameEn: `Poet ${over.id}`,
    region: 'r',
    bioAr: 'ب',
    bioEn: 'b',
    humanStoryAr: '',
    humanStoryEn: '',
    themes: [],
    signaturePoemIds: [],
    ...over,
  };
}

function poem(
  over: Partial<Poem> &
    Pick<Poem, 'id' | 'poetId' | 'eraId' | 'type' | 'themes'>,
): Poem {
  return {
    slug: over.id,
    titleAr: `قصيدة-${over.id}`,
    titleEn: `Poem ${over.id}`,
    linesAr: ['سطرٌ أوّل'],
    isMuallaqa: false,
    source: [],
    ...over,
  };
}

const eras: Era[] = [
  era({ id: 'jahili', order: 1, nameAr: 'العصر الجاهلي', nameEn: 'Pre-Islamic' }),
  era({ id: 'abbasi', order: 3, nameAr: 'العصر العباسي', nameEn: 'Abbasid' }),
  era({ id: 'hadith', order: 5, nameAr: 'العصر الحديث', nameEn: 'Modern' }),
  era({ id: 'andalusi', order: 4, nameAr: 'الأندلس', nameEn: 'Al-Andalus' }), // no poems
];

const poets: Poet[] = [
  poet({ id: 'imru', eraId: 'jahili', nameAr: 'امرؤ القيس', nameEn: "Imru' al-Qais" }),
  poet({ id: 'antara', eraId: 'jahili', nameAr: 'عنترة', nameEn: 'Antara' }),
  poet({ id: 'shaaban', eraId: 'hadith', nameAr: 'عوض شعبان', nameEn: 'Awad Shaaban' }),
  poet({ id: 'mutanabbi', eraId: 'abbasi', nameAr: 'المتنبي', nameEn: 'al-Mutanabbi' }),
];

const poems: Poem[] = [
  poem({
    id: 'p-imru',
    poetId: 'imru',
    eraId: 'jahili',
    type: 'muallaqa',
    themes: ['ghazal', 'hikma'],
    titleAr: 'مُعلّقة امرئ القيس',
    titleEn: "The Mu'allaqa of Imru' al-Qais",
    meter: 'الطويل',
    linesAr: ['قِفَا نَبْكِ مِنْ ذِكْرَى حَبِيبٍ ومَنْزِلِ'],
    isMuallaqa: true,
  }),
  poem({
    id: 'p-antara',
    poetId: 'antara',
    eraId: 'jahili',
    type: 'qasida',
    themes: ['fakhr', 'hamasa'],
    titleAr: 'مُعلّقة عنترة',
    titleEn: 'The Ode of Antara',
    meter: 'الكامل',
    linesAr: ['هل غادرَ الشعراءُ من مُتردَّمِ'],
  }),
  poem({
    id: 'p-shaaban',
    poetId: 'shaaban',
    eraId: 'hadith',
    type: 'free',
    themes: ['ritha'],
    titleAr: 'مرثيّة',
    titleEn: 'Elegy',
    linesAr: ['رحلْتَ وبقي الحرفُ'],
  }),
  poem({
    id: 'p-mutanabbi',
    poetId: 'mutanabbi',
    eraId: 'abbasi',
    type: 'qasida',
    themes: ['fakhr', 'hikma'],
    titleAr: 'على قدرِ أهلِ العزمِ',
    titleEn: 'On the Measure of the Resolute',
    meter: 'البسيط',
    linesAr: ['على قدرِ أهلِ العزمِ تأتي العزائمُ'],
  }),
];

// ---- normalizeArabic ------------------------------------------------------

describe('normalizeArabic', () => {
  it('strips harakat / tashkīl so vocalized and bare text match', () => {
    expect(normalizeArabic('مُعَلَّقَة')).toBe(normalizeArabic('معلقة'));
  });

  it('folds the alef-hamza forms (أ إ آ ٱ) to bare alef', () => {
    expect(normalizeArabic('أحمد')).toBe(normalizeArabic('احمد'));
    expect(normalizeArabic('إيمان')).toBe(normalizeArabic('ايمان'));
    expect(normalizeArabic('آمال')).toBe(normalizeArabic('امال'));
  });

  it('folds taa-marbuta (ة) to haa and alef-maqsura (ى) to yaa', () => {
    expect(normalizeArabic('قصيدة')).toBe(normalizeArabic('قصيده'));
    expect(normalizeArabic('ليلى')).toBe(normalizeArabic('ليلي'));
  });

  it('strips the tatweel (ـ) elongation', () => {
    expect(normalizeArabic('الطـــويل')).toBe(normalizeArabic('الطويل'));
  });

  it('lowercases Latin text and collapses whitespace', () => {
    expect(normalizeArabic('  Imru   AL-Qais ')).toBe('imru al-qais');
  });
});

// ---- buildCards -----------------------------------------------------------

describe('buildCards', () => {
  it('produces one card per poem, preserving input order', () => {
    const cards = buildCards(poems, poets, eras, 'ar', labels);
    expect(cards).toHaveLength(poems.length);
    expect(cards.map((c) => c.id)).toEqual([
      'p-imru',
      'p-antara',
      'p-shaaban',
      'p-mutanabbi',
    ]);
  });

  it('joins each poem to its poet and era and builds locale-aware hrefs', () => {
    const cards = buildCards(poems, poets, eras, 'ar', labels);
    const imru = cards[0];
    expect(imru.href).toBe('/ar/poem/p-imru');
    expect(imru.poetHref).toBe('/ar/poet/imru');
    expect(imru.poetName).toBe('امرؤ القيس');
    expect(imru.eraName).toBe('العصر الجاهلي');
  });

  it('localizes title and era for English', () => {
    const cards = buildCards(poems, poets, eras, 'en', labels);
    expect(cards[0].title).toBe("The Mu'allaqa of Imru' al-Qais");
    expect(cards[0].eraName).toBe('Pre-Islamic');
    expect(cards[0].href).toBe('/en/poem/p-imru');
  });

  it('carries emotion keys with parallel localized labels and the type label', () => {
    const card = buildCards(poems, poets, eras, 'ar', labels)[0];
    expect(card.emotions).toEqual(['ghazal', 'hikma']);
    expect(card.emotionLabels).toEqual(['EMO:ghazal', 'EMO:hikma']);
    expect(card.typeLabel).toBe('TYP:muallaqa');
  });

  it('exposes the first bayt as a preview line', () => {
    const card = buildCards(poems, poets, eras, 'ar', labels)[0];
    expect(card.firstLine).toBe('قِفَا نَبْكِ مِنْ ذِكْرَى حَبِيبٍ ومَنْزِلِ');
  });

  it('builds a normalized search haystack covering title, poet, meter and lines', () => {
    const card = buildCards(poems, poets, eras, 'ar', labels)[0];
    // meter is searchable even though it is not shown as a chip
    expect(card.search).toContain(normalizeArabic('الطويل'));
    expect(card.search).toContain(normalizeArabic('امرؤ القيس'));
    expect(card.search).toContain(normalizeArabic("Imru' al-Qais"));
  });

  it('is defensive when a poem references a missing poet', () => {
    const orphan = poem({
      id: 'orphan',
      poetId: 'nobody',
      eraId: 'jahili',
      type: 'nathr',
      themes: [],
    });
    const card = buildCards([orphan], poets, eras, 'ar', labels)[0];
    expect(card.poetName).toBe('');
    expect(card.poetHref).toBeUndefined();
  });
});

// ---- filterCards ----------------------------------------------------------

describe('filterCards', () => {
  const cards = buildCards(poems, poets, eras, 'ar', labels);

  it('returns everything when no criteria are set', () => {
    expect(filterCards(cards, {})).toHaveLength(4);
  });

  it('filters by era', () => {
    const r = filterCards(cards, { eraId: 'jahili' });
    expect(r.map((c) => c.id).sort()).toEqual(['p-antara', 'p-imru']);
  });

  it('filters by emotion (a poem matches if its themes include it)', () => {
    const r = filterCards(cards, { emotion: 'hikma' });
    expect(r.map((c) => c.id).sort()).toEqual(['p-imru', 'p-mutanabbi']);
  });

  it('filters by poem type', () => {
    const r = filterCards(cards, { type: 'qasida' });
    expect(r.map((c) => c.id).sort()).toEqual(['p-antara', 'p-mutanabbi']);
  });

  it('ANDs filters across dimensions', () => {
    const r = filterCards(cards, { eraId: 'jahili', emotion: 'hikma' });
    expect(r.map((c) => c.id)).toEqual(['p-imru']);
  });

  it('matches an English title query case-insensitively', () => {
    const r = filterCards(cards, { query: 'elegy' });
    expect(r.map((c) => c.id)).toEqual(['p-shaaban']);
  });

  it('matches an Arabic poet-name query ignoring diacritics', () => {
    const r = filterCards(cards, { query: 'عنتره' }); // taa-marbuta vs haa
    expect(r.map((c) => c.id)).toEqual(['p-antara']);
  });

  it('matches by meter even though meter has no chip', () => {
    const r = filterCards(cards, { query: 'البسيط' });
    expect(r.map((c) => c.id)).toEqual(['p-mutanabbi']);
  });

  it('returns an empty list when nothing matches', () => {
    expect(filterCards(cards, { query: 'zzz-nothing' })).toEqual([]);
  });
});

// ---- facets ---------------------------------------------------------------

describe('facets', () => {
  const cards = buildCards(poems, poets, eras, 'ar', labels);

  it('eraFacets counts poems per era, ordered by the eras array, omitting empties', () => {
    const f = eraFacets(cards, eras, 'ar');
    expect(f.map((x) => [x.key, x.count])).toEqual([
      ['jahili', 2],
      ['abbasi', 1],
      ['hadith', 1],
    ]);
    // andalusi has no poems and must be omitted
    expect(f.find((x) => x.key === 'andalusi')).toBeUndefined();
    // labels are localized era names
    expect(f[0].label).toBe('العصر الجاهلي');
  });

  it('emotionFacets counts poems per emotion in the canonical order, omitting empties', () => {
    const f = emotionFacets(cards, labels);
    expect(f.map((x) => [x.key, x.count])).toEqual([
      ['ghazal', 1],
      ['fakhr', 2],
      ['ritha', 1],
      ['hikma', 2],
      ['hamasa', 1],
    ]);
    expect(f[0].label).toBe('EMO:ghazal');
  });

  it('typeFacets counts poems per type in the canonical order, omitting empties', () => {
    const f = typeFacets(cards, labels);
    expect(f.map((x) => [x.key, x.count])).toEqual([
      ['qasida', 2],
      ['muallaqa', 1],
      ['free', 1],
    ]);
  });
});

// ---- exported orderings ---------------------------------------------------

describe('canonical orderings', () => {
  it('EMOTIONS matches the schema emotion set', () => {
    expect([...EMOTIONS].sort()).toEqual(
      ['fakhr', 'ghazal', 'hamasa', 'hija', 'hikma', 'ritha'].sort(),
    );
  });

  it('POEM_TYPES matches the schema type set', () => {
    expect([...POEM_TYPES].sort()).toEqual(
      ['free', 'hija', 'muallaqa', 'muwashshah', 'nathr', 'qasida'].sort(),
    );
  });
});
