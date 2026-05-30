import type { TributeWork } from '@/lib/schemas';

/**
 * His works, grouped by kind (novels / story collections / studies). Each card
 * shows the title, year, and publisher.
 */
type WorksProps = {
  heading: string;
  labels: { novels: string; stories: string; study: string };
  works: TributeWork[];
  locale: string;
};

const ORDER: TributeWork['type'][] = ['novel', 'stories', 'study'];

export function Works({ heading, labels, works, locale }: WorksProps) {
  const isAr = locale === 'ar';
  const fmt = new Intl.NumberFormat(isAr ? 'ar-EG' : 'en', { useGrouping: false });
  const labelOf = (t: TributeWork['type']) =>
    t === 'novel' ? labels.novels : t === 'stories' ? labels.stories : labels.study;

  return (
    <section className="tribute-section" data-testid="tribute-works">
      <h2 className="tribute-section__heading font-kufi">{heading}</h2>
      {ORDER.map((type) => {
        const group = works.filter((w) => w.type === type);
        if (group.length === 0) return null;
        return (
          <div key={type} className="tribute-works__group">
            <h3 className="tribute-works__group-label font-kufi">{labelOf(type)}</h3>
            <ul className="tribute-works__grid">
              {group
                .slice()
                .sort((a, b) => a.year - b.year)
                .map((w) => (
                  <li key={`${w.titleAr}-${w.year}`} className="tribute-work">
                    <span className="tribute-work__title font-display">{w.titleAr}</span>
                    <span className="tribute-work__meta font-kufi">
                      {fmt.format(w.year)}
                      {w.note ? <span className="tribute-work__pub"> · {w.note}</span> : null}
                    </span>
                  </li>
                ))}
            </ul>
          </div>
        );
      })}
    </section>
  );
}
