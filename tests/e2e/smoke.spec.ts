import { test, expect } from '@playwright/test'

test.describe('app boots (smoke)', () => {
  test('Arabic locale boots and renders <html dir="rtl" lang="ar">', async ({ page }) => {
    await page.goto('/ar')
    const html = page.locator('html')
    await expect(html).toHaveAttribute('dir', 'rtl')
    await expect(html).toHaveAttribute('lang', 'ar')
    // The Doorway title renders in Arabic.
    await expect(page.getByRole('heading', { name: 'مُعلّقات' })).toBeVisible()
  })

  test('English locale boots and renders <html dir="ltr" lang="en">', async ({ page }) => {
    await page.goto('/en')
    const html = page.locator('html')
    await expect(html).toHaveAttribute('dir', 'ltr')
    await expect(html).toHaveAttribute('lang', 'en')
    await expect(page.getByRole('heading', { name: 'The Living Diwan' })).toBeVisible()
  })

  test('root / redirects into the Arabic default locale', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL(/\/ar(\/|$)/)
  })
})
