/**
 * Word segmentation for verse highlighting.
 *
 * The Web Speech API reports progress through an utterance as a `charIndex`
 * into the original string (an "boundary" event). To light up the word being
 * spoken we need to know, for every word, the half-open character range it
 * occupies in that same string. Splitting on whitespace is safe for Arabic:
 * letters only join *within* a word, never across the space between words, so
 * shaping and ligatures are unaffected by rendering each word in its own span.
 *
 * Offsets are measured in UTF-16 code units to match `SpeechSynthesisEvent.charIndex`.
 */
export type WordToken = {
  /** The word text, with its diacritics (tashkīl) intact. */
  text: string;
  /** Inclusive start index into the source line. */
  start: number;
  /** Exclusive end index into the source line. */
  end: number;
};

const WHITESPACE = /\s/;

/**
 * Split a line of verse into word tokens carrying their character offsets.
 * Collapses runs of whitespace; leading/trailing whitespace is ignored.
 */
export function segmentLine(line: string): WordToken[] {
  const tokens: WordToken[] = [];
  const len = line.length;
  let i = 0;
  while (i < len) {
    while (i < len && WHITESPACE.test(line[i])) i++;
    if (i >= len) break;
    const start = i;
    while (i < len && !WHITESPACE.test(line[i])) i++;
    tokens.push({ text: line.slice(start, i), start, end: i });
  }
  return tokens;
}

/**
 * Given the tokens of a line and a `charIndex` from a speech boundary event,
 * return the index of the word that contains it, or -1 if it falls in a gap
 * (e.g. on a space) — in which case callers should keep the previous word lit.
 */
export function wordIndexAt(tokens: WordToken[], charIndex: number): number {
  return tokens.findIndex((t) => charIndex >= t.start && charIndex < t.end);
}
