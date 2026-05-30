# مُعلّقات — The Living Diwan · Milestone 1 Implementation Plan
**(Foundation + the Sacred Core: the Doorway & the Tribute to Awad Shaaban)**

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up the Next.js 15 + RTL foundation and ship a deployable, emotionally complete first slice: a memorial Doorway and a full /tribute page honoring the Lebanese writer Awad Shaaban (1931–2025), backed by a typed, Zod-validated content layer.

**Architecture:** Next.js 15 App Router, Arabic-first locale routing via next-intl (`app/[locale]`), Tailwind v4 CSS-first tokens inherited from the father's own site, self-hosted Arabic fonts (Amiri/Cairo/Reem Kufi), and a database-free content layer of typed TS modules validated by Zod at load. Content drives both pages. Motion is progressive (self-writing calligraphy with a reduced-motion static fallback).

**Tech Stack:** Next.js 15, React 19, TypeScript (strict), Tailwind CSS v4, next-intl, next/font/local, GSAP/Lenis (minimal in M1), Zod, Vitest + @testing-library/react, Playwright, pnpm. Deploy: Vercel.

**Scope note:** This is Milestone 1 of the phased vision in `docs/superpowers/specs/2026-05-30-living-diwan-design.md`. Later milestones (the era journey, poet/poem pages, hanging Mu'allaqat, hija2 duels, explore) each get their own plan once this ships.

---

## Shared contract (types, paths, tokens)

PROJECT ROOT: /home/sawad/devrepo/muallaqat (empty except docs/, assets/awad-shaaban-portrait.jpg, .gitignore; git remote = github.com/salahawad/muallaqat; git author already set to salahawad <salah.awad@outlook.com>; conventional-commit messages; NO Co-Authored-By trailers).

PROJECT NAME: مُعلّقات — The Living Diwan. A tribute to the Lebanese writer Awad Shaaban (عوض شعبان, Beirut 1931–2025).

STACK (locked): Next.js 15 (App Router) + React 19 + TypeScript (strict). Tailwind CSS v4 (CSS-first @theme, @import "tailwindcss"). next-intl for AR-first/EN locale routing. next/font/local for self-hosted Amiri, Cairo, Reem Kufi. GSAP + ScrollTrigger + Lenis + Framer Motion (later milestones; in M1 only minimal use). Zod for content validation. Vitest (unit) + Playwright (e2e). pnpm as package manager. Deploy target Vercel.

LOCALE ROUTING: app/[locale]/ with locales = ['ar','en'], defaultLocale 'ar'. <html lang={locale} dir={locale==='ar'?'rtl':'ltr'}>. Arabic is the primary/default experience.

FILE STRUCTURE (use these EXACT paths):
  app/[locale]/layout.tsx            root locale layout (html/body, fonts, dir, next-intl provider)
  app/[locale]/page.tsx              The Doorway (route '/')
  app/[locale]/tribute/page.tsx      The Tribute memorial (route '/tribute')
  app/globals.css                    Tailwind import + @theme tokens + base styles + paper-noise
  middleware.ts                      next-intl middleware
  i18n/routing.ts                    next-intl routing config (locales, defaultLocale)
  i18n/request.ts                    next-intl request config (load messages per locale)
  messages/ar.json , messages/en.json   translation catalogs
  lib/schemas.ts                     Zod schemas + inferred TS types (Era, Poet, Poem, Duel, Tribute, Emotion, PoemType)
  lib/content.ts                     content loaders (validate at load with Zod; throw on invalid)
  lib/fonts.ts                       next/font/local definitions (amiri, cairo, reemKufi) exporting CSS variable classNames
  content/eras.ts                    Era[] data
  content/poets.ts                   Poet[] data
  content/poems.ts                   Poem[] data
  content/tribute.ts                 the Tribute object (Awad Shaaban) — typed
  components/ornament/GoldDivider.tsx   reusable illuminated divider
  components/ornament/PaperGrain.tsx    fixed noise overlay
  components/typography/Verse.tsx       renders Arabic verse lines in Amiri
  components/doorway/DoorwayOverture.tsx  client component for the Doorway hero (self-writing name; reduced-motion fallback)
  components/tribute/*                   tribute sub-sections (Bio, Works, Timeline, Quotes, Portrait)
  public/fonts/                          self-hosted .woff2 files
  tests/unit/                            Vitest specs (schemas, content, utils)
  tests/e2e/                             Playwright specs (doorway, tribute, rtl, reduced-motion, locale)
  vitest.config.ts , playwright.config.ts

DESIGN TOKENS (CSS variables, define in app/globals.css @theme; inherited from the father's own site):
  --color-cream #f5f0e8 ; --color-parchment #ede5d5 ; --color-ink #1a130a ; --color-ink-light #3d2c1e ; --color-ink-muted #7a6455 ; --color-gold #b8873a ; --color-gold-light #d4a855 ; --color-gold-pale #f0ddb0 ; --color-burgundy #6b2d3e ; --color-night #0e1726 .
  Fonts as CSS vars: --font-display (Amiri), --font-ui (Cairo), --font-kufi (Reem Kufi).

DATA MODEL (lib/schemas.ts — Zod schemas; export inferred types with these EXACT field names):
  type Emotion = 'ghazal' | 'fakhr' | 'ritha' | 'hija' | 'hikma' | 'hamasa'
  type PoemType = 'qasida' | 'muallaqa' | 'nathr' | 'hija' | 'muwashshah' | 'free'
  interface Era { id:string; slug:string; nameAr:string; nameEn:string; order:number; startYear:number; endYear:number; descriptionAr:string; descriptionEn:string; scene:{ palette:string[]; motif:string; motion:string } }
  interface Poet { id:string; slug:string; nameAr:string; nameEn:string; eraId:string; birthYear?:number; deathYear?:number; region:string; bioAr:string; bioEn:string; humanStoryAr:string; humanStoryEn:string; themes:Emotion[]; emblem?:string; portrait?:string; signaturePoemIds:string[] }
  interface Poem { id:string; slug:string; titleAr:string; titleEn:string; poetId:string; eraId:string; type:PoemType; meter?:string; rhyme?:string; themes:Emotion[]; linesAr:string[]; linesEn?:string[]; transliteration?:string[]; contextAr?:string; contextEn?:string; recitationUrl?:string; isMuallaqa:boolean; source:string[] }
  interface DuelVolley { poetId:string; linesAr:string[]; linesEn?:string[]; note?:string }
  interface Duel { id:string; slug:string; titleAr:string; titleEn:string; poetAId:string; poetBId:string; contextAr:string; contextEn:string; volleys:DuelVolley[] }
  interface TributeWork { titleAr:string; titleEn?:string; year:number; type:'novel'|'stories'|'study'; note?:string }
  interface TributeTranslation { author:string; year?:number; note?:string }
  interface TributeQuote { textAr:string; textEn?:string }
  interface TributeEvent { year:number; eventAr:string; eventEn:string }
  interface Tribute { nameAr:string; nameEn:string; birthYear:number; deathYear:number; portrait:string; creedAr:string; creedEn:string; dedicationAr:string; bioAr:string; bioEn:string; timeline:TributeEvent[]; works:TributeWork[]; translations:TributeTranslation[]; journalism:string[]; quotes:TributeQuote[] }

VERIFIED TRIBUTE FACTS (Awad Shaaban — use verbatim; do NOT invent):
  Full name: عوض العوض، المعروف بـ عوض شعبان. Born Beirut 1931, died 2025.
  Roles: روائي، كاتب قصصي، صحفي، مترجم (novelist, short-story writer, journalist, translator).
  Emigrated to Latin America 1953 (Brazil, Uruguay, Argentina); returned to Lebanon 1960. Languages: Arabic, English, Portuguese, Spanish, Italian.
  Award: جائزة اتحاد الكتاب اللبنانيين 1988 for the novel «درب الجنوب».
  Novels: الآفاق البعيدة (1979), الدروب المتقاطعة (1985), المغيب في مونتيفيديو (1987), درب الجنوب (1988), زمن التفسخ (1997), عندما يحل الظلام والصقيع (2009), الملعونون (2012).
  Story collections: الرهائن (1981), الموت المجاني (1988), الجندب (1994), الفلسطينيات (1998), خزين الذكريات (2010), في أرض التيه (2014).
  Translations: Gogol, Chekhov, Jorge Amado (1961–1992).
  Journalism: السفير، اللواء، الفكر العربي، النضال، اليوم، التلغراف، الأنباء، المحرر.
  Creed (verbatim): «الكتابة ليست موهبة فحسب، بل هي مسؤولية تجاه الكلمة والإنسان.»
  Also: «الأدب مرآة المجتمع ونافذته على المستقبل، فمن يكتب اليوم يرسم ملامح الغد.»
  Portrait already saved at assets/awad-shaaban-portrait.jpg (copy to public/ during build tasks).

MILESTONE 1 SCOPE ONLY: (1) Foundation/tooling, (2) Design-system primitives, (3) Content layer with Zod + seed data, (4) The Doorway page, (5) The Tribute memorial page, (6) testing infra. Do NOT draft the era journey, poet/poem pages, muallaqat, hija2, or explore — those are later milestones.

TDD DISCIPLINE: bite-sized steps (2–5 min each). Order: write failing test → run it (show FAIL) → minimal implementation → run it (show PASS) → commit. Every code step shows COMPLETE code. Every run step shows the EXACT command and EXPECTED output. NO placeholders ('TODO', 'add error handling', 'similar to above', etc.). Use ONLY the paths/types/names above. For visual components, test rendering, RTL correctness (dir=rtl present), reduced-motion fallback, and content presence (e.g. the father's name and creed appear) — not pixel exactness.


---

## Verified seed content (use verbatim)
- **The seven Mu'allaqat:** Imru' al-Qais, Tarafa ibn al-'Abd, Zuhayr ibn Abi Sulma, Labid ibn Rabi'a, 'Amr ibn Kulthum, 'Antara ibn Shaddad, al-Harith ibn Hilliza
- **Imru' al-Qais opening abyat (8):**
  1. قِفَا نَبْكِ مِنْ ذِكْرَى حَبِيبٍ ومَنْزِلِ بِسِقْطِ اللِّوَى بَينَ الدَّخول فَحَوْملِ
  2. فَتُوْضِحَ فَالمِقْراةِ لمْ يَعْفُ رَسْمُها لِما نَسَجَتْهَا مِنْ جَنُوبٍ وشَمْألِ
  3. تَرَى بَعَرَ الأرْآمِ فِي عَرَصَاتِهَا وَقِيْعَانِهَا كَأنَّهُ حَبُّ فُلْفُلِ
  4. كَأنّي غَدَاةَ البَيْنِ يَومَ تَحَمَّلوا لَدَى سَمُراتِ الحَيِّ نَاقِفُ حَنْظَلِ
  5. وُقُوْفاً بِها صَحْبِي عَلَيَّ مَطِيَّهُمُ يَقُوْلُوْنَ لا تَهْلِكْ أَسًى وَتَجَمَّلِ
  6. وإِنَّ شِفائي عَبْرَةٌ مُهْراقَةٌ فَهَلْ عِندَ رَسْمٍ دَارِسٍ مِنْ مُعَوَّلِ
  7. كَدَأْبِكَ مِنْ أُمِّ الحُوَيْرِثِ قَبْلَها وَجارَتِها أُمِّ الرَّبابِ بِمَأْسَلِ
  8. إِذَا قَامَتَا تَضَوَّعَ المِسْكُ مِنهُمَا نَسِيْمَ الصَّبَا جَاءَتْ بِرَيَّا القَرَنْفُلِ
- **Sources:** https://ar.wikisource.org/wiki/معلقة_امرئ_القيس (Imru' al-Qais Mu'allaqa — PRIMARY; fetched & verified this session, rev. 532024, proofread/نصوص مصححة; 8 abyat returned identically across 4 passes) ; https://www.aldiwan.net/poem50.html (al-Diwan — SECOND independent source for Imru' al-Qais matla & text; surfaced and corroborated via WebSearch) ; https://poetsgate.com/poem.php?pm=4730 (Poets Gate — third corroboration of Imru' al-Qais matla/text) ; https://ar.wikipedia.org/wiki/المعلقات (Wikipedia ‘al-Mu'allaqat’ — verified the seven poets + each matla) ; https://mawdoo3.com/من_هم_شعراء_المعلقات_السبع (Mawdoo3 — independent corroboration of the seven poets + matáli') ; https://folderat.com/Reference/13 (أصحاب المعلقات ومطلع كل معلقة — corroboration of each poet's matla) ; https://ar.wikipedia.org/wiki/معلقة_طرفة_بن_العبد (verified Tarafa matla: لخولة أطلال ببرقة ثهمد)
- **Notes:** CORRECTION to an earlier draft: my tool calls DID succeed (an initial display glitch made some outputs look empty, but all WebFetch/Bash results came through and were read). Cross-source verification WAS performed and the content is well-attested. Confidence is high.

CROSS-CHECK PERFORMED:
1) Imru' al-Qais opening — the same 8 abyat were returned IDENTICALLY across four independent WebFetch passes of ar.wikisource.org/wiki/معلقة_امرئ_القيس (page confirmed genuine: revision 532024, categories include "معلقات" and "امرؤ القيس", marked "نصوص مصححة" = proofread text). The matla and word-level text also match the al-Diwan (aldiwan.net/poem50.html) and Poets Gate (poetsgate.com) results surfaced in WebSearch. The consonantal text, word order, and bayt ordering are consistent across all sources.
2) The seven poets + their مطالع — verified across THREE independent sources that agree fully on poet identity, opening lines, and content: ar.wikipedia.org/wiki/المعلقات, mawdoo3.com, and folderat.com (نتائج بحث), plus the dedicated Wikisource/Wikipedia poem pages for Tarafa and the matla of each.

ORDERING NOTE (not a content error, just a convention): The seven poets are universally the SAME, but their listed order varies by source. I used the most common scholarly/chronological order: Imru' al-Qais, Tarafa, Zuhayr, Labid, 'Amr ibn Kulthum, 'Antara, al-Harith ibn Hilliza. (Wikipedia's table happened to list al-Harith before Zuhayr and Labid last — purely a presentation choice; same seven names, same matla for each.)

DIACRITICS (تشكيل): Diacritics naturally vary slightly between printed editions and even between site renderings; the harakat here follow the standard Wikisource/al-Diwan vocalization and are best-effort, not the single authoritative tashkīl. The CONSONANTAL text + word order + bayt order are solidly verified. If absolute diacritic fidelity matters for a given line, prefer the Zuzani recension (شرح المعلقات السبع للزوزني) as the tiebreaker. Note minor known rasm/spelling variants seen across sources: matla second hemistich «الدخول فحومل» (Wikisource/al-Diwan) vs the variant «الدخول وحومل» (seen on toarab.ws) — both are attested; I kept «فحومل», which is the more common reading.

For Poem records in content/poems.ts: set isMuallaqa=true and source=["https://ar.wikisource.org/wiki/معلقة_امرئ_القيس","https://www.aldiwan.net/poem50.html"] for the Imru' al-Qais poem. Each bayt above is one string with both hemistichs (sadr + 'ajuz), ready to drop into linesAr[].

---

## Group A: Foundation & tooling

Environment confirmed: pnpm 10.17.1, node 20.20.1, git author already `salahawad`, remote correct, `.gitignore` already covers Next.js artifacts. Note `books/` exists in addition to the contract's stated dirs — irrelevant to scaffolding. Now I'll write the Group A plan.

### Task A1: Initialize Next.js 15 + TypeScript + pnpm scaffolding

**Files:**
- Create: `/home/sawad/devrepo/muallaqat/package.json`
- Create: `/home/sawad/devrepo/muallaqat/next.config.ts`
- Create: `/home/sawad/devrepo/muallaqat/tsconfig.json`
- Create: `/home/sawad/devrepo/muallaqat/next-env.d.ts`
- Create: `/home/sawad/devrepo/muallaqat/.npmrc`

- [ ] **Step 1: Verify the repo is greenfield and git is already configured (do NOT re-init git).**
  Run:
  ```bash
  cd /home/sawad/devrepo/muallaqat && git rev-parse --is-inside-work-tree && git config user.name && git config user.email && git remote get-url origin && ls -a
  ```
  EXPECTED output (the repo already has git, author, remote; only docs/, assets/, books/, .gitignore exist — NO package.json):
  ```
  true
  salahawad
  salah.awad@outlook.com
  https://github.com/salahawad/muallaqat.git
  .  ..  .git  .gitignore  assets  books  docs
  ```

- [ ] **Step 2: Create `package.json` with pinned versions and the exact scripts contract.**
  Write `/home/sawad/devrepo/muallaqat/package.json`:
  ```json
  {
    "name": "muallaqat",
    "version": "0.1.0",
    "private": true,
    "type": "module",
    "packageManager": "pnpm@10.17.1",
    "scripts": {
      "dev": "next dev",
      "build": "next build",
      "start": "next start",
      "lint": "next lint",
      "test": "vitest run",
      "test:watch": "vitest",
      "test:e2e": "playwright test"
    },
    "dependencies": {
      "next": "15.5.4",
      "react": "19.2.0",
      "react-dom": "19.2.0"
    },
    "devDependencies": {
      "@types/node": "22.18.6",
      "@types/react": "19.2.2",
      "@types/react-dom": "19.2.1",
      "typescript": "5.9.3"
    }
  }
  ```

- [ ] **Step 3: Create `.npmrc` so pnpm hoists Next.js peer deps cleanly (avoids "module not found" for next plugins).**
  Write `/home/sawad/devrepo/muallaqat/.npmrc`:
  ```ini
  shamefully-hoist=true
  strict-peer-dependencies=false
  ```

- [ ] **Step 4: Create `tsconfig.json` (strict, `@/*` alias, excludes tests/e2e per testing contract).**
  Write `/home/sawad/devrepo/muallaqat/tsconfig.json`:
  ```json
  {
    "compilerOptions": {
      "target": "ES2022",
      "lib": ["dom", "dom.iterable", "esnext"],
      "jsx": "preserve",
      "module": "esnext",
      "moduleResolution": "bundler",
      "strict": true,
      "noEmit": true,
      "esModuleInterop": true,
      "resolveJsonModule": true,
      "isolatedModules": true,
      "incremental": true,
      "skipLibCheck": true,
      "allowJs": true,
      "plugins": [{ "name": "next" }],
      "types": ["vitest/globals", "@testing-library/jest-dom"],
      "paths": { "@/*": ["./*"] }
    },
    "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
    "exclude": ["node_modules", "tests/e2e"]
  }
  ```

- [ ] **Step 5: Create `next.config.ts` wired with the next-intl plugin (no-arg → defaults to `./i18n/request.ts`).**
  Write `/home/sawad/devrepo/muallaqat/next.config.ts`:
  ```typescript
  import type {NextConfig} from 'next';
  import createNextIntlPlugin from 'next-intl/plugin';

  const nextConfig: NextConfig = {};

  // With no argument the plugin defaults to './i18n/request.ts'.
  const withNextIntl = createNextIntlPlugin();

  export default withNextIntl(nextConfig);
  ```

- [ ] **Step 6: Create `next-env.d.ts` (Next regenerates it on build; commit a baseline so type checks before first build work).**
  Write `/home/sawad/devrepo/muallaqat/next-env.d.ts`:
  ```typescript
  /// <reference types="next" />
  /// <reference types="next/image-types/global" />

  // NOTE: This file should not be edited
  // see https://nextjs.org/docs/app/api-reference/config/typescript for more information.
  ```

- [ ] **Step 7: Install the core stack with pnpm.**
  Run:
  ```bash
  cd /home/sawad/devrepo/muallaqat && pnpm install
  ```
  EXPECTED: pnpm resolves and writes `pnpm-lock.yaml`, creates `node_modules/`. Output ends with a line like:
  ```
  dependencies:
  + next 15.5.4
  + react 19.2.0
  + react-dom 19.2.0
  Done in ...
  ```

- [ ] **Step 8: Verify Next.js binary is installed and reports a 15.x version (proves the toolchain boots).**
  Run:
  ```bash
  cd /home/sawad/devrepo/muallaqat && pnpm exec next --version
  ```
  EXPECTED output:
  ```
  Next.js v15.5.4
  ```

- [ ] **Step 9: First commit early (scaffold only). The plugin import in next.config.ts will fail typecheck until A3 installs next-intl, so commit the scaffold now without a build.**
  Run:
  ```bash
  cd /home/sawad/devrepo/muallaqat && git add package.json pnpm-lock.yaml .npmrc tsconfig.json next.config.ts next-env.d.ts && git commit -m "chore: scaffold Next.js 15 + TypeScript + pnpm"
  ```
  EXPECTED: a commit is created listing the six files plus `pnpm-lock.yaml`.

### Task A2: Add Tailwind CSS v4 with design tokens and paper-grain

**Files:**
- Create: `/home/sawad/devrepo/muallaqat/postcss.config.mjs`
- Create: `/home/sawad/devrepo/muallaqat/app/globals.css`

- [ ] **Step 1: Install Tailwind v4 and its PostCSS plugin (no autoprefixer, no postcss-import, no init step).**
  Run:
  ```bash
  cd /home/sawad/devrepo/muallaqat && pnpm add -D tailwindcss @tailwindcss/postcss postcss
  ```
  EXPECTED: devDependencies updated; output includes lines like:
  ```
  + tailwindcss 4.3.0
  + @tailwindcss/postcss 4.3.0
  + postcss 8.5.6
  ```

- [ ] **Step 2: Confirm a 4.x Tailwind resolved (v4 has NO config file / NO `npx tailwindcss init`).**
  Run:
  ```bash
  cd /home/sawad/devrepo/muallaqat && pnpm why tailwindcss
  ```
  EXPECTED: a tree showing `tailwindcss 4.3.0` (a 4.x version). Confirm NO `tailwind.config.js` was created:
  ```bash
  test ! -f /home/sawad/devrepo/muallaqat/tailwind.config.js && echo "NO_CONFIG_OK"
  ```
  EXPECTED:
  ```
  NO_CONFIG_OK
  ```

- [ ] **Step 3: Create `postcss.config.mjs` (the ONLY PostCSS plugin is `@tailwindcss/postcss`).**
  Write `/home/sawad/devrepo/muallaqat/postcss.config.mjs`:
  ```javascript
  const config = {
    plugins: {
      "@tailwindcss/postcss": {},
    },
  };

  export default config;
  ```

- [ ] **Step 4: Create `app/globals.css` with `@import "tailwindcss"`, the full @theme palette + font vars, base styles, paper-grain overlay, and the reduced-motion guard.**
  Write `/home/sawad/devrepo/muallaqat/app/globals.css`:
  ```css
  @import "tailwindcss";

  /* ============================================================
     مُعلّقات — The Living Diwan : design tokens (CSS-first @theme)
     Inherited palette from Awad Shaaban's own site.
     --color-* → bg-/text-/border-* utilities + var(--color-*)
     --font-*  → font-* utilities + var(--font-*)
     ============================================================ */
  @theme {
    /* Palette */
    --color-cream:      #f5f0e8;
    --color-parchment:  #ede5d5;
    --color-ink:        #1a130a;
    --color-ink-light:  #3d2c1e;
    --color-ink-muted:  #7a6455;
    --color-gold:       #b8873a;
    --color-gold-light: #d4a855;
    --color-gold-pale:  #f0ddb0;
    --color-burgundy:   #6b2d3e;
    --color-night:      #0e1726;

    /* Fonts — wired to next/font/local CSS variables (see lib/fonts.ts).
       The .variable classNames must be applied on <html>/<body> so
       var(--font-amiri) etc. are in scope when font-display resolves. */
    --font-display: var(--font-amiri), "Amiri", serif;
    --font-ui:      var(--font-cairo), "Cairo", system-ui, sans-serif;
    --font-kufi:    var(--font-reem-kufi), "Reem Kufi", sans-serif;
  }

  /* ------------------------------------------------------------
     Base styles
     ------------------------------------------------------------ */
  @layer base {
    html {
      -webkit-text-size-adjust: 100%;
      text-rendering: optimizeLegibility;
    }

    body {
      background-color: var(--color-cream);
      color: var(--color-ink);
      font-family: var(--font-ui);
      margin: 0;
      min-height: 100dvh;
    }

    /* Arabic display copy defaults to Amiri ligatures */
    :lang(ar) {
      font-feature-settings: "liga" 1, "calt" 1;
    }

    ::selection {
      background-color: var(--color-gold-pale);
      color: var(--color-ink);
    }
  }

  /* ------------------------------------------------------------
     Paper-grain noise overlay (inline SVG feTurbulence data URI).
     Fixed, non-interactive, subtle. Hash/angle-bracket/percent
     chars are URL-encoded so the data URI parses inside url(...).
     Use this rule OR the <PaperGrain /> component — not both.
     ------------------------------------------------------------ */
  .paper-grain::after {
    content: "";
    position: fixed;
    inset: 0;
    z-index: 50;
    pointer-events: none;
    opacity: 0.06;
    mix-blend-mode: multiply;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23grain)'/%3E%3C/svg%3E");
    background-repeat: repeat;
  }

  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.001ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.001ms !important;
      scroll-behavior: auto !important;
    }
  }
  ```

- [ ] **Step 5: Verify Tailwind compiles `globals.css` standalone (proves @import + @theme + the URL-encoded data URI all parse before any page exists).**
  Run:
  ```bash
  cd /home/sawad/devrepo/muallaqat && pnpm exec tailwindcss -i app/globals.css -o /tmp/tw-a2-check.css && grep -c -- "--color-gold" /tmp/tw-a2-check.css && grep -c "paper-grain" /tmp/tw-a2-check.css
  ```
  EXPECTED (compiles with no error; the emitted CSS contains the gold token and the paper-grain rule — each grep prints a count ≥ 1):
  ```
  1
  1
  ```

- [ ] **Step 6: Commit the Tailwind setup.**
  Run:
  ```bash
  cd /home/sawad/devrepo/muallaqat && git add package.json pnpm-lock.yaml postcss.config.mjs app/globals.css && git commit -m "build: add Tailwind CSS v4 with design tokens and paper-grain overlay"
  ```
  EXPECTED: a commit listing the four changed/added files.

### Task A3: Wire next-intl AR-first locale routing

**Files:**
- Create: `/home/sawad/devrepo/muallaqat/i18n/routing.ts`
- Create: `/home/sawad/devrepo/muallaqat/i18n/request.ts`
- Create: `/home/sawad/devrepo/muallaqat/middleware.ts`
- Create: `/home/sawad/devrepo/muallaqat/messages/ar.json`
- Create: `/home/sawad/devrepo/muallaqat/messages/en.json`
- Create: `/home/sawad/devrepo/muallaqat/global.d.ts`
- Create: `/home/sawad/devrepo/muallaqat/app/[locale]/layout.tsx`
- Create: `/home/sawad/devrepo/muallaqat/app/[locale]/page.tsx`

- [ ] **Step 1: Install next-intl (v4).**
  Run:
  ```bash
  cd /home/sawad/devrepo/muallaqat && pnpm add next-intl
  ```
  EXPECTED: dependency added; output includes:
  ```
  + next-intl 4.13.0
  ```

- [ ] **Step 2: Confirm next-intl resolved to v4 (the plugin in next.config.ts depends on it).**
  Run:
  ```bash
  cd /home/sawad/devrepo/muallaqat && pnpm why next-intl
  ```
  EXPECTED: a tree showing `next-intl 4.13.x` (a 4.x version).

- [ ] **Step 3: Create the routing single source of truth (locales `['ar','en']`, defaultLocale `'ar'`).**
  Write `/home/sawad/devrepo/muallaqat/i18n/routing.ts`:
  ```typescript
  import {defineRouting} from 'next-intl/routing';

  export const routing = defineRouting({
    // Arabic first / default — the primary experience.
    locales: ['ar', 'en'],
    defaultLocale: 'ar'
  });
  ```

- [ ] **Step 4: Create the request config (loads `../messages/${locale}.json`, AR fallback via hasLocale).**
  Write `/home/sawad/devrepo/muallaqat/i18n/request.ts`:
  ```typescript
  import {getRequestConfig} from 'next-intl/server';
  import {hasLocale} from 'next-intl';
  import {routing} from './routing';

  export default getRequestConfig(async ({requestLocale}) => {
    // `requestLocale` typically corresponds to the `[locale]` segment.
    const requested = await requestLocale;
    const locale = hasLocale(routing.locales, requested)
      ? requested
      : routing.defaultLocale;

    return {
      locale,
      messages: (await import(`../messages/${locale}.json`)).default
    };
  });
  ```

- [ ] **Step 5: Create the middleware (matcher skips api/_next/_vercel and dotted files so fonts/assets bypass).**
  Write `/home/sawad/devrepo/muallaqat/middleware.ts`:
  ```typescript
  import createMiddleware from 'next-intl/middleware';
  import {routing} from './i18n/routing';

  export default createMiddleware(routing);

  export const config = {
    // Match all pathnames except for:
    // - /api, /trpc (API routes)
    // - /_next, /_vercel (internals)
    // - files containing a dot (favicon.ico, fonts, images)
    matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
  };
  ```

- [ ] **Step 6: Create the Arabic message catalog (default locale) with the seeded namespace keys.**
  Write `/home/sawad/devrepo/muallaqat/messages/ar.json`:
  ```json
  {
    "Doorway": {
      "title": "مُعلّقات",
      "enter": "ادخل الديوان",
      "dedication": "إلى عوض شعبان"
    },
    "Nav": {
      "tribute": "تكريم"
    },
    "Tribute": {
      "name": "عوض شعبان"
    }
  }
  ```

- [ ] **Step 7: Create the English message catalog (mirrors ar.json key structure exactly).**
  Write `/home/sawad/devrepo/muallaqat/messages/en.json`:
  ```json
  {
    "Doorway": {
      "title": "The Living Diwan",
      "enter": "Enter the Diwan",
      "dedication": "For Awad Shaaban"
    },
    "Nav": {
      "tribute": "Tribute"
    },
    "Tribute": {
      "name": "Awad Shaaban"
    }
  }
  ```

- [ ] **Step 8: Create `global.d.ts` to type Locale + Messages under TS strict.**
  Write `/home/sawad/devrepo/muallaqat/global.d.ts`:
  ```typescript
  import {routing} from '@/i18n/routing';
  import messages from '@/messages/ar.json';

  declare module 'next-intl' {
    interface AppConfig {
      Locale: (typeof routing.locales)[number];
      Messages: typeof messages;
    }
  }
  ```

- [ ] **Step 9: Create the root locale layout (await params, hasLocale→notFound, setRequestLocale, `<html lang dir>`, font vars, provider). Imports `@/lib/fonts` which Task A4 creates — order A3 then A4 before any build/typecheck.**
  Write `/home/sawad/devrepo/muallaqat/app/[locale]/layout.tsx`:
  ```typescript
  import type {ReactNode} from 'react';
  import {notFound} from 'next/navigation';
  import {NextIntlClientProvider, hasLocale} from 'next-intl';
  import {setRequestLocale} from 'next-intl/server';
  import {routing} from '@/i18n/routing';
  import {amiri, cairo, reemKufi} from '@/lib/fonts';
  import '../globals.css';

  type Props = {
    children: ReactNode;
    params: Promise<{locale: string}>;
  };

  export function generateStaticParams() {
    return routing.locales.map((locale) => ({locale}));
  }

  export default async function LocaleLayout({children, params}: Props) {
    // Next.js 15: params is async and must be awaited.
    const {locale} = await params;

    // Reject unknown locales -> 404.
    if (!hasLocale(routing.locales, locale)) {
      notFound();
    }

    // Enable static rendering for this locale (stable API in v4).
    setRequestLocale(locale);

    return (
      <html
        lang={locale}
        dir={locale === 'ar' ? 'rtl' : 'ltr'}
        className={`${amiri.variable} ${cairo.variable} ${reemKufi.variable}`}
      >
        <body className="paper-grain bg-cream text-ink font-ui antialiased">
          <NextIntlClientProvider>{children}</NextIntlClientProvider>
        </body>
      </html>
    );
  }
  ```

- [ ] **Step 10: Create a minimal Doorway page (await params → setRequestLocale → getTranslations) so the route renders a heading. The full Doorway is a later task group; this is the boot smoke target.**
  Write `/home/sawad/devrepo/muallaqat/app/[locale]/page.tsx`:
  ```typescript
  import {setRequestLocale, getTranslations} from 'next-intl/server';

  type Props = {
    params: Promise<{locale: string}>;
  };

  export default async function DoorwayPage({params}: Props) {
    const {locale} = await params;
    // Must be called before any other next-intl API to keep this route static.
    setRequestLocale(locale);

    // Async server component -> use getTranslations (awaited).
    const t = await getTranslations('Doorway');
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="font-display text-6xl text-gold">{t('title')}</h1>
        <p className="font-kufi text-lg text-ink-muted">{t('dedication')}</p>
      </main>
    );
  }
  ```

- [ ] **Step 11: Commit the i18n wiring (do NOT build yet — layout imports `@/lib/fonts`, created in A4).**
  Run:
  ```bash
  cd /home/sawad/devrepo/muallaqat && git add package.json pnpm-lock.yaml i18n middleware.ts messages global.d.ts "app/[locale]/layout.tsx" "app/[locale]/page.tsx" && git commit -m "feat: add next-intl AR-first locale routing and root layout"
  ```
  EXPECTED: a commit listing the i18n/, messages/, middleware.ts, global.d.ts, and the two app/[locale] files.

### Task A4: Self-host Amiri / Cairo / Reem Kufi via next/font/local

**Files:**
- Create: `/home/sawad/devrepo/muallaqat/public/fonts/amiri-arabic-400-normal.woff2`
- Create: `/home/sawad/devrepo/muallaqat/public/fonts/amiri-arabic-700-normal.woff2`
- Create: `/home/sawad/devrepo/muallaqat/public/fonts/cairo-arabic-wght-normal.woff2`
- Create: `/home/sawad/devrepo/muallaqat/public/fonts/reem-kufi-arabic-wght-normal.woff2`
- Create: `/home/sawad/devrepo/muallaqat/lib/fonts.ts`

- [ ] **Step 1: Install the Fontsource packages as devDeps (used ONLY to obtain the woff2; not needed at runtime).**
  Run:
  ```bash
  cd /home/sawad/devrepo/muallaqat && pnpm add -D @fontsource/amiri @fontsource-variable/cairo @fontsource-variable/reem-kufi
  ```
  EXPECTED: output includes:
  ```
  + @fontsource/amiri 5.2.8
  + @fontsource-variable/cairo 5.2.7
  + @fontsource-variable/reem-kufi 5.2.11
  ```

- [ ] **Step 2: Verify the exact Arabic-subset woff2 filenames exist in node_modules before copying.**
  Run:
  ```bash
  cd /home/sawad/devrepo/muallaqat && ls node_modules/@fontsource/amiri/files/ | grep arabic && ls node_modules/@fontsource-variable/cairo/files/ | grep arabic && ls node_modules/@fontsource-variable/reem-kufi/files/ | grep arabic</parameter>
  ```
  EXPECTED (filenames present; includes the four target files):
  ```
  amiri-arabic-400-normal.woff2
  amiri-arabic-700-normal.woff2
  ...
  cairo-arabic-wght-normal.woff2
  ...
  reem-kufi-arabic-wght-normal.woff2
  ```

- [ ] **Step 3: Copy the four Arabic woff2 into `public/fonts/` (the contract's stated location).**
  Run:
  ```bash
  cd /home/sawad/devrepo/muallaqat && mkdir -p public/fonts && cp node_modules/@fontsource/amiri/files/amiri-arabic-400-normal.woff2 public/fonts/ && cp node_modules/@fontsource/amiri/files/amiri-arabic-700-normal.woff2 public/fonts/ && cp node_modules/@fontsource-variable/cairo/files/cairo-arabic-wght-normal.woff2 public/fonts/ && cp node_modules/@fontsource-variable/reem-kufi/files/reem-kufi-arabic-wght-normal.woff2 public/fonts/ && ls -la public/fonts/
  ```
  EXPECTED: `public/fonts/` lists exactly four non-empty `.woff2` files:
  ```
  amiri-arabic-400-normal.woff2
  amiri-arabic-700-normal.woff2
  cairo-arabic-wght-normal.woff2
  reem-kufi-arabic-wght-normal.woff2
  ```

- [ ] **Step 4: Create `lib/fonts.ts` exporting `amiri`, `cairo`, `reemKufi` (variables `--font-amiri`/`--font-cairo`/`--font-reem-kufi` matching @theme; src walks up to public/fonts/).**
  Write `/home/sawad/devrepo/muallaqat/lib/fonts.ts`:
  ```typescript
  import localFont from "next/font/local";

  // Self-hosted .woff2 in public/fonts/. next/font/local resolves `src`
  // RELATIVE TO THIS FILE (lib/fonts.ts), so walk up one level into public/.
  // Each exposes a CSS variable (--font-amiri / --font-cairo /
  // --font-reem-kufi) consumed by @theme in app/globals.css.

  // --font-amiri — Amiri (STATIC, naskh): verse & display headings.
  export const amiri = localFont({
    src: [
      { path: "../public/fonts/amiri-arabic-400-normal.woff2", weight: "400", style: "normal" },
      { path: "../public/fonts/amiri-arabic-700-normal.woff2", weight: "700", style: "normal" },
    ],
    variable: "--font-amiri",
    display: "swap",
    preload: true,
    fallback: ["Scheherazade New", "Noto Naskh Arabic", "Times New Roman", "serif"],
    adjustFontFallback: "Times New Roman",
  });

  // --font-cairo — Cairo (VARIABLE, wght 200..1000): body / UI text.
  export const cairo = localFont({
    src: "../public/fonts/cairo-arabic-wght-normal.woff2",
    weight: "200 1000",
    style: "normal",
    variable: "--font-cairo",
    display: "swap",
    preload: true,
    fallback: ["Noto Kufi Arabic", "Tahoma", "Arial", "sans-serif"],
    adjustFontFallback: "Arial",
  });

  // --font-reem-kufi — Reem Kufi (VARIABLE, wght 400..700): geometric kufic accents.
  export const reemKufi = localFont({
    src: "../public/fonts/reem-kufi-arabic-wght-normal.woff2",
    weight: "400 700",
    style: "normal",
    variable: "--font-reem-kufi",
    display: "swap",
    preload: false, // accent-only; avoid preloading a face not on first paint
    fallback: ["Noto Kufi Arabic", "Tahoma", "Arial", "sans-serif"],
    adjustFontFallback: "Arial",
  });

  // All three CSS-variable classNames to spread onto <html>/<body>.
  export const fontVariables = `${amiri.variable} ${cairo.variable} ${reemKufi.variable}`;
  ```

- [ ] **Step 5: Typecheck the whole project — A3's layout imports `@/lib/fonts`, now satisfied. This is the first full TS pass and proves the i18n + fonts + tsconfig alias wire together.**
  Run:
  ```bash
  cd /home/sawad/devrepo/muallaqat && pnpm exec tsc --noEmit
  ```
  EXPECTED: no output and exit code 0 (clean typecheck).

- [ ] **Step 6: Production build — proves Next.js compiles the app, next/font emits the fonts, next-intl plugin loads, and both locales prerender.**
  Run:
  ```bash
  cd /home/sawad/devrepo/muallaqat && pnpm build
  ```
  EXPECTED: build succeeds; output includes a route table listing the `/[locale]` route and the `Compiled successfully` / `Generating static pages` lines, e.g.:
  ```
  ✓ Compiled successfully
  ✓ Generating static pages (...)
  Route (app)
  ┌ ● /[locale]
  ...
  ```

- [ ] **Step 7: Commit the fonts and the woff2 (commit the binaries so the build is hermetic on Vercel).**
  Run:
  ```bash
  cd /home/sawad/devrepo/muallaqat && git add package.json pnpm-lock.yaml lib/fonts.ts public/fonts/amiri-arabic-400-normal.woff2 public/fonts/amiri-arabic-700-normal.woff2 public/fonts/cairo-arabic-wght-normal.woff2 public/fonts/reem-kufi-arabic-wght-normal.woff2 && git commit -m "feat: self-host Amiri, Cairo, and Reem Kufi via next/font/local"
  ```
  EXPECTED: a commit listing lib/fonts.ts plus the four woff2 files.

### Task A5: Boot smoke e2e — `/ar` renders `<html dir="rtl">`

**Files:**
- Create: `/home/sawad/devrepo/muallaqat/playwright.config.ts`
- Test: `/home/sawad/devrepo/muallaqat/tests/e2e/smoke.spec.ts`

- [ ] **Step 1: Install Playwright and download the Chromium browser.**
  Run:
  ```bash
  cd /home/sawad/devrepo/muallaqat && pnpm add -D @playwright/test && pnpm exec playwright install --with-deps chromium
  ```
  EXPECTED: `@playwright/test 1.60.0` added to devDependencies; Chromium downloads with a final line like `Chromium ... downloaded` (or already-installed message).

- [ ] **Step 2: Create `playwright.config.ts` (testDir tests/e2e, prod build+start webServer, 127.0.0.1 baseURL).**
  Write `/home/sawad/devrepo/muallaqat/playwright.config.ts`:
  ```typescript
  import { defineConfig, devices } from '@playwright/test'

  export default defineConfig({
    testDir: './tests/e2e',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'html',
    use: {
      baseURL: 'http://127.0.0.1:3000',
      trace: 'on-first-retry',
    },
    projects: [
      { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    ],
    webServer: {
      command: 'pnpm build && pnpm start',
      url: 'http://127.0.0.1:3000',
      reuseExistingServer: !process.env.CI,
      timeout: 120 * 1000,
    },
  })
  ```

- [ ] **Step 3: Write the FAILING smoke test first (it asserts the app boots, `/ar` renders `<html dir="rtl" lang="ar">`, the Arabic title is visible, and `/en` is ltr). Currently no spec file exists, so the run finds zero matching content for the smoke assertions.**
  Write `/home/sawad/devrepo/muallaqat/tests/e2e/smoke.spec.ts`:
  ```typescript
  import { test, expect } from '@playwright/test'

  test.describe('app boots (smoke)', () => {
    test('Arabic locale boots and renders <html dir="rtl" lang="ar">', async ({ page }) => {
      await page.goto('/ar')
      const html = page.locator('html')
      await expect(html).toHaveAttribute('dir', 'rtl')
      await expect(html).toHaveAttribute('lang', 'ar')
      // The Doorway title renders in Arabic.
      await expect(page.getByRole('heading', { name: 'مُعلّقات' })).toBeVisible()
    })

    test('English locale boots and renders <html dir="ltr" lang="en">', async ({ page }) => {
      await page.goto('/en')
      const html = page.locator('html')
      await expect(html).toHaveAttribute('dir', 'ltr')
      await expect(html).toHaveAttribute('lang', 'en')
      await expect(page.getByRole('heading', { name: 'The Living Diwan' })).toBeVisible()
    })

    test('root / redirects into the Arabic default locale', async ({ page }) => {
      await page.goto('/')
      await expect(page).toHaveURL(/\/ar(\/|$)/)
    })
  })
  ```

- [ ] **Step 4: TEMPORARILY break the layout to PROVE the test fails (TDD red). Change the dir ternary so `ar` yields `ltr`.**
  In `/home/sawad/devrepo/muallaqat/app/[locale]/layout.tsx`, replace:
  ```typescript
        dir={locale === 'ar' ? 'rtl' : 'ltr'}
  ```
  with:
  ```typescript
        dir={locale === 'ar' ? 'ltr' : 'ltr'}
  ```

- [ ] **Step 5: Run the e2e suite and SHOW the FAILURE (proves the smoke test actually checks RTL, not a no-op).**
  Run:
  ```bash
  cd /home/sawad/devrepo/muallaqat && pnpm test:e2e
  ```
  EXPECTED: the Arabic test FAILS on the dir assertion; output includes:
  ```
  Error: expect(locator).toHaveAttribute(expected)
  Expected string: "rtl"
  Received string: "ltr"
  ...
  1 failed
    [chromium] › smoke.spec.ts:4:5 › app boots (smoke) › Arabic locale boots and renders <html dir="rtl" lang="ar">
  ```

- [ ] **Step 6: Restore the correct dir logic (TDD green — minimal fix).**
  In `/home/sawad/devrepo/muallaqat/app/[locale]/layout.tsx`, replace:
  ```typescript
        dir={locale === 'ar' ? 'ltr' : 'ltr'}
  ```
  back to:
  ```typescript
        dir={locale === 'ar' ? 'rtl' : 'ltr'}
  ```

- [ ] **Step 7: Re-run the e2e suite and SHOW the PASS.**
  Run:
  ```bash
  cd /home/sawad/devrepo/muallaqat && pnpm test:e2e
  ```
  EXPECTED: all three tests pass; output ends with:
  ```
  3 passed (...)
  ```

- [ ] **Step 8: Ensure Playwright artifacts are ignored so they are not committed.**
  Append to `/home/sawad/devrepo/muallaqat/.gitignore`:
  ```
  # Playwright
  /test-results/
  /playwright-report/
  /blob-report/
  /playwright/.cache/
  ```

- [ ] **Step 9: Commit the smoke test and Playwright config.**
  Run:
  ```bash
  cd /home/sawad/devrepo/muallaqat && git add package.json pnpm-lock.yaml playwright.config.ts tests/e2e/smoke.spec.ts .gitignore && git commit -m "test: add boot smoke e2e asserting RTL doorway for /ar"
  ```
  EXPECTED: a commit listing playwright.config.ts, tests/e2e/smoke.spec.ts, and the updated .gitignore.

---

## Group B: Design-system primitives

The project is greenfield (no components/, tests/, package.json yet). Group B builds on the foundation tooling (Vitest + Testing Library, paths, fonts) established by Group A. I have everything needed from the contract and verified research. Here is the Group B task group.

### Task B1: PaperGrain — fixed SVG-noise overlay component

**Files:**
- Create: `/home/sawad/devrepo/muallaqat/components/ornament/PaperGrain.tsx`
- Test: `/home/sawad/devrepo/muallaqat/tests/unit/PaperGrain.test.tsx`

- [ ] **Step 1: Write the failing test for PaperGrain.**

  Create `/home/sawad/devrepo/muallaqat/tests/unit/PaperGrain.test.tsx`:

  ```tsx
  import { render } from '@testing-library/react'
  import { PaperGrain } from '@/components/ornament/PaperGrain'

  describe('PaperGrain', () => {
    it('renders a single overlay element', () => {
      const { container } = render(<PaperGrain />)
      const overlay = container.firstElementChild as HTMLElement
      expect(overlay).toBeInTheDocument()
    })

    it('is decorative and non-interactive (aria-hidden)', () => {
      const { container } = render(<PaperGrain />)
      const overlay = container.firstElementChild as HTMLElement
      expect(overlay).toHaveAttribute('aria-hidden', 'true')
    })

    it('carries the paper-grain class for the fixed noise overlay', () => {
      const { container } = render(<PaperGrain />)
      const overlay = container.firstElementChild as HTMLElement
      expect(overlay).toHaveClass('paper-grain')
    })

    it('is a fixed, pointer-events-none overlay so it never blocks content', () => {
      const { container } = render(<PaperGrain />)
      const overlay = container.firstElementChild as HTMLElement
      expect(overlay).toHaveClass('fixed')
      expect(overlay).toHaveClass('pointer-events-none')
    })
  })
  ```

- [ ] **Step 2: Run the test and confirm it FAILS.**

  Command:

  ```bash
  pnpm vitest run tests/unit/PaperGrain.test.tsx
  ```

  Expected output (the import cannot resolve because the component does not exist yet):

  ```
   FAIL  tests/unit/PaperGrain.test.tsx [ tests/unit/PaperGrain.test.tsx ]
  Error: Failed to load url @/components/ornament/PaperGrain (resolved id: @/components/ornament/PaperGrain). Does the file exist?

   Test Files  1 failed (1)
        Tests  no tests
  ```

- [ ] **Step 3: Write the minimal PaperGrain implementation.**

  Create `/home/sawad/devrepo/muallaqat/components/ornament/PaperGrain.tsx`:

  ```tsx
  /**
   * PaperGrain — fixed, full-viewport SVG feTurbulence noise overlay.
   *
   * The actual noise texture (inline feTurbulence data URI), z-index, opacity
   * and mix-blend-mode live in the `.paper-grain` rule in app/globals.css.
   * This component only mounts a decorative, non-interactive layer that carries
   * that class plus the fixed / pointer-events-none positioning utilities.
   *
   * Decorative only: aria-hidden so assistive tech ignores it; pointer-events
   * none so it never intercepts clicks or scrolling.
   */
  export function PaperGrain() {
    return (
      <div
        aria-hidden="true"
        className="paper-grain pointer-events-none fixed inset-0"
      />
    )
  }
  ```

- [ ] **Step 4: Run the test and confirm it PASSES.**

  Command:

  ```bash
  pnpm vitest run tests/unit/PaperGrain.test.tsx
  ```

  Expected output:

  ```
   ✓ tests/unit/PaperGrain.test.tsx (4 tests)
     ✓ PaperGrain > renders a single overlay element
     ✓ PaperGrain > is decorative and non-interactive (aria-hidden)
     ✓ PaperGrain > carries the paper-grain class for the fixed noise overlay
     ✓ PaperGrain > is a fixed, pointer-events-none overlay so it never blocks content

   Test Files  1 passed (1)
        Tests  4 passed (4)
  ```

- [ ] **Step 5: Commit.**

  ```bash
  git -C /home/sawad/devrepo/muallaqat add components/ornament/PaperGrain.tsx tests/unit/PaperGrain.test.tsx
  git -C /home/sawad/devrepo/muallaqat commit -m "feat(ornament): add PaperGrain fixed SVG-noise overlay"
  ```

---

### Task B2: GoldDivider — illuminated decorative divider (RTL-safe)

**Files:**
- Create: `/home/sawad/devrepo/muallaqat/components/ornament/GoldDivider.tsx`
- Test: `/home/sawad/devrepo/muallaqat/tests/unit/GoldDivider.test.tsx`

- [ ] **Step 1: Write the failing test for GoldDivider.**

  Create `/home/sawad/devrepo/muallaqat/tests/unit/GoldDivider.test.tsx`:

  ```tsx
  import { render } from '@testing-library/react'
  import { GoldDivider } from '@/components/ornament/GoldDivider'

  describe('GoldDivider', () => {
    it('renders a separator element', () => {
      const { container } = render(<GoldDivider />)
      const root = container.firstElementChild as HTMLElement
      expect(root).toBeInTheDocument()
      expect(root).toHaveAttribute('role', 'separator')
    })

    it('is decorative — the SVG ornament is hidden from assistive tech', () => {
      const { container } = render(<GoldDivider />)
      const svg = container.querySelector('svg') as SVGElement
      expect(svg).not.toBeNull()
      expect(svg).toHaveAttribute('aria-hidden', 'true')
    })

    it('uses logical margins (RTL-safe) and never physical left/right utilities', () => {
      const { container } = render(<GoldDivider />)
      const root = container.firstElementChild as HTMLElement
      // logical inline margin so the ornament centers correctly in rtl and ltr
      expect(root.className).toMatch(/\bmx-auto\b/)
      expect(root.className).not.toMatch(/\bml-/)
      expect(root.className).not.toMatch(/\bmr-/)
    })

    it('merges a caller-supplied className', () => {
      const { container } = render(<GoldDivider className="my-12" />)
      const root = container.firstElementChild as HTMLElement
      expect(root).toHaveClass('my-12')
    })
  })
  ```

- [ ] **Step 2: Run the test and confirm it FAILS.**

  Command:

  ```bash
  pnpm vitest run tests/unit/GoldDivider.test.tsx
  ```

  Expected output (component module does not exist yet):

  ```
   FAIL  tests/unit/GoldDivider.test.tsx [ tests/unit/GoldDivider.test.tsx ]
  Error: Failed to load url @/components/ornament/GoldDivider (resolved id: @/components/ornament/GoldDivider). Does the file exist?

   Test Files  1 failed (1)
        Tests  no tests
  ```

- [ ] **Step 3: Write the minimal GoldDivider implementation.**

  Create `/home/sawad/devrepo/muallaqat/components/ornament/GoldDivider.tsx`:

  ```tsx
  /**
   * GoldDivider — an illuminated, gilded section divider.
   *
   * A horizontal separator: a hair-line rule that fades from transparent to
   * gold and back, centred on a small diamond ornament. Purely decorative, so
   * the SVG ornament is aria-hidden; the wrapper carries role="separator" with
   * aria-orientation="horizontal" so it is announced once as a section break.
   *
   * RTL-safe: uses only logical / symmetric utilities (mx-auto, w-*, gap-*),
   * never physical ml-/mr-/left-/right-, so it mirrors correctly under dir=rtl.
   */
  type GoldDividerProps = {
    /** Extra classes (e.g. vertical rhythm) merged onto the wrapper. */
    className?: string
  }

  export function GoldDivider({ className = '' }: GoldDividerProps) {
    return (
      <div
        role="separator"
        aria-orientation="horizontal"
        className={`mx-auto flex w-full max-w-md items-center gap-4 ${className}`}
      >
        <span
          aria-hidden="true"
          className="h-px flex-1 bg-gradient-to-r from-transparent to-gold"
        />
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-3 w-3 shrink-0 fill-gold"
        >
          <path d="M12 0 L24 12 L12 24 L0 12 Z" />
        </svg>
        <span
          aria-hidden="true"
          className="h-px flex-1 bg-gradient-to-l from-transparent to-gold"
        />
      </div>
    )
  }
  ```

- [ ] **Step 4: Run the test and confirm it PASSES.**

  Command:

  ```bash
  pnpm vitest run tests/unit/GoldDivider.test.tsx
  ```

  Expected output:

  ```
   ✓ tests/unit/GoldDivider.test.tsx (4 tests)
     ✓ GoldDivider > renders a separator element
     ✓ GoldDivider > is decorative — the SVG ornament is hidden from assistive tech
     ✓ GoldDivider > uses logical margins (RTL-safe) and never physical left/right utilities
     ✓ GoldDivider > merges a caller-supplied className

   Test Files  1 passed (1)
        Tests  4 passed (4)
  ```

- [ ] **Step 5: Commit.**

  ```bash
  git -C /home/sawad/devrepo/muallaqat add components/ornament/GoldDivider.tsx tests/unit/GoldDivider.test.tsx
  git -C /home/sawad/devrepo/muallaqat commit -m "feat(ornament): add RTL-safe illuminated GoldDivider"
  ```

---

### Task B3: Verse — Arabic verse renderer (Amiri, RTL, line semantics)

**Files:**
- Create: `/home/sawad/devrepo/muallaqat/components/typography/Verse.tsx`
- Test: `/home/sawad/devrepo/muallaqat/tests/unit/Verse.test.tsx`

- [ ] **Step 1: Write the failing test for Verse.**

  Create `/home/sawad/devrepo/muallaqat/tests/unit/Verse.test.tsx`:

  ```tsx
  import { render, screen } from '@testing-library/react'
  import { Verse } from '@/components/typography/Verse'

  describe('Verse', () => {
    // Verified seed: the opening abyat of Imru' al-Qais's Mu'allaqa.
    const linesAr = [
      'قِفَا نَبْكِ مِنْ ذِكْرَى حَبِيبٍ ومَنْزِلِ بِسِقْطِ اللِّوَى بَينَ الدَّخول فَحَوْملِ',
      'فَتُوْضِحَ فَالمِقْراةِ لمْ يَعْفُ رَسْمُها لِما نَسَجَتْهَا مِنْ جَنُوبٍ وشَمْألِ',
    ]

    it('renders every Arabic verse line', () => {
      render(<Verse linesAr={linesAr} />)
      for (const line of linesAr) {
        expect(screen.getByText(line)).toBeInTheDocument()
      }
    })

    it('marks the verse container as right-to-left', () => {
      const { container } = render(<Verse linesAr={linesAr} />)
      const root = container.firstElementChild as HTMLElement
      expect(root).toHaveAttribute('dir', 'rtl')
      expect(root).toHaveAttribute('lang', 'ar')
    })

    it('renders verse lines in the Amiri display font', () => {
      const { container } = render(<Verse linesAr={linesAr} />)
      const root = container.firstElementChild as HTMLElement
      expect(root).toHaveClass('font-display')
    })

    it('gives each bayt its own line element so line semantics survive', () => {
      const { container } = render(<Verse linesAr={linesAr} />)
      const lineEls = container.querySelectorAll('[data-verse-line]')
      expect(lineEls).toHaveLength(linesAr.length)
    })

    it('renders nothing when given no lines', () => {
      const { container } = render(<Verse linesAr={[]} />)
      expect(container.firstChild).toBeNull()
    })
  })
  ```

- [ ] **Step 2: Run the test and confirm it FAILS.**

  Command:

  ```bash
  pnpm vitest run tests/unit/Verse.test.tsx
  ```

  Expected output (component module does not exist yet):

  ```
   FAIL  tests/unit/Verse.test.tsx [ tests/unit/Verse.test.tsx ]
  Error: Failed to load url @/components/typography/Verse (resolved id: @/components/typography/Verse). Does the file exist?

   Test Files  1 failed (1)
        Tests  no tests
  ```

- [ ] **Step 3: Write the minimal Verse implementation.**

  Create `/home/sawad/devrepo/muallaqat/components/typography/Verse.tsx`:

  ```tsx
  /**
   * Verse — renders an array of Arabic verse lines (أبيات).
   *
   * Each entry of linesAr is one bayt (sadr + ʿajuz already joined into a
   * single string). Rendered in the Amiri display family (var(--font-display)
   * via the `font-display` utility), forced right-to-left and lang="ar" so the
   * harakat shape and the line order are correct regardless of the page locale.
   *
   * Line semantics: each bayt is its own block element carrying a
   * data-verse-line marker, so verses are never collapsed into a single run.
   * Returns null for an empty array (nothing to render).
   */
  type VerseProps = {
    /** One string per bayt (both hemistichs joined). */
    linesAr: string[]
    /** Extra classes merged onto the verse container. */
    className?: string
  }

  export function Verse({ linesAr, className = '' }: VerseProps) {
    if (linesAr.length === 0) {
      return null
    }

    return (
      <div
        dir="rtl"
        lang="ar"
        className={`font-display text-balance leading-loose ${className}`}
      >
        {linesAr.map((line, index) => (
          <p key={index} data-verse-line className="my-2">
            {line}
          </p>
        ))}
      </div>
    )
  }
  ```

- [ ] **Step 4: Run the test and confirm it PASSES.**

  Command:

  ```bash
  pnpm vitest run tests/unit/Verse.test.tsx
  ```

  Expected output:

  ```
   ✓ tests/unit/Verse.test.tsx (5 tests)
     ✓ Verse > renders every Arabic verse line
     ✓ Verse > marks the verse container as right-to-left
     ✓ Verse > renders verse lines in the Amiri display font
     ✓ Verse > gives each bayt its own line element so line semantics survive
     ✓ Verse > renders nothing when given no lines

   Test Files  1 passed (1)
        Tests  5 passed (5)
  ```

- [ ] **Step 5: Commit.**

  ```bash
  git -C /home/sawad/devrepo/muallaqat add components/typography/Verse.tsx tests/unit/Verse.test.tsx
  git -C /home/sawad/devrepo/muallaqat commit -m "feat(typography): add Arabic Verse renderer in Amiri (RTL)"
  ```

---

## Group C: Content layer (Zod + seed)

The project is greenfield (no package.json). I have all the verified facts I need. Now I'll draft the Group C task plan.

### Task C1: Zod schemas (lib/schemas.ts) — content model single source of truth

**Files:**
- Create: `/home/sawad/devrepo/muallaqat/lib/schemas.ts`
- Test: `/home/sawad/devrepo/muallaqat/tests/unit/schemas.test.ts`

- [ ] **Step 1: Install Zod and Vitest (greenfield — only run if not already installed by Group A).** Run the exact verified install commands. Skip if `node_modules/zod` already exists.
```bash
cd /home/sawad/devrepo/muallaqat
pnpm add zod
pnpm add -D vitest
```
Expected output (tail): `dependencies:` block listing `+ zod 4.4.3` and `devDependencies:` listing `+ vitest 4.1.7` (pin whatever patch pnpm writes). Confirm with:
```bash
cd /home/sawad/devrepo/muallaqat && pnpm why zod | head -3
```
Expected: a line `zod 4.4.x`.

- [ ] **Step 2: Write the failing schema spec.** Create `/home/sawad/devrepo/muallaqat/tests/unit/schemas.test.ts` with complete content:
```ts
import { describe, it, expect } from "vitest";
import {
  EmotionSchema,
  PoemTypeSchema,
  EraSchema,
  PoetSchema,
  PoemSchema,
  TributeSchema,
} from "../../lib/schemas";

const validEra = {
  id: "jahili",
  slug: "jahili",
  nameAr: "العصر الجاهلي",
  nameEn: "The Pre-Islamic Era",
  order: 1,
  startYear: 475,
  endYear: 622,
  descriptionAr: "عصر ما قبل الإسلام",
  descriptionEn: "The age before Islam",
  scene: { palette: ["#1a130a", "#b8873a"], motif: "sand", motion: "drift" },
};

const validPoet = {
  id: "imru-al-qais",
  slug: "imru-al-qais",
  nameAr: "امرؤ القيس",
  nameEn: "Imru' al-Qais",
  eraId: "jahili",
  region: "Najd",
  bioAr: "شاعر جاهلي",
  bioEn: "Pre-Islamic poet",
  humanStoryAr: "الملك الضليل",
  humanStoryEn: "The errant king",
  themes: ["ghazal", "fakhr"],
  signaturePoemIds: ["muallaqat-imru-al-qais"],
};

const validPoem = {
  id: "muallaqat-imru-al-qais",
  slug: "muallaqat-imru-al-qais",
  titleAr: "معلقة امرئ القيس",
  titleEn: "The Mu'allaqa of Imru' al-Qais",
  poetId: "imru-al-qais",
  eraId: "jahili",
  type: "muallaqa",
  themes: ["ghazal"],
  linesAr: ["قِفَا نَبْكِ مِنْ ذِكْرَى حَبِيبٍ ومَنْزِلِ بِسِقْطِ اللِّوَى بَينَ الدَّخول فَحَوْملِ"],
  isMuallaqa: true,
  source: ["https://ar.wikisource.org/wiki/معلقة_امرئ_القيس"],
};

describe("EmotionSchema", () => {
  it("accepts a valid emotion", () => {
    expect(EmotionSchema.parse("ghazal")).toBe("ghazal");
  });
  it("rejects an unknown emotion", () => {
    expect(EmotionSchema.safeParse("sadness").success).toBe(false);
  });
});

describe("PoemTypeSchema", () => {
  it("accepts muallaqa", () => {
    expect(PoemTypeSchema.parse("muallaqa")).toBe("muallaqa");
  });
  it("rejects an unknown type", () => {
    expect(PoemTypeSchema.safeParse("sonnet").success).toBe(false);
  });
});

describe("EraSchema", () => {
  it("parses a valid Era", () => {
    expect(EraSchema.parse(validEra).nameAr).toBe("العصر الجاهلي");
  });
  it("rejects a non-integer order", () => {
    expect(EraSchema.safeParse({ ...validEra, order: 1.5 }).success).toBe(false);
  });
  it("rejects a missing required field", () => {
    const { nameAr, ...missing } = validEra;
    expect(EraSchema.safeParse(missing).success).toBe(false);
  });
});

describe("PoetSchema", () => {
  it("parses a valid Poet", () => {
    expect(PoetSchema.parse(validPoet).nameAr).toBe("امرؤ القيس");
  });
  it("rejects a bad Emotion enum in themes", () => {
    expect(PoetSchema.safeParse({ ...validPoet, themes: ["sadness"] }).success).toBe(false);
  });
  it("rejects a wrong field type", () => {
    expect(PoetSchema.safeParse({ ...validPoet, signaturePoemIds: "x" }).success).toBe(false);
  });
});

describe("PoemSchema", () => {
  it("parses a valid Poem with isMuallaqa true", () => {
    const p = PoemSchema.parse(validPoem);
    expect(p.isMuallaqa).toBe(true);
    expect(p.type).toBe("muallaqa");
  });
  it("rejects a missing isMuallaqa boolean", () => {
    const { isMuallaqa, ...missing } = validPoem;
    expect(PoemSchema.safeParse(missing).success).toBe(false);
  });
});

describe("TributeSchema", () => {
  it("rejects a non-integer birthYear", () => {
    const result = TributeSchema.safeParse({
      nameAr: "عوض شعبان",
      nameEn: "Awad Shaaban",
      birthYear: 1931.5,
      deathYear: 2025,
      portrait: "/awad-shaaban-portrait.jpg",
      creedAr: "x",
      creedEn: "x",
      dedicationAr: "x",
      bioAr: "x",
      bioEn: "x",
      timeline: [],
      works: [],
      translations: [],
      journalism: [],
      quotes: [],
    });
    expect(result.success).toBe(false);
  });
});
```

- [ ] **Step 3: Run the spec — expect FAIL (module missing).**
```bash
cd /home/sawad/devrepo/muallaqat && pnpm vitest run tests/unit/schemas.test.ts
```
Expected output includes:
```
Error: Failed to load url ../../lib/schemas (resolved id: ../../lib/schemas) ... Does the file exist?
 FAIL  tests/unit/schemas.test.ts [ tests/unit/schemas.test.ts ]
```

- [ ] **Step 4: Implement `lib/schemas.ts` (minimal, complete).** Create `/home/sawad/devrepo/muallaqat/lib/schemas.ts`:
```ts
import * as z from "zod";

/**
 * Single source of truth for the content model.
 * Every TS type is INFERRED from its Zod schema (never hand-written),
 * so schema and type can never drift. Field names match the CONTRACT verbatim.
 */

/* ---------- primitive unions ---------- */
export const EmotionSchema = z.enum([
  "ghazal",
  "fakhr",
  "ritha",
  "hija",
  "hikma",
  "hamasa",
]);
export type Emotion = z.infer<typeof EmotionSchema>;

export const PoemTypeSchema = z.enum([
  "qasida",
  "muallaqa",
  "nathr",
  "hija",
  "muwashshah",
  "free",
]);
export type PoemType = z.infer<typeof PoemTypeSchema>;

/* ---------- Era ---------- */
export const EraSchema = z.object({
  id: z.string(),
  slug: z.string(),
  nameAr: z.string(),
  nameEn: z.string(),
  order: z.number().int(),
  startYear: z.number().int(),
  endYear: z.number().int(),
  descriptionAr: z.string(),
  descriptionEn: z.string(),
  scene: z.object({
    palette: z.array(z.string()),
    motif: z.string(),
    motion: z.string(),
  }),
});
export type Era = z.infer<typeof EraSchema>;

/* ---------- Poet ---------- */
export const PoetSchema = z.object({
  id: z.string(),
  slug: z.string(),
  nameAr: z.string(),
  nameEn: z.string(),
  eraId: z.string(),
  birthYear: z.number().int().optional(),
  deathYear: z.number().int().optional(),
  region: z.string(),
  bioAr: z.string(),
  bioEn: z.string(),
  humanStoryAr: z.string(),
  humanStoryEn: z.string(),
  themes: z.array(EmotionSchema),
  emblem: z.string().optional(),
  portrait: z.string().optional(),
  signaturePoemIds: z.array(z.string()),
});
export type Poet = z.infer<typeof PoetSchema>;

/* ---------- Poem ---------- */
export const PoemSchema = z.object({
  id: z.string(),
  slug: z.string(),
  titleAr: z.string(),
  titleEn: z.string(),
  poetId: z.string(),
  eraId: z.string(),
  type: PoemTypeSchema,
  meter: z.string().optional(),
  rhyme: z.string().optional(),
  themes: z.array(EmotionSchema),
  linesAr: z.array(z.string()),
  linesEn: z.array(z.string()).optional(),
  transliteration: z.array(z.string()).optional(),
  contextAr: z.string().optional(),
  contextEn: z.string().optional(),
  recitationUrl: z.string().optional(),
  isMuallaqa: z.boolean(),
  source: z.array(z.string()),
});
export type Poem = z.infer<typeof PoemSchema>;

/* ---------- Duel ---------- */
export const DuelVolleySchema = z.object({
  poetId: z.string(),
  linesAr: z.array(z.string()),
  linesEn: z.array(z.string()).optional(),
  note: z.string().optional(),
});
export type DuelVolley = z.infer<typeof DuelVolleySchema>;

export const DuelSchema = z.object({
  id: z.string(),
  slug: z.string(),
  titleAr: z.string(),
  titleEn: z.string(),
  poetAId: z.string(),
  poetBId: z.string(),
  contextAr: z.string(),
  contextEn: z.string(),
  volleys: z.array(DuelVolleySchema),
});
export type Duel = z.infer<typeof DuelSchema>;

/* ---------- Tribute (Awad Shaaban) ---------- */
export const TributeWorkSchema = z.object({
  titleAr: z.string(),
  titleEn: z.string().optional(),
  year: z.number().int(),
  type: z.enum(["novel", "stories", "study"]),
  note: z.string().optional(),
});
export type TributeWork = z.infer<typeof TributeWorkSchema>;

export const TributeTranslationSchema = z.object({
  author: z.string(),
  year: z.number().int().optional(),
  note: z.string().optional(),
});
export type TributeTranslation = z.infer<typeof TributeTranslationSchema>;

export const TributeQuoteSchema = z.object({
  textAr: z.string(),
  textEn: z.string().optional(),
});
export type TributeQuote = z.infer<typeof TributeQuoteSchema>;

export const TributeEventSchema = z.object({
  year: z.number().int(),
  eventAr: z.string(),
  eventEn: z.string(),
});
export type TributeEvent = z.infer<typeof TributeEventSchema>;

export const TributeSchema = z.object({
  nameAr: z.string(),
  nameEn: z.string(),
  birthYear: z.number().int(),
  deathYear: z.number().int(),
  portrait: z.string(),
  creedAr: z.string(),
  creedEn: z.string(),
  dedicationAr: z.string(),
  bioAr: z.string(),
  bioEn: z.string(),
  timeline: z.array(TributeEventSchema),
  works: z.array(TributeWorkSchema),
  translations: z.array(TributeTranslationSchema),
  journalism: z.array(z.string()),
  quotes: z.array(TributeQuoteSchema),
});
export type Tribute = z.infer<typeof TributeSchema>;
```

- [ ] **Step 5: Run the spec — expect PASS.**
```bash
cd /home/sawad/devrepo/muallaqat && pnpm vitest run tests/unit/schemas.test.ts
```
Expected output includes:
```
 ✓ tests/unit/schemas.test.ts (13 tests)
 Test Files  1 passed (1)
      Tests  13 passed (13)
```

- [ ] **Step 6: Commit.**
```bash
cd /home/sawad/devrepo/muallaqat
git add lib/schemas.ts tests/unit/schemas.test.ts package.json pnpm-lock.yaml
git commit -m "feat(content): add Zod schemas for content model with inferred types"
```

---

### Task C2: lib/slug.ts — Unicode-aware slug helper

**Files:**
- Create: `/home/sawad/devrepo/muallaqat/lib/slug.ts`
- Test: `/home/sawad/devrepo/muallaqat/tests/unit/slug.test.ts`

- [ ] **Step 1: Write the failing slug spec.** Create `/home/sawad/devrepo/muallaqat/tests/unit/slug.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { slugify } from "../../lib/slug";

describe("slugify", () => {
  it("lowercases and hyphenates ASCII", () => {
    expect(slugify("  Imru Al Qais  ")).toBe("imru-al-qais");
  });
  it("preserves Arabic letters", () => {
    expect(slugify("درب الجنوب")).toBe("درب-الجنوب");
  });
  it("collapses underscores and repeated spaces to a single hyphen", () => {
    expect(slugify("a__b   c")).toBe("a-b-c");
  });
  it("strips punctuation that is neither letter nor number", () => {
    expect(slugify("Imru' al-Qais!")).toBe("imru-al-qais");
  });
  it("collapses repeated hyphens and trims edge hyphens", () => {
    expect(slugify("--a--b--")).toBe("a-b");
  });
});
```

- [ ] **Step 2: Run — expect FAIL (module missing).**
```bash
cd /home/sawad/devrepo/muallaqat && pnpm vitest run tests/unit/slug.test.ts
```
Expected output includes:
```
Error: Failed to load url ../../lib/slug ... Does the file exist?
 FAIL  tests/unit/slug.test.ts [ tests/unit/slug.test.ts ]
```

- [ ] **Step 3: Implement `lib/slug.ts`.** Create `/home/sawad/devrepo/muallaqat/lib/slug.ts`:
```ts
/**
 * Deterministic, Unicode-safe slug: normalize, lowercase, trim,
 * collapse whitespace/underscores to hyphens, drop everything that is
 * neither a Unicode letter (\p{L}) nor number (\p{N}) nor hyphen, then
 * collapse repeated hyphens and trim edge hyphens.
 *
 * The 'u' flag is REQUIRED for the \p{...} property escapes. Keeping
 * \p{L} preserves Arabic letters so Arabic titles are not stripped to
 * empty strings (wrong for an Arabic-first project).
 */
export function slugify(input: string): string {
  return input
    .normalize("NFKC")
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^\p{L}\p{N}-]/gu, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
```

- [ ] **Step 4: Run — expect PASS.**
```bash
cd /home/sawad/devrepo/muallaqat && pnpm vitest run tests/unit/slug.test.ts
```
Expected output includes:
```
 ✓ tests/unit/slug.test.ts (5 tests)
 Test Files  1 passed (1)
      Tests  5 passed (5)
```

- [ ] **Step 5: Commit.**
```bash
cd /home/sawad/devrepo/muallaqat
git add lib/slug.ts tests/unit/slug.test.ts
git commit -m "feat(content): add Unicode-aware slugify helper"
```

---

### Task C3: content/tribute.ts — the Awad Shaaban Tribute object (verified facts)

**Files:**
- Create: `/home/sawad/devrepo/muallaqat/content/tribute.ts`
- Test: `/home/sawad/devrepo/muallaqat/tests/unit/tribute.test.ts`

- [ ] **Step 1: Copy the portrait into public/ so the build serves it.** The contract says copy `assets/awad-shaaban-portrait.jpg` to `public/` during build tasks; the Tribute `portrait` field references the served path.
```bash
cd /home/sawad/devrepo/muallaqat
mkdir -p public
cp assets/awad-shaaban-portrait.jpg public/awad-shaaban-portrait.jpg
ls -la public/awad-shaaban-portrait.jpg
```
Expected output: a single line ending in `public/awad-shaaban-portrait.jpg` with a non-zero byte count (around `152625`).

- [ ] **Step 2: Write the failing tribute spec.** Create `/home/sawad/devrepo/muallaqat/tests/unit/tribute.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { TributeSchema } from "../../lib/schemas";
import { tribute } from "../../content/tribute";

describe("content/tribute.ts (Awad Shaaban)", () => {
  it("validates against TributeSchema", () => {
    expect(TributeSchema.safeParse(tribute).success).toBe(true);
  });

  it("carries the verified name and dates", () => {
    expect(tribute.nameAr).toBe("عوض شعبان");
    expect(tribute.nameEn).toBe("Awad Shaaban");
    expect(tribute.birthYear).toBe(1931);
    expect(tribute.deathYear).toBe(2025);
  });

  it("carries the verbatim primary creed", () => {
    expect(tribute.creedAr).toBe(
      "الكتابة ليست موهبة فحسب، بل هي مسؤولية تجاه الكلمة والإنسان.",
    );
  });

  it("includes the second verbatim quote and the award novel", () => {
    const quoteTexts = tribute.quotes.map((q) => q.textAr);
    expect(quoteTexts).toContain(
      "الأدب مرآة المجتمع ونافذته على المستقبل، فمن يكتب اليوم يرسم ملامح الغد.",
    );
    const novelTitles = tribute.works
      .filter((w) => w.type === "novel")
      .map((w) => w.titleAr);
    expect(novelTitles).toContain("درب الجنوب");
  });

  it("lists the seven verified novels and six story collections", () => {
    expect(tribute.works.filter((w) => w.type === "novel")).toHaveLength(7);
    expect(tribute.works.filter((w) => w.type === "stories")).toHaveLength(6);
  });

  it("points at the public portrait path", () => {
    expect(tribute.portrait).toBe("/awad-shaaban-portrait.jpg");
  });
});
```

- [ ] **Step 3: Run — expect FAIL (module missing).**
```bash
cd /home/sawad/devrepo/muallaqat && pnpm vitest run tests/unit/tribute.test.ts
```
Expected output includes:
```
Error: Failed to load url ../../content/tribute ... Does the file exist?
 FAIL  tests/unit/tribute.test.ts [ tests/unit/tribute.test.ts ]
```

- [ ] **Step 4: Implement `content/tribute.ts` from the VERIFIED TRIBUTE FACTS (verbatim).** Create `/home/sawad/devrepo/muallaqat/content/tribute.ts`:
```ts
import type { Tribute } from "../lib/schemas";

/**
 * عوض العوض، المعروف بـ عوض شعبان — Beirut 1931–2025.
 * Every Arabic string is taken VERBATIM from the verified tribute facts.
 * The portrait path points at public/awad-shaaban-portrait.jpg (served at /).
 */
export const tribute: Tribute = {
  nameAr: "عوض شعبان",
  nameEn: "Awad Shaaban",
  birthYear: 1931,
  deathYear: 2025,
  portrait: "/awad-shaaban-portrait.jpg",
  creedAr: "الكتابة ليست موهبة فحسب، بل هي مسؤولية تجاه الكلمة والإنسان.",
  creedEn:
    "Writing is not merely a talent; it is a responsibility toward the word and toward humankind.",
  dedicationAr: "إلى أبي عوض شعبان، الذي علّمنا أنّ الكلمة أمانة.",
  bioAr:
    "عوض العوض، المعروف بـ عوض شعبان، روائي وكاتب قصصي وصحفي ومترجم لبناني وُلد في بيروت عام 1931 وتوفي عام 2025. هاجر إلى أميركا اللاتينية عام 1953 فأقام في البرازيل والأوروغواي والأرجنتين، ثم عاد إلى لبنان عام 1960. أتقن العربية والإنكليزية والبرتغالية والإسبانية والإيطالية، ونال جائزة اتحاد الكتّاب اللبنانيين عام 1988 عن روايته «درب الجنوب».",
  bioEn:
    "Awad al-Awad, known as Awad Shaaban, was a Lebanese novelist, short-story writer, journalist and translator, born in Beirut in 1931 and died in 2025. He emigrated to Latin America in 1953, living in Brazil, Uruguay and Argentina, then returned to Lebanon in 1960. He mastered Arabic, English, Portuguese, Spanish and Italian, and won the Lebanese Writers' Union Award in 1988 for his novel «Darb al-Janoub».",
  timeline: [
    {
      year: 1931,
      eventAr: "وُلد في بيروت.",
      eventEn: "Born in Beirut.",
    },
    {
      year: 1953,
      eventAr: "هاجر إلى أميركا اللاتينية (البرازيل، الأوروغواي، الأرجنتين).",
      eventEn: "Emigrated to Latin America (Brazil, Uruguay, Argentina).",
    },
    {
      year: 1960,
      eventAr: "عاد إلى لبنان.",
      eventEn: "Returned to Lebanon.",
    },
    {
      year: 1988,
      eventAr: "نال جائزة اتحاد الكتّاب اللبنانيين عن رواية «درب الجنوب».",
      eventEn:
        "Won the Lebanese Writers' Union Award for the novel «Darb al-Janoub».",
    },
    {
      year: 2025,
      eventAr: "رحل عن عالمنا.",
      eventEn: "Passed away.",
    },
  ],
  works: [
    { titleAr: "الآفاق البعيدة", year: 1979, type: "novel" },
    { titleAr: "الدروب المتقاطعة", year: 1985, type: "novel" },
    { titleAr: "المغيب في مونتيفيديو", year: 1987, type: "novel" },
    {
      titleAr: "درب الجنوب",
      year: 1988,
      type: "novel",
      note: "جائزة اتحاد الكتّاب اللبنانيين 1988",
    },
    { titleAr: "زمن التفسخ", year: 1997, type: "novel" },
    { titleAr: "عندما يحل الظلام والصقيع", year: 2009, type: "novel" },
    { titleAr: "الملعونون", year: 2012, type: "novel" },
    { titleAr: "الرهائن", year: 1981, type: "stories" },
    { titleAr: "الموت المجاني", year: 1988, type: "stories" },
    { titleAr: "الجندب", year: 1994, type: "stories" },
    { titleAr: "الفلسطينيات", year: 1998, type: "stories" },
    { titleAr: "خزين الذكريات", year: 2010, type: "stories" },
    { titleAr: "في أرض التيه", year: 2014, type: "stories" },
  ],
  translations: [
    { author: "Gogol", note: "ترجمات أدبية (1961–1992)" },
    { author: "Chekhov", note: "ترجمات أدبية (1961–1992)" },
    { author: "Jorge Amado", note: "ترجمات أدبية (1961–1992)" },
  ],
  journalism: [
    "السفير",
    "اللواء",
    "الفكر العربي",
    "النضال",
    "اليوم",
    "التلغراف",
    "الأنباء",
    "المحرر",
  ],
  quotes: [
    {
      textAr: "الكتابة ليست موهبة فحسب، بل هي مسؤولية تجاه الكلمة والإنسان.",
      textEn:
        "Writing is not merely a talent; it is a responsibility toward the word and toward humankind.",
    },
    {
      textAr:
        "الأدب مرآة المجتمع ونافذته على المستقبل، فمن يكتب اليوم يرسم ملامح الغد.",
      textEn:
        "Literature is society's mirror and its window onto the future; whoever writes today draws the features of tomorrow.",
    },
  ],
};
```

- [ ] **Step 5: Run — expect PASS.**
```bash
cd /home/sawad/devrepo/muallaqat && pnpm vitest run tests/unit/tribute.test.ts
```
Expected output includes:
```
 ✓ tests/unit/tribute.test.ts (6 tests)
 Test Files  1 passed (1)
      Tests  6 passed (6)
```

- [ ] **Step 6: Commit.**
```bash
cd /home/sawad/devrepo/muallaqat
git add content/tribute.ts tests/unit/tribute.test.ts public/awad-shaaban-portrait.jpg
git commit -m "feat(content): add Awad Shaaban tribute data from verified facts"
```

---

### Task C4: content/eras.ts + content/poets.ts + content/poems.ts — minimal verified seed

**Files:**
- Create: `/home/sawad/devrepo/muallaqat/content/eras.ts`
- Create: `/home/sawad/devrepo/muallaqat/content/poets.ts`
- Create: `/home/sawad/devrepo/muallaqat/content/poems.ts`
- Test: `/home/sawad/devrepo/muallaqat/tests/unit/seed.test.ts`

- [ ] **Step 1: Write the failing seed spec.** Create `/home/sawad/devrepo/muallaqat/tests/unit/seed.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import * as z from "zod";
import { EraSchema, PoetSchema, PoemSchema } from "../../lib/schemas";
import { eras } from "../../content/eras";
import { poets } from "../../content/poets";
import { poems } from "../../content/poems";

describe("content/eras.ts", () => {
  it("validates as an Era array", () => {
    expect(z.array(EraSchema).safeParse(eras).success).toBe(true);
  });
  it("seeds the five eras with unique ascending order values", () => {
    expect(eras).toHaveLength(5);
    const orders = eras.map((e) => e.order);
    expect(orders).toEqual([1, 2, 3, 4, 5]);
    expect(new Set(eras.map((e) => e.id)).size).toBe(5);
  });
  it("includes the pre-Islamic era used by the seed poet", () => {
    expect(eras.some((e) => e.id === "jahili")).toBe(true);
  });
});

describe("content/poets.ts", () => {
  it("validates as a Poet array", () => {
    expect(z.array(PoetSchema).safeParse(poets).success).toBe(true);
  });
  it("includes Imru' al-Qais in the pre-Islamic era", () => {
    const poet = poets.find((p) => p.id === "imru-al-qais");
    expect(poet).toBeDefined();
    expect(poet?.nameAr).toBe("امرؤ القيس بن حُجْر الكِندي");
    expect(poet?.eraId).toBe("jahili");
    expect(poet?.signaturePoemIds).toContain("muallaqat-imru-al-qais");
  });
});

describe("content/poems.ts", () => {
  it("validates as a Poem array", () => {
    expect(z.array(PoemSchema).safeParse(poems).success).toBe(true);
  });
  it("includes Imru' al-Qais's Mu'allaqa with the verified eight abyat", () => {
    const poem = poems.find((p) => p.id === "muallaqat-imru-al-qais");
    expect(poem).toBeDefined();
    expect(poem?.isMuallaqa).toBe(true);
    expect(poem?.type).toBe("muallaqa");
    expect(poem?.poetId).toBe("imru-al-qais");
    expect(poem?.eraId).toBe("jahili");
    expect(poem?.linesAr).toHaveLength(8);
    expect(poem?.linesAr[0]).toBe(
      "قِفَا نَبْكِ مِنْ ذِكْرَى حَبِيبٍ ومَنْزِلِ بِسِقْطِ اللِّوَى بَينَ الدَّخول فَحَوْملِ",
    );
    expect(poem?.source).toContain(
      "https://ar.wikisource.org/wiki/معلقة_امرئ_القيس",
    );
    expect(poem?.source).toContain("https://www.aldiwan.net/poem50.html");
  });
});
```

- [ ] **Step 2: Run — expect FAIL (modules missing).**
```bash
cd /home/sawad/devrepo/muallaqat && pnpm vitest run tests/unit/seed.test.ts
```
Expected output includes:
```
Error: Failed to load url ../../content/eras ... Does the file exist?
 FAIL  tests/unit/seed.test.ts [ tests/unit/seed.test.ts ]
```

- [ ] **Step 3: Implement `content/eras.ts` (the five eras).** Create `/home/sawad/devrepo/muallaqat/content/eras.ts`:
```ts
import type { Era } from "../lib/schemas";

/**
 * The five eras of the journey. M1 seeds them minimally; later milestones
 * enrich descriptions and scenes. Order is 1..5 and ids are unique.
 */
export const eras: Era[] = [
  {
    id: "jahili",
    slug: "jahili",
    nameAr: "العصر الجاهلي",
    nameEn: "The Pre-Islamic Era",
    order: 1,
    startYear: 475,
    endYear: 622,
    descriptionAr:
      "عصر القصيدة الجاهلية والمعلقات، حيث وُلد البيت العربي على ألسنة فحول الشعراء.",
    descriptionEn:
      "The age of the pre-Islamic ode and the Mu'allaqat, when the Arabic verse was born on the tongues of the master poets.",
    scene: {
      palette: ["#1a130a", "#b8873a", "#f0ddb0"],
      motif: "desert-sand",
      motion: "drift",
    },
  },
  {
    id: "islami",
    slug: "islami",
    nameAr: "العصر الإسلامي",
    nameEn: "The Islamic Era",
    order: 2,
    startYear: 622,
    endYear: 750,
    descriptionAr:
      "عصر صدر الإسلام والدولة الأموية، حيث تحوّل الشعر مع القيم الجديدة والفتوح.",
    descriptionEn:
      "The era of early Islam and the Umayyad state, when poetry shifted with new values and conquests.",
    scene: {
      palette: ["#0e1726", "#b8873a", "#f5f0e8"],
      motif: "crescent",
      motion: "rise",
    },
  },
  {
    id: "abbasi",
    slug: "abbasi",
    nameAr: "العصر العباسي",
    nameEn: "The Abbasid Era",
    order: 3,
    startYear: 750,
    endYear: 1258,
    descriptionAr:
      "العصر الذهبي للحضارة العربية، حيث ازدهر الشعر والفلسفة والترجمة في بغداد.",
    descriptionEn:
      "The golden age of Arab civilization, when poetry, philosophy and translation flourished in Baghdad.",
    scene: {
      palette: ["#6b2d3e", "#d4a855", "#f0ddb0"],
      motif: "arabesque",
      motion: "bloom",
    },
  },
  {
    id: "andalusi",
    slug: "andalusi",
    nameAr: "العصر الأندلسي",
    nameEn: "The Andalusian Era",
    order: 4,
    startYear: 711,
    endYear: 1492,
    descriptionAr:
      "عصر الموشحات وحدائق قرطبة وغرناطة، حيث تجدّد الشعر العربي في الأندلس.",
    descriptionEn:
      "The era of the muwashshah and the gardens of Cordoba and Granada, when Arabic poetry renewed itself in al-Andalus.",
    scene: {
      palette: ["#3d2c1e", "#d4a855", "#ede5d5"],
      motif: "garden-arch",
      motion: "flow",
    },
  },
  {
    id: "hadith",
    slug: "hadith",
    nameAr: "العصر الحديث",
    nameEn: "The Modern Era",
    order: 5,
    startYear: 1798,
    endYear: 2025,
    descriptionAr:
      "عصر النهضة والشعر الحر والنثر، حيث يلتقي التراث بالحداثة في الكلمة العربية.",
    descriptionEn:
      "The era of the renaissance, free verse and prose, where heritage meets modernity in the Arabic word.",
    scene: {
      palette: ["#7a6455", "#b8873a", "#f5f0e8"],
      motif: "ink-pen",
      motion: "write",
    },
  },
];
```

- [ ] **Step 4: Implement `content/poets.ts` (Imru' al-Qais).** Create `/home/sawad/devrepo/muallaqat/content/poets.ts`:
```ts
import type { Poet } from "../lib/schemas";

/**
 * M1 seeds a single poet: Imru' al-Qais, of the pre-Islamic (jahili) era,
 * author of the first Mu'allaqa. nameAr matches the verified seed list.
 */
export const poets: Poet[] = [
  {
    id: "imru-al-qais",
    slug: "imru-al-qais",
    nameAr: "امرؤ القيس بن حُجْر الكِندي",
    nameEn: "Imru' al-Qais",
    eraId: "jahili",
    deathYear: 544,
    region: "نجد",
    bioAr:
      "امرؤ القيس بن حُجْر الكِندي، من أشهر شعراء الجاهلية وصاحب أولى المعلقات السبع، يُلقّب بالملك الضليل.",
    bioEn:
      "Imru' al-Qais ibn Hujr al-Kindi, among the most famous pre-Islamic poets and author of the first of the seven Mu'allaqat, called the Errant King.",
    humanStoryAr:
      "ابن ملكٍ من كِندة، قضى شبابه في اللهو، فلمّا قُتل أبوه نذر حياته للثأر فطاف القبائل طلباً للنصرة حتى مات غريباً.",
    humanStoryEn:
      "Son of a king of Kinda, he spent his youth in revelry; when his father was killed he devoted his life to vengeance, roaming the tribes for aid until he died a stranger.",
    themes: ["ghazal", "fakhr"],
    signaturePoemIds: ["muallaqat-imru-al-qais"],
  },
];
```

- [ ] **Step 5: Implement `content/poems.ts` (the Mu'allaqa, verified eight abyat).** Create `/home/sawad/devrepo/muallaqat/content/poems.ts`:
```ts
import type { Poem } from "../lib/schemas";

/**
 * M1 seeds Imru' al-Qais's Mu'allaqa with the verified opening eight abyat.
 * Each bayt is one string carrying both hemistichs (sadr + 'ajuz).
 * isMuallaqa = true; source = the cross-verified primary + secondary URLs.
 */
export const poems: Poem[] = [
  {
    id: "muallaqat-imru-al-qais",
    slug: "muallaqat-imru-al-qais",
    titleAr: "معلقة امرئ القيس",
    titleEn: "The Mu'allaqa of Imru' al-Qais",
    poetId: "imru-al-qais",
    eraId: "jahili",
    type: "muallaqa",
    rhyme: "اللام",
    themes: ["ghazal", "fakhr"],
    linesAr: [
      "قِفَا نَبْكِ مِنْ ذِكْرَى حَبِيبٍ ومَنْزِلِ بِسِقْطِ اللِّوَى بَينَ الدَّخول فَحَوْملِ",
      "فَتُوْضِحَ فَالمِقْراةِ لمْ يَعْفُ رَسْمُها لِما نَسَجَتْهَا مِنْ جَنُوبٍ وشَمْألِ",
      "تَرَى بَعَرَ الأرْآمِ فِي عَرَصَاتِهَا وَقِيْعَانِهَا كَأنَّهُ حَبُّ فُلْفُلِ",
      "كَأنّي غَدَاةَ البَيْنِ يَومَ تَحَمَّلوا لَدَى سَمُراتِ الحَيِّ نَاقِفُ حَنْظَلِ",
      "وُقُوْفاً بِها صَحْبِي عَلَيَّ مَطِيَّهُمُ يَقُوْلُوْنَ لا تَهْلِكْ أَسًى وَتَجَمَّلِ",
      "وإِنَّ شِفائي عَبْرَةٌ مُهْراقَةٌ فَهَلْ عِندَ رَسْمٍ دَارِسٍ مِنْ مُعَوَّلِ",
      "كَدَأْبِكَ مِنْ أُمِّ الحُوَيْرِثِ قَبْلَها وَجارَتِها أُمِّ الرَّبابِ بِمَأْسَلِ",
      "إِذَا قَامَتَا تَضَوَّعَ المِسْكُ مِنهُمَا نَسِيْمَ الصَّبَا جَاءَتْ بِرَيَّا القَرَنْفُلِ",
    ],
    contextAr:
      "مطلع المعلقة، يقف فيه الشاعر على أطلال الحبيبة باكياً ذكراها مستوقفاً صحبه.",
    contextEn:
      "The opening of the Mu'allaqa, where the poet halts at the beloved's ruins, weeping her memory and bidding his companions stop.",
    isMuallaqa: true,
    source: [
      "https://ar.wikisource.org/wiki/معلقة_امرئ_القيس",
      "https://www.aldiwan.net/poem50.html",
    ],
  },
];
```

- [ ] **Step 6: Run — expect PASS.**
```bash
cd /home/sawad/devrepo/muallaqat && pnpm vitest run tests/unit/seed.test.ts
```
Expected output includes:
```
 ✓ tests/unit/seed.test.ts (7 tests)
 Test Files  1 passed (1)
      Tests  7 passed (7)
```

- [ ] **Step 7: Commit.**
```bash
cd /home/sawad/devrepo/muallaqat
git add content/eras.ts content/poets.ts content/poems.ts tests/unit/seed.test.ts
git commit -m "feat(content): seed five eras, Imru al-Qais, and his verified Mu'allaqa"
```

---

### Task C5: lib/content.ts — validating loaders (getEras/getPoets/getPoems/getTribute)

**Files:**
- Create: `/home/sawad/devrepo/muallaqat/lib/content.ts`
- Test: `/home/sawad/devrepo/muallaqat/tests/unit/content.test.ts`

- [ ] **Step 1: Write the failing loader spec.** Create `/home/sawad/devrepo/muallaqat/tests/unit/content.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import {
  getEras,
  getPoets,
  getPoems,
  getTribute,
} from "../../lib/content";

describe("lib/content loaders", () => {
  it("getEras returns the five validated eras in order", () => {
    const eras = getEras();
    expect(eras).toHaveLength(5);
    expect(eras.map((e) => e.order)).toEqual([1, 2, 3, 4, 5]);
  });

  it("getPoets returns Imru' al-Qais", () => {
    const poets = getPoets();
    expect(poets.some((p) => p.id === "imru-al-qais")).toBe(true);
  });

  it("getPoems returns the Mu'allaqa with eight abyat", () => {
    const poems = getPoems();
    const poem = poems.find((p) => p.id === "muallaqat-imru-al-qais");
    expect(poem).toBeDefined();
    expect(poem?.linesAr).toHaveLength(8);
    expect(poem?.isMuallaqa).toBe(true);
  });

  it("getTribute returns Awad Shaaban with the verbatim creed", () => {
    const t = getTribute();
    expect(t.nameAr).toBe("عوض شعبان");
    expect(t.creedAr).toBe(
      "الكتابة ليست موهبة فحسب، بل هي مسؤولية تجاه الكلمة والإنسان.",
    );
  });
});
```

- [ ] **Step 2: Run — expect FAIL (module missing).**
```bash
cd /home/sawad/devrepo/muallaqat && pnpm vitest run tests/unit/content.test.ts
```
Expected output includes:
```
Error: Failed to load url ../../lib/content ... Does the file exist?
 FAIL  tests/unit/content.test.ts [ tests/unit/content.test.ts ]
```

- [ ] **Step 3: Implement `lib/content.ts` (validate-at-load + accessor functions).** Create `/home/sawad/devrepo/muallaqat/lib/content.ts`:
```ts
import * as z from "zod";
import {
  EraSchema,
  PoetSchema,
  PoemSchema,
  TributeSchema,
  type Era,
  type Poet,
  type Poem,
  type Tribute,
} from "./schemas";
import { eras as rawEras } from "../content/eras";
import { poets as rawPoets } from "../content/poets";
import { poems as rawPoems } from "../content/poems";
import { tribute as rawTribute } from "../content/tribute";

/**
 * Validate a value against a schema at module-load time.
 * On failure, throw ONE clear Error whose message names the source file
 * and includes Zod 4's human-readable z.prettifyError() output.
 *
 * Because this module is imported synchronously (and pages import from it,
 * not from content/* directly), any invalid content throws during
 * `next build` / app boot — a hard, early failure rather than a silent bug.
 */
function validate<T>(schema: z.ZodType<T>, data: unknown, source: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Error(
      `Invalid content in ${source}:\n${z.prettifyError(result.error)}`,
    );
  }
  return result.data;
}

