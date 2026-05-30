import type { Duel } from '@/lib/schemas';

/**
 * The naqā'iḍ — the great poetic flytings of the Umayyad age, presented as
 * interactive back-and-forth duels. Each volley is one poet's answering salvo.
 *
 * Verse, contexts, and notes are sacred classical texts: until a dedicated
 * verification pass supplies the verbatim, cross-checked lines, every field
 * that would carry verse, biography, context, or prose carries the literal
 * sentinel `__PENDING_VERIFICATION__`. Real ids/slugs/names are filled.
 */
export const duels: Duel[] = [
  // PLACEHOLDER — replace with verified content
  {
    id: 'jarir-farazdaq',
    slug: 'jarir-farazdaq',
    titleAr: 'نقائض جرير والفرزدق',
    titleEn: 'The Naqā\'iḍ of Jarir and al-Farazdaq',
    poetAId: 'jarir',
    poetBId: 'al-farazdaq',
    contextAr: '__PENDING_VERIFICATION__',
    contextEn: '__PENDING_VERIFICATION__',
    volleys: [
      {
        poetId: 'jarir',
        linesAr: ['__PENDING_VERIFICATION__'],
        linesEn: ['__PENDING_VERIFICATION__'],
        note: '__PENDING_VERIFICATION__',
      },
      {
        poetId: 'al-farazdaq',
        linesAr: ['__PENDING_VERIFICATION__'],
        linesEn: ['__PENDING_VERIFICATION__'],
        note: '__PENDING_VERIFICATION__',
      },
    ],
  },
  // PLACEHOLDER — replace with verified content
  {
    id: 'jarir-akhtal',
    slug: 'jarir-akhtal',
    titleAr: 'نقائض جرير والأخطل',
    titleEn: 'The Naqā\'iḍ of Jarir and al-Akhtal',
    poetAId: 'jarir',
    poetBId: 'al-akhtal',
    contextAr: '__PENDING_VERIFICATION__',
    contextEn: '__PENDING_VERIFICATION__',
    volleys: [
      {
        poetId: 'jarir',
        linesAr: ['__PENDING_VERIFICATION__'],
        linesEn: ['__PENDING_VERIFICATION__'],
        note: '__PENDING_VERIFICATION__',
      },
      {
        poetId: 'al-akhtal',
        linesAr: ['__PENDING_VERIFICATION__'],
        linesEn: ['__PENDING_VERIFICATION__'],
        note: '__PENDING_VERIFICATION__',
      },
    ],
  },
];
