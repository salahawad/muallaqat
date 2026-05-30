/**
 * A fixed, non-interactive fractal-noise overlay that gives the page its
 * aged-parchment texture. Decorative only — hidden from assistive tech.
 */
export function PaperGrain() {
  return <div className="paper-grain" aria-hidden="true" data-testid="paper-grain" />;
}
