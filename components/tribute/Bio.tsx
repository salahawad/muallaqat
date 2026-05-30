/**
 * The biography — a single reverent paragraph in the active locale.
 */
type BioProps = {
  heading: string;
  text: string;
};

export function Bio({ heading, text }: BioProps) {
  return (
    <section className="tribute-section" data-testid="tribute-bio">
      <h2 className="tribute-section__heading font-kufi">{heading}</h2>
      <p className="tribute-bio__text font-ui">{text}</p>
    </section>
  );
}
