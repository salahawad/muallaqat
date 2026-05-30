/**
 * Generate per-poem Arabic recitations with Google Cloud Text-to-Speech.
 *
 * For every poem in `content/poems.ts` this writes two files into
 * `public/audio/`:
 *
 *   <slug>.mp3   — the recitation, voiced for the poem's historical era.
 *   <slug>.json  — { voice, marks: [{ name, time }] }, the start time (seconds)
 *                  of each bayt, so the reader can spotlight lines in sync.
 *
 * The web app loads these automatically (see components/poem/useRecitation.ts)
 * and falls back to the browser voice for any poem without a recitation.
 *
 * ── Why a script, not the app ────────────────────────────────────────────────
 * High-quality speech needs a real TTS engine. We render the audio once, ahead
 * of time, commit it, and serve it as a static asset — no per-request API cost,
 * no key in the browser, and the same voice for every visitor.
 *
 * ── Usage ────────────────────────────────────────────────────────────────────
 *   1. Get a Google Cloud Text-to-Speech API key (or an OAuth access token):
 *        https://console.cloud.google.com/apis/library/texttospeech.googleapis.com
 *   2. Export it:
 *        export GOOGLE_TTS_API_KEY="…"            # API key, or
 *        export GOOGLE_ACCESS_TOKEN="$(gcloud auth application-default print-access-token)"
 *   3. Run:
 *        pnpm recitations                 # all poems missing audio
 *        pnpm recitations --force         # re-render everything
 *        pnpm recitations --only muallaqat-antara
 *        pnpm recitations --list          # just print the era→voice plan
 *
 * Requires Node 18+ (global fetch). Run via `tsx` (see package.json script).
 */

import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleAuth } from 'google-auth-library';

import { poems } from '../content/poems';
import { eras } from '../content/eras';

// ── Voice per era ────────────────────────────────────────────────────────────
// One voice per stage of the journey, chosen to suit its temper. Google's
// Arabic (ar-XA) WaveNet set has voices A/D (female) and B/C (male); we vary
// pitch, pace, and the gap between bayts to give each era its own character.
// `gapMs` is the silence inserted after each line — longer gaps read as more
// solemn, classical recitation. Tune freely; this is the whole "direction".
type EraVoice = {
  voice: string;
  /** 0.25–4.0; below 1.0 is slower, more deliberate. */
  rate: number;
  /** -20.0–20.0 semitones. */
  pitch: number;
  /** Silence after each bayt, in milliseconds. */
  gapMs: number;
  /** Silence at the hemistich caesura (between صدر and عجز), in milliseconds. */
  caesuraMs: number;
};

const VOICE_BY_ERA: Record<string, EraVoice> = {
  // Pre-Islamic desert odes — deep, grand, unhurried.
  jahili:   { voice: 'ar-XA-Wavenet-B', rate: 0.72, pitch: -3.0, gapMs: 1400, caesuraMs: 600 },
  // Umayyad tribal pride and satire — vigorous, declamatory.
  umawi:    { voice: 'ar-XA-Wavenet-C', rate: 0.76, pitch: -1.0, gapMs: 1200, caesuraMs: 500 },
  // Abbasid golden court — refined, measured.
  abbasi:   { voice: 'ar-XA-Wavenet-D', rate: 0.78, pitch: 1.0,  gapMs: 1100, caesuraMs: 450 },
  // Andalusi gardens and muwashshah — lyrical, lighter.
  andalusi: { voice: 'ar-XA-Wavenet-A', rate: 0.80, pitch: 2.0,  gapMs: 1000, caesuraMs: 400 },
  // The modern Nahda — natural, contemporary.
  hadith:   { voice: 'ar-XA-Wavenet-C', rate: 0.84, pitch: 0.0,  gapMs: 900,  caesuraMs: 350 },
};

const DEFAULT_VOICE: EraVoice = {
  voice: 'ar-XA-Wavenet-B',
  rate: 0.78,
  pitch: 0.0,
  gapMs: 1100,
  caesuraMs: 450,
};

// ── Google TTS plumbing ──────────────────────────────────────────────────────
const ENDPOINT = 'https://texttospeech.googleapis.com/v1beta1/text:synthesize';
// Google caps SSML input at 5000 bytes per request; keep a safe margin so the
// <mark>/<break> scaffolding and a trailing end-mark always fit.
const SSML_BUDGET = 4200;

