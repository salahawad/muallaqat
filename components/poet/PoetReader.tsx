'use client';

import { Fragment, useMemo, type ReactNode } from 'react';
import { segmentLine, segmentSentences, type WordToken } from '@/lib/arabicWords';
import { useSpeech } from '@/components/poem/useSpeech';
import type { ListenLabels } from '@/components/poem/PoemReader';
import { GoldDivider } from '@/components/ornament/GoldDivider';

type PoetReaderProps = {
  /** The biography paragraph, in the active locale. */
  bio: string;
  /** The optional "human story" blockquote, in the active locale. */
  story?: string;
  /** Active locale — the prose is shown (and read) in this language. */
  lang: string;
  labels: ListenLabels;
};

type Clause = { text: string; index: number; tokens: WordToken[] };

/**
 * Reads a poet's biography (and human-story) aloud with the visitor's browser
 * voice, highlighting the spoken word. Prose is split into short clauses so the
 * voice never hits Chrome's long-utterance cut-off, yet each block still renders
 * as one flowing paragraph (the clauses are laid out inline).
 */
export function PoetReader({ bio, story, lang, labels }: PoetReaderProps) {
  const isAr = lang === 'ar';

  // Flatten every block into a single ordered list of clauses (the speech
  // units). Each clause keeps its own word tokens, so a boundary charIndex maps
  // straight onto a rendered word span with no offset arithmetic.
  const { clauses, bioClauses, storyClauses } = useMemo(() => {
    const all: string[] = [];
    const build = (text: string): Clause[] =>
      segmentSentences(text).map((t) => {
        const index = all.length;
        all.push(t);
        return { text: t, index, tokens: segmentLine(t) };
      });
    const bioClauses = build(bio);
    const storyClauses = story ? build(story) : [];
    return { clauses: all, bioClauses, storyClauses };
  }, [bio, story]);

  const { supported, state, activeLine, activeWord, play, pause, resume, stop } =
    useSpeech(clauses, { lang, rate: 1 });

  const isReading = state !== 'idle';
  const primary =
    state === 'playing'
      ? { label: labels.pause, onClick: pause, icon: '⏸' }
      : state === 'paused'
        ? { label: labels.resume, onClick: resume, icon: '▶' }
        : { label: labels.play, onClick: play, icon: '▶' };

  const renderClauses = (list: Clause[]): ReactNode[] =>
    list.flatMap((clause, ci): ReactNode[] => {
      const words = clause.tokens.flatMap((token, wi): ReactNode[] => {
        const span = (
          <span
            key={`w${wi}`}
            className={`poet__word ${
              activeLine === clause.index && activeWord === wi ? 'is-active' : ''
            }`}
          >
            {token.text}
          </span>
        );
        return wi === 0 ? [span] : [<Fragment key={`g${wi}`}> </Fragment>, span];
      });
      const node = (
        <span key={`c${clause.index}`} className="poet__clause">
          {words}
        </span>
      );
      return ci === 0 ? [node] : [<Fragment key={`cg${ci}`}> </Fragment>, node];
    });

  return (
    <>
      {supported ? (
        <div className="poet__listen-bar">
          <button
            type="button"
            className="poet__listen font-kufi"
            data-testid="poet-listen"
            aria-pressed={state === 'playing'}
            onClick={primary.onClick}
          >
            <span className="poet__listen-icon" aria-hidden="true">
              {primary.icon}
            </span>
            <span>{primary.label}</span>
          </button>
          {isReading ? (
            <button
              type="button"
              className="poet__listen poet__listen--stop font-kufi"
              data-testid="poet-stop"
              onClick={stop}
            >
              <span className="poet__listen-icon" aria-hidden="true">
                ■
              </span>
              <span>{labels.stop}</span>
            </button>
          ) : null}
        </div>
      ) : null}

      <p className="poet__bio font-ui" data-testid="poet-bio">
        {renderClauses(bioClauses)}
      </p>

      {storyClauses.length > 0 ? (
        <>
          <GoldDivider />
          <blockquote
            className="poet__story font-display"
            data-testid="poet-story"
            lang={isAr ? 'ar' : undefined}
            dir={isAr ? 'rtl' : undefined}
          >
            {renderClauses(storyClauses)}
          </blockquote>
        </>
      ) : null}
    </>
  );
}
