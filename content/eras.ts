import type { Era } from '@/lib/schemas';

/**
 * The five eras of the journey. Milestone 1 seeds them with their identity and
 * scene tokens; later milestones build each into a full cinematic scene.
 */
export const eras: Era[] = [
  {
    id: 'jahili',
    slug: 'al-jahili',
    nameAr: 'العصر الجاهلي',
    nameEn: 'The Pre-Islamic Age',
    order: 1,
    startYear: -500,
    endYear: 610,
    descriptionAr:
      'عصر القصيدة والمعلّقات، حين وُلد الشعر العربيّ على ألسنة فحول الشعراء في ليالي البادية.',
    descriptionEn:
      'The age of the ode and the Mu’allaqat, when Arabic verse was born on the tongues of the master poets in the desert nights.',
    scene: { palette: ['#0e1726', '#1b2640', '#b8873a'], motif: 'desert-night', motion: 'starfield' },
  },
  {
    id: 'umawi',
    slug: 'al-umawi',
    nameAr: 'العصر الأموي',
    nameEn: 'The Umayyad Age',
    order: 2,
    startYear: 661,
    endYear: 750,
    descriptionAr: 'عصر النقائض والفخر القبليّ، حين تبارى الشعراء في ساحات الهجاء.',
    descriptionEn:
      'The age of the naqā’iḍ and tribal pride, when poets dueled in the arenas of satire.',
    scene: { palette: ['#14101f', '#6b2d3e', '#d4a855'], motif: 'duel', motion: 'volley' },
  },
  {
    id: 'abbasi',
    slug: 'al-abbasi',
    nameAr: 'العصر العباسي',
    nameEn: 'The Abbasid Age',
    order: 3,
    startYear: 750,
    endYear: 1258,
    descriptionAr: 'عصر البلاط الذهبيّ، حين بلغ الشعر والنثر ذروتهما في بغداد.',
    descriptionEn:
      'The golden-court age, when poetry and prose reached their summit in Baghdad.',
    scene: { palette: ['#1a130a', '#b8873a', '#f0ddb0'], motif: 'golden-court', motion: 'gilt' },
  },
  {
    id: 'andalusi',
    slug: 'al-andalusi',
    nameAr: 'الأندلس',
    nameEn: 'Al-Andalus',
    order: 4,
    startYear: 711,
    endYear: 1492,
    descriptionAr: 'عصر الموشّحات والحدائق، حين غنّى الشعر للحبّ والماء والياسمين.',
    descriptionEn:
      'The age of the muwashshaḥ and the gardens, when verse sang of love, water, and jasmine.',
    scene: { palette: ['#0e1726', '#3d2c1e', '#d4a855'], motif: 'garden', motion: 'water' },
  },
  {
    id: 'hadith',
    slug: 'al-hadith',
    nameAr: 'العصر الحديث',
    nameEn: 'The Modern Age',
    order: 5,
    startYear: 1850,
    endYear: 2025,
    descriptionAr:
      'عصر النهضة والمهجر، حين حملت الكلمة العربية أوجاع الوطن وأحلامه — وفيه يقف عوض شعبان.',
    descriptionEn:
      'The age of the Nahda and the Mahjar, when the Arabic word carried the homeland’s wounds and dreams — and where Awad Shaaban stands.',
    scene: { palette: ['#f5f0e8', '#6b2d3e', '#b8873a'], motif: 'nahda', motion: 'ink' },
  },
];
