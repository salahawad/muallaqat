'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useSpeech, type UseSpeechResult } from './useSpeech';

/**
 * Plays a poem's pre-rendered Arabic recitation — a real, expressive voice
 * generated per historical era (see `scripts/generate-recitations.ts`) instead
 * of the visitor's browser synthesiser.
 *
 * For each poem the generator writes two files under `public/audio/`:
 *   - `<slug>.mp3`  — the recitation, voiced for the poem's era.
 *   - `<slug>.json` — `{ voice, marks: [{ name, time }] }`, where each `time`
 *     (seconds) is the moment the matching bayt begins, so the reader can keep
 *     its per-line spotlight in sync with the recording.
 *
 * When no recitation has been generated for a poem (the files 404), this hook
 * transparently falls back to {@link useSpeech} — the browser voice — so the
 * "listen" control always works and the app degrades gracefully. The returned
 * shape is identical to `useSpeech`, so callers don't care which is driving.
 *
 * The word-level highlight (`activeWord`) is not available for a recording —
 * a rendered file carries no word-boundary events — so it stays -1 and the
 * reader lights the whole active line, exactly as it already does for the many
 * browser voices that omit boundary events.
 */
export function useRecitation(
  slug: string | undefined,
  lines: string[],
): UseSpeechResult {
  // Always set up the browser fallback; it's cheap and is what we return until
  // (and unless) a generated recitation is found for this poem.
  const browser = useSpeech(lines);

  // null = still probing; true = recitation present; false = fall back.
  const [hasAudio, setHasAudio] = useState<boolean | null>(null);
  const [state, setState] = useState<'idle' | 'playing' | 'paused'>('idle');
  const [activeLine, setActiveLine] = useState(-1);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  // Bayt start times (seconds), index-aligned to `lines`.
  const marksRef = useRef<number[]>([]);

  // --- Probe for a generated recitation --------------------------------------
  useEffect(() => {
    if (!slug || typeof window === 'undefined' || typeof fetch !== 'function') {
      setHasAudio(false);
      return;
    }
    let alive = true;
    let audio: HTMLAudioElement | null = null;

    fetch(`/audio/${slug}.json`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('no recitation'))))
      .then((data: { marks?: { name: string; time: number }[] }) => {
        if (!alive) return;
        marksRef.current = (data.marks ?? []).map((m) => m.time);
        audio = new Audio(`/audio/${slug}.mp3`);
        audio.preload = 'auto';
        audioRef.current = audio;
        setHasAudio(true);
      })
      .catch(() => {
        if (alive) setHasAudio(false);
      });

    return () => {
      alive = false;
      audio?.pause();
      audioRef.current = null;
    };
  }, [slug]);

  // --- Keep the per-line spotlight in step with the recording ----------------
  useEffect(() => {
    const audio = audioRef.current;
    if (hasAudio !== true || !audio) return;

    const onTime = () => {
      const t = audio.currentTime;
      const marks = marksRef.current;
      // The active bayt is the last one whose start time has been reached.
      let idx = -1;
      for (let i = 0; i < marks.length; i++) {
        if (marks[i] <= t + 0.02) idx = i;
        else break;
      }
      setActiveLine(idx);
    };
    const onEnded = () => {
      setState('idle');
      setActiveLine(-1);
    };

    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('ended', onEnded);
    };
  }, [hasAudio]);

  // Stop playback when leaving the page.
  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (state === 'idle') audio.currentTime = 0;
    void audio.play();
    setState('playing');
  }, [state]);

  const pause = useCallback(() => {
    if (state !== 'playing') return;
    audioRef.current?.pause();
    setState('paused');
  }, [state]);

  const resume = useCallback(() => {
    if (state !== 'paused') return;
    void audioRef.current?.play();
    setState('playing');
  }, [state]);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    setState('idle');
    setActiveLine(-1);
  }, []);

  // Until a recitation is confirmed present, defer entirely to the browser
  // voice so the control behaves exactly as before on poems without audio.
  if (hasAudio !== true) return browser;

  return { supported: true, state, activeLine, activeWord: -1, play, pause, resume, stop };
}
