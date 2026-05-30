import type { Poem } from '@/lib/schemas';

/**
 * Milestone 1 seeds the opening of the most famous of all Arabic odes — the
 * Mu'allaqa of Imru' al-Qais. Each line is one full bayt (sadr + ʿajuz).
 *
 * The text is verbatim and cross-verified across reputable public-domain
 * sources (Arabic Wikisource — proofreader-marked text — corroborated by
 * al-Diwan and Poets Gate). See `source`.
 */
export const poems: Poem[] = [
  {
    id: 'muallaqat-imru-al-qais',
    slug: 'muallaqat-imru-al-qais',
    titleAr: 'مُعلّقة امرئ القيس',
    titleEn: "The Mu'allaqa of Imru' al-Qais",
    poetId: 'imru-al-qais',
    eraId: 'jahili',
    type: 'muallaqa',
    meter: 'الطويل',
    rhyme: 'اللام',
    themes: ['ghazal', 'hikma'],
    isMuallaqa: true,
    linesAr: [
      'قِفَا نَبْكِ مِنْ ذِكْرَى حَبِيبٍ ومَنْزِلِ بِسِقْطِ اللِّوَى بَينَ الدَّخُولِ فَحَوْمَلِ',
      'فَتُوْضِحَ فَالمِقْراةِ لمْ يَعْفُ رَسْمُها لِما نَسَجَتْهَا مِنْ جَنُوبٍ وشَمْأَلِ',
      'تَرَى بَعَرَ الأرْآمِ فِي عَرَصَاتِهَا وَقِيْعَانِهَا كَأنَّهُ حَبُّ فُلْفُلِ',
      'كَأنِّي غَدَاةَ البَيْنِ يَومَ تَحَمَّلُوا لَدَى سَمُراتِ الحَيِّ نَاقِفُ حَنْظَلِ',
      'وُقُوْفًا بِها صَحْبِي عَلَيَّ مَطِيَّهُمُ يَقُوْلُوْنَ لا تَهْلِكْ أَسًى وَتَجَمَّلِ',
      'وإِنَّ شِفائِي عَبْرَةٌ مُهَراقَةٌ فَهَلْ عِندَ رَسْمٍ دَارِسٍ مِنْ مُعَوَّلِ',
      'كَدَأْبِكَ مِنْ أُمِّ الحُوَيْرِثِ قَبْلَها وَجارَتِها أُمِّ الرَّبابِ بِمَأْسَلِ',
      'إِذَا قَامَتَا تَضَوَّعَ المِسْكُ مِنهُمَا نَسِيْمَ الصَّبَا جَاءَتْ بِرَيَّا القَرَنْفُلِ',
    ],
    contextAr:
      'مطلع المعلّقة، حيث يقف الشاعر على أطلال الديار يبكي الحبيب الراحل — أشهر استهلالٍ في الشعر العربيّ كلّه.',
    contextEn:
      "The ode's opening, where the poet halts at the ruined campsite weeping for a departed love — the most famous opening in all of Arabic poetry.",
    source: [
      'https://ar.wikisource.org/wiki/معلقة_امرئ_القيس',
      'https://www.aldiwan.net/poem50.html',
    ],
  },
];
