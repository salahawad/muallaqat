import { test, expect } from '@playwright/test'

test.describe('about / عن المشروع', () => {
  test('Arabic /about renders the colophon sections, RTL', async ({ page }) => {
    await page.goto('/ar/about')
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl')
    await expect(page.getByTestId('about-page')).toBeVisible()
    // The four colophon section headings are present.
    await expect(page.getByRole('heading', { name: 'ما يجمعه هذا الديوان' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'في توثيق النصوص' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'أمانة النصّ والحقوق' })).toBeVisible()
    // Reaches the memorial and the journey.
    await expect(page.getByRole('link', { name: 'في ذكرى عوض شعبان' })).toBeVisible()
  })

  test('English /about renders translated colophon', async ({ page }) => {
    await page.goto('/en/about')
    await expect(page.locator('html')).toHaveAttribute('dir', 'ltr')
    await expect(page.getByRole('heading', { name: 'On verifying the texts' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Textual integrity & rights' })).toBeVisible()
  })
})
