import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HangingPanel } from '@/components/muallaqat/HangingPanel';
import type { Poem, Poet } from '@/lib/schemas';

const poet: Poet = {
  id: 'imru-al-qais',
  slug: 'imru-al-qais',
  nameAr: 'امرؤ القيس',
  nameEn: "Imru' al-Qais",
  eraId: 'jahili',
  region: 'نجد',
  bioAr: 'سيرة',
  bioEn: 'bio',
  humanStoryAr: '',
  humanStoryEn: '',
  themes: ['ghazal'],
  signaturePoemIds: ['muallaqat-imru-al-qais'],
};

const poem: Poem = {
  id: 'muallaqat-imru-al-qais',
  slug: 'muallaqat-imru-al-qais',
  titleAr: 'مُعلّقة امرئ القيس',
  titleEn: "The Mu'allaqa of Imru' al-Qais",
  poetId: 'imru-al-qais',
  eraId: 'jahili',
  type: 'muallaqa',
  themes: ['ghazal'],
  linesAr: ['قِفَا نَبْكِ مِنْ ذِكْرَى حَبِيبٍ ومَنْزِلِ'],
  isMuallaqa: true,
  source: ['https://example.org', 'https://example.com'],
};

describe('HangingPanel', () => {
  it('renders the poet name, era tag and matlaʿ couplet in RTL', () => {
    render(
      <HangingPanel poem={poem} poet={poet} eraNameAr="العصر الجاهلي" eraNameEn="Pre-Islamic" locale="ar" index={0} />,
    );
    expect(screen.getByText('امرؤ القيس')).toBeInTheDocument();
    expect(screen.getByText('العصر الجاهلي')).toBeInTheDocument();
    const matla = screen.getByText(/قِفَا نَبْكِ/);
    expect(matla).toBeInTheDocument();
    expect(matla.closest('[dir="rtl"]')).not.toBeNull();
  });

  it('links to the poem page for the locale', () => {
    render(
      <HangingPanel poem={poem} poet={poet} eraNameAr="العصر الجاهلي" eraNameEn="Pre-Islamic" locale="ar" index={0} />,
    );
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/ar/poem/muallaqat-imru-al-qais');
  });

  it('falls back to a pending notice when the matlaʿ is not yet verified', () => {
    const pending: Poem = { ...poem, linesAr: ['__PENDING_VERIFICATION__'] };
    render(
      <HangingPanel poem={pending} poet={poet} eraNameAr="العصر الجاهلي" eraNameEn="Pre-Islamic" locale="ar" index={1} />,
    );
    // The sentinel must never reach the reader.
    expect(screen.queryByText(/__PENDING_VERIFICATION__/)).toBeNull();
  });
});
