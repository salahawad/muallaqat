import { test, expect } from '@playwright/test';

test.describe('Explore (استكشاف)', () => {
  test('Arabic /ar/explore renders the heading and at least one poem card', async ({
    page,
  }) => {
    await page.goto('/ar/explore');
    await expect(
      page.getByRole('heading', { level: 1, name: 'استكشاف الديوان' }),
    ).toBeVisible();
    // The seeded Mu'allaqa of Imru' al-Qais surfaces as a card link.
    const card = page.getByRole('article').first();
    await expect(card).toBeVisible();
    await expect(card.getByRole('link').first()).toBeVisible();
  });

  test('a card links through to a poem page', async ({ page }) => {
    await page.goto('/ar/explore');
    const poemLink = page
      .getByRole('article')
      .first()
      .getByRole('link', { name: /مُعلّقة|قصيدة/ })
      .first();
    await poemLink.click();
    await expect(page).toHaveURL(/\/ar\/poem\//);
  });

  test('an emotion chip narrows the results', async ({ page }) => {
    await page.goto('/ar/explore');
    const before = await page.getByRole('article').count();
    expect(before).toBeGreaterThan(0);

    // Pick the first emotion chip (within the "الإحساس" group) that is not "الكل".
    const group = page.getByRole('group', { name: 'الإحساس' });
    const chip = group.getByRole('button').nth(1);
    await chip.click();
    await expect(chip).toHaveAttribute('aria-pressed', 'true');

    // The live region announces a (numeric) count and cards remain articles.
    await expect(page.getByRole('status')).toBeVisible();
    const after = await page.getByRole('article').count();
    expect(after).toBeGreaterThan(0);
    expect(after).toBeLessThanOrEqual(before);
  });

  test('the English locale renders its own heading', async ({ page }) => {
    await page.goto('/en/explore');
    await expect(
      page.getByRole('heading', { level: 1, name: 'Explore the Diwan' }),
    ).toBeVisible();
  });
});
