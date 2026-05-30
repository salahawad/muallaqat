import Image from 'next/image';

/**
 * The memorial portrait — framed in a gold ring, with the name and life dates
 * beneath. Dates are rendered with the locale's own numerals.
 */
type PortraitProps = {
  src: string;
  name: string;
  birthYear: number;
  deathYear: number;
  locale: string;
};

export function Portrait({ src, name, birthYear, deathYear, locale }: PortraitProps) {
  const fmt = new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en', {
    useGrouping: false,
  });
  const dates = `${fmt.format(birthYear)} — ${fmt.format(deathYear)}`;

  return (
    <figure className="tribute-portrait" data-testid="tribute-portrait">
      <div className="tribute-portrait__frame">
        <Image
          src={src}
          alt={name}
          width={1200}
          height={1600}
          priority
          className="tribute-portrait__img"
        />
      </div>
      <figcaption className="tribute-portrait__caption">
        <span className="tribute-portrait__name font-display">{name}</span>
        <span className="tribute-portrait__dates font-kufi">{dates}</span>
      </figcaption>
    </figure>
  );
}
