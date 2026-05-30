import Link from 'next/link';

/**
 * An in-voice 404 — "this verse is lost." Rendered inside the [locale] segment,
 * so it inherits the RTL layout and fonts. Kept locale-agnostic (bilingual) since
 * a not-found may be hit before a locale is resolved.
 */
export default function NotFound() {
  return (
    <main className="lost paper-grain">
      <div className="lost__glow" aria-hidden="true" />
      <p className="lost__num font-kufi">٤٠٤</p>
      <h1 className="lost__title font-display" lang="ar" dir="rtl">
        ضاعَ هذا البيت
      </h1>
      <p className="lost__lead font-ui" lang="ar" dir="rtl">
        كأنّ الصفحة التي تبحث عنها أطلالٌ دارسة — لا أثر لها بين القصائد.
      </p>
      <p className="lost__lead-en font-ui">
        This verse is lost — the page you sought has faded like ruined campsites.
      </p>
      <div className="lost__links">
        <Link className="lost__link font-kufi" href="/ar/diwan">الديوان ←</Link>
        <Link className="lost__link lost__link--muted font-kufi" href="/en/diwan">The Diwan →</Link>
      </div>
    </main>
  );
}