const API_KEY = process.env.GOOGLE_TTS_API_KEY ?? process.env.GOOGLE_CLOUD_API_KEY;
let ACCESS_TOKEN = process.env.GOOGLE_ACCESS_TOKEN;

/** Resolve an access token from GOOGLE_APPLICATION_CREDENTIALS if no key/token is set. */
async function resolveAccessToken(): Promise<void> {
  if (API_KEY || ACCESS_TOKEN) return;
  const credFile = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (!credFile) return;
  const auth = new GoogleAuth({
    keyFile: credFile,
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
  });
  const client = await auth.getClient();
  const { token } = await client.getAccessToken();
  if (token) ACCESS_TOKEN = token;
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, '..', 'public', 'audio');

type Timepoint = { markName: string; timeSeconds: number };
type SynthResult = { audio: Buffer; timepoints: Timepoint[] };

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Split a poem's lines into chunks whose SSML stays under the byte budget.
 * Each chunk carries the absolute line indices so marks stay globally correct.
 */
function chunkLines(lines: string[], v: EraVoice): { from: number; to: number }[] {
  const chunks: { from: number; to: number }[] = [];
  let from = 0;
  let size = 0;
  // Account for mark, bayt-end break, and possible caesura break per line.
  const overhead = (i: number) =>
    `<mark name="b${i}"/>`.length +
    `<break time="${v.gapMs}ms"/>`.length +
    `<break time="${v.caesuraMs}ms"/>`.length;

  for (let i = 0; i < lines.length; i++) {
    const cost = Buffer.byteLength(escapeXml(lines[i]), 'utf8') + overhead(i);
    if (size > 0 && size + cost > SSML_BUDGET) {
      chunks.push({ from, to: i });
      from = i;
      size = 0;
    }
    size += cost;
  }
  if (from < lines.length) chunks.push({ from, to: lines.length });
  return chunks;
}

/**
 * Try to split a bayt into its two hemistichs (صدر and عجز).
 *
 * Classical Arabic poetry has a caesura roughly in the middle of each verse.
 * The text has no explicit separator, so we heuristically split at the
 * whitespace closest to the midpoint — favouring a position within the
 * central 30–70 % band so we don't chop off a single word at the edge.
 */
function splitHemistichs(bayt: string): [string, string] | null {
  const words = bayt.split(/\s+/);
  if (words.length < 4) return null; // too short to split meaningfully

  const mid = Math.floor(words.length / 2);
  const sadr = words.slice(0, mid).join(' ');
  const ajuz = words.slice(mid).join(' ');
  return [sadr, ajuz];
}

function buildSsml(lines: string[], from: number, to: number, v: EraVoice): string {
  let body = '';
  for (let i = from; i < to; i++) {
    body += `<mark name="b${i}"/>`;

    const halves = splitHemistichs(lines[i]);
    if (halves) {
      // صدر — caesura pause — عجز
      body += `${escapeXml(halves[0])}<break time="${v.caesuraMs}ms"/>${escapeXml(halves[1])}`;
    } else {
      body += escapeXml(lines[i]);
    }

    body += `<break time="${v.gapMs}ms"/>`;
  }
  // A trailing mark whose timepoint gives us this chunk's total duration, so we
  // can offset the next chunk's marks when the audio is concatenated.
  body += '<mark name="_end"/>';
  return `<speak>${body}</speak>`;
}

async function synthesize(ssml: string, v: EraVoice): Promise<SynthResult> {
  const url = API_KEY ? `${ENDPOINT}?key=${encodeURIComponent(API_KEY)}` : ENDPOINT;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (ACCESS_TOKEN) headers.Authorization = `Bearer ${ACCESS_TOKEN}`;

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      input: { ssml },
      voice: { languageCode: 'ar-XA', name: v.voice },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate: v.rate,
        pitch: v.pitch,
        sampleRateHertz: 24000,
      },
      enableTimePointing: ['SSML_MARK'],
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`Google TTS ${res.status}: ${detail.slice(0, 400)}`);
  }
  const data = (await res.json()) as { audioContent: string; timepoints?: Timepoint[] };
  return {
    audio: Buffer.from(data.audioContent, 'base64'),
    timepoints: data.timepoints ?? [],
  };
}

