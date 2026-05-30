import localFont from "next/font/local";

// Self-hosted .woff2 in public/fonts/. next/font/local resolves `src`
// RELATIVE TO THIS FILE (lib/fonts.ts), so walk up one level into public/.
// Each exposes a CSS variable (--font-amiri / --font-cairo /
// --font-reem-kufi) consumed by @theme in app/globals.css.

// --font-amiri — Amiri (STATIC, naskh): verse & display headings.
export const amiri = localFont({
  src: [
    { path: "../public/fonts/amiri-arabic-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/amiri-arabic-700-normal.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-amiri",
  display: "swap",
  preload: true,
  fallback: ["Scheherazade New", "Noto Naskh Arabic", "Times New Roman", "serif"],
  adjustFontFallback: "Times New Roman",
});

// --font-cairo — Cairo (VARIABLE, wght 200..1000): body / UI text.
export const cairo = localFont({
  src: "../public/fonts/cairo-arabic-wght-normal.woff2",
  weight: "200 1000",
  style: "normal",
  variable: "--font-cairo",
  display: "swap",
  preload: true,
  fallback: ["Noto Kufi Arabic", "Tahoma", "Arial", "sans-serif"],
  adjustFontFallback: "Arial",
});

// --font-reem-kufi — Reem Kufi (VARIABLE, wght 400..700): geometric kufic accents.
export const reemKufi = localFont({
  src: "../public/fonts/reem-kufi-arabic-wght-normal.woff2",
  weight: "400 700",
  style: "normal",
  variable: "--font-reem-kufi",
  display: "swap",
  preload: false, // accent-only; avoid preloading a face not on first paint
  fallback: ["Noto Kufi Arabic", "Tahoma", "Arial", "sans-serif"],
  adjustFontFallback: "Arial",
});

// All three CSS-variable classNames to spread onto <html>/<body>.
export const fontVariables = `${amiri.variable} ${cairo.variable} ${reemKufi.variable}`;
