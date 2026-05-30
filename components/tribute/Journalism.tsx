/**
 * The newspapers and journals he wrote for — a row of gold-edged chips.
 */
type JournalismProps = {
  heading: string;
  outlets: string[];
};

export function Journalism({ heading, outlets }: JournalismProps) {
  return (
    <section className="tribute-section" data-testid="tribute-journalism">
      <h2 className="tribute-section__heading font-kufi">{heading}</h2>
      <ul className="tribute-journalism">
        {outlets.map((name) => (
          <li key={name} className="tribute-journalism__chip font-kufi">
            {name}
          </li>
        ))}
      </ul>
    </section>
  );
}
