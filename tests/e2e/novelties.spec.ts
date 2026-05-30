import { test, expect } from '@playwright/test'

test.describe('المعلقات — the hanging gallery', () => {
  test('Arabic /muallaqat hangs the seven poets in RTL', async ({ page }) => {
    await page.goto('/ar/muallaqat')
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl')
    await expect(page.getByRole('heading', { name: 'المعلّقات السبع' })).toBeVisible()

    const panels = page.getByTestId('hanging-panel')
    await expect(panels).toHaveCount(7)

    // The traditional Seven are all present, each panel linking into its ode.
    // (Assert on the stable poem slugs rather than vocalized names, which carry
    // diacritics that make substring matching brittle.)
    const hrefs = await panels.evaluateAll((els) =>
      els.map((e) => e.getAttribute('href')),
    )
    expect(hrefs).toEqual(
      expect.arrayContaining([
        '/ar/poem/muallaqat-imru-al-qais',
        '/ar/poem/muallaqat-tarafa',
        '/ar/poem/muallaqat-zuhayr',
        '/ar/poem/muallaqat-labid',
        '/ar/poem/muallaqat-amr-ibn-kulthum',
        '/ar/poem/muallaqat-antara',
        '/ar/poem/muallaqat-al-harith',
      ]),
    )
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
    // Both flytings are listed, each card a tap-target into its back-and-forth.
    const cardHrefs = await cards.evaluateAll((els) =>
      els.map((e) => e.getAttribute('href')),
    )
    expect(cardHrefs).toEqual(
      expect.arrayContaining(['/ar/hija2/jarir-farazdaq', '/ar/hija2/jarir-akhtal']),
    )
  })

  test('a duel opens into its volley stepper in RTL', async ({ page }) => {
    await page.goto('/ar/hija2/jarir-farazdaq')
    await expect(page.getByTestId('duel-view')).toHaveAttribute('dir', 'rtl')
    // A flyting is a back-and-forth — at least two volleys.
    expect(await page.getByTestId('duel-volley').count()).toBeGreaterThanOrEqual(2)
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
