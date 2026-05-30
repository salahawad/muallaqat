import type { TributeTranslation } from '@/lib/schemas';

/**
 * His literary translations — the translated work and its original author.
 */
type TranslationsProps = {
  heading: string;
  translations: TributeTranslation[];
  locale: string;
};

export function Translations({ heading, translations, locale }: TranslationsProps) {
  const isAr = locale === 'ar';
  const fmt = new Intl.NumberFormat(isAr ? 'ar-EG' : 'en', { useGrouping: false });

  return (
    <section className="tribute-section" data-testid="tribute-translations">
      <h2 className="tribute-section__heading font-kufi">{heading}</h2>
      <ul className="tribute-translations">
        {translations.map((t, i) => (
          <li key={`${t.author}-${t.note ?? i}`} className="tribute-translation">
            <span className="tribute-translation__work font-display">{t.note}</span>
            <span className="tribute-translation__author font-kufi">
              {t.author}
              {t.year ? <span className="tribute-translation__year"> · {fmt.format(t.year)}</span> : null}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
