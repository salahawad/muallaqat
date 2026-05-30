import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExploreBrowser } from '@/components/explore/ExploreBrowser';
import { normalizeArabic, type ExploreCard } from '@/lib/explore';
import type { Emotion, PoemType } from '@/lib/schemas';

// Arabic-Indic rendering of a count, matching the component's Intl usage.
const ar = (n: number) => new Intl.NumberFormat('ar').format(n);

// ---- Fixtures -------------------------------------------------------------

function card(
  over: Partial<ExploreCard> &
    Pick<ExploreCard, 'id' | 'title' | 'poetName' | 'type' | 'eraId'> & {
      emotions: Emotion[];
    },
): ExploreCard {
  const slug = over.slug ?? over.id;
  return {
    slug,
    href: `/ar/poem/${slug}`,
    poetSlug: 'poet-' + over.id,
    poetHref: `/ar/poet/poet-${over.id}`,
    eraName: 'عصر',
    typeLabel: 'TYP',
    emotionLabels: over.emotions.map((e) => `EMO:${e}`),
    firstLine: 'سطرٌ أوّل',
    search: normalizeArabic(`${over.title} ${over.poetName}`),
    ...over,
  };
}

const cards: ExploreCard[] = [
  card({
    id: 'p-imru',
    title: "Imru Mu'allaqa",
    poetName: 'Imru al-Qais',
    type: 'muallaqa',
    eraId: 'jahili',
    emotions: ['ghazal', 'hikma'],
    href: '/ar/poem/p-imru',
    poetHref: '/ar/poet/imru',
  }),
  card({
    id: 'p-antara',
    title: 'Antara Ode',
    poetName: 'Antara',
    type: 'qasida',
    eraId: 'jahili',
    emotions: ['fakhr', 'hamasa'],
  }),
  card({
    id: 'p-shaaban',
    title: 'Elegy',
    poetName: 'Awad Shaaban',
    type: 'free',
    eraId: 'hadith',
    emotions: ['ritha'],
  }),
];

const facets = {
  era: [
    { key: 'jahili', label: 'الجاهلي', count: 2 },
    { key: 'hadith', label: 'الحديث', count: 1 },
  ],
  emotion: [
    { key: 'ghazal' as Emotion, label: 'غزل', count: 1 },
    { key: 'fakhr' as Emotion, label: 'فخر', count: 1 },
    { key: 'ritha' as Emotion, label: 'رثاء', count: 1 },
    { key: 'hikma' as Emotion, label: 'حكمة', count: 1 },
    { key: 'hamasa' as Emotion, label: 'حماسة', count: 1 },
  ],
  type: [
    { key: 'muallaqa' as PoemType, label: 'معلّقة', count: 1 },
    { key: 'qasida' as PoemType, label: 'قصيدة', count: 1 },
    { key: 'free' as PoemType, label: 'حر', count: 1 },
  ],
};

const labels = {
  search: 'ابحث',
  all: 'الكل',
  era: 'العصر',
  emotion: 'الإحساس',
  type: 'النوع',
  clear: 'مسح المرشحات',
  empty: 'لا نتائج',
  by: 'لـ',
  results: 'نتيجة',
  resultsOne: 'نتيجة',
};

function renderBrowser() {
  return render(
    <ExploreBrowser
      cards={cards}
      facets={facets}
      labels={labels}
      locale="ar"
      dir="rtl"
    />,
  );
}

// ---- Tests ----------------------------------------------------------------

