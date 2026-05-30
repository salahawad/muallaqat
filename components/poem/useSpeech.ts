'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { segmentLine, wordIndexAt, type WordToken } from '@/lib/arabicWords';

export type SpeechState = 'idle' | 'playing' | 'paused';

export type UseSpeechResult = {
  /** True only when the browser has a working synthesiser AND an Arabic voice. */
  supported: boolean;
  state: SpeechState;
  /** Index of the bayt currently being read, or -1 when idle. */
  activeLine: number;
  /** Index of the word lit within the active bayt, or -1 for line-only. */
  activeWord: number;
  play: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
};

/**
 * Reads an array of Arabic lines aloud with the visitor's own browser voice
 * (the Web Speech API), reporting which bayt — and, where the browser fires
 * word-boundary events, which word — is being spoken so the UI can follow along.
 *
 * Design notes:
 * - One utterance per bayt, advanced manually on `onend`, so pause/resume and
 *   the per-line spotlight stay simple and a single long utterance never trips
 *   Chrome's ~15s cut-off.
 * - The word highlight is best-effort: many voices (notably Chrome's remote
 *   Arabic voice) do not emit boundary events, in which case `activeWord` stays
 *   -1 and the caller falls back to lighting the whole active line.
 */
export function useSpeech(lines: string[]): UseSpeechResult {
  const [supported, setSupported] = useState(false);
  const [state, setState] = useState<SpeechState>('idle');
  const [activeLine, setActiveLine] = useState(-1);
  const [activeWord, setActiveWord] = useState(-1);

  const tokensPerLine = useMemo<WordToken[][]>(
    () => lines.map(segmentLine),
    [lines],
  );

  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);
  // Guards an auto-advance after a deliberate cancel(): some browsers fire
  // `onend` when you call cancel(), which would otherwise resume reading.
  const cancelledRef = useRef(false);
  const tokensRef = useRef(tokensPerLine);
  tokensRef.current = tokensPerLine;

  // --- Capability + voice detection (voices load asynchronously) -------------
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const synth = window.speechSynthesis;
    const pick = () => {
      const voices = synth.getVoices();
      const arabic = voices.filter((v) => v.lang?.toLowerCase().startsWith('ar'));
      // Prefer a locally-installed voice: local voices speak instantly and are
      // far more likely to emit the word-boundary events the highlight rides on.
      const chosen = arabic.find((v) => v.localService) ?? arabic[0] ?? null;
      voiceRef.current = chosen;
      setSupported(Boolean(chosen));
    };
    pick();
    synth.addEventListener?.('voiceschanged', pick);
    return () => synth.removeEventListener?.('voiceschanged', pick);
  }, []);

  // --- Keep Chrome alive: it silently pauses long-running synthesis ----------
  useEffect(() => {
    if (state !== 'playing') return;
    const id = window.setInterval(() => {
      window.speechSynthesis?.resume();
    }, 8000);
    return () => window.clearInterval(id);
  }, [state]);

  const speakFrom = useCallback(
    (index: number) => {
      const synth = window.speechSynthesis;
      if (index >= lines.length) {
        setState('idle');
        setActiveLine(-1);
        setActiveWord(-1);
        return;
      }
      setActiveLine(index);
      setActiveWord(-1);

      const utterance = new SpeechSynthesisUtterance(lines[index]);
      utterance.lang = 'ar';
      utterance.rate = 0.9; // a measured pace, fitting for verse
      if (voiceRef.current) utterance.voice = voiceRef.current;

      utterance.onboundary = (event: SpeechSynthesisEvent) => {
        if (event.name && event.name !== 'word') return; // ignore sentence marks
        const w = wordIndexAt(tokensRef.current[index] ?? [], event.charIndex);
        if (w !== -1) setActiveWord(w);
      };
      utterance.onend = () => {
        if (cancelledRef.current) return;
        speakFrom(index + 1);
      };
      utterance.onerror = () => {
        if (cancelledRef.current) return;
        speakFrom(index + 1);
      };

      synth.speak(utterance);
    },
    [lines],
  );

  const play = useCallback(() => {
    if (!supported || state !== 'idle') return;
    cancelledRef.current = false;
    setState('playing');
    speakFrom(0);
  }, [supported, state, speakFrom]);

  const pause = useCallback(() => {
    if (state !== 'playing') return;
    window.speechSynthesis?.pause();
    setState('paused');
  }, [state]);

  const resume = useCallback(() => {
    if (state !== 'paused') return;
    window.speechSynthesis?.resume();
    setState('playing');
  }, [state]);

  const stop = useCallback(() => {
    cancelledRef.current = true;
    window.speechSynthesis?.cancel();
    setState('idle');
    setActiveLine(-1);
    setActiveWord(-1);
  }, []);

  // Stop any in-flight speech when the page unmounts.
  useEffect(() => {
    return () => {
      cancelledRef.current = true;
      if (typeof window !== 'undefined') window.speechSynthesis?.cancel();
    };
  }, []);

  return { supported, state, activeLine, activeWord, play, pause, resume, stop };
}