/* Parsed, validated, frozen content. Throws on load if any record is invalid. */
const eras: readonly Era[] = Object.freeze(
  validate(z.array(EraSchema), rawEras, "content/eras.ts"),
);

const poets: readonly Poet[] = Object.freeze(
  validate(z.array(PoetSchema), rawPoets, "content/poets.ts"),
);

const poems: readonly Poem[] = Object.freeze(
  validate(z.array(PoemSchema), rawPoems, "content/poems.ts"),
);

const tribute: Tribute = Object.freeze(
  validate(TributeSchema, rawTribute, "content/tribute.ts"),
);

/* ---------- loaders ---------- */

export function getEras(): readonly Era[] {
  return eras;
}

export function getPoets(): readonly Poet[] {
  return poets;
}

export function getPoems(): readonly Poem[] {
  return poems;
}

export function getTribute(): Tribute {
  return tribute;
}

/* ---------- lookup helpers ---------- */

export function eraBySlug(slug: string): Era | undefined {
  return eras.find((e) => e.slug === slug);
}

export function poetBySlug(slug: string): Poet | undefined {
  return poets.find((p) => p.slug === slug);
}

export function poemBySlug(slug: string): Poem | undefined {
  return poems.find((p) => p.slug === slug);
}

export function poetById(id: string): Poet | undefined {
  return poets.find((p) => p.id === id);
}
```

- [ ] **Step 4: Run — expect PASS.**
```bash
cd /home/sawad/devrepo/muallaqat && pnpm vitest run tests/unit/content.test.ts
```
Expected output includes:
```
 ✓ tests/unit/content.test.ts (4 tests)
 Test Files  1 passed (1)
      Tests  4 passed (4)
