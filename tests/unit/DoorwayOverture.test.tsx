import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DoorwayOverture } from '@/components/doorway/DoorwayOverture';

const props = {
  kicker: 'ديوانٌ حيّ',
  name: 'عوض شعبان',
  dates: '١٩٣١ — ٢٠٢٥',
  creed: 'الكتابة ليست موهبة فحسب، بل هي مسؤولية تجاه الكلمة والإنسان.',
  dedication: 'إلى أبي، عوض شعبان — الذي علّمنا أنّ الكلمة أمانة.',
  intro: 'جمعٌ لأعظم ما خطّه العرب.',
  enterLabel: 'ادخل الديوان',
  enterHref: '/ar/diwan',
};

describe('DoorwayOverture', () => {
  it('renders the name, creed, dedication and dates', () => {
    render(<DoorwayOverture {...props} reducedMotion />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('عوض شعبان');
    expect(screen.getByText(props.creed)).toBeInTheDocument();
    expect(screen.getByText(props.dedication)).toBeInTheDocument();
    expect(screen.getByText(props.dates)).toBeInTheDocument();
  });

  it('links the gate into the Diwan', () => {
    render(<DoorwayOverture {...props} reducedMotion />);
    const gate = screen.getByRole('link', { name: /ادخل الديوان/ });
    expect(gate).toHaveAttribute('href', '/ar/diwan');
  });

  it('renders fully static (no animation) when reducedMotion is set', () => {
    render(<DoorwayOverture {...props} reducedMotion />);
    const root = screen.getByTestId('doorway-overture');
    // With reduced motion forced, the scene is presented final from first paint.
    expect(root).toHaveAttribute('data-animate', 'false');
    expect(root).toHaveAttribute('data-state', 'in');
  });

  it('renders the creed in the Amiri display face, RTL', () => {
    render(<DoorwayOverture {...props} reducedMotion />);
    const creed = screen.getByText(props.creed);
    expect(creed).toHaveClass('font-display');
    expect(creed).toHaveAttribute('dir', 'rtl');
  });
});
