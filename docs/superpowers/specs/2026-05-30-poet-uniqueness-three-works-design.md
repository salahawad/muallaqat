# Design — Unique poets, three works each, full sourcing

**Date:** 2026-05-30
**Status:** Approved (direction + sourcing/recitation choices confirmed by user)

## Problem

An audit of how poems flow into the pages surfaced three content-integrity gaps,
all introduced by commit `159832c` ("add 33 poems — 3 famous works per poet"):

1. **Poets are not unique.** `content/poets.ts` holds **25 entries but only 21
   distinct poets**. Four Jahili poets — `tarafa`, `labid`, `amr-ibn-kulthum`,
   `al-harith` — appear twice (same id/slug). The batch re-authored them with
   richer bios but **appended** the new versions instead of replacing the
   originals. Effect: each renders **two seals** in the Diwan's Jahili scene
   (with different romanizations), and the subtitle counts "25 master poets."

2. **Not every poet has three works.** Five distinct poets have only one entry:
   `amr-ibn-kulthum` (Muʿallaqa), `al-harith` (Muʿallaqa), `al-jahiz` (prose),
   `al-hariri` (prose), `gibran` (prose).

3. **Thin sourcing.** The 33 batch-added poems each cite a **single**
   `aldiwan.net` URL, so `tests/unit/content.test.ts` ("every poem ≥2 sources")
   is already red on `main`.

Everything else is consistent: all 53 poems resolve to a real poet & era, all 53
have recitations, and Explore / poem pages / poet pages render every poem.

## Requirements

- **R1 — Uniqueness:** every poet in `content/poets.ts` is distinct (no
  duplicate id or slug).
- **R2 — Three works:** every poet has at least three works ("most famous
  three"). Confirmed by user: applies to **all** figures, including the prose
  masters (al-Jāḥiẓ, al-Ḥarīrī get two more prose pieces; Gibran gets real
  Arabic works).
- **R3 — Sourcing:** every poem cites **≥2 real, verified sources** — for the 10
  new entries *and* by backfilling a verified second source onto each of the 33
  single-source poems. (User choice: "≥2 for new + backfill 33".)
- **R4 — Recitations:** generate era-voiced audio for the 10 new slugs via
  `pnpm recitations` so all works are recited like the existing 53. (User
  choice: "Generate era-voiced audio".)
- **Hard authenticity rule:** every added line and every added source is real,
  attested text fetched from primary sources (aldiwan.net, ar.wikisource.org,
  shamela.ws, hindawi.org, poetsgate.com). **No verse is invented** and no
  source URL is fabricated — each is fetched and confirmed to host the work
  before it is recorded. For the two thin Jahili poets, only genuinely
  transmitted pieces are used; if fewer than two additional attested works
  exist, that is surfaced rather than padded.

## Design

### A. Dedup poets (R1)

In `content/poets.ts`:

- Replace the four original short entries (currently lines ~77–140:
  `tarafa`, `labid`, `amr-ibn-kulthum`, `al-harith`) **in place** with their
  richer re-authored bodies (currently lines ~285–370).
- Delete the four trailing duplicate entries.

Result: 21 unique poets; the richer bios/stories/themes are kept; the original
Jahili sequence (…al-khansa, **tarafa, labid, amr-ibn-kulthum, al-harith**,
al-nabigha, al-shanfara…) is preserved; the Diwan subtitle and Muʿallaqāt
gallery update automatically. No poem references break (poems key off the
shared `poetId`).

### B. Add 10 works to reach three each (R2)

New entries in `content/poems.ts`, each mirroring the established house format:
`slug`, `titleAr` (matla / opening), `titleEn`, `poetId`, `eraId`, `type`,
`meter` + `rhyme` (for verse), `themes[]`, `linesAr[]` (~6 full abyāt),
`linesEn[]` (one summary line, as siblings do), `isMuallaqa: false`,
`contextAr` + `contextEn`, `source[]` (≥2 verified).

| poet | era | + works (final selection verified from source) | type |
|---|---|---|---|
| `amr-ibn-kulthum` | jahili | two attested pieces from his dīwān | qasida |
| `al-harith` | jahili | two attested pieces/qiṭaʿ | qasida |
| `al-jahiz` | abbasi | الحيوان · البيان والتبيين (excerpts) | nathr |
| `al-hariri` | abbasi | two more Maqāmāt (e.g. البصرية · الحلوانية) | nathr |
| `gibran` | hadith | المواكب (poem) · one more sourced piece | qasida/free |

### C. Backfill second sources (R3)

For each of the 33 single-source poems (all currently citing one `aldiwan.net`
URL), fetch and add a verified second source hosting the same poem (e.g.
ar.wikisource.org, poetsgate.com, adab.com, diwandb). The text already present
is left unchanged; only `source[]` grows. The 33 slugs are enumerated in the
implementation plan.

### D. Signature poems (R2 cross-check)

Update each newly-filled poet's `signaturePoemIds` to list its three works
(`[muallaqa/primary, work2, work3]`), so the Diwan seal and "His Verse" list
both reflect the full set.

### E. Recitations (R4)

After content lands, run `pnpm recitations` (uses `credentials.json` Google TTS)
to emit `<slug>.mp3` + `<slug>.json` for the 10 new slugs. The generator is
incremental; existing 53 are untouched. If TTS access is unavailable at run
time, `useRecitation.ts` already falls back to the browser voice — so the
feature degrades gracefully and is not a hard blocker for the content work.

### F. Tests & guardrails

- **Fix stale test:** `tests/unit/novelties-content.test.ts` asserts `al-akhtal`
  has `signaturePoemIds` length 0; he now legitimately has three poems and three
  signature ids. Update the expectation to match (three resolvable signature
  poems in the Umayyad era).
- **Add `tests/unit/content-integrity.test.ts`** enforcing R1–R3 permanently:
  - no duplicate poet `id` or `slug`;
  - every poet has **≥3 poems**;
  - every `signaturePoemId` resolves and belongs to its poet;
  - every poem resolves to an existing poet **and** era;
  - every poem cites **≥2 sources** (now true after backfill).
- The pre-existing `content.test.ts` "≥2 sources" assertion goes green via the
  backfill.

### G. Audit script disposition

`scripts/check-consistency.ts` (written during the audit) is superseded by the
content-integrity test. Remove it (its checks are now durable unit tests).

## Verification

1. `npx tsx scripts/check-consistency.ts` (one final run before removal) shows
   0 problems / 0 warnings.
2. `pnpm test` — all unit tests pass, including the new integrity test.
3. Distinct poets = 21; every poet has ≥3 poems; total poems = 63.
4. Spot-check Explore (63 cards), a backfilled poem page (2 sources), and each
   newly-filled poet page ("His Verse" shows three).
5. Audio: `public/audio` has `<slug>.mp3` + `.json` for all 63 slugs.

## Out of scope

- No new poets, eras, or duels.
- No redesign of pages/components; data only (plus the two test files).
- No re-translation of existing entries; backfill only grows `source[]`.