async function renderPoem(
  poem: (typeof poems)[number],
  v: EraVoice,
): Promise<{ marks: { name: string; time: number }[]; audio: Buffer }> {
  const lines = poem.linesAr;
  const chunks = chunkLines(lines, v);
  const buffers: Buffer[] = [];
  const marks: { name: string; time: number }[] = [];
  let offset = 0; // cumulative seconds across previous chunks

  for (const { from, to } of chunks) {
    const ssml = buildSsml(lines, from, to, v);
    const { audio, timepoints } = await synthesize(ssml, v);
    buffers.push(audio);

    const byName = new Map(timepoints.map((t) => [t.markName, t.timeSeconds]));
    for (let i = from; i < to; i++) {
      const t = byName.get(`b${i}`);
      if (t !== undefined) marks.push({ name: `b${i}`, time: +(offset + t).toFixed(3) });
    }
    // Advance the offset by this chunk's measured duration (the end mark), with
    // a small fallback if the API omitted it.
    const end = byName.get('_end');
    offset += end ?? (timepoints.length ? Math.max(...timepoints.map((t) => t.timeSeconds)) + 0.5 : 0);
  }

  return { marks, audio: Buffer.concat(buffers) };
}

// ── CLI ──────────────────────────────────────────────────────────────────────
function parseArgs(argv: string[]) {
  const force = argv.includes('--force');
  const list = argv.includes('--list');
  let only: string | undefined;
  const onlyEq = argv.find((a) => a.startsWith('--only='));
  if (onlyEq) only = onlyEq.slice('--only='.length);
  const onlyIdx = argv.indexOf('--only');
  if (onlyIdx !== -1 && argv[onlyIdx + 1]) only = argv[onlyIdx + 1];
  return { force, list, only };
}

function voiceFor(eraId: string): EraVoice {
  return VOICE_BY_ERA[eraId] ?? DEFAULT_VOICE;
}

async function main() {
  const { force, list, only } = parseArgs(process.argv.slice(2));

  // Try service account auth before checking credentials
  await resolveAccessToken();

  if (list) {
    console.log('Era → voice plan:\n');
    for (const era of eras) {
      const v = voiceFor(era.id);
      const count = poems.filter((p) => p.eraId === era.id).length;
      console.log(
        `  ${era.id.padEnd(9)} ${v.voice}  rate ${v.rate}  pitch ${v.pitch >= 0 ? '+' : ''}${v.pitch}  gap ${v.gapMs}ms   (${count} poem${count === 1 ? '' : 's'})`,
      );
    }
    return;
  }

  if (!API_KEY && !ACCESS_TOKEN) {
    console.error(
      'No credentials. Set GOOGLE_TTS_API_KEY (API key) or GOOGLE_ACCESS_TOKEN (OAuth).\n' +
        'See the header of this file for setup, or run with --list to preview the plan.',
    );
    process.exit(1);
  }

  await mkdir(OUT_DIR, { recursive: true });

  const targets = only ? poems.filter((p) => p.slug === only) : poems;
  if (only && targets.length === 0) {
    console.error(`No poem with slug "${only}".`);
    process.exit(1);
  }

  let made = 0;
  let skipped = 0;
  for (const poem of targets) {
    const mp3Path = path.join(OUT_DIR, `${poem.slug}.mp3`);
    if (!force && existsSync(mp3Path)) {
      skipped++;
      continue;
    }
    const v = voiceFor(poem.eraId);
    process.stdout.write(`• ${poem.slug} [${poem.eraId} · ${v.voice}] … `);
    try {
      const { marks, audio } = await renderPoem(poem, v);
      await writeFile(mp3Path, audio);
      await writeFile(
        path.join(OUT_DIR, `${poem.slug}.json`),
        JSON.stringify({ voice: v.voice, eraId: poem.eraId, marks }, null, 2),
      );
      made++;
      console.log(`done (${poem.linesAr.length} bayts, ${(audio.length / 1024).toFixed(0)} KB)`);
    } catch (err) {
      console.log('FAILED');
      console.error(`  ${(err as Error).message}`);
      process.exitCode = 1;
    }
  }

  console.log(`\nGenerated ${made}, skipped ${skipped} (already present). Output: public/audio/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
