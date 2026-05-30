import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PoemView } from '@/components/poem/PoemView';
import { getPoemBySlug, getPoetBySlug } from '@/lib/content';

const poem = getPoemBySlug('muallaqat-imru-al-qais')!;
const poet = getPoetBySlug('imru-al-qais');
const labels = {
  meter: 'البحر',
  rhyme: 'القافية',
  backToDiwan: 'الديوان',
  listen: { play: 'استمع', pause: 'إيقاف مؤقت', resume: 'متابعة', stop: 'إنهاء' },
};

describe('PoemView', () => {
  it('renders the poem title and every bayt', () => {
    render(<PoemView poem={poem} poet={poet} locale="ar" labels={labels} />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('مُعلّقة امرئ القيس');
    expect(screen.getAllByTestId('poem-bayt')).toHaveLength(poem.linesAr.length);
  });

  it('renders the famous opening bayt verbatim', () => {
    render(<PoemView poem={poem} poet={poet} locale="ar" labels={labels} />);
    // The bayt is now split into per-word spans for highlighting; assert the
    // full line survives across them.
    expect(screen.getAllByTestId('poem-bayt')[0]).toHaveTextContent(
      'قِفَا نَبْكِ مِنْ ذِكْرَى',
    );
  });

  it('marks a Muallaqa with its badge and meter/rhyme', () => {
    render(<PoemView poem={poem} poet={poet} locale="ar" labels={labels} />);
    expect(screen.getByText('مُعلّقة')).toBeInTheDocument();
    expect(screen.getByText('الطويل')).toBeInTheDocument();
  });

  it('links to the poet', () => {
    render(<PoemView poem={poem} poet={poet} locale="ar" labels={labels} />);
    const link = screen.getByRole('link', { name: 'امرؤ القيس' });
    expect(link).toHaveAttribute('href', '/ar/poet/imru-al-qais');
  });

  it('offers a way back to the Diwan', () => {
    render(<PoemView poem={poem} poet={poet} locale="ar" labels={labels} />);
    const back = screen.getByRole('link', { name: /الديوان/ });
    expect(back).toHaveAttribute('href', '/ar/diwan');
  });
});
