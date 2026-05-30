import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DoorwayOverture } from '@/components/doorway/DoorwayOverture';

const props = {
  kicker: 'ديوانٌ حيّ',
  name: 'عوض شعبان',
  dates: '١٩٣١ — ٢٠٢٥',
  creed: 'الكتابة ليست موهبة فحسب، بل هي مسؤولية تجاه الكلمة والإنسان.',
  dedication: 'إلى أبي، عوض شعبان — الذي علّمنا أنّ الكلمة أمانة.',
  intro: 'المعلقاتُ والأشعارُ والنثرُ والهجاء.',
  enterLabel: 'ادخل الديوان',
  skipLabel: 'تخطَّ المقدّمة',
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

  describe('reaching the landing', () => {
    afterEach(() => {
      vi.useRealTimers();
    });

    it('offers a skip link straight into the Diwan during the overture', () => {
      // No reducedMotion → the animated path, where the skip affordance shows.
      render(<DoorwayOverture {...props} navigate={vi.fn()} />);
      const skip = screen.getByRole('link', { name: /تخطَّ المقدّمة/ });
      expect(skip).toHaveAttribute('href', '/ar/diwan');
    });

    it('auto-advances into the Diwan after the overture, for motion visitors', () => {
      vi.useFakeTimers();
      const navigate = vi.fn();
      render(<DoorwayOverture {...props} navigate={navigate} />);
      // Not before the overture has had time to play out…
      vi.advanceTimersByTime(3000);
      expect(navigate).not.toHaveBeenCalled();
      // …but it does glide on after the reveal settles (delay is tunable).
      vi.advanceTimersByTime(12000);
      expect(navigate).toHaveBeenCalledWith('/ar/diwan');
    });

    it('cancels the auto-advance once the visitor interacts', () => {
      vi.useFakeTimers();
      const navigate = vi.fn();
      render(<DoorwayOverture {...props} navigate={navigate} />);
      window.dispatchEvent(new Event('wheel'));
      vi.advanceTimersByTime(20000);
      expect(navigate).not.toHaveBeenCalled();
    });

    it('never auto-advances reduced-motion visitors, and hides the skip link', () => {
      vi.useFakeTimers();
      const navigate = vi.fn();
      render(<DoorwayOverture {...props} navigate={navigate} reducedMotion />);
      vi.advanceTimersByTime(20000);
      expect(navigate).not.toHaveBeenCalled();
      expect(
        screen.queryByRole('link', { name: /تخطَّ المقدّمة/ })
      ).not.toBeInTheDocument();
    });
  });
});
