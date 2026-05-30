import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { getEras } from '@/lib/content';

type Props = {
  params: Promise<{ locale: string }>;
};

/**
 * Placeholder for the Living Diwan journey (built in a later milestone). For now
 * it lists the five eras so the Doorway's gate leads somewhere real.
 */
export default async function DiwanPage({ params }: Props) {
  const { locale: rawLocale } = await params;
  if (!hasLocale(routing.locales, rawLocale)) notFound();
  const locale = rawLocale;
  setRequestLocale(locale);
  const isAr = locale === 'ar';
  const eras = getEras();

  return (
    <main className="diwan-stub paper-grain">
      <h1 className="diwan-stub__title font-display">
        {isAr ? 'الديوان' : 'The Diwan'}
      </h1>
      <ol className="diwan-stub__eras">
        {eras.map((era) => (
          <li key={era.id} className="diwan-stub__era font-kufi">
            {isAr ? era.nameAr : era.nameEn}
          </li>
        ))}
      </ol>
    </main>
  );
}
