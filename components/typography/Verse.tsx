/**
 * Renders Arabic verse (or any line-structured Arabic text) in the display
 * Naskh face (Amiri), right-to-left, one line per bayt/سطر.
 */
type VerseProps = {
  lines: string[];
  className?: string;
  /** Visually centered verse (used for matáli' and quotes). */
  centered?: boolean;
};

export function Verse({ lines, className = '', centered = false }: VerseProps) {
  return (
    <div
      dir="rtl"
      lang="ar"
      data-testid="verse"
      className={`font-display text-ink ${centered ? 'text-center' : 'text-start'} ${className}`}
    >
      {lines.map((line, i) => (
        <p key={i} className="leading-loose text-2xl">
          {line}
        </p>
      ))}
    </div>
  );
}
