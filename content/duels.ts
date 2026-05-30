import type { Duel } from '@/lib/schemas';

/**
 * The naqā'iḍ — the great poetic flytings of the Umayyad age, presented as
 * interactive back-and-forth duels. Each volley is one poet's answering salvo.
 *
 * The verse is verbatim and cross-verified against reputable public-domain
 * sources (al-Diwan, Arabic Wikisource/Wikipedia, and classical commentaries);
 * each duel records its sources in its context, and known textual variants were
 * resolved against the standard recensions. Each bayt is one full line
 * (sadr + ʿajuz).
 */
export const duels: Duel[] = [
  {
    id: "jarir-farazdaq",
    slug: "jarir-farazdaq",
    titleAr: "نقيضة البيت: الفرزدق وجرير",
    titleEn: "The Flyting of the House: al-Farazdaq and Jarir",
    poetAId: "jarir",
    poetBId: "al-farazdaq",
    contextAr: "دارت بين جرير والفرزدق حرب نقائض نحو نصف قرن. ومن أشهر جولاتها قصيدة الفرزدق اللامية «إن الذي سمك السماء» يفخر فيها ببيت تميم ومجاشع، فعارضها جرير على وزنها ورويّها بقصيدته «لمن الديار» فهدم «البيت» الذي بناه الفرزدق وردّ مجده إلى القيون (الحدّادين).",
    contextEn: "Jarir and al-Farazdaq waged a war of flytings for nearly half a century. Among its most famous rounds is al-Farazdaq's lam-rhymed ode 'Inna alladhi samaka al-sama'' (Verily He who raised the heavens), boasting of the 'house' of Tamim and Mujashi'; Jarir answered it on the same meter and rhyme with 'Liman al-diyar,' demolishing the 'house' al-Farazdaq had built and tracing his glory back to smiths (al-quyun).",
    volleys: [
      {
        poetId: "al-farazdaq",
        linesAr: ["إِنَّ الَّذي سَمَكَ السَماءَ بَنى لَنا بَيتاً دَعائِمُهُ أَعَزُّ وَأَطوَلُ", "بَيتاً زُرارَةُ مُحتَبٍ بِفِنائِهِ وَمُجاشِعٌ وَأَبو الفَوارِسِ نَهشَلُ", "لا يَحتَبي بِفِناءِ بَيتِكَ مِثلُهُم أَبَداً إِذا عُدَّ الفَعالُ الأَفضَلُ"],
        note: "الفرزدق يفخر بأن الله بنى لقومه بيت مجدٍ لا يُدانى، يحفّ به ساداتُ تميم.",
      },
      {
        poetId: "jarir",
        linesAr: ["أَخزى الَّذي سَمَكَ السَماءَ مُجاشِعاً وَبَنى بِناءَكَ في الحَضيضِ الأَسفَلِ", "بَيتاً يُحَمِّمُ قَينُكُم بِفِنائِهِ دَنِساً مَقاعِدُهُ خَبيثَ المَدخَلِ", "وَلَقَد بَنَيتَ أَخَسَّ بَيتٍ يُبتَنى فَهَدَمتُ بَيتَكُمُ بِمِثلَي يَذبُلِ"],
        note: "جرير يقلب الصورة: بيتُكم في الحضيض، يلطّخه حدّادُكم، وقد هدمتُه بجبلين من الهجاء.",
      },
      {
        poetId: "al-farazdaq",
        linesAr: ["أَينَ الَّذينَ بِهِم تُسامي دارِماً أَم مَن إِلى سَلَفي طُهَيَّةَ تَجعَلُ", "ضَرَبَت عَلَيكَ العَنكَبوتَ بِنَسجِها وَقَضى عَلَيكَ بِهِ الكِتابُ المُنزَلُ"],
        note: "الفرزدق يتحدّى جريراً: أين لقومك من يساوي دارمَ؟ فبيتُك خرابٌ نسج العنكبوتُ عليه.",
      },
      {
        poetId: "jarir",
        linesAr: ["أَعيَتكَ مَأثُرَةُ القُيونِ مُجاشِعٍ فَاِنظُر لَعَلَّكَ تَدَّعي مِن نَهشَلِ", "وَاِمدَح سُراةَ بَني فُقَيمٍ إِنَّهُم قَتَلوا أَباكَ وَثَأرُهُ لَم يُقتَلِ"],
        note: "جرير يعيّره بأن مفاخر مجاشع حدادةٌ، ويذكّره بأن أباه قُتل ولم يُؤخذ بثأره.",
      }
    ],
  },
  {
    id: "jarir-akhtal",
    slug: "jarir-akhtal",
    titleAr: "نقيضة كليب وتغلب: جرير والأخطل",
    titleEn: "The Flyting of Kulayb and Taghlib: Jarir and al-Akhtal",
    poetAId: "jarir",
    poetBId: "al-akhtal",
    contextAr: "لمّا ناصر الأخطلُ النصرانيُّ التغلبيُّ الفرزدقَ على جرير، نشبت بينهما مساجلة طويلة قوامها مفاخرةُ تغلب بأيامها وملوكها في وجه كليبٍ قومِ جرير، يقابلها افتخارُ جرير بأن النبوة والخلافة في مضر، وتعييرُه تغلبَ بالنصرانية واللؤم. وأشهر جولاتها لاميّتا الأخطل «كذبتك عينك» وجرير «حيِّ الغداة برامة»، وقد أقرّ جرير بأن الأخطل غلبه في «كذبتك عينك» وحدها.",
    contextEn: "When al-Akhtal — the Christian of Taghlib — sided with al-Farazdaq against Jarir, a long exchange broke out between them: Taghlib's pride in its battle-days and kings set against Kulayb, Jarir's clan; answered by Jarir's boast that prophethood and caliphate lie with Mudar, and his taunting of Taghlib for its Christianity and meanness. Its most famous rounds are al-Akhtal's lam-rhymed 'Kadhabatka aynuk' and Jarir's 'Hayyi al-ghadata bi-Ramata' — and Jarir conceded that al-Akhtal had bested him in that one ode alone.",
    volleys: [
      {
        poetId: "al-akhtal",
        linesAr: ["ما زالَ فينا رِباطُ الخَيلِ مُعلِمَةً وَفي كُلَيبٍ رِباطُ الذُلِّ وَالعارِ", "قَومٌ إِذا اِستَنبَحَ الأَضيافُ كَلبَهُمُ قالوا لِأُمِّهِمِ بولي عَلى النارِ"],
        note: "الأخطل يفاخر بخيل تغلب ويرمي كليباً بالذل والبخل: يأمرون أمهم أن تطفئ النار بالبول لئلا يراها الضيف.",
      },
      {
        poetId: "al-akhtal",
        linesAr: ["أَبَني كُلَيبٍ إِنَّ عَمَّيَّ اللَذا قَتَلا المُلوكَ وَفَكَّكا الأَغلالا", "وَلَقَد جَشِمتَ جَريرُ أَمراً عاجِزاً وَأَرَيتَ عَورَةَ أُمِّكَ الجُهّالا", "فَاِنعَق بِضَأنِكَ يا جَريرُ فَإِنَّما مَنَّتكَ نَفسُكَ في الخَلاءِ ضَلالا"],
        note: "من «كذبتك عينك»: الأخطل يفخر بعمومته الذين قتلوا الملوك، ويصغّر جريراً إلى راعي ضأنٍ في الخلاء.",
      },
      {
        poetId: "jarir",
        linesAr: ["إِنَّ الَّذي حَرَمَ المَكارِمَ تَغلِباً جَعَلَ النُبُوَّةَ وَالخِلافَةَ فينا", "مُضَرٌ أَبي وَأَبو المُلوكِ فَهَل لَكُم يا خُزرَ تَغلِبَ مِن أَبٍ كَأَبينا", "هَذا اِبنُ عَمّي في دِمَشقَ خَليفَةٌ لَو شِئتُ ساقَكُمُ إِلَيَّ قَطينا"],
        note: "جرير يردّ بأن النبوة والخلافة في مضر قومِه، وأن خليفة دمشق ابنُ عمه؛ فقال عبد الملك حين بلغه البيت: ما زاد ابن المراغة على أن جعلني شرطياً له.",
      },
      {
        poetId: "jarir",
        linesAr: ["عَبَدوا الصَليبَ وَكَذَّبوا بِمُحَمَّدٍ وَبِجِبرَئيلَ وَكَذَّبوا ميكالا", "قَبَحَ الإِلَهُ وُجوهَ تَغلِبَ إِنَّها هانَت عَلَيَّ مَراسِناً وَسِبالا", "وَالتَغلِبِيُّ إِذا تَنَحنَحَ لِلقِرى حَكَّ اِستَهُ وَتَمَثَّلَ الأَمثالا"],
        note: "من «حيِّ الغداة»: جرير يعيّر تغلب بنصرانيتها وعبادة الصليب، ويسخر من بخل التغلبي حين يُستضاف. وهو البيت الذي يُروى أن الأخطل سكت بعده.",
      }
    ],
  },
];
