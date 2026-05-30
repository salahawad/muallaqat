# مُعلّقات — The Living Diwan

**An immersive, Arabic-first tribute to the greatest Arabic literature — and to one writer who gave his life to the word.**

The Living Diwan gathers the canon — المعلقات، الأشعار، النثر، الهجاء — into a cinematic, right-to-left journey through the eras, treating every poet as a human being. It is dedicated to the Lebanese novelist, journalist, and translator **عوض شعبان (Awad Shaaban), Beirut 1931–2025**, whose creed anchors the project:

> «الكتابة ليست موهبة فحسب، بل هي مسؤولية تجاه الكلمة والإنسان.»
> *Writing is not merely talent — it is a responsibility toward the word and toward humanity.*

## The journey

A reader enters through a memorial overture and descends through five eras, meeting the poets and their verse:

- **`/`** — **The Doorway**: a night-to-dawn overture; the father's name self-writes in gold.
- **`/diwan`** — **The Living Diwan**: a scroll through five era dioramas (الجاهلي → الأموي → العباسي → الأندلس → الحديث), the poets stepping forward as illuminated seals.
- **`/muallaqat`** — **the Seven Muʿallaqāt** hung as illuminated panels, each opening into its full ode.
- **`/hija2`** — **the النقائض** rendered as interactive back-and-forth duels (Jarīr ↔ al-Farazdaq, Jarīr ↔ al-Akhṭal).
- **`/poet/[slug]`** & **`/poem/[slug]`** — the human behind the verse, and the full text with meter (بحر), rhyme (قافية), and read-aloud.
- **`/explore`** — browse and search by era, emotion/theme, poet, or form.
- **`/tribute`** — **في ذكرى عوض شعبان**: biography, works, translations, journalism, and his own words.
- **`/about`** — the why, the sourcing method, and content-integrity notes.

## Content & textual integrity

Classical Arabic verse is treated as **sacred**. Every classical text here is published **verbatim** after being cross-checked against **at least two reputable public-domain sources** (Arabic Wikisource, al-Diwan, Poets Gate, classical commentaries), agreeing on the consonantal text and the order of words and verses. For the Seven Muʿallaqāt the **al-Zawzanī recension** is the tiebreaker; vocalization (تشكيل) is best-effort. All seven odes are present in full, and each text records its `source`.

Works by modern authors still under copyright are **not** hosted in full — only brief fair-use excerpts or links to authorized sources. The father's own writings appear only as his family permits.

Content lives as typed modules in [`content/`](content/) (eras, poets, poems, duels, tribute), validated by **Zod** at load time — a malformed or missing entry fails the build, not the visitor.

## Tech stack

- **Next.js 15** (App Router) · **React 19** · **TypeScript** — SSG for speed, SEO, shareability; RTL-first
- **Tailwind CSS v4** using RTL logical properties
- **next-intl** — Arabic-first (`ar` default) / English locale routing
- **Zod** content layer — no database; everything is version-controlled
- Self-hosted fonts: **Amiri** (verse), **Cairo** (UI), **Reem Kufi** (kinetic headlines)
- **Vitest** (unit) + **Playwright** (e2e)
- Deploys to **Vercel**

## Getting started

Requires Node and **pnpm** (pinned `10.18.0`).

```bash
pnpm install
pnpm dev        # http://localhost:3000  → redirects to /ar
```

### Scripts

| Command | Purpose |
|---|---|
| `pnpm dev` | Run the dev server |
| `pnpm build` | Production build (static-generates all locale routes) |
| `pnpm start` | Serve the production build |
| `pnpm test` | Unit tests (Vitest) — schema validation + utilities + components |
| `pnpm test:e2e` | End-to-end journeys (Playwright) |
| `pnpm lint` | Lint |

## Accessibility & performance

Mobile-first; `prefers-reduced-motion` honored everywhere (calligraphy, dioramas, and scroll choreography degrade to static); keyboard-navigable, semantic, RTL screen-reader friendly; self-hosted fonts and SSG for a tight performance budget.

---

*A son's monument to his father, built from the literature he gave his life to.*
