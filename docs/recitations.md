# Recitations — real Arabic voices per era

The reader plays a pre-rendered, expressive Arabic recitation for each poem
instead of the visitor's browser voice. Audio is generated once with Google
Cloud Text-to-Speech, committed as a static asset, and served from
`public/audio/`. Every visitor hears the same voice, there's no per-request API
cost, and no key ever reaches the browser.

If a poem has no recitation yet, the reader silently falls back to the browser
voice (`useSpeech`), so the "listen" control always works.

## Files

For each poem (keyed by its `slug`):

| File | Contents |
| --- | --- |
| `public/audio/<slug>.mp3` | The recitation, voiced for the poem's era. |
| `public/audio/<slug>.json` | `{ voice, eraId, marks: [{ name, time }] }` — the start time (seconds) of each bayt, so the reader keeps its per-line spotlight in sync. |

The app loads these in `components/poem/useRecitation.ts`.

## One voice per stage

Each historical era gets a voice chosen to suit its temper (deep and unhurried
for the pre-Islamic odes, lighter and lyrical for Andalusi muwashshah, and so
on). The full mapping — voice, pace, pitch, and the pause between bayts — lives
at the top of `scripts/generate-recitations.ts` in `VOICE_BY_ERA`. Edit it to
re-direct the recitations, then re-render.

Preview the plan without calling the API:

```bash
pnpm recitations --list
```

## Generating the audio

> Requires outbound network access and a Google Cloud Text-to-Speech key, so
> run it locally or in CI — not inside a locked-down sandbox.

1. Enable the API and create a key (or use an OAuth token):
   https://console.cloud.google.com/apis/library/texttospeech.googleapis.com

2. Provide credentials (either one):

   ```bash
   export GOOGLE_TTS_API_KEY="…"
   # or
   export GOOGLE_ACCESS_TOKEN="$(gcloud auth application-default print-access-token)"
   ```

3. Install deps and render:

   ```bash
   pnpm install
   pnpm recitations                      # render poems missing audio
   pnpm recitations --force              # re-render everything
   pnpm recitations --only muallaqat-antara
   ```

4. Commit the generated `public/audio/*.mp3` and `*.json` so they deploy as
   static assets.

Long poems are split into chunks under Google's 5000-byte SSML limit and
stitched back together, with bayt timings offset across chunks automatically.
