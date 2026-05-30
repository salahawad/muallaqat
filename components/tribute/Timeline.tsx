import type { TributeEvent } from '@/lib/schemas';

/**
 * The life timeline — a vertical thread of gold nodes, each a year and event,
 * in chronological order.
 */
type TimelineProps = {
  heading: string;
  events: TributeEvent[];
  locale: string;
};

export function Timeline({ heading, events, locale }: TimelineProps) {
  const isAr = locale === 'ar';
  const fmt = new Intl.NumberFormat(isAr ? 'ar-EG' : 'en', { useGrouping: false });
  const ordered = [...events].sort((a, b) => a.year - b.year);

  return (
    <section className="tribute-section" data-testid="tribute-timeline">
      <h2 className="tribute-section__heading font-kufi">{heading}</h2>
      <ol className="tribute-timeline">
        {ordered.map((e) => (
          <li key={e.year} className="tribute-timeline__item">
            <span className="tribute-timeline__year font-kufi">{fmt.format(e.year)}</span>
            <span className="tribute-timeline__event font-ui">
              {isAr ? e.eventAr : e.eventEn}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
