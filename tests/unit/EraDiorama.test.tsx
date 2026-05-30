import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EraDiorama } from '@/components/diwan/EraDiorama';

describe('EraDiorama', () => {
  it('renders a decorative diorama for the given variant', () => {
    const { container } = render(<EraDiorama variant="desert-night" />);
    const root = container.querySelector('.era-diorama');
    expect(root).toBeInTheDocument();
    expect(root).toHaveClass('era-diorama--desert-night');
    expect(root).toHaveAttribute('aria-hidden', 'true');
    // It is pure SVG scenery.
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('supports each era variant', () => {
    for (const v of ['duel', 'golden-court', 'garden', 'nahda'] as const) {
      const { container } = render(<EraDiorama variant={v} />);
      expect(container.querySelector(`.era-diorama--${v}`)).toBeInTheDocument();
    }
  });
});
