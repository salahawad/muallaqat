import { test, expect } from '@playwright/test'

// Every poem and poet page must offer a way back to the Diwan, so the reader
// never reaches a dead-end after stepping through a threshold.
test.describe('return navigation', () => {
  test('a poem page leads back to the Diwan', async ({ page }) => {
    await page.goto('/ar/poem/muallaqat-imru-al-qais')
    const back = page.getByRole('link', { name: /الديوان/ })
    await expect(back).toBeVisible()
    await back.click()
    await expect(page).toHaveURL(/\/ar\/diwan$/)
    await expect(page.getByTestId('diwan')).toBeVisible()
  })

  test('a poet page leads back to the Diwan', async ({ page }) => {
    await page.goto('/ar/poet/imru-al-qais')
    const back = page.getByRole('link', { name: /الديوان/ })
    await expect(back).toBeVisible()
    await back.click()
    await expect(page).toHaveURL(/\/ar\/diwan$/)
    await expect(page.getByTestId('diwan')).toBeVisible()
  })
})
