import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DuelView } from '@/components/hija2/DuelView';
import { getDuels, getPoetBySlug } from '@/lib/content';
import type { Poet } from '@/lib/schemas';

const duel = getDuels().find((d) => d.slug === 'jarir-farazdaq')!;
const poetA = getPoetBySlug(duel.poetAId) as Poet;
const poetB = getPoetBySlug(duel.poetBId) as Poet;
const poetsById: Record<string, Poet> = {
  [poetA.id]: poetA,
  [poetB.id]: poetB,
};

const labels = {
  next: 'الرد التالي',
  prev: 'الرد السابق',
  volleyOf: 'الجولة {n} من {total}',
};

describe('DuelView', () => {
  it('renders in RTL and shows both combatants', () => {
    const { container } = render(
      <DuelView duel={duel} poetsById={poetsById} locale="ar" labels={labels} />,
    );
    expect(container.querySelector('[dir="rtl"]')).not.toBeNull();
    // Each combatant appears in the header and again as a volley speaker.
    expect(screen.getAllByText(poetA.nameAr).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(poetB.nameAr).length).toBeGreaterThanOrEqual(1);
  });

  it('renders every volley on alternating sides', () => {
    render(<DuelView duel={duel} poetsById={poetsById} locale="ar" labels={labels} />);
    const volleys = screen.getAllByTestId('duel-volley');
    expect(volleys).toHaveLength(duel.volleys.length);
    expect(volleys[0].getAttribute('data-side')).not.toBe(
      volleys[1].getAttribute('data-side'),
    );
  });

  it('advances through the volleys with the stepper', async () => {
    const user = userEvent.setup();
    render(<DuelView duel={duel} poetsById={poetsById} locale="ar" labels={labels} />);
    const next = screen.getByTestId('duel-next');
    // First volley revealed initially; advancing reveals the second.
    expect(screen.getByTestId('duel-stage')).toHaveAttribute('data-revealed', '1');
    await user.click(next);
    expect(screen.getByTestId('duel-stage')).toHaveAttribute('data-revealed', '2');
  });

  it('stacks every volley statically under reduced motion', () => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockImplementation((q: string) => ({
        matches: q.includes('reduce'),
        media: q,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
        onchange: null,
      })),
    );
    render(<DuelView duel={duel} poetsById={poetsById} locale="ar" labels={labels} />);
    const stage = screen.getByTestId('duel-stage');
    // Reduced motion → no stepping; all volleys are present and revealed.
    expect(stage).toHaveAttribute('data-reduced-motion', 'true');
    expect(stage).toHaveAttribute('data-revealed', String(duel.volleys.length));
    expect(screen.queryByTestId('duel-next')).toBeNull();
  });
});