describe('ExploreBrowser', () => {
  it('renders every card as an article initially', () => {
    renderBrowser();
    expect(screen.getAllByRole('article')).toHaveLength(3);
    expect(screen.getByRole('link', { name: "Imru Mu'allaqa" })).toBeInTheDocument();
  });

  it('each card links to its poem and to its poet', () => {
    renderBrowser();
    expect(screen.getByRole('link', { name: "Imru Mu'allaqa" })).toHaveAttribute(
      'href',
      '/ar/poem/p-imru',
    );
    expect(screen.getByRole('link', { name: /Imru al-Qais/ })).toHaveAttribute(
      'href',
      '/ar/poet/imru',
    );
  });

  it('reports the result count in a live region using Arabic-Indic digits', () => {
    renderBrowser();
    expect(screen.getByRole('status')).toHaveTextContent(ar(3));
  });

  it('filters by an emotion chip, marks it pressed, and updates the count', async () => {
    const user = userEvent.setup();
    renderBrowser();
    const group = screen.getByRole('group', { name: 'الإحساس' });
    const fakhr = within(group).getByRole('button', { name: /فخر/ });
    await user.click(fakhr);
    expect(fakhr).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getAllByRole('article')).toHaveLength(1);
    expect(screen.getByRole('link', { name: 'Antara Ode' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: "Imru Mu'allaqa" })).toBeNull();
    expect(screen.getByRole('status')).toHaveTextContent(ar(1));
  });

  it('filters by an era chip', async () => {
    const user = userEvent.setup();
    renderBrowser();
    const group = screen.getByRole('group', { name: 'العصر' });
    await user.click(within(group).getByRole('button', { name: /الحديث/ }));
    expect(screen.getAllByRole('article')).toHaveLength(1);
    expect(screen.getByRole('link', { name: 'Elegy' })).toBeInTheDocument();
  });

  it('clicking the same chip again clears that dimension', async () => {
    const user = userEvent.setup();
    renderBrowser();
    const group = screen.getByRole('group', { name: 'الإحساس' });
    const fakhr = within(group).getByRole('button', { name: /فخر/ });
    await user.click(fakhr);
    expect(screen.getAllByRole('article')).toHaveLength(1);
    await user.click(fakhr);
    expect(screen.getAllByRole('article')).toHaveLength(3);
    expect(fakhr).toHaveAttribute('aria-pressed', 'false');
  });

  it('filters by the search box and restores when cleared', async () => {
    const user = userEvent.setup();
    renderBrowser();
    const box = screen.getByRole('searchbox', { name: 'ابحث' });
    await user.type(box, 'antara');
    expect(screen.getAllByRole('article')).toHaveLength(1);
    expect(screen.getByRole('link', { name: 'Antara Ode' })).toBeInTheDocument();
    await user.clear(box);
    expect(screen.getAllByRole('article')).toHaveLength(3);
  });

  it('shows an empty state when nothing matches', async () => {
    const user = userEvent.setup();
    renderBrowser();
    await user.type(screen.getByRole('searchbox', { name: 'ابحث' }), 'zzzznope');
    expect(screen.queryAllByRole('article')).toHaveLength(0);
    expect(screen.getByText('لا نتائج')).toBeInTheDocument();
  });

  it('offers a clear-filters control that resets all dimensions', async () => {
    const user = userEvent.setup();
    renderBrowser();
    const group = screen.getByRole('group', { name: 'الإحساس' });
    await user.click(within(group).getByRole('button', { name: /فخر/ }));
    const clear = screen.getByRole('button', { name: 'مسح المرشحات' });
    await user.click(clear);
    expect(screen.getAllByRole('article')).toHaveLength(3);
  });

  it('ANDs a chip with the search box', async () => {
    const user = userEvent.setup();
    renderBrowser();
    // jahili era has Imru + Antara; searching "imru" within it leaves one.
    const eraGroup = screen.getByRole('group', { name: 'العصر' });
    await user.click(within(eraGroup).getByRole('button', { name: /الجاهلي/ }));
    expect(screen.getAllByRole('article')).toHaveLength(2);
    await user.type(screen.getByRole('searchbox', { name: 'ابحث' }), 'imru');
    expect(screen.getAllByRole('article')).toHaveLength(1);
    expect(screen.getByRole('link', { name: "Imru Mu'allaqa" })).toBeInTheDocument();
  });
});
