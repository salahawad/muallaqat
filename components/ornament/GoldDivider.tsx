/**
 * An illuminated gold divider used to give rhythm between sections.
 * RTL-safe (centered, symmetric) and decorative — hidden from assistive tech.
 */
type GoldDividerProps = {
  className?: string;
};

export function GoldDivider({ className = '' }: GoldDividerProps) {
  return (
    <div
      role="separator"
      aria-hidden="true"
      data-testid="gold-divider"
      className={`flex items-center justify-center gap-3 py-8 ${className}`}
    >
      <span className="h-px w-16 bg-gradient-to-r from-transparent to-gold/60" />
      <span className="text-gold-light text-xl leading-none">۞</span>
      <span className="h-px w-16 bg-gradient-to-l from-transparent to-gold/60" />
    </div>
  );
}
