/**
 * The quiet close of the Diwan scroll. After the five era scenes, the journey
 * resolves into a remembrance of the man the whole site is built for — the same
 * dedication that opened the Doorway, with a gentle door into his tribute page.
 * Footer-weight, not a full scene, so it reads as a closing breath rather than
 * another threshold.
 */
type DiwanClosingProps = {
  /** One line of remembrance — the Doorway dedication, reused to close the loop. */
  dedication: string;
  /** Link text into the tribute page (e.g. "في ذكرى عوض شعبان"). */
  label: string;
  /** Destination, e.g. `/${locale}/tribute`. */
  href: string;
};

export function DiwanClosing({ dedication, label, href }: DiwanClosingProps) {
  return (
    <footer className="diwan__closing" data-testid="diwan-closing">
      <div className="diwan__closing-rule" aria-hidden="true" />
      <p className="diwan__closing-lead font-kufi">{dedication}</p>
      <a className="diwan__closing-link font-display" href={href}>
        {label}
        <span className="diwan__closing-arrow" aria-hidden="true">
          →
        </span>
      </a>
    </footer>
  );
}
