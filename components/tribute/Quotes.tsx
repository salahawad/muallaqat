import type { TributeQuote } from '@/lib/schemas';
import { Verse } from '@/components/typography/Verse';

/**
 * His words — rendered large in the display Naskh face via the Verse primitive,
 * with the English beneath when the active locale is English.
 */
type QuotesProps = {
  heading: string;
  quotes: TributeQuote[];
  locale: string;
};

export function Quotes({ heading, quotes, locale }: QuotesProps) {
  const showEn = locale === 'en';
  return (
    <section className="tribute-section" data-testid="tribute-quotes">
      <h2 className="tribute-section__heading font-kufi">{heading}</h2>
      <div className="tribute-quotes">
        {quotes.map((q, i) => (
          <blockquote key={i} className="tribute-quote">
            <Verse lines={[q.textAr]} centered className="tribute-quote__ar" />
            {showEn && q.textEn ? (
              <p className="tribute-quote__en font-ui">{q.textEn}</p>
            ) : null}
          </blockquote>
        ))}
      </div>
    </section>
  );
}
