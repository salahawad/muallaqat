'use client';

import { Fragment, useMemo, useState, type ReactNode } from 'react';
import { segmentLine } from '@/lib/arabicWords';
import { useRecitation } from './useRecitation';
import { downloadVerseCard } from './verseCard';

export type ListenLabels = {
  play: string;
  pause: string;
  resume: string;
  stop: string;
};

export type ReaderLabels = {
  listen: ListenLabels;
  /** View toggle + share labels. */
  arabic: string;
  english: string;
  translit: string;
  save: string;
};

type PoemReaderProps = {
  /** The bayts of the poem, one full line (sadr + ʿajuz) per entry. */
  lines: string[];
  /**
   * The poem's slug. When a recitation has been generated for it
   * (`public/audio/<slug>.{mp3,json}`), that real voice plays; otherwise the
   * reader falls back to the browser voice. Omit it to force the browser voice.
   */
  slug?: string;
  isMuallaqa: boolean;
  labels: ReaderLabels;
  /** Optional faithful English lines, aligned to `lines`. */
  linesEn?: string[];
  /** Optional transliteration, aligned to `lines`. */
  transliteration?: string[];
  /** For the share card footer. */
  poetName: string;
  poemTitle: string;
};

type View = 'ar' | 'en' | 'translit';

/**
 * The interactive reading surface for a poem's body. Renders each bayt with its
 * words wrapped in spans for read-aloud highlighting, offers a "read aloud"
 * control, an Arabic/English/transliteration view toggle (when those exist), and
 * a per-bayt "save as card" share export.
 */
export function PoemReader({
  lines,
  slug,
  isMuallaqa,
  labels,
  linesEn,
  transliteration,
  poetName,
  poemTitle,
}: PoemReaderProps) {
  const tokensPerLine = useMemo(() => lines.map(segmentLine), [lines]);
  const { supported, state, activeLine, activeWord, play, pause, resume, stop } =
    useRecitation(slug, lines);
  const [view, setView] = useState<View>('ar');

  const hasEn = Array.isArray(linesEn) && linesEn.length > 0;
  const hasTranslit = Array.isArray(transliteration) && transliteration.length > 0;
  const isReading = state !== 'idle';

  const primary =
    state === 'playing'
      ? { label: labels.listen.pause, onClick: pause, icon: '⏸' }
      : state === 'paused'
        ? { label: labels.listen.resume, onClick: resume, icon: '▶' }
        : { label: labels.listen.play, onClick: play, icon: '▶' };

  return (
    <>
      <div className="poem__toolbar">
        {supported ? (
          <div className="poem__listen-bar">
            <button
              type="button"
              className="poem__listen font-kufi"
              data-testid="poem-listen"
              aria-pressed={state === 'playing'}
              onClick={primary.onClick}
            >
              <span className="poem__listen-icon" aria-hidden="true">{primary.icon}</span>
              <span>{primary.label}</span>
            </button>
            {isReading ? (
              <button
                type="button"
                className="poem__listen poem__listen--stop font-kufi"
                data-testid="poem-stop"
                onClick={stop}
              >
                <span className="poem__listen-icon" aria-hidden="true">■</span>
                <span>{labels.listen.stop}</span>
              </button>
            ) : null}
          </div>
        ) : null}

        {hasEn || hasTranslit ? (
          <div className="poem__views font-kufi" role="group" data-testid="poem-views">
            <button
              type="button"
              className={`poem__view ${view === 'ar' ? 'is-active' : ''}`}
              aria-pressed={view === 'ar'}
              onClick={() => setView('ar')}
            >
              {labels.arabic}
            </button>
            {hasEn ? (
              <button
                type="button"
                className={`poem__view ${view === 'en' ? 'is-active' : ''}`}
                aria-pressed={view === 'en'}
                onClick={() => setView('en')}
              >
                {labels.english}
              </button>
            ) : null}
            {hasTranslit ? (
              <button
                type="button"
                className={`poem__view ${view === 'translit' ? 'is-active' : ''}`}
                aria-pressed={view === 'translit'}
                onClick={() => setView('translit')}
              >
                {labels.translit}
              </button>
            ) : null}
          </div>
        ) : null}
      </div>

      <div
        className={`poem__body ${isMuallaqa ? 'poem__body--hanging' : ''} ${
          isReading ? 'is-reading' : ''
        }`}
      >
        {lines.map((line, li) => {
          const en = linesEn?.[li];
          const tr = transliteration?.[li];
          return (
            <div
              key={li}
              className={`poem__bayt ${activeLine === li ? 'is-active' : ''}`}
              data-testid="poem-bayt"
            >
              {view === 'ar' ? (
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
                      return wi === 0
                        ? [span]
                        : [<Fragment key={`s${wi}`}> </Fragment>, span];
                    })}
                  </p>
                </div>
              ) : view === 'en' ? (
                <p className="poem__bayt-en font-ui" dir="ltr">
                  {en ?? '—'}
                </p>
              ) : (
                <p className="poem__bayt-translit font-ui" dir="ltr">
                  {tr ?? '—'}
                </p>
              )}

              <button
                type="button"
                className="poem__save font-kufi"
                data-testid="poem-save"
                aria-label={labels.save}
                title={labels.save}
                onClick={() =>
                  downloadVerseCard({
                    bayt: line,
                    poet: poetName,
                    title: poemTitle,
                    sub: en,
                  })
                }
              >
                <span aria-hidden="true">⬇</span> {labels.save}
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
}
