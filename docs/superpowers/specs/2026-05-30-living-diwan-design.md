# مُعلّقات — The Living Diwan

**A son's monument to his father, built from the literature he gave his life to.**

- **Status:** Design — approved in concept, pending written-spec review
- **Date:** 2026-05-30
- **Author/owner:** Salah Awad (for his father, عوض شعبان)
- **Repo:** `/home/sawad/devrepo/muallaqat` (local-only, branch `main`, no remote yet)

---

## 1. Purpose & dedication

This is a tribute to **عوض العوض، المعروف بـ عوض شعبان** (Awad Shaaban) — Beirut **1931–2025** — Lebanese novelist, short-story writer, journalist, and translator. He emigrated to Latin America (Brazil, Uruguay, Argentina) in 1953, mastered five languages (Arabic, English, Portuguese, Spanish, Italian), returned to Lebanon in 1960, won the **Union of Lebanese Writers Prize (1988)** for the novel **درب الجنوب**, published 14+ novels and story collections, translated Gogol, Chekhov and Jorge Amado into Arabic, and wrote for *السفير، اللواء، الفكر العربي، النضال* and others.

His creed is the soul of this project:

> **«الكتابة ليست موهبة فحسب، بل هي مسؤولية تجاه الكلمة والإنسان.»**
> *Writing is not merely talent — it is a responsibility toward the word and toward humanity.*

> **«الأدب مرآة المجتمع ونافذته على المستقبل، فمن يكتب اليوم يرسم ملامح الغد.»**

The site gathers the greatest Arabic literature — المعلقات، الأشعار، النثر، الهجاء — into an immersive, Arabic-first (RTL) experience that treats every poet as a **human being**, echoing his father's devotion "to the word and the human." His own Mahjar emigration rhymes with the Mahjar poets (Gibran) featured here, so he belongs **inside** the canon, not beside it.

**Portrait asset already saved:** `assets/awad-shaaban-portrait.jpg` (1200×1600, sourced from awadshaaban.com).

## 2. Goals & non-goals

**Goals**
- An immersive, emotionally moving, genuinely novel experience for the Arabic/RTL web.
- Arabic-first, fully RTL; optional English translation/transliteration.
- A curated, **accuracy-verified**, public-domain starter collection across all major eras.
- Honor the father via a memorial Doorway, a dedicated `/tribute` page, and a featured place in the Modern era.
- Fast, mobile-first, accessible, SEO-friendly; expandable content over time.

**Non-goals (v1)**
- No full walk-through 3D world (the "Majlis" concept was considered and set aside).
- No user accounts, comments, or a CMS/admin panel in v1 (content is version-controlled files).
- No exhaustive corpus — a curated, expandable "rich starter set," not "every poem ever written."

## 3. Decisions locked during brainstorming

| Decision | Choice |
|---|---|
| Core concept | **The Living Diwan** — cinematic, scroll-driven RTL journey through the eras |
| Content sourcing | I curate a rich, verified, public-domain starter set (expandable) |
| Language | Arabic-first; optional English translation + transliteration |
| Father's placement | Featured figure in the **Modern era** + memorial **Doorway** + full **/tribute** page |
| Scope | Full vision, built in **ordered phases** (working result each phase) |

## 4. Visual identity (inherited from the father's own site)

- **Palette:** `--cream #f5f0e8`, `--parchment #ede5d5`, `--ink #1a130a`, `--ink-light #3d2c1e`, `--ink-muted #7a6455`, `--gold #b8873a`, `--gold-light #d4a855`, `--gold-pale #f0ddb0`, `--burgundy #6b2d3e`; plus a deep **desert-night** indigo (e.g. `#0e1726` / `#14101f`) for immersive era scenes.
- **Type:** **Amiri** (verse / display, classical Naskh), **Cairo** (UI / body), **Reem Kufi** (kinetic Kufic headlines). Latin fallback serif (EB Garamond / Cormorant) for English. **Self-hosted** for performance.
- **Texture & motion language:** subtle fractal-noise paper grain (as on his site), gold illuminated dividers and flourishes, ink/calligraphy that **draws itself**, parchment that unfurls. Pacing is slow and reverent.

## 5. Architecture & tech stack (latest)

- **Next.js 15 (App Router) + React 19 + TypeScript** — SSG/ISR for content pages (SEO, speed, shareability), RTL-first.
- **Tailwind CSS v4** using RTL **logical properties** (`ps-/pe-/ms-/me-/start/end`).
- **next-intl** for AR-first / EN locale routing and message catalogs.
- **Motion/scroll:** **GSAP + ScrollTrigger** for scroll-driven scenes, **Lenis** for smooth (RTL-aware) scroll, **Framer Motion** for component transitions, **View Transitions API** for poet↔poem navigation.
- **Self-writing calligraphy:** SVG path stroke animation (`stroke-dashoffset`) on real Arabic letterforms for verses; richer hero moments may use Canvas/WebGL.
- **Era scenes:** lightweight **React-Three-Fiber / Three.js** used sparingly (particle starfields, gold motes), progressively enhanced with a **static fallback** image/gradient.
- **Audio:** HTML5/Web Audio recitation playback; optional word-synced highlighting.
- **Content layer:** typed **TS modules and/or MDX** in `content/`, validated by **Zod** at build time. **No database** in v1 → fast, version-controlled, easy to expand.
- **Hosting:** **Vercel**. Domain TBD (candidate: a subdomain of awadshaaban.com, or a new domain) — not blocking.

