import type { Poem, Poet } from '@/lib/schemas';
import { PoemReader, type ListenLabels } from '@/components/poem/PoemReader';
import { verified } from '@/lib/pending';

/** A source entry is shown only if it is a real, parseable URL (never a sentinel). */
function sourceHost(src: string): string | null {
  if (verified(src) === undefined) return null;
  try {
    return new URL(src).hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
}

/**
 * A reading surface for a single poem. A Mu'allaqa is given a "hanging" treatment
 * — the legend that the seven odes hung on the Kaaba — with each bayt suspended
 * on its own, the sadr and ʿajuz balanced across the line.
 */
type PoemViewProps = {
  poem: Poem;
  poet: Poet | undefined;
  locale: string;
  labels: {
    meter: string;
    rhyme: string;
    backToPoet: string;
    listen: ListenLabels;
  };
};

export function PoemView({ poem, poet, locale, labels }: PoemViewProps) {
  const isAr = locale === 'ar';
  // Sentinels never reach the reader: keep only verified verse, context, sources.
  const lines = poem.linesAr
    .map((l) => verified(l))
    .filter((l): l is string => Boolean(l));
  const context = verified(isAr ? poem.contextAr : poem.contextEn);
  const meter = verified(poem.meter);
  const rhyme = verified(poem.rhyme);
  const hosts = poem.source
    .map((src) => ({ src, host: sourceHost(src) }))
    .filter((s): s is { src: string; host: string } => s.host !== null);
  const isPendingPoem = lines.length === 0;

  return (
    <article className="poem" data-testid="poem-view">
      <header className="poem__header">
        {poem.isMuallaqa ? (
          <span className="poem__badge font-kufi">مُعلّقة</span>
        ) : null}
        <h1 className="poem__title font-display">
          {isAr ? poem.titleAr : poem.titleEn}
        </h1>
        {poet ? (
          <a className="poem__poet font-kufi" href={`/${locale}/poet/${poet.slug}`}>
            {isAr ? poet.nameAr : poet.nameEn}
          </a>
        ) : null}
        <dl className="poem__meta font-kufi">
          {meter ? (
            <div className="poem__meta-pair">
              <dt>{labels.meter}</dt>
              <dd>{meter}</dd>
            </div>
          ) : null}
          {rhyme ? (
            <div className="poem__meta-pair">
              <dt>{labels.rhyme}</dt>
              <dd>{rhyme}</dd>
            </div>
          ) : null}
        </dl>
      </header>

      {isPendingPoem ? (
        <p className="poem__pending font-display" lang="ar" dir="rtl">
          {isAr ? 'النصّ قيد التحقّق' : 'The verse is pending verification.'}
        </p>
      ) : (
        <PoemReader
          lines={lines}
          isMuallaqa={poem.isMuallaqa}
          labels={labels.listen}
        />
      )}

      {context ? (
        <footer className="poem__context font-ui">{context}</footer>
      ) : null}

      {hosts.length > 0 ? (
        <p className="poem__source font-ui">
          {hosts.map(({ src, host }, i) => (
            <a key={i} href={src} target="_blank" rel="noopener noreferrer">
              {host}
            </a>
          ))}
        </p>
      ) : null}
    </article>
  );
}
