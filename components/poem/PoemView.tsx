import type { Poem, Poet } from '@/lib/schemas';
import { Verse } from '@/components/typography/Verse';

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
  };
};

export function PoemView({ poem, poet, locale, labels }: PoemViewProps) {
  const isAr = locale === 'ar';

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
          {poem.meter ? (
            <div className="poem__meta-pair">
              <dt>{labels.meter}</dt>
              <dd>{poem.meter}</dd>
            </div>
          ) : null}
          {poem.rhyme ? (
            <div className="poem__meta-pair">
              <dt>{labels.rhyme}</dt>
              <dd>{poem.rhyme}</dd>
            </div>
          ) : null}
        </dl>
      </header>

      <div className={`poem__body ${poem.isMuallaqa ? 'poem__body--hanging' : ''}`}>
        {poem.linesAr.map((line, i) => (
          <div key={i} className="poem__bayt" data-testid="poem-bayt">
            <Verse lines={[line]} centered className="poem__bayt-text" />
          </div>
        ))}
      </div>

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
