import type { Poem, Poet } from '@/lib/schemas';
import { PoemReader, type ListenLabels } from '@/components/poem/PoemReader';

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
    backToDiwan: string;
    listen: ListenLabels;
  };
};

export function PoemView({ poem, poet, locale, labels }: PoemViewProps) {
  const isAr = locale === 'ar';

  return (
    <article className="poem" data-testid="poem-view">
      <nav className="poem__return">
        <a className="return-link font-kufi" href={`/${locale}/diwan`}>
          <span className="return-link__arrow" aria-hidden="true">
            {isAr ? '→' : '←'}
          </span>
          {labels.backToDiwan}
        </a>
      </nav>

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
          {poem.meter ? (
            <div className="poem__meta-pair">
              <dt>{labels.meter}</dt>
              <dd dir="auto">{poem.meter}</dd>
            </div>
          ) : null}
          {poem.rhyme ? (
            <div className="poem__meta-pair">
              <dt>{labels.rhyme}</dt>
              <dd dir="auto">{poem.rhyme}</dd>
            </div>
          ) : null}
        </dl>
      </header>

      <PoemReader
        lines={poem.linesAr}
        isMuallaqa={poem.isMuallaqa}
        labels={labels.listen}
      />

      {(isAr ? poem.contextAr : poem.contextEn) ? (
        <footer className="poem__context font-ui">
          {isAr ? poem.contextAr : poem.contextEn}
        </footer>
      ) : null}

      {poem.source.length > 0 ? (
        <p className="poem__source font-ui">
          {poem.source.map((src, i) => (
            <a key={i} href={src} target="_blank" rel="noopener noreferrer">
              {new URL(src).hostname.replace(/^www\./, '')}
            </a>
          ))}
        </p>
      ) : null}
    </article>
  );
}
