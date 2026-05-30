/**
 * عوض شعبان in the Modern era — not as a classical poet with an ode, but as the
 * keeper of the word whose Mahjar emigration (Brazil, Uruguay, Argentina) rhymes
 * with Gibran's, and to whom this whole Diwan is dedicated. An illuminated panel,
 * distinct from the poet cartouches, that opens into his tribute.
 */
type KeeperPanelProps = {
  nameAr: string;
  nameEn: string;
  years: string;
  creed: string;
  locale: string;
  labels: { kicker: string; cta: string };
  href: string;
};

export function KeeperPanel({ nameAr, nameEn, years, creed, locale, labels, href }: KeeperPanelProps) {
  const isAr = locale === 'ar';
  return (
    <a className="keeper-panel" data-testid="keeper-panel" href={href}>
      <span className="keeper-panel__frame" aria-hidden="true" />
      <span className="keeper-panel__kicker font-kufi">{labels.kicker}</span>
      <span className="keeper-panel__name font-display">{isAr ? nameAr : nameEn}</span>
      <span className="keeper-panel__years font-kufi">{years}</span>
      <span className="keeper-panel__creed font-display" lang="ar" dir="rtl">
        {creed}
      </span>
      <span className="keeper-panel__cta font-kufi">
        {labels.cta}
        <span aria-hidden="true"> {isAr ? '←' : '→'}</span>
      </span>
    </a>
  );
}
