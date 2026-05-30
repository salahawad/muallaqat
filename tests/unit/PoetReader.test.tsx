import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { PoetReader } from '@/components/poet/PoetReader';
import { segmentSentences, segmentLine } from '@/lib/arabicWords';

const labels = { play: 'استمع', pause: 'إيقاف مؤقت', resume: 'متابعة', stop: 'إنهاء' };
const bio = 'زهير حكيم الشعراء. نظم معلقته بعد الحرب.';
const story = 'وقف على أطلال الديار.';

class FakeUtterance {
  text: string;
  lang = '';
  rate = 1;
  voice: SpeechSynthesisVoice | null = null;
  onboundary: ((e: { name?: string; charIndex: number }) => void) | null = null;
  onend: (() => void) | null = null;
  onerror: (() => void) | null = null;
  constructor(text: string) {
    this.text = text;
  }
}

let spoken: FakeUtterance[];
let synth: Record<string, ReturnType<typeof vi.fn>>;

beforeEach(() => {
  spoken = [];
  synth = {
    speak: vi.fn((u: FakeUtterance) => spoken.push(u)),
    cancel: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
    getVoices: vi.fn(() => [{ lang: 'ar-SA', name: 'Test Arabic', localService: true }]),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  };
  vi.stubGlobal('speechSynthesis', synth);
  vi.stubGlobal('SpeechSynthesisUtterance', FakeUtterance);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

const renderReader = () =>
  render(<PoetReader bio={bio} story={story} lang="ar" labels={labels} />);

describe('PoetReader', () => {
  it('renders the bio and story with their full text preserved across word spans', () => {
    renderReader();
    expect(screen.getByTestId('poet-bio')).toHaveTextContent('زهير حكيم الشعراء. نظم معلقته بعد الحرب.');
    expect(screen.getByTestId('poet-story')).toHaveTextContent('وقف على أطلال الديار.');
  });

  it('shows the listen control when a matching voice exists', () => {
    renderReader();
    expect(screen.getByTestId('poet-listen')).toHaveTextContent('استمع');
  });

  it('hides the control when there is no voice for the locale', () => {
    synth.getVoices = vi.fn(() => []);
    renderReader();
    expect(screen.queryByTestId('poet-listen')).not.toBeInTheDocument();
    expect(screen.getByTestId('poet-bio')).toBeInTheDocument();
  });

  it('speaks the first clause when play is pressed (prose split into clauses)', () => {
    renderReader();
    fireEvent.click(screen.getByTestId('poet-listen'));
    const firstClause = segmentSentences(bio)[0];
    expect(spoken[0].text).toBe(firstClause);
    expect(spoken[0].lang).toBe('ar');
  });

  it('lights the matching word on a boundary event', () => {
    renderReader();
    fireEvent.click(screen.getByTestId('poet-listen'));
    const clause = segmentSentences(bio)[0];
    const secondWord = segmentLine(clause)[1];
    act(() => spoken[0].onboundary?.({ name: 'word', charIndex: secondWord.start }));
    expect(screen.getByText(secondWord.text)).toHaveClass('is-active');
  });

  it('advances through every clause of both blocks then idles', () => {
    renderReader();
    fireEvent.click(screen.getByTestId('poet-listen'));
    const total = segmentSentences(bio).length + segmentSentences(story).length;
    for (let i = 0; i < total; i++) {
      act(() => spoken[i].onend?.());
    }
    expect(spoken).toHaveLength(total);
    expect(screen.queryByTestId('poet-stop')).not.toBeInTheDocument();
    expect(screen.getByTestId('poet-listen')).toHaveTextContent('استمع');
  });

  it('cancels speech on unmount', () => {
    const { unmount } = renderReader();
    fireEvent.click(screen.getByTestId('poet-listen'));
    unmount();
    expect(synth.cancel).toHaveBeenCalled();
  });
});
