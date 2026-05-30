import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Portrait } from '@/components/tribute/Portrait';
import { Bio } from '@/components/tribute/Bio';
import { Timeline } from '@/components/tribute/Timeline';
import { Works } from '@/components/tribute/Works';
import { Translations } from '@/components/tribute/Translations';
import { Journalism } from '@/components/tribute/Journalism';
import { Quotes } from '@/components/tribute/Quotes';
import { getTribute } from '@/lib/content';

const t = getTribute();

describe('Portrait', () => {
  it('renders the portrait image with the name as alt text', () => {
    render(
      <Portrait src={t.portrait} name={t.nameAr} birthYear={1931} deathYear={2025} locale="ar" />,
    );
    expect(screen.getByRole('img', { name: 'عوض شعبان' })).toBeInTheDocument();
  });

  it('renders the life dates in Arabic numerals for the ar locale', () => {
    render(
      <Portrait src={t.portrait} name={t.nameAr} birthYear={1931} deathYear={2025} locale="ar" />,
    );
    expect(screen.getByText(/١٩٣١/)).toBeInTheDocument();
    expect(screen.getByText(/٢٠٢٥/)).toBeInTheDocument();
  });
});

describe('Bio', () => {
  it('renders the heading and text', () => {
    render(<Bio heading="سيرة" text={t.bioAr} />);
    expect(screen.getByRole('heading', { name: 'سيرة' })).toBeInTheDocument();
    expect(screen.getByText(/روائيّ/)).toBeInTheDocument();
  });
});

describe('Timeline', () => {
  it('renders an event for the 1988 award', () => {
    render(<Timeline heading="محطّات" events={t.timeline} locale="ar" />);
    expect(screen.getByText(/درب الجنوب/)).toBeInTheDocument();
  });

  it('renders all events', () => {
    render(<Timeline heading="محطّات" events={t.timeline} locale="ar" />);
    expect(screen.getAllByRole('listitem')).toHaveLength(t.timeline.length);
  });
});

describe('Works', () => {
  it('renders all works including درب الجنوب with its publisher', () => {
    render(
      <Works
        heading="مؤلفاته"
        labels={{ novels: 'روايات', stories: 'قصص', study: 'دراسات' }}
        works={t.works}
        locale="ar"
      />,
    );
    expect(screen.getByText('درب الجنوب')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(t.works.length);
  });
});

describe('Translations', () => {
  it('renders all 12 translations with their authors', () => {
    render(<Translations heading="ترجماته" translations={t.translations} locale="ar" />);
    expect(screen.getAllByRole('listitem')).toHaveLength(12);
    expect(screen.getByText('المعطف')).toBeInTheDocument();
  });
});

describe('Journalism', () => {
  it('renders every outlet', () => {
    render(<Journalism heading="صحافته" outlets={t.journalism} />);
    expect(screen.getByText('السفير')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(t.journalism.length);
  });
});

describe('Quotes', () => {
  it('renders the verbatim creed', () => {
    render(<Quotes heading="من أقواله" quotes={t.quotes} locale="ar" />);
    expect(
      screen.getByText('الكتابة ليست موهبة فحسب، بل هي مسؤولية تجاه الكلمة والإنسان.'),
    ).toBeInTheDocument();
  });

  it('shows the English translation only in the en locale', () => {
    const { rerender } = render(<Quotes heading="Quotes" quotes={t.quotes} locale="en" />);
    expect(screen.getByText(/Writing is not merely a talent/)).toBeInTheDocument();
    rerender(<Quotes heading="من أقواله" quotes={t.quotes} locale="ar" />);
    expect(screen.queryByText(/Writing is not merely a talent/)).not.toBeInTheDocument();
  });
});
