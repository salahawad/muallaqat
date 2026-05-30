import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DuelCard } from '@/components/hija2/DuelCard';
import { getDuels, getPoetBySlug } from '@/lib/content';
import type { Poet } from '@/lib/schemas';

const duel = getDuels().find((d) => d.slug === 'jarir-farazdaq')!;
const poetA = getPoetBySlug(duel.poetAId) as Poet;
const poetB = getPoetBySlug(duel.poetBId) as Poet;

describe('DuelCard', () => {
  it('renders the duel title and both combatants', () => {
    render(<DuelCard duel={duel} poetA={poetA} poetB={poetB} locale="ar" />);
    expect(screen.getByText(duel.titleAr)).toBeInTheDocument();
    expect(screen.getByText(poetA.nameAr)).toBeInTheDocument();
    expect(screen.getByText(poetB.nameAr)).toBeInTheDocument();
  });

  it('links to the duel page for the locale', () => {
    render(<DuelCard duel={duel} poetA={poetA} poetB={poetB} locale="ar" />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/ar/hija2/jarir-farazdaq');
  });

  it('never leaks the verification sentinel to the reader', () => {
    render(<DuelCard duel={duel} poetA={poetA} poetB={poetB} locale="ar" />);
    expect(screen.queryByText(/__PENDING_VERIFICATION__/)).toBeNull();
  });
});
