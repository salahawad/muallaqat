import type { Tribute } from '@/lib/schemas';

/**
 * عوض العوض، المعروف بـ عوض شعبان — Beirut 1931–2025.
 * Novelist, short-story writer, journalist, and translator.
 *
 * Biographical facts are verbatim from his own site (awadshaaban.com); the
 * bibliography (works + translations with publishers and original authors) is
 * the authoritative catalogue from books/_meta/books.json. The portrait is
 * served from public/awad-shaaban-portrait.jpg.
 */
export const tribute: Tribute = {
  nameAr: 'عوض شعبان',
  nameEn: 'Awad Shaaban',
  birthYear: 1931,
  deathYear: 2025,
  portrait: '/awad-shaaban-portrait.jpg',
  creedAr: 'الكتابة ليست موهبة فحسب، بل هي مسؤولية تجاه الكلمة والإنسان.',
  creedEn:
    'Writing is not merely a talent; it is a responsibility toward the word and toward humankind.',
  dedicationAr: 'إلى أبي، عوض شعبان — الذي علّمنا أنّ الكلمة أمانة.',
  bioAr:
    'عوض العوض، المعروف بـ عوض شعبان، روائيّ وكاتب قصصيّ وصحفيّ ومترجم لبنانيّ، وُلد في بيروت عام ١٩٣١. هاجر إلى أميركا اللاتينية عام ١٩٥٣ فأقام في البرازيل والأوروغواي والأرجنتين، وأتقن لغاتها وآدابها، ثم عاد إلى لبنان عام ١٩٦٠. أتقن العربية والإنكليزية والبرتغالية والإسبانية والإيطالية، وكتب في كبريات الصحف اللبنانية. نال جائزة اتحاد الكتّاب اللبنانيين عام ١٩٨٨ عن روايته «درب الجنوب». أصدر أكثر من أربعة عشر مؤلَّفًا بين رواية ومجموعة قصصية، وترجم روائع الأدب الروسي واللاتيني. رحل عام ٢٠٢٥ تاركًا إرثًا من الكلمة الصادقة.',
  bioEn:
    'Awad al-Awad, known as Awad Shaaban, was a Lebanese novelist, short-story writer, journalist, and translator, born in Beirut in 1931. He emigrated to Latin America in 1953, living in Brazil, Uruguay, and Argentina and mastering their languages and literatures, then returned to Lebanon in 1960. He commanded Arabic, English, Portuguese, Spanish, and Italian, and wrote for Lebanon’s major newspapers. He won the Lebanese Writers’ Union Award in 1988 for his novel «Darb al-Janoub» (The Southern Path). He published more than fourteen novels and short-story collections and translated masterpieces of Russian and Latin American literature. He died in 2025, leaving a legacy of the honest word.',
  timeline: [
    {
      year: 1931,
      eventAr: 'وُلد في بيروت.',
      eventEn: 'Born in Beirut.',
    },
    {
      year: 1953,
      eventAr: 'هاجر إلى أميركا اللاتينية: البرازيل، الأوروغواي، الأرجنتين.',
      eventEn: 'Emigrated to Latin America: Brazil, Uruguay, Argentina.',
    },
    {
      year: 1960,
      eventAr: 'عاد إلى لبنان وانصرف إلى الأدب والصحافة والترجمة.',
      eventEn: 'Returned to Lebanon and devoted himself to literature, journalism, and translation.',
    },
    {
      year: 1979,
      eventAr: 'صدرت روايته الأولى «الآفاق البعيدة».',
      eventEn: 'His first novel, «The Distant Horizons», was published.',
    },
    {
      year: 1988,
      eventAr: 'نال جائزة اتحاد الكتّاب اللبنانيين عن رواية «درب الجنوب».',
      eventEn: 'Won the Lebanese Writers’ Union Award for the novel «Darb al-Janoub».',
    },
    {
      year: 2025,
      eventAr: 'رحل عن عالمنا.',
      eventEn: 'Passed away.',
    },
  ],
  // Authoritative bibliography from books/_meta/books.json: 14 original works
  // (7 novels, 6 story collections, 1 study). Publishers carried in `note`.
  works: [
    { titleAr: 'الآفاق البعيدة', year: 1979, type: 'novel', note: 'دار النهار، بيروت' },
    { titleAr: 'الدروب المتقاطعة', year: 1985, type: 'novel', note: 'دار الوحدة، بيروت' },
    { titleAr: 'المغيب في مونتيفيديو', year: 1987, type: 'novel', note: 'دار الوحدة، بيروت' },
    {
      titleAr: 'درب الجنوب',
      year: 1988,
      type: 'novel',
      note: 'دار الفارابي — جائزة اتحاد الكتّاب اللبنانيين ١٩٨٨',
    },
    { titleAr: 'زمن التفسخ', year: 1997, type: 'novel', note: 'دار العلم للملايين، بيروت' },
    { titleAr: 'عندما يحل الظلام والصقيع', year: 2009, type: 'novel', note: 'دار الفارابي' },
    { titleAr: 'الملعونون', year: 2012, type: 'novel', note: 'دار الفارابي — أربع روايات قصيرة' },
    { titleAr: 'الرهائن', year: 1981, type: 'stories', note: 'دار الكلمة، بيروت' },
    { titleAr: 'الموت المجاني', year: 1988, type: 'stories', note: 'دار الأدب الحديث، بيروت' },
    { titleAr: 'الجندب', year: 1994, type: 'stories', note: 'منشورات اتحاد الكتّاب اللبنانيين' },
    { titleAr: 'الفلسطينيات', year: 1998, type: 'stories', note: 'دار الفارابي، بيروت' },
    { titleAr: 'خزين الذكريات', year: 2010, type: 'stories', note: 'دار الفارابي، بيروت' },
    { titleAr: 'في أرض التيه', year: 2014, type: 'stories', note: 'المؤسسة الجامعية، بيروت' },
    { titleAr: 'بيراندللو', year: 1979, type: 'study', note: 'المؤسسة العربية، بيروت' },
  ],
  // 12 literary translations from Russian and Latin American literature.
  translations: [
    { author: 'نيكولاي غوغول', year: 1961, note: 'المعطف' },
    { author: 'أنطون تشيخوف', year: 1962, note: 'المبارزة' },
    { author: 'أنطون تشيخوف', year: 1969, note: 'السيدة والكلب' },
    { author: 'نيكولاي غوغول', year: 1969, note: 'تاراس بولبا' },
    { author: 'نيكولاي غوغول', year: 1969, note: 'يوميات مجنون' },
    { author: 'مجموعة كتّاب إيطاليين', year: 1981, note: 'القصة الإيطالية' },
    { author: 'جورجي آمادو', year: 1984, note: 'غابرييلا: قرنفل وقرفة' },
    { author: 'جورجي آمادو', year: 1988, note: 'المحصول الأحمر' },
    { author: 'مانويل فيريرا', year: 1988, note: 'ساعة الرحيل' },
    { author: 'جورجي آمادو', year: 1992, note: 'الدونا فلور وزوجاها — جزآن' },
    { author: 'جورجي آمادو', year: 1992, note: 'البزة والرداء وقميص النوم' },
    { author: 'جورجي آمادو', note: 'فارس الأمل' },
  ],
  journalism: [
    'السفير',
    'اللواء',
    'الفكر العربي',
    'النضال',
    'اليوم',
    'التلغراف',
    'الأنباء',
    'المحرر',
  ],
  quotes: [
    {
      textAr: 'الكتابة ليست موهبة فحسب، بل هي مسؤولية تجاه الكلمة والإنسان.',
      textEn:
        'Writing is not merely a talent; it is a responsibility toward the word and toward humankind.',
    },
    {
      textAr:
        'الأدب مرآة المجتمع ونافذته على المستقبل، فمن يكتب اليوم يرسم ملامح الغد.',
      textEn:
        'Literature is society’s mirror and its window onto the future; whoever writes today draws the features of tomorrow.',
    },
  ],
};
