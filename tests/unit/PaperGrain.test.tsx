import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PaperGrain } from '@/components/ornament/PaperGrain';

describe('PaperGrain', () => {
  it('renders a decorative overlay hidden from assistive tech', () => {
    render(<PaperGrain />);
    const el = screen.getByTestId('paper-grain');
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute('aria-hidden', 'true');
    expect(el).toHaveClass('paper-grain');
  });
});
