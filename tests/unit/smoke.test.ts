import { describe, it, expect } from 'vitest';
import { routing } from '@/i18n/routing';

describe('foundation smoke test', () => {
  it('runs the vitest harness', () => {
    expect(1 + 1).toBe(2);
  });

  it('configures Arabic as the default locale', () => {
    expect(routing.defaultLocale).toBe('ar');
    expect(routing.locales).toContain('ar');
    expect(routing.locales).toContain('en');
  });
});
