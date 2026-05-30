import { test, expect } from '@playwright/test'

test.describe('app boots (smoke)', () => {
  test('Arabic locale boots and renders <html dir="rtl" lang="ar">', async ({ page }) => {
    await page.goto('/ar')
    const html = page.locator('html')
    await expect(html).toHaveAttribute('dir', 'rtl')
    await expect(html).toHaveAttribute('lang', 'ar')
    // The Doorway is a memorial overture: its heading is the father's name,
    // self-writing in gold (the مُعلّقات title sits above it as the kicker).
    await expect(page.getByRole('heading', { name: 'عوض شعبان' })).toBeVisible()
  })

  test('English locale boots and renders <html dir="ltr" lang="en">', async ({ page }) => {
    await page.goto('/en')
    const html = page.locator('html')
    await expect(html).toHaveAttribute('dir', 'ltr')
    await expect(html).toHaveAttribute('lang', 'en')
    await expect(page.getByRole('heading', { name: 'Awad Shaaban' })).toBeVisible()
  })

  test('root / redirects into the Arabic default locale', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL(/\/ar(\/|$)/)
  })
})
