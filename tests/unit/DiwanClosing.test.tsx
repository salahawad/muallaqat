import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DiwanClosing } from '@/components/diwan/DiwanClosing';

const dedication = 'إلى أبي، عوض شعبان — الذي علّمنا أنّ الكلمة أمانة.';
const label = 'في ذكرى عوض شعبان';

describe('DiwanClosing', () => {
  it('links to the tribute page with the in-memory label', () => {
    render(<DiwanClosing dedication={dedication} label={label} href="/ar/tribute" />);
    const link = screen.getByRole('link', { name: /في ذكرى عوض شعبان/ });
    expect(link).toHaveAttribute('href', '/ar/tribute');
  });

  it('shows the dedication as the closing lead', () => {
    render(<DiwanClosing dedication={dedication} label={label} href="/ar/tribute" />);
    expect(screen.getByTestId('diwan-closing')).toHaveTextContent('إلى أبي، عوض شعبان');
  });
});
