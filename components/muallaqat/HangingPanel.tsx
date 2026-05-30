import type { Poem, Poet } from '@/lib/schemas';
import { verified } from '@/lib/pending';

/**
 * One of the Seven, presented as an illuminated panel hung from the gallery's
 * cord — the legend of the odes suspended on the Kaaba made literal. Bears the
 * poet's name, their era tag, and the matlaʿ (opening couplet) drawn in Amiri,
 * the whole panel a tap-target into the full ode.
 *
 * Presentational and server-renderable; the unfurl/brighten choreography is
 * owned by the client {@link MuallaqatGallery} wrapper. When the verse is not
 * yet verified, the sentinel is replaced with a quiet pending notice so the
 * sacred text is never approximated for the reader.
 */
type HangingPanelProps = {
  poem: Poem;
  poet: Poet;
  eraNameAr: string;
  eraNameEn: string;
  locale: string;
  /** Position among the Seven — used only for staggered reveal timing. */
  index: number;
};

export function HangingPanel({
  poem,
  poet,
  eraNameAr,
  eraNameEn,
  locale,
  index,
}: HangingPanelProps) {
  const isAr = locale === 'ar';
  const name = isAr ? poet.nameAr : poet.nameEn;
  const eraName = isAr ? eraNameAr : eraNameEn;
  const matla = verified(poem.linesAr[0]);
  const ordinal = new Intl.NumberFormat(isAr ? 'ar-EG' : 'en').format(index + 1);

  return (
    <a
      className="hanging-panel"
      data-testid="hanging-panel"
      href={`/${locale}/poem/${poem.slug}`}
      style={{ '--panel-index': index } as React.CSSProperties}
    >
      <span className="hanging-panel__cord" aria-hidden="true" />
      <span className="hanging-panel__sheet">
        <span className="hanging-panel__ordinal font-kufi" aria-hidden="true">
          {ordinal}
        </span>
        <span className="hanging-panel__era font-kufi">{eraName}</span>
        <span className="hanging-panel__name font-display">{name}</span>
        {matla ? (
          <span className="hanging-panel__matla font-display" lang="ar" dir="rtl">
            {matla}
          </span>
        ) : (
          <span className="hanging-panel__pending font-kufi" lang="ar" dir="rtl">
            {isAr ? 'النصّ قيد التحقّق' : 'verse pending verification'}
          </span>
        )}
        <span className="hanging-panel__cta font-kufi">
          {isAr ? 'اقرأ المعلّقة' : 'Read the Muʿallaqa'}
          <span aria-hidden="true"> ←</span>
        </span>
      </span>
    </a>
  );
}
