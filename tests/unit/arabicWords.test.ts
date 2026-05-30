import { describe, it, expect } from 'vitest';
import { segmentLine, wordIndexAt } from '@/lib/arabicWords';

describe('segmentLine', () => {
  it('splits a bayt into words with correct character offsets', () => {
    const line = 'قِفَا نَبْكِ مِنْ';
    const tokens = segmentLine(line);
    expect(tokens.map((t) => t.text)).toEqual(['قِفَا', 'نَبْكِ', 'مِنْ']);
    // Every token's slice must round-trip back to its text.
    for (const t of tokens) {
      expect(line.slice(t.start, t.end)).toBe(t.text);
    }
  });

  it('keeps diacritics (tashkīl) attached to their word', () => {
    const [first] = segmentLine('قِفَا نَبْكِ');
    expect(first.text).toBe('قِفَا');
    expect(first.text.length).toBeGreaterThan(2); // base letters + harakat
  });

  it('collapses runs of whitespace and ignores leading/trailing spaces', () => {
    const tokens = segmentLine('  مِنْ   ذِكْرَى  ');
    expect(tokens.map((t) => t.text)).toEqual(['مِنْ', 'ذِكْرَى']);
    expect(tokens[0].start).toBe(2);
  });

  it('returns an empty array for blank input', () => {
    expect(segmentLine('')).toEqual([]);
    expect(segmentLine('   ')).toEqual([]);
  });
});

describe('wordIndexAt', () => {
  const tokens = segmentLine('قِفَا نَبْكِ مِنْ');

  it('maps a charIndex inside a word to that word', () => {
    expect(wordIndexAt(tokens, tokens[1].start)).toBe(1);
    expect(wordIndexAt(tokens, tokens[2].end - 1)).toBe(2);
  });

  it('returns -1 when the index lands on a separating space', () => {
    const spaceIdx = tokens[0].end; // the space after the first word
    expect(wordIndexAt(tokens, spaceIdx)).toBe(-1);
  });
});
