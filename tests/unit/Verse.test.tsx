import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Verse } from '@/components/typography/Verse';

describe('Verse', () => {
  const lines = [
    'قِفَا نَبْكِ مِنْ ذِكْرَى حَبِيبٍ ومَنْزِلِ بِسِقْطِ اللِّوَى بَينَ الدَّخول فَحَوْملِ',
    'فَتُوْضِحَ فَالمِقْراةِ لمْ يَعْفُ رَسْمُها لِما نَسَجَتْهَا مِنْ جَنُوبٍ وشَمْألِ',
  ];

  it('renders each line of verse', () => {
    render(<Verse lines={lines} />);
    for (const line of lines) {
      expect(screen.getByText(line)).toBeInTheDocument();
    }
  });

  it('is right-to-left and in the display font', () => {
    render(<Verse lines={lines} />);
    const el = screen.getByTestId('verse');
    expect(el).toHaveAttribute('dir', 'rtl');
    expect(el).toHaveAttribute('lang', 'ar');
    expect(el).toHaveClass('font-display');
  });

  it('can be centered', () => {
    render(<Verse lines={lines} centered />);
    expect(screen.getByTestId('verse')).toHaveClass('text-center');
  });
});