```

- [ ] **Step 5: Run the FULL unit suite to confirm Group C integrates.**
```bash
cd /home/sawad/devrepo/muallaqat && pnpm vitest run tests/unit
```
Expected output includes:
```
 ✓ tests/unit/schemas.test.ts (13 tests)
 ✓ tests/unit/slug.test.ts (5 tests)
 ✓ tests/unit/tribute.test.ts (6 tests)
 ✓ tests/unit/seed.test.ts (7 tests)
 ✓ tests/unit/content.test.ts (4 tests)
 Test Files  5 passed (5)
      Tests  35 passed (35)
```

- [ ] **Step 6: Commit.**
```bash
cd /home/sawad/devrepo/muallaqat
git add lib/content.ts tests/unit/content.test.ts
git commit -m "feat(content): add validating content loaders for eras, poets, poems, tribute"
```

---

## Group D: The Doorway page

The project is greenfield. I have all the contract details I need. Let me draft the Group D task group.

### Task D1: DoorwayOverture component (unit-tested, reduced-motion aware)

**Files:**
- Create: `/home/sawad/devrepo/muallaqat/components/doorway/DoorwayOverture.tsx`
- Test: `/home/sawad/devrepo/muallaqat/tests/unit/DoorwayOverture.test.tsx`

- [ ] **Step 1: Write the failing unit test for DoorwayOverture.**
  Create `/home/sawad/devrepo/muallaqat/tests/unit/DoorwayOverture.test.tsx`. The component is a `'use client'` presentational component (NOT async — Vitest cannot test async Server Components per the verified Next.js caveat). It takes the name, creed, dedication, an enter-button label, an enter-href, and a `reducedMotion` prop. We assert the name, creed, dedication and enter link render, that the enter link points at `/diwan`, and that with `reducedMotion` the name SVG is statically drawn (no animation class, immediately present in the DOM).

```tsx
import { render, screen } from '@testing-library/react'
import { DoorwayOverture } from '@/components/doorway/DoorwayOverture'

