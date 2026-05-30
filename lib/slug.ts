/**
 * A small Unicode-aware slug helper. Latin text is lowercased and hyphenated;
 * non-ASCII (e.g. Arabic) is preserved so Arabic slugs stay readable.
 */
export function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/['’"]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/[^\p{L}\p{N}-]+/gu, '')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '');
}
