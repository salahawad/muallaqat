import { test, expect } from '@playwright/test'

test.describe('المعلقات — the hanging gallery', () => {
  test('Arabic /muallaqat hangs the seven poets in RTL', async ({ page }) => {
    await page.goto('/ar/muallaqat')
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl')
    await expect(page.getByRole('heading', { name: 'المعلّقات السبع' })).toBeVisible()

    const panels = page.getByTestId('hanging-panel')
    await expect(panels).toHaveCount(7)

    // The traditional Seven are all present by name.
    const names = [
      'امرؤ القيس',
      'طَرَفة بن العبد',
      'زهير بن أبي سلمى',
      'لَبيد بن ربيعة',
      'عمرو بن كلثوم',
      'عَنْتَرَة بْن شَدّاد العَبْسِيّ',
      'الحارث بن حِلِّزة اليشكري',
    ]
    for (const name of names) {
      await expect(page.getByText(name, { exact: false }).first()).toBeVisible()
    }
  })

  test('a hanging panel links into its ode', async ({ page }) => {
    await page.goto('/ar/muallaqat')
    const first = page.getByTestId('hanging-panel').first()
    await expect(first).toHaveAttribute('href', '/ar/poem/muallaqat-imru-al-qais')
  })
})

test.describe('الهجاء — the duels', () => {
  test('Arabic /hija2 lists the two flytings in RTL', async ({ page }) => {
    await page.goto('/ar/hija2')
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl')
    await expect(page.getByRole('heading', { name: 'الهجاء والنقائض' })).toBeVisible()

    const cards = page.getByTestId('duel-card')
    await expect(cards).toHaveCount(2)
    await expect(page.getByText('نقائض جرير والفرزدق')).toBeVisible()
    await expect(page.getByText('نقائض جرير والأخطل')).toBeVisible()
  })

  test('a duel opens into its volley stepper in RTL', async ({ page }) => {
    await page.goto('/ar/hija2/jarir-farazdaq')
    await expect(page.getByTestId('duel-view')).toHaveAttribute('dir', 'rtl')
    await expect(page.getByTestId('duel-volley')).toHaveCount(2)
    // The stepper advances through the volleys.
    const stage = page.getByTestId('duel-stage')
    await expect(stage).toHaveAttribute('data-revealed', '1')
    await page.getByTestId('duel-next').click()
    await expect(stage).toHaveAttribute('data-revealed', '2')
  })

  test('the sentinel never leaks into the rendered page', async ({ page }) => {
    await page.goto('/ar/hija2/jarir-farazdaq')
    await expect(page.locator('body')).not.toContainText('__PENDING_VERIFICATION__')
  })
})

test.describe('navigation reaches the showcases', () => {
  test('the Diwan links into المعلقات and الهجاء', async ({ page }) => {
    await page.goto('/ar/diwan')
    await expect(
      page.getByRole('link', { name: /المعلقات/ }).first(),
    ).toHaveAttribute('href', '/ar/muallaqat')
    await expect(
      page.getByRole('link', { name: /الهجاء/ }).first(),
    ).toHaveAttribute('href', '/ar/hija2')
  })
})