const NAME = 'عوض شعبان'
const CREED =
  'الكتابة ليست موهبة فحسب، بل هي مسؤولية تجاه الكلمة والإنسان.'
const DEDICATION = 'إلى روح أبي، عوض شعبان، الذي علّمنا أنّ الكلمة أمانة.'
const ENTER_LABEL = 'ادخل الديوان'

describe('DoorwayOverture', () => {
  it('renders the father name (accessible label on the SVG)', () => {
    render(
      <DoorwayOverture
        name={NAME}
        creed={CREED}
        dedication={DEDICATION}
        enterLabel={ENTER_LABEL}
        enterHref="/diwan"
        reducedMotion={false}
      />,
    )
    expect(screen.getByRole('img', { name: NAME })).toBeInTheDocument()
  })

  it('renders the creed text', () => {
    render(
      <DoorwayOverture
        name={NAME}
        creed={CREED}
        dedication={DEDICATION}
        enterLabel={ENTER_LABEL}
        enterHref="/diwan"
        reducedMotion={false}
      />,
    )
    expect(screen.getByText(CREED)).toBeInTheDocument()
  })

  it('renders the dedication line', () => {
    render(
      <DoorwayOverture
        name={NAME}
        creed={CREED}
        dedication={DEDICATION}
        enterLabel={ENTER_LABEL}
        enterHref="/diwan"
        reducedMotion={false}
      />,
    )
    expect(screen.getByText(DEDICATION)).toBeInTheDocument()
  })

  it('renders the enter link pointing at /diwan', () => {
    render(
      <DoorwayOverture
        name={NAME}
        creed={CREED}
        dedication={DEDICATION}
        enterLabel={ENTER_LABEL}
        enterHref="/diwan"
        reducedMotion={false}
      />,
    )
    const link = screen.getByRole('link', { name: ENTER_LABEL })
    expect(link).toHaveAttribute('href', '/diwan')
  })

  it('uses the animated state class when motion is allowed', () => {
    render(
      <DoorwayOverture
        name={NAME}
        creed={CREED}
        dedication={DEDICATION}
        enterLabel={ENTER_LABEL}
        enterHref="/diwan"
        reducedMotion={false}
      />,
    )
    const svg = screen.getByRole('img', { name: NAME })
    expect(svg).toHaveClass('doorway-name--animate')
    expect(svg).not.toHaveClass('doorway-name--static')
  })

  it('respects reduced motion: static name, no animation class, visible immediately', () => {
    render(
      <DoorwayOverture
        name={NAME}
        creed={CREED}
        dedication={DEDICATION}
        enterLabel={ENTER_LABEL}
        enterHref="/diwan"
        reducedMotion={true}
      />,
    )
    const svg = screen.getByRole('img', { name: NAME })
    expect(svg).toHaveClass('doorway-name--static')
    expect(svg).not.toHaveClass('doorway-name--animate')
    // The name remains accessible (the static fallback shows the readable name).
    expect(screen.getByRole('img', { name: NAME })).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run the test and confirm it FAILS.**
  Command:
  ```bash
  pnpm vitest run tests/unit/DoorwayOverture.test.tsx
  ```
  Expected output (the module does not exist yet):
  ```
  FAIL  tests/unit/DoorwayOverture.test.tsx [ tests/unit/DoorwayOverture.test.tsx ]
  Error: Failed to resolve import "@/components/doorway/DoorwayOverture" from "tests/unit/DoorwayOverture.test.tsx". Does the file exist?
  ...
  Test Files  1 failed (1)
       Tests  no tests
  ```

- [ ] **Step 3: Implement DoorwayOverture with the static-by-default name and reduced-motion fallback.**
  Create `/home/sawad/devrepo/muallaqat/components/doorway/DoorwayOverture.tsx`. The default markup renders the FINAL/visible state (the name path drawn) so SSR / JS-off / reduced-motion all show the readable name. The `reducedMotion` prop drives the class on the SVG: `doorway-name--static` (drawn, no animation) vs `doorway-name--animate` (self-writing stroke). `<title>` inside the SVG makes `role="img"` resolve its accessible name to «عوض شعبان». The enter button is a plain `<a href={enterHref}>` so the `/diwan` link is present even before that route exists. We render the name BOTH as a self-writing SVG stroke AND as visually-rendered Arabic text inside `<text>` so the name is legible in browsers immediately (the stroke path animates over it when allowed).

```tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

type DoorwayOvertureProps = {
  name: string;
  creed: string;
  dedication: string;
  enterLabel: string;
  enterHref: string;
  /** When true, render the static (fully drawn) name with no animation. */
  reducedMotion: boolean;
};

export function DoorwayOverture({
  name,
  creed,
  dedication,
  enterLabel,
  enterHref,
  reducedMotion,
}: DoorwayOvertureProps) {
  const container = useRef<HTMLDivElement>(null);
  const textRef = useRef<SVGTextElement>(null);
  const [length, setLength] = useState(0);

  // Measure the rendered text outline length client-side so the stroke
  // dashoffset 'self-writing' has a real value (getComputedTextLength is
  // available on SVGTextElement in the browser, not during SSR).
  useEffect(() => {
    const node = textRef.current;
    if (!node) return;
    setLength(node.getComputedTextLength());
  }, [name]);

  useGSAP(
    () => {
      if (reducedMotion) return;
      const node = textRef.current;
      if (!node || length === 0) return;

      gsap.set(node, { strokeDasharray: length, strokeDashoffset: length });
      gsap.to(node, {
        strokeDashoffset: 0,
        duration: 2.4,
        ease: 'power1.inOut',
        delay: 0.2,
      });
    },
    { scope: container, dependencies: [reducedMotion, length] },
  );

  const nameStateClass = reducedMotion
    ? 'doorway-name--static'
    : 'doorway-name--animate';

  return (
    <div
      ref={container}
      className="flex min-h-screen flex-col items-center justify-center gap-10 bg-night px-6 py-20 text-center"
    >
      <svg
        viewBox="0 0 600 200"
        className={`${nameStateClass} h-auto w-[min(80vw,600px)]`}
        role="img"
        aria-label={name}
        focusable="false"
      >
        <title>{name}</title>
        <text
          ref={textRef}
          x="300"
          y="120"
          textAnchor="middle"
          dominantBaseline="middle"
          fontFamily="var(--font-display)"
          fontSize="92"
          fill="var(--color-gold)"
          stroke="var(--color-gold-light)"
          strokeWidth={1.5}
        >
          {name}
        </text>
      </svg>

      <p className="max-w-2xl font-display text-2xl leading-relaxed text-gold-pale">
        {creed}
      </p>

      <p className="max-w-xl font-ui text-base leading-relaxed text-ink-muted">
        {dedication}
      </p>

      <a
        href={enterHref}
        className="rounded-s-lg rounded-e-lg border border-gold px-8 py-3 font-kufi text-lg text-gold-light transition-colors hover:bg-gold hover:text-night"
      >
        {enterLabel}
      </a>
    </div>
  );
}
```

- [ ] **Step 4: Run the test and confirm it PASSES.**
  Command:
  ```bash
  pnpm vitest run tests/unit/DoorwayOverture.test.tsx
  ```
  Expected output:
  ```
  ✓ tests/unit/DoorwayOverture.test.tsx (6 tests)
    ✓ DoorwayOverture > renders the father name (accessible label on the SVG)
    ✓ DoorwayOverture > renders the creed text
    ✓ DoorwayOverture > renders the dedication line
    ✓ DoorwayOverture > renders the enter link pointing at /diwan
    ✓ DoorwayOverture > uses the animated state class when motion is allowed
    ✓ DoorwayOverture > respects reduced motion: static name, no animation class, visible immediately

  Test Files  1 passed (1)
       Tests  6 passed (6)
  ```

- [ ] **Step 5: Add the reduced-motion CSS guard for the doorway name in globals.css.**
  Append the following rule to `/home/sawad/devrepo/muallaqat/app/globals.css` (after the existing `@media (prefers-reduced-motion: reduce)` block defined in the foundation task). This forces the self-writing stroke to its final drawn state for CSS-driven / JS-off users even on the `doorway-name--animate` variant, so the name is always legible.

```css
/* ------------------------------------------------------------
   Doorway overture — self-writing father's name.
   Default (animate) variant draws the stroke via GSAP; the static
   variant and reduced-motion users see the fully drawn name.
   ------------------------------------------------------------ */
.doorway-name--static text {
  stroke-dasharray: none;
  stroke-dashoffset: 0;
}

@media (prefers-reduced-motion: reduce) {
  .doorway-name--animate text {
    stroke-dasharray: none !important;
    stroke-dashoffset: 0 !important;
  }
}
```

- [ ] **Step 6: Re-run the unit test to confirm nothing regressed after the CSS edit.**
  Command:
  ```bash
  pnpm vitest run tests/unit/DoorwayOverture.test.tsx
  ```
  Expected output:
  ```
  Test Files  1 passed (1)
       Tests  6 passed (6)
  ```

- [ ] **Step 7: Commit the DoorwayOverture component, its test, and the CSS guard.**
  Commands:
  ```bash
  git -C /home/sawad/devrepo/muallaqat add components/doorway/DoorwayOverture.tsx tests/unit/DoorwayOverture.test.tsx app/globals.css
  git -C /home/sawad/devrepo/muallaqat commit -m "feat(doorway): self-writing father's name overture with reduced-motion fallback"
  ```

### Task D2: Doorway tribute content + messages for the overture copy

**Files:**
- Modify: `/home/sawad/devrepo/muallaqat/content/tribute.ts`
- Modify: `/home/sawad/devrepo/muallaqat/messages/ar.json`
- Modify: `/home/sawad/devrepo/muallaqat/messages/en.json`
- Test: `/home/sawad/devrepo/muallaqat/tests/unit/tribute-doorway.test.ts`

- [ ] **Step 1: Write a failing unit test asserting the tribute exposes the creed and dedication used by the Doorway.**
  Create `/home/sawad/devrepo/muallaqat/tests/unit/tribute-doorway.test.ts`. The Doorway pulls its name + creed from `getTribute()`/the validated `tribute` export, and the dedication from `tribute.dedicationAr`. This test pins the exact verbatim Arabic strings so the Doorway page can never silently drift from the verified facts.

```ts
import { describe, it, expect } from 'vitest'
import { tribute } from '../../lib/content'

describe('tribute (Doorway overture source)', () => {
  it("exposes the father's name verbatim", () => {
    expect(tribute.nameAr).toBe('عوض شعبان')
  })

  it('exposes the verified creed verbatim', () => {
    expect(tribute.creedAr).toBe(
      'الكتابة ليست موهبة فحسب، بل هي مسؤولية تجاه الكلمة والإنسان.',
    )
  })

  it('exposes a non-empty Arabic dedication line', () => {
    expect(typeof tribute.dedicationAr).toBe('string')
    expect(tribute.dedicationAr.length).toBeGreaterThan(0)
  })
})
```

- [ ] **Step 2: Run the test and confirm it FAILS (or passes only partially).**
  Command:
  ```bash
  pnpm vitest run tests/unit/tribute-doorway.test.ts
  ```
  Expected output (the dedication assertion fails if `content/tribute.ts` has no `dedicationAr`, or the creed differs):
  ```
  FAIL  tests/unit/tribute-doorway.test.ts > tribute (Doorway overture source) > exposes a non-empty Arabic dedication line
  AssertionError: expected '' to have a length greater than 0
  ...
  Test Files  1 failed (1)
       Tests  1 failed | 2 passed (3)
  ```

- [ ] **Step 3: Set the verified creed and a dedication line in content/tribute.ts.**
  Open `/home/sawad/devrepo/muallaqat/content/tribute.ts` and ensure the `tribute` object's `creedAr` and `dedicationAr` fields hold exactly these strings (replace the existing field values; do not add duplicate keys). The creed is verbatim from the verified facts; the dedication is the memorial line the Doorway renders.

```ts
  creedAr: 'الكتابة ليست موهبة فحسب، بل هي مسؤولية تجاه الكلمة والإنسان.',
  creedEn:
    'Writing is not merely a talent; it is a responsibility toward the word and toward humanity.',
  dedicationAr: 'إلى روح أبي، عوض شعبان، الذي علّمنا أنّ الكلمة أمانة.',
```

- [ ] **Step 4: Run the test and confirm it PASSES.**
  Command:
  ```bash
  pnpm vitest run tests/unit/tribute-doorway.test.ts
  ```
  Expected output:
  ```
  ✓ tests/unit/tribute-doorway.test.ts (3 tests)
    ✓ tribute (Doorway overture source) > exposes the father's name verbatim
    ✓ tribute (Doorway overture source) > exposes the verified creed verbatim
    ✓ tribute (Doorway overture source) > exposes a non-empty Arabic dedication line

  Test Files  1 passed (1)
       Tests  3 passed (3)
  ```

- [ ] **Step 5: Add the Doorway namespace keys to messages/ar.json.**
  Open `/home/sawad/devrepo/muallaqat/messages/ar.json` and ensure the `Doorway` namespace contains the `title` (already seeded) plus the `enter` label. Replace the `Doorway` block with:

```json
  "Doorway": {
    "title": "مُعلّقات",
    "enter": "ادخل الديوان"
  },
```

- [ ] **Step 6: Mirror the Doorway keys in messages/en.json.**
  Open `/home/sawad/devrepo/muallaqat/messages/en.json` and replace the `Doorway` block so the key structure mirrors `ar.json` exactly:

```json
  "Doorway": {
    "title": "The Living Diwan",
    "enter": "Enter the Diwan"
  },
```

- [ ] **Step 7: Run the full unit suite to confirm content + messages are valid and nothing regressed.**
  Command:
  ```bash
  pnpm vitest run tests/unit
  ```
  Expected output (tribute-doorway plus all earlier unit specs pass):
  ```
  Test Files  ... passed
       Tests  ... passed
  ```

- [ ] **Step 8: Commit the content and message updates.**
  Commands:
  ```bash
  git -C /home/sawad/devrepo/muallaqat add content/tribute.ts messages/ar.json messages/en.json tests/unit/tribute-doorway.test.ts
  git -C /home/sawad/devrepo/muallaqat commit -m "feat(doorway): wire creed, dedication and enter label for the overture"
  ```

### Task D3: The Doorway page (route '/') wiring the overture

**Files:**
- Create: `/home/sawad/devrepo/muallaqat/app/[locale]/page.tsx`
- Test: `/home/sawad/devrepo/muallaqat/tests/e2e/doorway.spec.ts`

- [ ] **Step 1: Write the failing Playwright e2e spec for the Doorway.**
  Create `/home/sawad/devrepo/muallaqat/tests/e2e/doorway.spec.ts`. It loads `/ar`, asserts the father's name and the verbatim creed and dedication appear, asserts `<html dir="rtl">`, asserts the «ادخل الديوان» enter link points at a `/diwan` URL, and (under emulated reduced-motion) asserts the static name is visible immediately. The reduced-motion test uses `test.use({ reducedMotion: 'reduce' })` at describe scope, a path verified in the research.

```ts
import { test, expect } from '@playwright/test'

const NAME = 'عوض شعبان'
const CREED =
  'الكتابة ليست موهبة فحسب، بل هي مسؤولية تجاه الكلمة والإنسان.'
const DEDICATION = 'إلى روح أبي، عوض شعبان، الذي علّمنا أنّ الكلمة أمانة.'
const ENTER = 'ادخل الديوان'

test.describe('The Doorway (route /)', () => {
  test('Arabic doorway shows the name, creed, dedication, and is RTL', async ({
    page,
  }) => {
    await page.goto('/ar')

    // <html dir="rtl"> from the locale layout
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl')

    // Father's name (accessible label on the self-writing SVG)
    await expect(page.getByRole('img', { name: NAME })).toBeVisible()

    // Creed (verbatim) and dedication line
    await expect(page.locator('body')).toContainText(CREED)
    await expect(page.locator('body')).toContainText(DEDICATION)
  })

  test('enter button links into /diwan', async ({ page }) => {
    await page.goto('/ar')
    const enter = page.getByRole('link', { name: ENTER })
    await expect(enter).toBeVisible()
    await expect(enter).toHaveAttribute('href', /\/diwan(\/|$)/)
  })

  test('root / redirects into the Arabic (default-locale) experience', async ({
    page,
  }) => {
    await page.goto('/')
    await expect(page).toHaveURL(/\/ar(\/|$)/)
    await expect(page.getByRole('img', { name: NAME })).toBeVisible()
  })
})

test.describe('The Doorway under reduced motion', () => {
  test.use({ reducedMotion: 'reduce' })

  test('shows the name statically and immediately (no self-writing animation)', async ({
    page,
  }) => {
    await page.goto('/ar')

    // Reduced-motion fallback: the SVG carries the static state class
    // and the readable name is present right away.
    const svg = page.getByRole('img', { name: NAME })
    await expect(svg).toBeVisible()
    await expect(svg).toHaveClass(/doorway-name--static/)
  })
})
```

- [ ] **Step 2: Run the e2e spec and confirm it FAILS.**
  Command:
  ```bash
  pnpm test:e2e tests/e2e/doorway.spec.ts
  ```
  Expected output (the page renders the seeded `t('title')` placeholder, not the overture, so the name/creed/dedication and static-class assertions fail):
  ```
  Running 4 tests using 1 worker

    ✘  [chromium] › tests/e2e/doorway.spec.ts › The Doorway (route /) › Arabic doorway shows the name, creed, dedication, and is RTL
    Error: expect(locator).toBeVisible() failed
    Locator: getByRole('img', { name: 'عوض شعبان' })
    ...
    4 failed
  ```

- [ ] **Step 3: Implement the Doorway page as an async Server Component that renders the overture.**
  Create `/home/sawad/devrepo/muallaqat/app/[locale]/page.tsx`. It awaits `params`, calls `setRequestLocale(locale)` BEFORE any other next-intl API (keeps the route static), derives the AR/EN copy via `getTranslations('Doorway')`, pulls the name/creed/dedication from the validated `tribute`, and renders the `DoorwayOverture` client island. The page itself does not detect reduced motion server-side — it passes `reducedMotion={false}` as the default (final/static name still renders), and the client `DoorwayOverture` reads the media query to drive the GSAP animation. The enter link href is the literal `/{locale}/diwan` so the locale prefix is preserved (route may 404 until a later milestone — the link is still present).

```tsx
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { DoorwayOverture } from '@/components/doorway/DoorwayOverture';
import { tribute } from '@/lib/content';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function DoorwayPage({ params }: Props) {
  const { locale } = await params;
  // Must run before any other next-intl API so the route stays static.
  setRequestLocale(locale);

  const t = await getTranslations('Doorway');

  return (
    <main>
      <DoorwayOverture
        name={tribute.nameAr}
        creed={tribute.creedAr}
        dedication={tribute.dedicationAr}
        enterLabel={t('enter')}
        enterHref={`/${locale}/diwan`}
        reducedMotion={false}
      />
    </main>
  );
}
```

- [ ] **Step 4: Run the e2e spec and confirm the content/RTL/link tests PASS.**
  Command:
  ```bash
  pnpm test:e2e tests/e2e/doorway.spec.ts
  ```
  Expected output:
  ```
  Running 4 tests using 1 worker

    ✓  [chromium] › tests/e2e/doorway.spec.ts › The Doorway (route /) › Arabic doorway shows the name, creed, dedication, and is RTL
    ✓  [chromium] › tests/e2e/doorway.spec.ts › The Doorway (route /) › enter button links into /diwan
    ✓  [chromium] › tests/e2e/doorway.spec.ts › The Doorway (route /) › root / redirects into the Arabic (default-locale) experience
    ✓  [chromium] › tests/e2e/doorway.spec.ts › The Doorway under reduced motion › shows the name statically and immediately (no self-writing animation)

    4 passed
  ```

- [ ] **Step 5: Verify the reduced-motion static-class wiring needs the client to read the media query — patch DoorwayOverture to self-detect reduced motion so the page can pass a static default.**
  The page passes `reducedMotion={false}`, but the reduced-motion e2e test asserts the `doorway-name--static` class when the browser emulates reduced motion. The client component must therefore detect the media query itself and override the prop. Edit `/home/sawad/devrepo/muallaqat/components/doorway/DoorwayOverture.tsx` to add an SSR-safe media-query read that takes precedence over the incoming prop. Replace the imports and the start of the component body.

  Replace this exact block:
```tsx
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);
```
  with:
```tsx
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
```

  Then replace this exact block:
```tsx
  const container = useRef<HTMLDivElement>(null);
  const textRef = useRef<SVGTextElement>(null);
  const [length, setLength] = useState(0);
```
  with:
```tsx
  const container = useRef<HTMLDivElement>(null);
  const textRef = useRef<SVGTextElement>(null);
  const [length, setLength] = useState(0);

  // SSR-safe reduced-motion detection. Defaults to the incoming prop on the
  // server (no matchMedia), then reads + subscribes to the live media query.
  const [prefersReduced, setPrefersReduced] = useState(reducedMotion);

  useEffect(() => {
    const mql = window.matchMedia(REDUCED_MOTION_QUERY);
    setPrefersReduced(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  const effectiveReducedMotion = reducedMotion || prefersReduced;
```

  Then replace this exact block:
```tsx
  useGSAP(
    () => {
      if (reducedMotion) return;
      const node = textRef.current;
      if (!node || length === 0) return;

      gsap.set(node, { strokeDasharray: length, strokeDashoffset: length });
      gsap.to(node, {
        strokeDashoffset: 0,
        duration: 2.4,
        ease: 'power1.inOut',
        delay: 0.2,
      });
    },
    { scope: container, dependencies: [reducedMotion, length] },
  );

  const nameStateClass = reducedMotion
    ? 'doorway-name--static'
    : 'doorway-name--animate';
```
  with:
```tsx
  useGSAP(
    () => {
      if (effectiveReducedMotion) return;
      const node = textRef.current;
      if (!node || length === 0) return;

      gsap.set(node, { strokeDasharray: length, strokeDashoffset: length });
      gsap.to(node, {
        strokeDashoffset: 0,
        duration: 2.4,
        ease: 'power1.inOut',
        delay: 0.2,
      });
    },
    { scope: container, dependencies: [effectiveReducedMotion, length] },
  );

  const nameStateClass = effectiveReducedMotion
    ? 'doorway-name--static'
    : 'doorway-name--animate';
```

- [ ] **Step 6: Update the unit test to reflect that the `reducedMotion` prop still forces the static class without a media query.**
  The existing unit test in Task D1 passes `reducedMotion={true}` and asserts `doorway-name--static`; `effectiveReducedMotion = reducedMotion || prefersReduced` keeps that true, and `reducedMotion={false}` with jsdom's default (no reduced-motion match, `matchMedia` returns `matches: false`) keeps `doorway-name--animate`. Confirm jsdom provides `matchMedia`. Add this guard at the TOP of `/home/sawad/devrepo/muallaqat/tests/unit/DoorwayOverture.test.tsx`, immediately after the imports, so the `useEffect` media-query read does not throw in jsdom:

```tsx
beforeAll(() => {
  if (!window.matchMedia) {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => false,
      }),
    })
  }
})
```

- [ ] **Step 7: Re-run the unit test and confirm it still PASSES after the component change.**
  Command:
  ```bash
  pnpm vitest run tests/unit/DoorwayOverture.test.tsx
  ```
  Expected output:
  ```
  Test Files  1 passed (1)
       Tests  6 passed (6)
  ```

- [ ] **Step 8: Re-run the full Doorway e2e spec and confirm all four tests PASS.**
  Command:
  ```bash
  pnpm test:e2e tests/e2e/doorway.spec.ts
  ```
  Expected output:
  ```
  Running 4 tests using 1 worker

    ✓  [chromium] › tests/e2e/doorway.spec.ts › The Doorway (route /) › Arabic doorway shows the name, creed, dedication, and is RTL
    ✓  [chromium] › tests/e2e/doorway.spec.ts › The Doorway (route /) › enter button links into /diwan
    ✓  [chromium] › tests/e2e/doorway.spec.ts › The Doorway (route /) › root / redirects into the Arabic (default-locale) experience
    ✓  [chromium] › tests/e2e/doorway.spec.ts › The Doorway under reduced motion › shows the name statically and immediately (no self-writing animation)

    4 passed
  ```

- [ ] **Step 9: Commit the Doorway page, the reduced-motion self-detection, and the e2e spec.**
  Commands:
  ```bash
  git -C /home/sawad/devrepo/muallaqat add app/[locale]/page.tsx components/doorway/DoorwayOverture.tsx tests/unit/DoorwayOverture.test.tsx tests/e2e/doorway.spec.ts
  git -C /home/sawad/devrepo/muallaqat commit -m "feat(doorway): the Doorway page renders the memorial overture with enter link to /diwan"
  ```

---

## Group E: The Tribute memorial page

The portrait exists at `assets/awad-shaaban-portrait.jpg`. Now I have everything needed to draft Group E.

## Group E — The Tribute memorial page

This group builds the `/tribute` memorial from `getTribute()`. It depends on Group C (content layer: `lib/schemas.ts`, `lib/content.ts`, `content/tribute.ts`) and Group B (design primitives: `components/ornament/GoldDivider.tsx`, `components/typography/Verse.tsx`) and Group A (foundation: i18n, fonts, `messages/*.json`, Vitest + Playwright config). All paths, type names, and field names below are taken verbatim from the CONTRACT and VERIFIED RESEARCH.

---

### Task E1: Seed the Tribute content object (`content/tribute.ts`)

**Files:**
- Create: `/home/sawad/devrepo/muallaqat/content/tribute.ts`
- Test: `/home/sawad/devrepo/muallaqat/tests/unit/tribute-content.test.ts`

- [ ] **Step 1: Write the failing test for the tribute seed object.**
  Create `/home/sawad/devrepo/muallaqat/tests/unit/tribute-content.test.ts`:
  ```ts
  import { describe, it, expect } from 'vitest'
  import { TributeSchema } from '../../lib/schemas'
  import { tribute } from '../../content/tribute'

  describe('content/tribute.ts (Awad Shaaban)', () => {
    it('passes the TributeSchema validation', () => {
      const result = TributeSchema.safeParse(tribute)
      expect(result.success).toBe(true)
    })

    it('carries the verified name and dates', () => {
      expect(tribute.nameAr).toBe('عوض شعبان')
      expect(tribute.nameEn).toBe('Awad Shaaban')
      expect(tribute.birthYear).toBe(1931)
      expect(tribute.deathYear).toBe(2025)
    })

    it('points at the public portrait copy', () => {
      expect(tribute.portrait).toBe('/awad-shaaban-portrait.jpg')
    })

    it('carries both verbatim creeds in quotes', () => {
      const texts = tribute.quotes.map((q) => q.textAr)
      expect(texts).toContain(
        'الكتابة ليست موهبة فحسب، بل هي مسؤولية تجاه الكلمة والإنسان.',
      )
      expect(texts).toContain(
        'الأدب مرآة المجتمع ونافذته على المستقبل، فمن يكتب اليوم يرسم ملامح الغد.',
      )
    })

    it('lists the 1988 union prize for درب الجنوب in the timeline', () => {
      const ev = tribute.timeline.find((e) => e.year === 1988)
      expect(ev).toBeDefined()
      expect(ev!.eventAr).toContain('درب الجنوب')
    })

    it('includes درب الجنوب among the novels', () => {
      const novel = tribute.works.find(
        (w) => w.titleAr === 'درب الجنوب' && w.type === 'novel',
      )
      expect(novel).toBeDefined()
      expect(novel!.year).toBe(1988)
    })

    it('records seven novels, six story collections, and three translations', () => {
      expect(tribute.works.filter((w) => w.type === 'novel')).toHaveLength(7)
      expect(tribute.works.filter((w) => w.type === 'stories')).toHaveLength(6)
      expect(tribute.translations).toHaveLength(3)
    })
  })
  ```

- [ ] **Step 2: Run the test and confirm it FAILS.**
  Command:
  ```bash
  pnpm vitest run tests/unit/tribute-content.test.ts
  ```
  Expected output (the module does not exist yet):
  ```
  Error: Failed to load url ../../content/tribute (resolved id: .../content/tribute) in /home/sawad/devrepo/muallaqat/tests/unit/tribute-content.test.ts. Does the file exist?
   FAIL  tests/unit/tribute-content.test.ts [ tests/unit/tribute-content.test.ts ]
  Test Files  1 failed (1)
  ```

- [ ] **Step 3: Create the tribute seed object.**
  Create `/home/sawad/devrepo/muallaqat/content/tribute.ts`:
  ```ts
  import type { Tribute } from '../lib/schemas'

  // Awad Shaaban (عوض شعبان) — Beirut 1931–2025.
  // Every fact below is taken verbatim from the VERIFIED TRIBUTE FACTS.
  export const tribute: Tribute = {
    nameAr: 'عوض شعبان',
    nameEn: 'Awad Shaaban',
    birthYear: 1931,
    deathYear: 2025,
    portrait: '/awad-shaaban-portrait.jpg',
    creedAr: 'الكتابة ليست موهبة فحسب، بل هي مسؤولية تجاه الكلمة والإنسان.',
    creedEn:
      'Writing is not merely a gift; it is a responsibility toward the word and toward humankind.',
    dedicationAr: 'إلى عوض شعبان، أبي ومُعلِّمي الأول.',
    bioAr:
      'عوض العوض، المعروف بـ عوض شعبان، روائي وكاتب قصصي وصحفي ومترجم لبناني، وُلد في بيروت عام 1931. هاجر إلى أميركا اللاتينية (البرازيل والأوروغواي والأرجنتين) عام 1953، ثم عاد إلى لبنان عام 1960. أتقن العربية والإنجليزية والبرتغالية والإسبانية والإيطالية. نال جائزة اتحاد الكتاب اللبنانيين عام 1988 عن روايته «درب الجنوب». رحل عام 2025.',
    bioEn:
      'Awad al-Awad, known as Awad Shaaban, was a Lebanese novelist, short-story writer, journalist, and translator, born in Beirut in 1931. He emigrated to Latin America (Brazil, Uruguay, Argentina) in 1953, then returned to Lebanon in 1960. He mastered Arabic, English, Portuguese, Spanish, and Italian. He won the Lebanese Writers Union prize in 1988 for his novel «درب الجنوب» (The Southern Path). He died in 2025.',
    timeline: [
      {
        year: 1931,
        eventAr: 'وُلد في بيروت.',
        eventEn: 'Born in Beirut.',
      },
      {
        year: 1953,
        eventAr: 'هاجر إلى أميركا اللاتينية (البرازيل والأوروغواي والأرجنتين).',
        eventEn: 'Emigrated to Latin America (Brazil, Uruguay, Argentina).',
      },
      {
        year: 1960,
        eventAr: 'عاد إلى لبنان.',
        eventEn: 'Returned to Lebanon.',
      },
      {
        year: 1988,
        eventAr: 'نال جائزة اتحاد الكتاب اللبنانيين عن رواية «درب الجنوب».',
        eventEn: 'Awarded the Lebanese Writers Union prize for the novel «درب الجنوب».',
      },
      {
        year: 2025,
        eventAr: 'رحل عن عالمنا.',
        eventEn: 'Passed away.',
      },
    ],
    works: [
      { titleAr: 'الآفاق البعيدة', year: 1979, type: 'novel' },
      { titleAr: 'الدروب المتقاطعة', year: 1985, type: 'novel' },
      { titleAr: 'المغيب في مونتيفيديو', year: 1987, type: 'novel' },
      { titleAr: 'درب الجنوب', year: 1988, type: 'novel' },
      { titleAr: 'زمن التفسخ', year: 1997, type: 'novel' },
      { titleAr: 'عندما يحل الظلام والصقيع', year: 2009, type: 'novel' },
      { titleAr: 'الملعونون', year: 2012, type: 'novel' },
      { titleAr: 'الرهائن', year: 1981, type: 'stories' },
      { titleAr: 'الموت المجاني', year: 1988, type: 'stories' },
      { titleAr: 'الجندب', year: 1994, type: 'stories' },
      { titleAr: 'الفلسطينيات', year: 1998, type: 'stories' },
      { titleAr: 'خزين الذكريات', year: 2010, type: 'stories' },
      { titleAr: 'في أرض التيه', year: 2014, type: 'stories' },
    ],
    translations: [
      { author: 'Gogol' },
      { author: 'Chekhov' },
      { author: 'Jorge Amado' },
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
          'Writing is not merely a gift; it is a responsibility toward the word and toward humankind.',
      },
      {
        textAr:
          'الأدب مرآة المجتمع ونافذته على المستقبل، فمن يكتب اليوم يرسم ملامح الغد.',
        textEn:
          'Literature is the mirror of society and its window onto the future; whoever writes today draws the features of tomorrow.',
      },
    ],
  }
  ```

- [ ] **Step 4: Run the test and confirm it PASSES.**
  Command:
  ```bash
  pnpm vitest run tests/unit/tribute-content.test.ts
  ```
  Expected output:
  ```
   ✓ tests/unit/tribute-content.test.ts (7 tests) 
     ✓ content/tribute.ts (Awad Shaaban) > passes the TributeSchema validation
     ✓ content/tribute.ts (Awad Shaaban) > carries the verified name and dates
     ✓ content/tribute.ts (Awad Shaaban) > points at the public portrait copy
     ✓ content/tribute.ts (Awad Shaaban) > carries both verbatim creeds in quotes
     ✓ content/tribute.ts (Awad Shaaban) > lists the 1988 union prize for درب الجنوب in the timeline
     ✓ content/tribute.ts (Awad Shaaban) > includes درب الجنوب among the novels
     ✓ content/tribute.ts (Awad Shaaban) > records seven novels, six story collections, and three translations
   Test Files  1 passed (1)
        Tests  7 passed (7)
  ```

- [ ] **Step 5: Commit.**
  ```bash
  git -C /home/sawad/devrepo/muallaqat add content/tribute.ts tests/unit/tribute-content.test.ts
  git -C /home/sawad/devrepo/muallaqat commit -m "feat(content): seed Awad Shaaban tribute object"
  ```

---

### Task E2: Copy the portrait into `public/` and add a `getTribute()` accessor

**Files:**
- Create: `/home/sawad/devrepo/muallaqat/public/awad-shaaban-portrait.jpg` (copied from `assets/`)
- Modify: `/home/sawad/devrepo/muallaqat/lib/content.ts`
- Test: `/home/sawad/devrepo/muallaqat/tests/unit/get-tribute.test.ts`

- [ ] **Step 1: Copy the portrait asset into the public directory.**
  Command:
  ```bash
  mkdir -p /home/sawad/devrepo/muallaqat/public && cp /home/sawad/devrepo/muallaqat/assets/awad-shaaban-portrait.jpg /home/sawad/devrepo/muallaqat/public/awad-shaaban-portrait.jpg && ls -l /home/sawad/devrepo/muallaqat/public/awad-shaaban-portrait.jpg
  ```
  Expected output (file present, ~152625 bytes):
  ```
  -rw-rw-r-- 1 sawad sawad 152625 ... /home/sawad/devrepo/muallaqat/public/awad-shaaban-portrait.jpg
  ```

- [ ] **Step 2: Write the failing test for `getTribute()`.**
  Create `/home/sawad/devrepo/muallaqat/tests/unit/get-tribute.test.ts`:
  ```ts
  import { describe, it, expect } from 'vitest'
  import { getTribute } from '../../lib/content'

  describe('getTribute()', () => {
    it('returns the validated tribute object', () => {
      const t = getTribute()
      expect(t.nameAr).toBe('عوض شعبان')
      expect(t.nameEn).toBe('Awad Shaaban')
      expect(t.birthYear).toBe(1931)
      expect(t.deathYear).toBe(2025)
    })

    it('returns the same frozen instance every call', () => {
      expect(getTribute()).toBe(getTribute())
      expect(Object.isFrozen(getTribute())).toBe(true)
    })
  })
  ```

- [ ] **Step 3: Run the test and confirm it FAILS.**
  Command:
  ```bash
  pnpm vitest run tests/unit/get-tribute.test.ts
  ```
  Expected output (`getTribute` is not yet exported):
  ```
   FAIL  tests/unit/get-tribute.test.ts > getTribute() > returns the validated tribute object
  TypeError: getTribute is not a function
   Test Files  1 failed (1)
  ```

- [ ] **Step 4: Add the `getTribute()` accessor to the content loader.**
  Append the following to the end of `/home/sawad/devrepo/muallaqat/lib/content.ts` (the `tribute` const is already exported by the Group C loader):
  ```ts

  /** Accessor for the validated, frozen Tribute object (Awad Shaaban). */
  export function getTribute(): Tribute {
    return tribute;
  }
  ```

- [ ] **Step 5: Run the test and confirm it PASSES.**
  Command:
  ```bash
  pnpm vitest run tests/unit/get-tribute.test.ts
  ```
  Expected output:
  ```
   ✓ tests/unit/get-tribute.test.ts (2 tests)
     ✓ getTribute() > returns the validated tribute object
     ✓ getTribute() > returns the same frozen instance every call
   Test Files  1 passed (1)
        Tests  2 passed (2)
  ```

- [ ] **Step 6: Commit.**
  ```bash
  git -C /home/sawad/devrepo/muallaqat add public/awad-shaaban-portrait.jpg lib/content.ts tests/unit/get-tribute.test.ts
  git -C /home/sawad/devrepo/muallaqat commit -m "feat(content): expose getTribute() and copy portrait to public"
  ```

---

### Task E3: `Portrait` sub-section component

**Files:**
- Create: `/home/sawad/devrepo/muallaqat/components/tribute/Portrait.tsx`
- Test: `/home/sawad/devrepo/muallaqat/tests/unit/tribute-Portrait.test.tsx`

- [ ] **Step 1: Write the failing test.**
  Create `/home/sawad/devrepo/muallaqat/tests/unit/tribute-Portrait.test.tsx`:
  ```tsx
  import { render, screen } from '@testing-library/react'
  import { Portrait } from '@/components/tribute/Portrait'

  describe('tribute/Portrait', () => {
    it('renders the portrait image with the name as alt text', () => {
      render(
        <Portrait
          src="/awad-shaaban-portrait.jpg"
          name="عوض شعبان"
          birthYear={1931}
          deathYear={2025}
        />,
      )
      const img = screen.getByRole('img', { name: 'عوض شعبان' })
      expect(img).toHaveAttribute('src', '/awad-shaaban-portrait.jpg')
    })

    it('renders the name and the life span', () => {
      render(
        <Portrait
          src="/awad-shaaban-portrait.jpg"
          name="عوض شعبان"
          birthYear={1931}
          deathYear={2025}
        />,
      )
      expect(screen.getByText('عوض شعبان')).toBeInTheDocument()
      expect(screen.getByText('1931 – 2025')).toBeInTheDocument()
    })
  })
  ```

- [ ] **Step 2: Run the test and confirm it FAILS.**
  Command:
  ```bash
  pnpm vitest run tests/unit/tribute-Portrait.test.tsx
  ```
  Expected output:
  ```
  Error: Failed to resolve import "@/components/tribute/Portrait"
   FAIL  tests/unit/tribute-Portrait.test.tsx [ tests/unit/tribute-Portrait.test.tsx ]
   Test Files  1 failed (1)
  ```

- [ ] **Step 3: Implement the Portrait component.**
  Create `/home/sawad/devrepo/muallaqat/components/tribute/Portrait.tsx`:
  ```tsx
  type PortraitProps = {
    src: string;
    name: string;
    birthYear: number;
    deathYear: number;
  };

  /** Reverent portrait header: framed photo, name in Amiri, life span. */
  export function Portrait({ src, name, birthYear, deathYear }: PortraitProps) {
    return (
      <section className="flex flex-col items-center gap-6 py-12 text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={name}
          width={224}
          height={224}
          className="h-56 w-56 rounded-full border-4 border-gold object-cover shadow-lg"
        />
        <h1 className="font-display text-5xl text-ink">{name}</h1>
        <p className="font-kufi text-xl text-gold">
          {birthYear} – {deathYear}
        </p>
      </section>
    );
  }
  ```

- [ ] **Step 4: Run the test and confirm it PASSES.**
  Command:
  ```bash
  pnpm vitest run tests/unit/tribute-Portrait.test.tsx
  ```
  Expected output:
  ```
   ✓ tests/unit/tribute-Portrait.test.tsx (2 tests)
     ✓ tribute/Portrait > renders the portrait image with the name as alt text
     ✓ tribute/Portrait > renders the name and the life span
   Test Files  1 passed (1)
        Tests  2 passed (2)
  ```

- [ ] **Step 5: Commit.**
  ```bash
  git -C /home/sawad/devrepo/muallaqat add components/tribute/Portrait.tsx tests/unit/tribute-Portrait.test.tsx
  git -C /home/sawad/devrepo/muallaqat commit -m "feat(tribute): add Portrait sub-section"
  ```

---

### Task E4: `Bio` sub-section component

**Files:**
- Create: `/home/sawad/devrepo/muallaqat/components/tribute/Bio.tsx`
- Test: `/home/sawad/devrepo/muallaqat/tests/unit/tribute-Bio.test.tsx`

- [ ] **Step 1: Write the failing test.**
  Create `/home/sawad/devrepo/muallaqat/tests/unit/tribute-Bio.test.tsx`:
  ```tsx
  import { render, screen } from '@testing-library/react'
  import { Bio } from '@/components/tribute/Bio'

  describe('tribute/Bio', () => {
    it('renders the heading and the biography text', () => {
      render(<Bio heading="سيرة" text="روائي وكاتب قصصي وصحفي ومترجم لبناني." />)
      expect(screen.getByText('سيرة')).toBeInTheDocument()
      expect(
        screen.getByText('روائي وكاتب قصصي وصحفي ومترجم لبناني.'),
      ).toBeInTheDocument()
    })
  })
  ```

- [ ] **Step 2: Run the test and confirm it FAILS.**
  Command:
  ```bash
  pnpm vitest run tests/unit/tribute-Bio.test.tsx
  ```
  Expected output:
  ```
  Error: Failed to resolve import "@/components/tribute/Bio"
   FAIL  tests/unit/tribute-Bio.test.tsx [ tests/unit/tribute-Bio.test.tsx ]
   Test Files  1 failed (1)
  ```

- [ ] **Step 3: Implement the Bio component.**
  Create `/home/sawad/devrepo/muallaqat/components/tribute/Bio.tsx`:
  ```tsx
  type BioProps = {
    heading: string;
    text: string;
  };

  /** Biography prose block, set in the UI font with comfortable measure. */
  export function Bio({ heading, text }: BioProps) {
    return (
      <section className="mx-auto max-w-2xl py-10 text-start">
        <h2 className="font-kufi mb-4 text-2xl text-gold">{heading}</h2>
        <p className="font-ui text-lg leading-loose text-ink-light">{text}</p>
      </section>
    );
  }
  ```

- [ ] **Step 4: Run the test and confirm it PASSES.**
  Command:
  ```bash
  pnpm vitest run tests/unit/tribute-Bio.test.tsx
  ```
  Expected output:
  ```
   ✓ tests/unit/tribute-Bio.test.tsx (1 test)
     ✓ tribute/Bio > renders the heading and the biography text
   Test Files  1 passed (1)
        Tests  1 passed (1)
  ```

- [ ] **Step 5: Commit.**
  ```bash
  git -C /home/sawad/devrepo/muallaqat add components/tribute/Bio.tsx tests/unit/tribute-Bio.test.tsx
  git -C /home/sawad/devrepo/muallaqat commit -m "feat(tribute): add Bio sub-section"
  ```

---

### Task E5: `Timeline` sub-section component

**Files:**
- Create: `/home/sawad/devrepo/muallaqat/components/tribute/Timeline.tsx`
- Test: `/home/sawad/devrepo/muallaqat/tests/unit/tribute-Timeline.test.tsx`

- [ ] **Step 1: Write the failing test.**
  Create `/home/sawad/devrepo/muallaqat/tests/unit/tribute-Timeline.test.tsx`:
  ```tsx
  import { render, screen } from '@testing-library/react'
  import { Timeline } from '@/components/tribute/Timeline'
  import type { TributeEvent } from '@/lib/schemas'

  const events: TributeEvent[] = [
    { year: 1931, eventAr: 'وُلد في بيروت.', eventEn: 'Born in Beirut.' },
    {
      year: 1953,
      eventAr: 'هاجر إلى أميركا اللاتينية.',
      eventEn: 'Emigrated to Latin America.',
    },
    {
      year: 1988,
      eventAr: 'نال جائزة اتحاد الكتاب اللبنانيين عن رواية «درب الجنوب».',
      eventEn: 'Awarded the Lebanese Writers Union prize for «درب الجنوب».',
    },
  ]

  describe('tribute/Timeline', () => {
    it('renders the heading', () => {
      render(<Timeline heading="مسيرة حياة" events={events} locale="ar" />)
      expect(screen.getByText('مسيرة حياة')).toBeInTheDocument()
    })

    it('renders every year and its Arabic event when locale is ar', () => {
      render(<Timeline heading="مسيرة حياة" events={events} locale="ar" />)
      expect(screen.getByText('1931')).toBeInTheDocument()
      expect(screen.getByText('وُلد في بيروت.')).toBeInTheDocument()
      expect(
        screen.getByText(
          'نال جائزة اتحاد الكتاب اللبنانيين عن رواية «درب الجنوب».',
        ),
      ).toBeInTheDocument()
    })

    it('renders the English event when locale is en', () => {
      render(<Timeline heading="A Life" events={events} locale="en" />)
      expect(screen.getByText('Born in Beirut.')).toBeInTheDocument()
      expect(
        screen.getByText('Emigrated to Latin America.'),
      ).toBeInTheDocument()
    })
  })
  ```

- [ ] **Step 2: Run the test and confirm it FAILS.**
  Command:
  ```bash
  pnpm vitest run tests/unit/tribute-Timeline.test.tsx
  ```
  Expected output:
  ```
  Error: Failed to resolve import "@/components/tribute/Timeline"
   FAIL  tests/unit/tribute-Timeline.test.tsx [ tests/unit/tribute-Timeline.test.tsx ]
   Test Files  1 failed (1)
  ```

- [ ] **Step 3: Implement the Timeline component.**
  Create `/home/sawad/devrepo/muallaqat/components/tribute/Timeline.tsx`:
  ```tsx
  import type { TributeEvent } from '@/lib/schemas';

  type TimelineProps = {
    heading: string;
    events: TributeEvent[];
    locale: 'ar' | 'en';
  };

  /** Vertical life timeline; year + localized event per row. */
  export function Timeline({ heading, events, locale }: TimelineProps) {
    return (
      <section className="mx-auto max-w-2xl py-10 text-start">
        <h2 className="font-kufi mb-6 text-2xl text-gold">{heading}</h2>
        <ol className="flex flex-col gap-6 border-s-2 border-gold-pale ps-6">
          {events.map((event) => (
            <li key={event.year} className="flex flex-col gap-1">
              <span className="font-kufi text-xl text-gold">{event.year}</span>
              <span className="font-ui text-lg text-ink-light">
                {locale === 'ar' ? event.eventAr : event.eventEn}
              </span>
            </li>
          ))}
        </ol>
      </section>
    );
  }
  ```

- [ ] **Step 4: Run the test and confirm it PASSES.**
  Command:
  ```bash
  pnpm vitest run tests/unit/tribute-Timeline.test.tsx
  ```
  Expected output:
  ```
   ✓ tests/unit/tribute-Timeline.test.tsx (3 tests)
     ✓ tribute/Timeline > renders the heading
     ✓ tribute/Timeline > renders every year and its Arabic event when locale is ar
     ✓ tribute/Timeline > renders the English event when locale is en
   Test Files  1 passed (1)
        Tests  3 passed (3)
  ```

- [ ] **Step 5: Commit.**
  ```bash
  git -C /home/sawad/devrepo/muallaqat add components/tribute/Timeline.tsx tests/unit/tribute-Timeline.test.tsx
  git -C /home/sawad/devrepo/muallaqat commit -m "feat(tribute): add Timeline sub-section"
  ```

---

### Task E6: `Works` sub-section component (novels, stories, translations)

**Files:**
- Create: `/home/sawad/devrepo/muallaqat/components/tribute/Works.tsx`
- Test: `/home/sawad/devrepo/muallaqat/tests/unit/tribute-Works.test.tsx`

- [ ] **Step 1: Write the failing test.**
  Create `/home/sawad/devrepo/muallaqat/tests/unit/tribute-Works.test.tsx`:
  ```tsx
  import { render, screen } from '@testing-library/react'
  import { Works } from '@/components/tribute/Works'
  import type { TributeWork, TributeTranslation } from '@/lib/schemas'

  const works: TributeWork[] = [
    { titleAr: 'الآفاق البعيدة', year: 1979, type: 'novel' },
    { titleAr: 'درب الجنوب', year: 1988, type: 'novel' },
    { titleAr: 'الرهائن', year: 1981, type: 'stories' },
    { titleAr: 'الجندب', year: 1994, type: 'stories' },
  ]

  const translations: TributeTranslation[] = [
    { author: 'Gogol' },
    { author: 'Chekhov' },
    { author: 'Jorge Amado' },
  ]

  describe('tribute/Works', () => {
    it('renders the three section headings', () => {
      render(
        <Works
          novelsHeading="روايات"
          storiesHeading="مجموعات قصصية"
          translationsHeading="ترجمات"
          works={works}
          translations={translations}
        />,
      )
      expect(screen.getByText('روايات')).toBeInTheDocument()
      expect(screen.getByText('مجموعات قصصية')).toBeInTheDocument()
      expect(screen.getByText('ترجمات')).toBeInTheDocument()
    })

    it('renders novels with their titles and years', () => {
      render(
        <Works
          novelsHeading="روايات"
          storiesHeading="مجموعات قصصية"
          translationsHeading="ترجمات"
          works={works}
          translations={translations}
        />,
      )
      expect(screen.getByText('درب الجنوب')).toBeInTheDocument()
      expect(screen.getByText('1988')).toBeInTheDocument()
      expect(screen.getByText('الآفاق البعيدة')).toBeInTheDocument()
      expect(screen.getByText('1979')).toBeInTheDocument()
    })

    it('renders story collections with their titles', () => {
      render(
        <Works
          novelsHeading="روايات"
          storiesHeading="مجموعات قصصية"
          translationsHeading="ترجمات"
          works={works}
          translations={translations}
        />,
      )
      expect(screen.getByText('الرهائن')).toBeInTheDocument()
      expect(screen.getByText('الجندب')).toBeInTheDocument()
    })

    it('renders the translated authors', () => {
      render(
        <Works
          novelsHeading="روايات"
          storiesHeading="مجموعات قصصية"
          translationsHeading="ترجمات"
          works={works}
          translations={translations}
        />,
      )
      expect(screen.getByText('Gogol')).toBeInTheDocument()
      expect(screen.getByText('Chekhov')).toBeInTheDocument()
      expect(screen.getByText('Jorge Amado')).toBeInTheDocument()
    })
  })
  ```

- [ ] **Step 2: Run the test and confirm it FAILS.**
  Command:
  ```bash
  pnpm vitest run tests/unit/tribute-Works.test.tsx
  ```
  Expected output:
  ```
  Error: Failed to resolve import "@/components/tribute/Works"
   FAIL  tests/unit/tribute-Works.test.tsx [ tests/unit/tribute-Works.test.tsx ]
   Test Files  1 failed (1)
  ```

- [ ] **Step 3: Implement the Works component.**
  Create `/home/sawad/devrepo/muallaqat/components/tribute/Works.tsx`:
  ```tsx
  import type { TributeWork, TributeTranslation } from '@/lib/schemas';

  type WorksProps = {
    novelsHeading: string;
    storiesHeading: string;
    translationsHeading: string;
    works: TributeWork[];
    translations: TributeTranslation[];
  };

  function WorkGrid({ items }: { items: TributeWork[] }) {
    return (
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {items.map((work) => (
          <li
            key={`${work.titleAr}-${work.year}`}
            className="flex items-baseline justify-between gap-4 border-s-2 border-gold-pale ps-4"
          >
            <span className="font-display text-xl text-ink">{work.titleAr}</span>
            <span className="font-kufi text-gold">{work.year}</span>
          </li>
        ))}
      </ul>
    );
  }

  /** Works grid: novels + story collections (title + year) and translations. */
  export function Works({
    novelsHeading,
    storiesHeading,
    translationsHeading,
    works,
    translations,
  }: WorksProps) {
    const novels = works.filter((work) => work.type === 'novel');
    const stories = works.filter((work) => work.type === 'stories');

    return (
      <section className="mx-auto max-w-3xl py-10 text-start">
        <div className="mb-10">
          <h2 className="font-kufi mb-4 text-2xl text-gold">{novelsHeading}</h2>
          <WorkGrid items={novels} />
        </div>

        <div className="mb-10">
          <h2 className="font-kufi mb-4 text-2xl text-gold">{storiesHeading}</h2>
          <WorkGrid items={stories} />
        </div>

        <div>
          <h2 className="font-kufi mb-4 text-2xl text-gold">
            {translationsHeading}
          </h2>
          <ul className="flex flex-wrap gap-3">
            {translations.map((translation) => (
              <li
                key={translation.author}
                className="font-ui rounded-full border border-gold-pale px-4 py-1 text-ink-light"
              >
                {translation.author}
              </li>
            ))}
          </ul>
        </div>
      </section>
    );
  }
  ```

- [ ] **Step 4: Run the test and confirm it PASSES.**
  Command:
  ```bash
  pnpm vitest run tests/unit/tribute-Works.test.tsx
  ```
  Expected output:
  ```
   ✓ tests/unit/tribute-Works.test.tsx (4 tests)
     ✓ tribute/Works > renders the three section headings
     ✓ tribute/Works > renders novels with their titles and years
     ✓ tribute/Works > renders story collections with their titles
     ✓ tribute/Works > renders the translated authors
   Test Files  1 passed (1)
        Tests  4 passed (4)
  ```

- [ ] **Step 5: Commit.**
  ```bash
  git -C /home/sawad/devrepo/muallaqat add components/tribute/Works.tsx tests/unit/tribute-Works.test.tsx
  git -C /home/sawad/devrepo/muallaqat commit -m "feat(tribute): add Works sub-section with novels, stories, translations"
  ```

---

### Task E7: `Quotes` sub-section component (the two creeds)

**Files:**
- Create: `/home/sawad/devrepo/muallaqat/components/tribute/Quotes.tsx`
- Test: `/home/sawad/devrepo/muallaqat/tests/unit/tribute-Quotes.test.tsx`

- [ ] **Step 1: Write the failing test.**
  Create `/home/sawad/devrepo/muallaqat/tests/unit/tribute-Quotes.test.tsx`:
  ```tsx
  import { render, screen } from '@testing-library/react'
  import { Quotes } from '@/components/tribute/Quotes'
  import type { TributeQuote } from '@/lib/schemas'

  const quotes: TributeQuote[] = [
    {
      textAr: 'الكتابة ليست موهبة فحسب، بل هي مسؤولية تجاه الكلمة والإنسان.',
      textEn:
        'Writing is not merely a gift; it is a responsibility toward the word and toward humankind.',
    },
    {
      textAr:
        'الأدب مرآة المجتمع ونافذته على المستقبل، فمن يكتب اليوم يرسم ملامح الغد.',
      textEn:
        'Literature is the mirror of society and its window onto the future; whoever writes today draws the features of tomorrow.',
    },
  ]

  describe('tribute/Quotes', () => {
    it('renders the heading', () => {
      render(<Quotes heading="عقيدته في الكتابة" quotes={quotes} locale="ar" />)
      expect(screen.getByText('عقيدته في الكتابة')).toBeInTheDocument()
    })

    it('renders both creeds in Arabic when locale is ar', () => {
      render(<Quotes heading="عقيدته في الكتابة" quotes={quotes} locale="ar" />)
      expect(
        screen.getByText(
          'الكتابة ليست موهبة فحسب، بل هي مسؤولية تجاه الكلمة والإنسان.',
        ),
      ).toBeInTheDocument()
      expect(
        screen.getByText(
          'الأدب مرآة المجتمع ونافذته على المستقبل، فمن يكتب اليوم يرسم ملامح الغد.',
        ),
      ).toBeInTheDocument()
    })

    it('renders the English creed when locale is en', () => {
      render(<Quotes heading="His Creed" quotes={quotes} locale="en" />)
      expect(
        screen.getByText(
          'Writing is not merely a gift; it is a responsibility toward the word and toward humankind.',
        ),
      ).toBeInTheDocument()
    })

    it('marks each blockquote container as right-to-left when locale is ar', () => {
      const { container } = render(
        <Quotes heading="عقيدته في الكتابة" quotes={quotes} locale="ar" />,
      )
      const blockquote = container.querySelector('blockquote')
      expect(blockquote).toHaveAttribute('dir', 'rtl')
    })
  })
  ```

- [ ] **Step 2: Run the test and confirm it FAILS.**
  Command:
  ```bash
  pnpm vitest run tests/unit/tribute-Quotes.test.tsx
  ```
  Expected output:
  ```
  Error: Failed to resolve import "@/components/tribute/Quotes"
   FAIL  tests/unit/tribute-Quotes.test.tsx [ tests/unit/tribute-Quotes.test.tsx ]
   Test Files  1 failed (1)
  ```

- [ ] **Step 3: Implement the Quotes component.**
  Create `/home/sawad/devrepo/muallaqat/components/tribute/Quotes.tsx`:
  ```tsx
  import type { TributeQuote } from '@/lib/schemas';

  type QuotesProps = {
    heading: string;
    quotes: TributeQuote[];
    locale: 'ar' | 'en';
  };

  /** The two creeds, rendered as reverent blockquotes in the display font. */
  export function Quotes({ heading, quotes, locale }: QuotesProps) {
    const dir = locale === 'ar' ? 'rtl' : 'ltr';
    return (
      <section className="mx-auto max-w-2xl py-10 text-center">
        <h2 className="font-kufi mb-8 text-2xl text-gold">{heading}</h2>
        <div className="flex flex-col gap-10">
          {quotes.map((quote, index) => (
            <blockquote
              key={index}
              dir={dir}
              className="font-display text-2xl leading-relaxed text-ink"
            >
              {locale === 'ar' ? quote.textAr : (quote.textEn ?? quote.textAr)}
            </blockquote>
          ))}
        </div>
      </section>
    );
  }
  ```

- [ ] **Step 4: Run the test and confirm it PASSES.**
  Command:
  ```bash
  pnpm vitest run tests/unit/tribute-Quotes.test.tsx
  ```
  Expected output:
  ```
   ✓ tests/unit/tribute-Quotes.test.tsx (4 tests)
     ✓ tribute/Quotes > renders the heading
     ✓ tribute/Quotes > renders both creeds in Arabic when locale is ar
     ✓ tribute/Quotes > renders the English creed when locale is en
     ✓ tribute/Quotes > marks each blockquote container as right-to-left when locale is ar
   Test Files  1 passed (1)
        Tests  4 passed (4)
  ```

- [ ] **Step 5: Commit.**
  ```bash
  git -C /home/sawad/devrepo/muallaqat add components/tribute/Quotes.tsx tests/unit/tribute-Quotes.test.tsx
  git -C /home/sawad/devrepo/muallaqat commit -m "feat(tribute): add Quotes sub-section for the two creeds"
  ```

---

### Task E8: Tribute translation keys (AR/EN section headings)

**Files:**
- Modify: `/home/sawad/devrepo/muallaqat/messages/ar.json`
- Modify: `/home/sawad/devrepo/muallaqat/messages/en.json`
- Test: `/home/sawad/devrepo/muallaqat/tests/unit/tribute-messages.test.ts`

- [ ] **Step 1: Write the failing test for the Tribute message keys.**
  Create `/home/sawad/devrepo/muallaqat/tests/unit/tribute-messages.test.ts`:
  ```ts
  import { describe, it, expect } from 'vitest'
  import ar from '../../messages/ar.json'
  import en from '../../messages/en.json'

  const REQUIRED_KEYS = [
    'bioHeading',
    'timelineHeading',
    'novelsHeading',
    'storiesHeading',
    'translationsHeading',
    'quotesHeading',
  ] as const

  describe('Tribute messages', () => {
    it('ar.json has a Tribute namespace with all section headings', () => {
      const tribute = (ar as Record<string, Record<string, string>>).Tribute
      expect(tribute).toBeDefined()
      for (const key of REQUIRED_KEYS) {
        expect(typeof tribute[key]).toBe('string')
        expect(tribute[key].length).toBeGreaterThan(0)
      }
    })

    it('en.json mirrors the ar.json Tribute keys', () => {
      const arT = (ar as Record<string, Record<string, string>>).Tribute
      const enT = (en as Record<string, Record<string, string>>).Tribute
      expect(enT).toBeDefined()
      expect(Object.keys(enT).sort()).toEqual(Object.keys(arT).sort())
    })
  })
  ```

- [ ] **Step 2: Run the test and confirm it FAILS.**
  Command:
  ```bash
  pnpm vitest run tests/unit/tribute-messages.test.ts
  ```
  Expected output (the `Tribute` namespace currently only has `name` from Group A's seed):
  ```
   FAIL  tests/unit/tribute-messages.test.ts > Tribute messages > ar.json has a Tribute namespace with all section headings
  AssertionError: expected undefined to be 'string'
   Test Files  1 failed (1)
  ```

- [ ] **Step 3: Add the Tribute section headings to `messages/ar.json`.**
  Replace the existing `"Tribute"` block in `/home/sawad/devrepo/muallaqat/messages/ar.json` (which contains only `"name"`) with this expanded block (keep the surrounding `Doorway` namespace and JSON structure intact):
  ```json
  "Tribute": {
    "name": "عوض شعبان",
    "bioHeading": "سيرة",
    "timelineHeading": "مسيرة حياة",
    "novelsHeading": "روايات",
    "storiesHeading": "مجموعات قصصية",
    "translationsHeading": "ترجمات",
    "quotesHeading": "عقيدته في الكتابة"
  }
  ```

- [ ] **Step 4: Add the mirrored Tribute section headings to `messages/en.json`.**
  Replace the existing `"Tribute"` block in `/home/sawad/devrepo/muallaqat/messages/en.json` (which contains only `"name"`) with this expanded block (keep the surrounding `Doorway` namespace and JSON structure intact):
  ```json
  "Tribute": {
    "name": "Awad Shaaban",
    "bioHeading": "Life",
    "timelineHeading": "A Life in Time",
    "novelsHeading": "Novels",
    "storiesHeading": "Story Collections",
    "translationsHeading": "Translations",
    "quotesHeading": "His Creed"
  }
  ```

- [ ] **Step 5: Run the test and confirm it PASSES.**
  Command:
  ```bash
  pnpm vitest run tests/unit/tribute-messages.test.ts
  ```
  Expected output:
  ```
   ✓ tests/unit/tribute-messages.test.ts (2 tests)
     ✓ Tribute messages > ar.json has a Tribute namespace with all section headings
     ✓ Tribute messages > en.json mirrors the ar.json Tribute keys
   Test Files  1 passed (1)
        Tests  2 passed (2)
  ```

- [ ] **Step 6: Commit.**
  ```bash
  git -C /home/sawad/devrepo/muallaqat add messages/ar.json messages/en.json tests/unit/tribute-messages.test.ts
  git -C /home/sawad/devrepo/muallaqat commit -m "feat(i18n): add Tribute section headings to AR/EN catalogs"
  ```

---

### Task E9: The Tribute memorial page (`app/[locale]/tribute/page.tsx`)

**Files:**
- Create: `/home/sawad/devrepo/muallaqat/app/[locale]/tribute/page.tsx`
- Test: `/home/sawad/devrepo/muallaqat/tests/e2e/tribute.spec.ts`

- [ ] **Step 1: Write the failing Playwright e2e spec.**
  Create `/home/sawad/devrepo/muallaqat/tests/e2e/tribute.spec.ts`:
  ```ts
  import { test, expect } from '@playwright/test'

  test.describe('The Tribute memorial', () => {
    test('/ar/tribute shows the Arabic name, dates, prize work, and creed', async ({
      page,
    }) => {
      await page.goto('/ar/tribute')

      // Father's name (verified)
      await expect(page.getByText('عوض شعبان')).toBeVisible()

      // Birth and death years
      await expect(page.locator('body')).toContainText('1931')
      await expect(page.locator('body')).toContainText('2025')

      // The 1988 union-prize novel
      await expect(page.locator('body')).toContainText('درب الجنوب')

      // The creed (verbatim, verified)
      await expect(page.locator('body')).toContainText(
        'الكتابة ليست موهبة فحسب، بل هي مسؤولية تجاه الكلمة والإنسان.',
      )
    })

    test('/en/tribute shows the English equivalents', async ({ page }) => {
      await page.goto('/en/tribute')

      await expect(page.getByText('Awad Shaaban')).toBeVisible()
      await expect(page.locator('body')).toContainText('1931')
      await expect(page.locator('body')).toContainText('2025')
      await expect(page.locator('body')).toContainText('Novels')
      await expect(page.locator('body')).toContainText(
        'Writing is not merely a gift; it is a responsibility toward the word and toward humankind.',
      )
    })
  })
  ```

- [ ] **Step 2: Run the e2e spec and confirm it FAILS.**
  Command:
  ```bash
  pnpm exec playwright test tests/e2e/tribute.spec.ts --project=chromium
  ```
  Expected output (the `/tribute` route does not exist yet, so the page 404s and the assertions time out):
  ```
   ✘  tests/e2e/tribute.spec.ts:5:7 › The Tribute memorial › /ar/tribute shows the Arabic name, dates, prize work, and creed
      Error: expect(locator).toBeVisible() failed
      Locator: getByText('عوض شعبان')
   2 failed
  ```

- [ ] **Step 3: Implement the Tribute memorial page.**
  Create `/home/sawad/devrepo/muallaqat/app/[locale]/tribute/page.tsx`:
  ```tsx
  import { setRequestLocale, getTranslations } from 'next-intl/server';
  import { getTribute } from '@/lib/content';
  import { GoldDivider } from '@/components/ornament/GoldDivider';
  import { Portrait } from '@/components/tribute/Portrait';
  import { Bio } from '@/components/tribute/Bio';
  import { Timeline } from '@/components/tribute/Timeline';
  import { Works } from '@/components/tribute/Works';
  import { Quotes } from '@/components/tribute/Quotes';

  type Props = {
    params: Promise<{ locale: string }>;
  };

  export default async function TributePage({ params }: Props) {
    const { locale } = await params;
    // Must be called before any other next-intl API to keep this route static.
    setRequestLocale(locale);

    const t = await getTranslations('Tribute');
    const tribute = getTribute();
    const isAr = locale === 'ar';
    const lang: 'ar' | 'en' = isAr ? 'ar' : 'en';

    return (
      <main className="mx-auto w-full max-w-4xl px-6 pb-24">
        <Portrait
          src={tribute.portrait}
          name={isAr ? tribute.nameAr : tribute.nameEn}
          birthYear={tribute.birthYear}
          deathYear={tribute.deathYear}
        />

        <GoldDivider />

        <Bio
          heading={t('bioHeading')}
          text={isAr ? tribute.bioAr : tribute.bioEn}
        />

        <GoldDivider />

        <Timeline
          heading={t('timelineHeading')}
          events={tribute.timeline}
          locale={lang}
        />

        <GoldDivider />

        <Works
          novelsHeading={t('novelsHeading')}
          storiesHeading={t('storiesHeading')}
          translationsHeading={t('translationsHeading')}
          works={tribute.works}
          translations={tribute.translations}
        />

        <GoldDivider />

        <Quotes
          heading={t('quotesHeading')}
          quotes={tribute.quotes}
          locale={lang}
        />
      </main>
    );
  }
  ```

- [ ] **Step 4: Run the e2e spec and confirm it PASSES.**
  Command:
  ```bash
  pnpm exec playwright test tests/e2e/tribute.spec.ts --project=chromium
  ```
  Expected output:
  ```
  Running 2 tests using 1 worker
    ✓  1 tests/e2e/tribute.spec.ts:5:7 › The Tribute memorial › /ar/tribute shows the Arabic name, dates, prize work, and creed
    ✓  2 tests/e2e/tribute.spec.ts:31:7 › The Tribute memorial › /en/tribute shows the English equivalents
    2 passed
  ```

- [ ] **Step 5: Commit.**
  ```bash
  git -C /home/sawad/devrepo/muallaqat add app/[locale]/tribute/page.tsx tests/e2e/tribute.spec.ts
  git -C /home/sawad/devrepo/muallaqat commit -m "feat(tribute): assemble the Tribute memorial page with e2e coverage"
  ```

---

### Task E10: Full Group E regression — unit + e2e green together

**Files:**
- Test: `/home/sawad/devrepo/muallaqat/tests/unit/tribute-content.test.ts` (existing)
- Test: `/home/sawad/devrepo/muallaqat/tests/unit/tribute-Portrait.test.tsx` (existing)
- Test: `/home/sawad/devrepo/muallaqat/tests/unit/tribute-Bio.test.tsx` (existing)
- Test: `/home/sawad/devrepo/muallaqat/tests/unit/tribute-Timeline.test.tsx` (existing)
- Test: `/home/sawad/devrepo/muallaqat/tests/unit/tribute-Works.test.tsx` (existing)
- Test: `/home/sawad/devrepo/muallaqat/tests/unit/tribute-Quotes.test.tsx` (existing)
- Test: `/home/sawad/devrepo/muallaqat/tests/unit/tribute-messages.test.ts` (existing)
- Test: `/home/sawad/devrepo/muallaqat/tests/unit/get-tribute.test.ts` (existing)
- Test: `/home/sawad/devrepo/muallaqat/tests/e2e/tribute.spec.ts` (existing)

- [ ] **Step 1: Run every Group E unit test together and confirm they PASS.**
  Command:
  ```bash
  pnpm vitest run tests/unit/tribute-content.test.ts tests/unit/get-tribute.test.ts tests/unit/tribute-Portrait.test.tsx tests/unit/tribute-Bio.test.tsx tests/unit/tribute-Timeline.test.tsx tests/unit/tribute-Works.test.tsx tests/unit/tribute-Quotes.test.tsx tests/unit/tribute-messages.test.ts
  ```
  Expected output:
  ```
   ✓ tests/unit/tribute-content.test.ts (7 tests)
   ✓ tests/unit/get-tribute.test.ts (2 tests)
   ✓ tests/unit/tribute-Portrait.test.tsx (2 tests)
   ✓ tests/unit/tribute-Bio.test.tsx (1 test)
   ✓ tests/unit/tribute-Timeline.test.tsx (3 tests)
   ✓ tests/unit/tribute-Works.test.tsx (4 tests)
   ✓ tests/unit/tribute-Quotes.test.tsx (4 tests)
   ✓ tests/unit/tribute-messages.test.ts (2 tests)
   Test Files  8 passed (8)
        Tests  25 passed (25)
  ```

- [ ] **Step 2: Run the Tribute e2e spec and confirm it PASSES.**
  Command:
  ```bash
  pnpm exec playwright test tests/e2e/tribute.spec.ts --project=chromium
  ```
  Expected output:
  ```
  Running 2 tests using 1 worker
    ✓  1 tests/e2e/tribute.spec.ts:5:7 › The Tribute memorial › /ar/tribute shows the Arabic name, dates, prize work, and creed
    ✓  2 tests/e2e/tribute.spec.ts:31:7 › The Tribute memorial › /en/tribute shows the English equivalents
    2 passed
  ```

- [ ] **Step 3: Type-check the whole project to confirm no strict-mode regressions in Group E files.**
  Command:
  ```bash
  pnpm exec tsc --noEmit
  ```
  Expected output (no errors; clean exit):
  ```
  
  ```

- [ ] **Step 4: Commit the verified Group E milestone marker.**
  ```bash
  git -C /home/sawad/devrepo/muallaqat add -A
  git -C /home/sawad/devrepo/muallaqat commit -m "test(tribute): verify full Tribute memorial unit + e2e suite green" --allow-empty
  ```

---

## Definition of done (Milestone 1)
- `pnpm build` succeeds; `pnpm test` (Vitest) and `pnpm test:e2e` (Playwright) pass.
- `/ar` is the default; `<html dir="rtl">` on Arabic; `/en` mirrors in English.
- The Doorway shows the father's name, his creed, the dedication, and an enter link; reduced-motion shows the name statically.
- `/tribute` shows his portrait, dates (1931–2025), bio, timeline, works (incl. درب الجنوب), translations, and both creed quotes — in AR and EN.
- Content is Zod-validated at load; invalid content fails the build, not the user.
- Father's portrait copied into `public/` and rendered.