### Project structure (indicative)
```
muallaqat/
  app/                # Next.js App Router (locale-segmented)
    [locale]/
      page.tsx            # The Doorway
      diwan/              # The journey
      poet/[slug]/
      poem/[slug]/
      muallaqat/
      hija2/
      explore/
      tribute/
  components/         # scene, calligraphy, verse-card, audio, ornaments
  content/           # poets/, poems/, eras/, duels/, tribute/ (typed + validated)
  lib/               # schemas (zod), meter utils, slug, content loaders
  messages/          # ar.json, en.json (next-intl)
  public/fonts/      # self-hosted Amiri, Cairo, Reem Kufi
  assets/            # source assets (e.g. father's portrait)
  tests/             # vitest + playwright
```

## 6. Information architecture (routes)

1. **The Doorway `/`** — memorial overture: darkness → his name in gold self-writing calligraphy → his creed → a dedication line (*«إلى أبي، الذي علّمني أن الكلمة أمانة»* — wording to be confirmed) → **«ادخل الديوان»** transitions into the journey.
2. **The Living Diwan `/diwan`** — cinematic RTL scroll through five era scenes:
   - **العصر الجاهلي** — desert night; the Mu'allaqat hang.
   - **العصر الأموي** — the duels (النقائض).
   - **العصر العباسي** — the golden court.
   - **الأندلس** — the garden / courtyard.
   - **العصر الحديث** — the Nahda & Mahjar; **عوض شعبان featured here**.
3. **Poet `/poet/[slug]`** — the human: life, loves, rivalries, exile, grief; themes; signature verse drawn live; recitation; links to poems. View-transition from the journey.
4. **Poem `/poem/[slug]`** — full text in Amiri, line-by-line; meter (بحر) + rhyme (قافية); AR↔EN translation + transliteration toggle; recitation with optional synced highlight; "the human moment" context; **export-verse-as-parchment-card**.
5. **المعلقات `/muallaqat`** — the Seven, each an illuminated **hanging** panel; the legend of the odes hung on the Kaaba.
6. **الهجاء / النقائض `/hija2`** — poetic feuds as interactive **duels** (e.g. Jarir ↔ al-Farazdaq) with back-and-forth volleys.
7. **استكشاف `/explore`** — filter/browse by era, **emotion/theme** (غزل، فخر، رثاء، هجاء، حكمة، حماسة), poet, or meter. (A lightweight browse utility, not a full constellation map.)
8. **في ذكرى عوض شعبان `/tribute`** — full memorial: biography, books, translations, journalism, portrait, his own words, a life timeline.
9. **عن المشروع `/about`** — the why, credits, and content-sourcing notes.

## 7. Signature novelties (unseen in the RTL web)

1. **Self-writing calligraphy** — verses drawn stroke-by-stroke in real Arabic letterforms.
2. **The hanging Mu'allaqat** — the legend made literal: illuminated panels that hang and unfurl on approach.
3. **Hija2 as duels** — the النقائض as an interactive back-and-forth; playful, human, genuinely novel.
4. **Emotion-first exploration** — enter the canon through human feeling, honoring the father's creed.
5. **Verse-as-image sharing** — any bayt exports as a gold-on-parchment card (built-in virality).
6. **Recitation with synced highlight** — the music of the meter restored to the page.

## 8. Data model (typed content, Zod-validated)

- **`Era`**: `id, nameAr, nameEn, range, descriptionAr/En, scene` (palette, particle/motif type, motion config).
- **`Poet`**: `id, slug, nameAr, nameEn, era, birth?, death?, region, bioAr/En, humanStory (the human angle), themes[], portraitOrEmblem, signaturePoemIds[]`.
- **`Poem`**: `id, slug, titleAr/En, poetId, era, type (qasida|nathr|hija2|muwashshah|...), meter?, rhyme?, themes[] (emotions), linesAr[], translationEn?[], transliteration?[], contextAr/En, recitationUrl?, isMuallaqa?`.
- **`Duel`** (hija2): `id, title, poetAId, poetBId, volleys[]` (each: `poetId, lines[], note`).
- **`Tribute`** (the father): structured `bio, works[], translations[], journalism[], quotes[], portrait, timeline[]`.

All authored as typed TS/MDX in `content/`, validated by Zod so a malformed/missing entry **fails the build, not the user**.

