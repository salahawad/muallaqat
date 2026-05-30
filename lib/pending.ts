/**
 * Classical Arabic verse, biographies, and contexts on this site are sacred and
 * must be verbatim-verified before they reach a reader. Until a verification
 * pass supplies the real text, content fields carry this literal sentinel.
 */
export const PENDING = '__PENDING_VERIFICATION__';

/** True when a value is the verification sentinel (or absent). */
export function isPending(value: string | undefined | null): boolean {
  return value == null || value === PENDING;
}

/** Returns the value if verified, otherwise `undefined` — so sentinels never render. */
export function verified(value: string | undefined | null): string | undefined {
  return isPending(value) ? undefined : (value as string);
}
