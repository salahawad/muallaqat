'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { filterCards, type ExploreCard, type Facet } from '@/lib/explore';
import type { Emotion, PoemType } from '@/lib/schemas';

export type ExploreBrowserLabels = {
  search: string;
  all: string;
  era: string;
  emotion: string;
  type: string;
  clear: string;
  empty: string;
  by: string;
  results: string;
  resultsOne: string;
};

export type ExploreBrowserProps = {
  cards: ExploreCard[];
  facets: {
    era: Facet<string>[];
    emotion: Facet<Emotion>[];
    type: Facet<PoemType>[];
  };
  labels: ExploreBrowserLabels;
  locale: string;
  dir?: 'rtl' | 'ltr';
};

/**
 * استكشاف — the reader's browse surface. A search field and three chip groups
 * (emotion, era, form) narrow a grid of poem cards entirely on the client, so
 * filtering is instant. Emotion comes first, honoring the father's creed:
 * enter the canon through human feeling.
 */
export function ExploreBrowser({
  cards,
  facets,
  labels,
  locale,
  dir = 'rtl',
}: ExploreBrowserProps) {
  const [eraId, setEraId] = useState<string | null>(null);
  const [emotion, setEmotion] = useState<Emotion | null>(null);
  const [type, setType] = useState<PoemType | null>(null);
  const [query, setQuery] = useState('');

  const nf = useMemo(() => new Intl.NumberFormat(locale), [locale]);

  const results = useMemo(
    () => filterCards(cards, { eraId, emotion, type, query }),
    [cards, eraId, emotion, type, query],
  );

  const anyActive =
    eraId !== null || emotion !== null || type !== null || query.trim() !== '';

  function clearAll() {
    setEraId(null);
    setEmotion(null);
    setType(null);
    setQuery('');
  }

  return (
    <div dir={dir} className="space-y-10">
      {/* Search */}
      <div className="mx-auto max-w-xl">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={labels.search}
          aria-label={labels.search}
          className="w-full rounded-full border border-ink/15 bg-parchment/50 px-6 py-3 text-center font-ui text-ink shadow-sm transition placeholder:text-ink-muted focus:border-gold/60 focus:bg-cream focus:outline-none focus:ring-2 focus:ring-gold/30"
        />
      </div>

      {/* Filter chips — emotion first */}
      <div className="space-y-6">
        <FilterGroup
          legend={labels.emotion}
          allLabel={labels.all}
          facets={facets.emotion}
          selected={emotion}
          onSelect={(k) =>
            setEmotion((prev) => (k !== null && prev === k ? null : k))
          }
          nf={nf}
        />
        <FilterGroup
          legend={labels.era}
          allLabel={labels.all}
          facets={facets.era}
          selected={eraId}
          onSelect={(k) =>
            setEraId((prev) => (k !== null && prev === k ? null : k))
          }
          nf={nf}
        />
        <FilterGroup
          legend={labels.type}
          allLabel={labels.all}
          facets={facets.type}
          selected={type}
          onSelect={(k) =>
            setType((prev) => (k !== null && prev === k ? null : k))
          }
          nf={nf}
        />
      </div>

      {/* Count + clear */}
      <div className="flex items-center justify-center gap-4 border-y border-ink/10 py-3">
        <p
          role="status"
          aria-live="polite"
          className="font-kufi text-sm text-ink-muted"
        >
          {nf.format(results.length)}{' '}
          {results.length === 1 ? labels.resultsOne : labels.results}
        </p>
        {anyActive && (
          <button
            type="button"
            onClick={clearAll}
            className="font-kufi text-sm text-gold underline-offset-4 transition hover:underline"
          >
            {labels.clear}
          </button>
        )}
      </div>

      {/* Results */}
      {results.length === 0 ? (
        <p className="py-16 text-center font-display text-2xl text-ink-muted">
          {labels.empty}
        </p>
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((card) => (
            <li key={card.id}>
              <ExploreCardView card={card} by={labels.by} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ---- Internal pieces ------------------------------------------------------

function FilterGroup<K extends string>({
  legend,
  allLabel,
  facets,
  selected,
  onSelect,
  nf,
}: {
  legend: string;
  allLabel: string;
  facets: Facet<K>[];
  selected: K | null;
  onSelect: (key: K | null) => void;
  nf: Intl.NumberFormat;
}) {
  if (facets.length === 0) return null;
  return (
    <fieldset className="flex flex-wrap items-center justify-center gap-2">
      <legend className="mb-2 w-full text-center font-kufi text-xs uppercase tracking-widest text-ink-muted">
        {legend}
      </legend>
      <Chip pressed={selected === null} onClick={() => onSelect(null)}>
        {allLabel}
      </Chip>
      {facets.map((f) => (
        <Chip
          key={f.key}
          pressed={selected === f.key}
          onClick={() => onSelect(f.key)}
        >
          {f.label}
          <span className="ms-2 text-xs opacity-60">{nf.format(f.count)}</span>
        </Chip>
      ))}
    </fieldset>
  );
}

function Chip({
  pressed,
  onClick,
  children,
}: {
  pressed: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={[
        'rounded-full border px-4 py-1.5 font-ui text-sm transition',
        pressed
          ? 'border-gold bg-gold/15 text-ink'
          : 'border-ink/15 bg-transparent text-ink-muted hover:border-gold/40 hover:text-ink',
      ].join(' ')}
    >
      {children}
    </button>
  );
}

function ExploreCardView({ card, by }: { card: ExploreCard; by: string }) {
  return (
    <article className="group flex h-full flex-col gap-3 rounded-xl border border-ink/10 bg-parchment/40 p-5 transition hover:border-gold/40 hover:bg-parchment/70">
      <div className="flex items-baseline justify-between gap-3">
        <p className="font-kufi text-xs text-gold">{card.eraName}</p>
        <span className="font-kufi text-xs text-ink-muted">{card.typeLabel}</span>
      </div>

      <Link href={card.href} className="block">
        <h3 className="font-display text-2xl leading-snug text-ink transition group-hover:text-gold">
          {card.title}
        </h3>
      </Link>

      {card.poetHref ? (
        <Link
          href={card.poetHref}
          className="font-ui text-sm text-ink-muted transition hover:text-gold"
        >
          {by} {card.poetName}
        </Link>
      ) : (
        <span className="font-ui text-sm text-ink-muted">{card.poetName}</span>
      )}

      <p
        dir="rtl"
        lang="ar"
        className="mt-1 line-clamp-1 font-display text-lg leading-loose text-ink-light"
      >
        {card.firstLine}
      </p>

      {card.emotionLabels.length > 0 && (
        <ul className="mt-auto flex flex-wrap gap-2 pt-2">
          {card.emotionLabels.map((label) => (
            <li
              key={label}
              className="rounded-full bg-gold/10 px-2.5 py-0.5 font-kufi text-xs text-ink-muted"
            >
              {label}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