## 9. Curated starter content (v1)

Public-domain, **verbatim and accuracy-verified** (classical verse is easy to get subtly wrong — a dedicated verification pass is part of the plan, see §12).

- **Mu'allaqat (the Seven):** Imru' al-Qais, Tarafa, Zuhayr, Labid, Amr ibn Kulthum, Antara, al-Harith — opening + substantial excerpts, expandable to full text.
- **Per era, ~3–5 poets, 1–3 signature poems each:**
  - *Jahili:* Imru' al-Qais, Antara, Zuhayr, **al-Khansā'** (رثاء; a woman's voice).
  - *Umayyad:* **Jarir & al-Farazdaq** (their naqā'iḍ duel), al-Akhtal, Umar ibn Abi Rabia, Majnun Layla.
  - *Abbasid:* al-Mutanabbi, Abu Nuwas, Abu al-Atahiya, Bashshar ibn Burd, al-Maʿarri.
  - *Andalusi:* **Ibn Zaydun & Wallada bint al-Mustakfi** (their love story), Ibn Khafaja, a muwashshah (Lisan al-Din ibn al-Khatib).
  - *Modern:* Ahmad Shawqi, **Gibran** (Mahjar/nathr), Nizar Qabbani, Mahmoud Darwish, Nazik al-Mala'ika, Badr Shakir al-Sayyab — and **عوض شعبان** as the bridge to the family.
- **Nathr (prose):** al-Jahiz, al-Hariri's maqamat, Gibran's prose poetry.
- **English:** translations/transliterations where strong public-domain (or original) versions exist; otherwise clearly marked "forthcoming." (Modern poets like Darwish/Qabbani may be in copyright — for those, present short, fair-use excerpts or link out, and prefer public-domain classical works for full texts. See §11.)

## 10. Quality, performance & accessibility

- **Mobile-first** (most Arabic readers are on phones).
- **`prefers-reduced-motion` honored everywhere** — calligraphy/particles degrade to static.
- Keyboard navigable; semantic HTML; RTL screen-reader friendly; sufficient contrast.
- Self-hosted fonts; image optimization; lazy-loaded heavy scenes; SSG for speed/SEO.
- Lighthouse-minded performance budget.

## 11. Legal / content integrity

- **Classical works** (pre-modern): public domain — used in full, verbatim, verified.
- **Modern works still in copyright** (e.g. Darwish, Qabbani): use short fair-use excerpts with attribution, or link to authorized sources — do **not** host full copyrighted texts.
- **Father's own writings:** included only as the family chooses to provide; excerpts by permission (owner is the rights-holder's family).
- Every poem carries a **source attribution**; the `/about` page documents sourcing and the verification method.

## 12. Error handling, testing & verification

- **Build-time validation:** Zod schemas reject malformed/missing content; the build fails loudly.
- **Progressive enhancement:** audio, WebGL scenes, and calligraphy animation are enhancements with graceful fallbacks (no JS / reduced-motion / unsupported GPU → still readable and beautiful).
- **404 page** in the site's voice (a tasteful "this verse is lost" page).
- **Automated tests:** **Vitest** for schema validation + utilities (meter/rhyme parsing, slug generation); **Playwright** for key journeys (Doorway loads, era scroll, poet↔poem navigation with view transitions, RTL correctness, reduced-motion fallback, locale toggle, verse-card export).
- **Content accuracy pass (critical):** every Arabic text cross-checked against ≥2 reputable public-domain sources; a tracked checklist per poem; mismatches block release. (Strong candidate for a multi-agent verification workflow during implementation.)

## 13. Build phases (for the implementation plan)

1. **Foundation** — Next.js 15 + TS + Tailwind v4 + RTL + next-intl + self-hosted fonts + design tokens (his palette) + base layout/ornaments.
2. **Content layer** — Zod schemas + content loaders + seed the curated starter content + tribute data.
3. **The Doorway + `/tribute` memorial** — the sacred core (most emotionally important; ship early).
4. **The Living Diwan journey** — scroll engine + the five era scenes.
5. **Poet & Poem pages** — recitation + AR/EN toggle + verse-as-image export + view transitions.
6. **المعلقات hanging section + الهجاء duels** — the two showcase novelties.
7. **استكشاف explore/filter + search**.
8. **Polish & ship** — reduced-motion, a11y, performance, SEO, content verification pass, deploy to Vercel.

## 14. Open questions (non-blocking; resolve during implementation)

- Final **domain** and whether to link from/with awadshaaban.com.
- Exact **dedication wording** on the Doorway (to be confirmed with the family).
- Whether to include the father's **own writings** as readable works (currently: featured/honored, full texts only if the family provides them).
- **Recitation audio** source: curated public-domain recordings vs. commissioned vs. omitted in v1.
- Whether `/explore` grows toward the full **Constellation** map in a later version.
