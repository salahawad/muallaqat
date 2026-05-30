import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GoldDivider } from '@/components/ornament/GoldDivider';

describe('GoldDivider', () => {
  it('renders a decorative separator', () => {
    render(<GoldDivider />);
    const el = screen.getByTestId('gold-divider');
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute('aria-hidden', 'true');
    expect(el).toHaveAttribute('role', 'separator');
  });

  it('merges a passed className', () => {
    render(<GoldDivider className="my-custom" />);
    expect(screen.getByTestId('gold-divider')).toHaveClass('my-custom');
  });
});
