'use client';

import { Fragment, useMemo, type ReactNode } from 'react';
import { segmentLine } from '@/lib/arabicWords';
import { useSpeech } from './useSpeech';

export type ListenLabels = {
  play: string;
  pause: string;
  resume: string;
  stop: string;
};

type PoemReaderProps = {
  /** The bayts of the poem, one full line (sadr + ʿajuz) per entry. */
  lines: string[];
  isMuallaqa: boolean;
  labels: ListenLabels;
};

/**
 * The interactive reading surface for a poem's body. Renders each bayt with its
 * words wrapped in spans so the one being spoken can be highlighted, and offers
 * a "read aloud" control driven by {@link useSpeech}. When the browser has no
 * Arabic voice the control is omitted and the verse reads as plain text.
 */
export function PoemReader({ lines, isMuallaqa, labels }: PoemReaderProps) {
  const tokensPerLine = useMemo(() => lines.map(segmentLine), [lines]);
  const { supported, state, activeLine, activeWord, play, pause, resume, stop } =
    useSpeech(lines);

  const isReading = state !== 'idle';

  const primary =
    state === 'playing'
      ? { label: labels.pause, onClick: pause, icon: '⏸' }
      : state === 'paused'
        ? { label: labels.resume, onClick: resume, icon: '▶' }
        : { label: labels.play, onClick: play, icon: '▶' };

  return (
    <>
      {supported ? (
        <div className="poem__listen-bar">
          <button
            type="button"
            className="poem__listen font-kufi"
            data-testid="poem-listen"
            aria-pressed={state === 'playing'}
            onClick={primary.onClick}
          >
            <span className="poem__listen-icon" aria-hidden="true">
              {primary.icon}
            </span>
            <span>{primary.label}</span>
          </button>
          {isReading ? (
            <button
              type="button"
              className="poem__listen poem__listen--stop font-kufi"
              data-testid="poem-stop"
              onClick={stop}
            >
              <span className="poem__listen-icon" aria-hidden="true">
                ■
              </span>
              <span>{labels.stop}</span>
            </button>
          ) : null}
        </div>
      ) : null}

      <div
        className={`poem__body ${isMuallaqa ? 'poem__body--hanging' : ''} ${
          isReading ? 'is-reading' : ''
        }`}
      >
        {lines.map((line, li) => (
          <div
            key={li}
            className={`poem__bayt ${activeLine === li ? 'is-active' : ''}`}
            data-testid="poem-bayt"
          >
            <div dir="rtl" lang="ar" className="font-display text-center poem__bayt-text">
              <p className="leading-loose text-2xl">
                {tokensPerLine[li].flatMap((token, wi): ReactNode[] => {
                  const span = (
                    <span
                      key={`w${wi}`}
                      className={`poem__word ${
                        activeLine === li && activeWord === wi ? 'is-active' : ''
                      }`}
                    >
                      {token.text}
                    </span>
                  );
                  // Keep the separating space between words as its own node so
                  // letter-shaping is identical to the unsplit line.
                  return wi === 0 ? [span] : [<Fragment key={`s${wi}`}> </Fragment>, span];
                })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
