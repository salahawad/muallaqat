import { readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import {
  getEras,
  getPoets,
  getPoems,
  getDuels,
  getMuallaqat,
  getTribute,
} from '../lib/content';

/**
 * Audit: is every poem reflected across every page that should surface it, and
 * is anything missing? Pure cross-reference check over the validated content.
 */

const eras = getEras();
const poets = getPoets();
const poems = getPoems();
const duels = getDuels();

const eraIds = new Set(eras.map((e) => e.id));
const poetIds = new Set(poets.map((p) => p.id));
const poemIds = new Set(poems.map((p) => p.id));
const poemBySlug = new Map(poems.map((p) => [p.slug, p]));
const poemById = new Map(poems.map((p) => [p.id, p]));

const problems: string[] = [];
const warnings: string[] = [];
const P = (s: string) => problems.push(s);
const W = (s: string) => warnings.push(s);

console.log(`\nContent totals: ${eras.length} eras · ${poets.length} poets · ${poems.length} poems · ${duels.length} duels\n`);

// 1. Duplicate ids / slugs --------------------------------------------------
const seenPoemId = new Set<string>();
const seenPoemSlug = new Set<string>();
for (const p of poems) {
  if (seenPoemId.has(p.id)) P(`Duplicate poem id: ${p.id}`);
  if (seenPoemSlug.has(p.slug)) P(`Duplicate poem slug: ${p.slug}`);
  seenPoemId.add(p.id);
  seenPoemSlug.add(p.slug);
}
const seenPoetId = new Set<string>();
const seenPoetSlug = new Set<string>();
for (const p of poets) {
  if (seenPoetId.has(p.id)) P(`Duplicate poet id: ${p.id}`);
  if (seenPoetSlug.has(p.slug)) P(`Duplicate poet slug: ${p.slug}`);
  seenPoetId.add(p.id);
  seenPoetSlug.add(p.slug);
}

// 2. Poem -> poet / era referential integrity -------------------------------
for (const poem of poems) {
  if (!poetIds.has(poem.poetId))
    P(`Poem "${poem.id}" -> unknown poetId "${poem.poetId}" (orphan: shows on no poet page; blank poet on Explore)`);
  if (!eraIds.has(poem.eraId))
    P(`Poem "${poem.id}" -> unknown eraId "${poem.eraId}" (no era chip/diorama on Explore)`);
}

// 3. Poet -> era + signaturePoemIds -----------------------------------------
for (const poet of poets) {
  if (!eraIds.has(poet.eraId))
    P(`Poet "${poet.id}" -> unknown eraId "${poet.eraId}" (won't appear in any Diwan era scene)`);

  if (poet.signaturePoemIds.length === 0) {
    W(`Poet "${poet.id}" has no signaturePoemIds → blank verse on its Diwan seal`);
  }
  poet.signaturePoemIds.forEach((id, i) => {
    const ref = poemById.get(id);
    if (!ref) {
      P(`Poet "${poet.id}".signaturePoemIds[${i}] -> unknown poem "${id}"`);
    } else if (ref.poetId !== poet.id) {
      P(`Poet "${poet.id}".signaturePoemIds[${i}] -> poem "${id}" belongs to "${ref.poetId}"`);
    }
  });
  // Diwan seal specifically uses signaturePoemIds[0] AND requires poetId match.
  const sig0 = poet.signaturePoemIds[0];
  const sealVerse = poems.find((p) => p.id === sig0 && p.poetId === poet.id);
  if (!sealVerse)
    W(`Poet "${poet.id}" Diwan seal verse won't resolve (signaturePoemIds[0]="${sig0 ?? '∅'}")`);
}

// 4. Every poet has at least one poem ---------------------------------------
const poemsByPoet = new Map<string, number>();
for (const poem of poems)
  poemsByPoet.set(poem.poetId, (poemsByPoet.get(poem.poetId) ?? 0) + 1);
for (const poet of poets) {
  if (!poemsByPoet.has(poet.id))
    P(`Poet "${poet.id}" has ZERO poems → empty "His Verse" on poet page, no seal verse`);
}

// 5. Recitation audio: every poem slug needs <slug>.mp3 + <slug>.json --------
const audioDir = join(process.cwd(), 'public', 'audio');
const audioFiles = existsSync(audioDir) ? readdirSync(audioDir) : [];
const mp3 = new Set(audioFiles.filter((f) => f.endsWith('.mp3')).map((f) => f.replace(/\.mp3$/, '')));
const meta = new Set(audioFiles.filter((f) => f.endsWith('.json')).map((f) => f.replace(/\.json$/, '')));

let withAudio = 0;
for (const poem of poems) {
  const hasMp3 = mp3.has(poem.slug);
  const hasJson = meta.has(poem.slug);
  if (hasMp3 && hasJson) withAudio++;
  else if (!hasMp3 && !hasJson)
    W(`Poem "${poem.slug}" has NO recitation (falls back to browser TTS)`);
  else if (!hasMp3) P(`Poem "${poem.slug}" missing .mp3 (has .json) → audio 404`);
  else if (!hasJson) P(`Poem "${poem.slug}" missing .json (has .mp3) → recitation won't activate`);
}
// Orphan audio: files that map to no poem slug.
for (const base of mp3)
  if (!poemBySlug.has(base)) W(`Orphan audio "/audio/${base}.mp3" maps to no poem slug`);

// 6. Muallaqat gallery -------------------------------------------------------
const muallaqat = getMuallaqat();
if (muallaqat.length !== 7)
  W(`getMuallaqat() returns ${muallaqat.length} panels (classical Seven expected)`);
const muallaqaFlagged = poems.filter((p) => p.isMuallaqa).length;

// 7. Duels referential integrity --------------------------------------------
for (const d of duels) {
  if (!poetIds.has(d.poetAId)) P(`Duel "${d.id}" -> unknown poetAId "${d.poetAId}"`);
  if (!poetIds.has(d.poetBId)) P(`Duel "${d.id}" -> unknown poetBId "${d.poetBId}"`);
  for (const v of d.volleys)
    if (!poetIds.has(v.poetId)) P(`Duel "${d.id}" volley -> unknown poetId "${v.poetId}"`);
}

// --- Per-poet breakdown -----------------------------------------------------
console.log('Poems per poet (era order):');
for (const era of eras) {
  const ep = poets.filter((p) => p.eraId === era.id);
  if (ep.length === 0) continue;
  console.log(`  ${era.nameEn} (${era.id}):`);
  for (const poet of ep) {
    const list = poems.filter((p) => p.poetId === poet.id);
    const audio = list.filter((p) => mp3.has(p.slug) && meta.has(p.slug)).length;
    console.log(
      `    ${poet.nameEn.padEnd(26)} ${String(list.length).padStart(2)} poems · ${audio}/${list.length} recited${list.length === 0 ? '   ⚠ NONE' : ''}`,
    );
  }
}

console.log(`\nRecitation coverage: ${withAudio}/${poems.length} poems have <slug>.mp3 + <slug>.json`);
console.log(`Muallaqa-flagged poems: ${muallaqaFlagged} · getMuallaqat() panels: ${muallaqat.length}`);
console.log(`Explore cards: ${poems.length} (Explore renders every poem)`);
console.log(`Poem pages generated: ${poems.length} · Poet pages: ${poets.length}\n`);

if (problems.length) {
  console.log(`✗ ${problems.length} PROBLEM(S):`);
  for (const p of problems) console.log(`  ✗ ${p}`);
} else {
  console.log('✓ No referential problems — every poem resolves to a real poet & era.');
}
if (warnings.length) {
  console.log(`\n△ ${warnings.length} WARNING(S):`);
  for (const w of warnings) console.log(`  △ ${w}`);
}
console.log('');
