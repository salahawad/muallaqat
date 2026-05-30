import type { Poet } from '@/lib/schemas';

/**
 * Milestone 1 seeds a single poet — Imru' al-Qais, the wandering king and author
 * of the first of the seven Mu'allaqat. Later milestones populate every era.
 */
export const poets: Poet[] = [
  {
    id: 'imru-al-qais',
    slug: 'imru-al-qais',
    nameAr: 'امرؤ القيس',
    nameEn: "Imru' al-Qais",
    eraId: 'jahili',
    birthYear: 501,
    deathYear: 544,
    region: 'نجد',
    bioAr:
      'امرؤ القيس بن حُجر الكِنديّ، من أشهر شعراء الجاهلية وصاحب أولى المعلّقات السبع. يُلقَّب بالملك الضِّلّيل، طاف البلاد يطلب ثأر أبيه، فجمع بين مُلك ضائع وشعرٍ خالد.',
    bioEn:
      "Imru' al-Qais ibn Hujr al-Kindi, among the most famous pre-Islamic poets and author of the first of the seven Mu'allaqat. Called the Wandering King, he roamed the lands seeking vengeance for his father — a lost kingdom and an immortal verse.",
    humanStoryAr:
      'حين بلغه نبأ مقتل أبيه قال كلمته الشهيرة: «ضيّعني صغيرًا، وحمّلني دمه كبيرًا». فقضى عمره بين اللهو والثأر، وبكى الأطلال في مطلعٍ لم يبلغه شاعر بعده.',
    humanStoryEn:
      "When word reached him of his father's murder he uttered his famous line: 'He neglected me as a child, and burdened me with his blood as a man.' He spent his life between revelry and revenge, weeping over the ruins in an opening no poet has since equaled.",
    themes: ['ghazal', 'fakhr', 'hikma'],
    signaturePoemIds: ['muallaqat-imru-al-qais'],
  },
];
