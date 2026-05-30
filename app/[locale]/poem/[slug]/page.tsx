import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { getPoems, getPoemBySlug, getPoetBySlug } from '@/lib/content';
import { PoemView } from '@/components/poem/PoemView';
import { verified } from '@/lib/pending';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getPoems().map((poem) => ({ locale, slug: poem.slug })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const poem = getPoemBySlug(slug);
  if (!poem) return {};
  const isAr = locale === 'ar';
  return {
    title: isAr ? poem.titleAr : poem.titleEn,
    description: verified(isAr ? poem.contextAr : poem.contextEn),
  };
}

export default async function PoemPage({ params }: Props) {
  const { locale: rawLocale, slug } = await params;
  if (!hasLocale(routing.locales, rawLocale)) notFound();
  const locale = rawLocale;
  setRequestLocale(locale);

  const poem = getPoemBySlug(slug);
  if (!poem) notFound();
  const poet = getPoetBySlug(poem.poetId) ?? undefined;
  const isAr = locale === 'ar';

  return (
    <main className="poem-page paper-grain">
      <div className="poem-page__glow" aria-hidden="true" />
      <PoemView
        poem={poem}
        poet={poet}
        locale={locale}
        labels={{
          meter: isAr ? 'البحر' : 'Meter',
          rhyme: isAr ? 'القافية' : 'Rhyme',
          backToPoet: isAr ? 'الشاعر' : 'The poet',
          listen: isAr
            ? { play: 'استمع', pause: 'إيقاف مؤقت', resume: 'متابعة', stop: 'إنهاء' }
            : { play: 'Listen', pause: 'Pause', resume: 'Resume', stop: 'Stop' },
        }}
      />
    </main>
  );
}
