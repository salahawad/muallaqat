import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { PoemReader } from '@/components/poem/PoemReader';
import { segmentLine } from '@/lib/arabicWords';

const labels = {
  listen: { play: 'استمع', pause: 'إيقاف مؤقت', resume: 'متابعة', stop: 'إنهاء' },
  arabic: 'العربية',
  english: 'الإنجليزية',
  translit: 'النطق',
  save: 'احفظ البيت',
};
const lines = ['قِفَا نَبْكِ مِنْ', 'فَتُوْضِحَ فَالمِقْراةِ'];

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
let synth: {
  speak: ReturnType<typeof vi.fn>;
  cancel: ReturnType<typeof vi.fn>;
  pause: ReturnType<typeof vi.fn>;
  resume: ReturnType<typeof vi.fn>;
  getVoices: ReturnType<typeof vi.fn>;
  addEventListener: ReturnType<typeof vi.fn>;
  removeEventListener: ReturnType<typeof vi.fn>;
};

const ARABIC_VOICE = { lang: 'ar-SA', name: 'Test Arabic', localService: true };

beforeEach(() => {
  spoken = [];
  synth = {
    speak: vi.fn((u: FakeUtterance) => spoken.push(u)),
    cancel: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
    getVoices: vi.fn(() => [ARABIC_VOICE]),
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
  render(
    <PoemReader
      lines={lines}
      isMuallaqa
      labels={labels}
      poetName="امرؤ القيس"
      poemTitle="مُعلّقة امرئ القيس"
    />,
  );

describe('PoemReader', () => {
  it('renders every bayt with its words as spans', () => {
    renderReader();
    expect(screen.getAllByTestId('poem-bayt')).toHaveLength(lines.length);
    // The whole bayt text is preserved across the word spans.
    expect(screen.getAllByTestId('poem-bayt')[0]).toHaveTextContent('قِفَا نَبْكِ مِنْ');
  });

  it('shows the listen control when an Arabic voice is available', () => {
    renderReader();
    expect(screen.getByTestId('poem-listen')).toHaveTextContent('استمع');
  });

  it('still offers the control when no Arabic voice is listed (browser may speak with a default)', () => {
    synth.getVoices = vi.fn(() => []);
    renderReader();
    expect(screen.getByTestId('poem-listen')).toBeInTheDocument();
    expect(screen.getAllByTestId('poem-bayt')).toHaveLength(lines.length);
  });

  it('hides the control only when the Speech API is unavailable', () => {
    vi.stubGlobal('speechSynthesis', undefined);
    renderReader();
    expect(screen.queryByTestId('poem-listen')).not.toBeInTheDocument();
    // …but the verse still renders.
    expect(screen.getAllByTestId('poem-bayt')).toHaveLength(lines.length);
  });

  it('speaks the first bayt when play is pressed', () => {
    renderReader();
    fireEvent.click(screen.getByTestId('poem-listen'));
    expect(synth.speak).toHaveBeenCalledTimes(1);
    expect(spoken[0].text).toBe(lines[0]);
    // The active bayt is spotlit immediately, before any boundary event.
    expect(screen.getAllByTestId('poem-bayt')[0]).toHaveClass('is-active');
  });

  it('lights the matching word on a boundary event', () => {
    renderReader();
    fireEvent.click(screen.getByTestId('poem-listen'));
    const second = segmentLine(lines[0])[1];
    act(() => spoken[0].onboundary?.({ name: 'word', charIndex: second.start }));
    expect(screen.getByText(second.text)).toHaveClass('is-active');
  });

  it('advances to the next bayt when the current one ends', () => {
    renderReader();
    fireEvent.click(screen.getByTestId('poem-listen'));
    act(() => spoken[0].onend?.());
    expect(spoken[1].text).toBe(lines[1]);
    expect(screen.getAllByTestId('poem-bayt')[1]).toHaveClass('is-active');
  });

  it('returns to idle after the final bayt finishes', () => {
    renderReader();
    fireEvent.click(screen.getByTestId('poem-listen'));
    act(() => spoken[0].onend?.());
    act(() => spoken[1].onend?.());
    expect(screen.queryByTestId('poem-stop')).not.toBeInTheDocument();
    expect(screen.getByTestId('poem-listen')).toHaveTextContent('استمع');
  });

  it('stops and clears the highlight when stop is pressed', () => {
    renderReader();
    fireEvent.click(screen.getByTestId('poem-listen'));
    fireEvent.click(screen.getByTestId('poem-stop'));
    expect(synth.cancel).toHaveBeenCalled();
    expect(screen.queryByTestId('poem-stop')).not.toBeInTheDocument();
  });

  it('cancels any in-flight speech on unmount', () => {
    const { unmount } = renderReader();
    fireEvent.click(screen.getByTestId('poem-listen'));
    unmount();
    expect(synth.cancel).toHaveBeenCalled();
  });
});
