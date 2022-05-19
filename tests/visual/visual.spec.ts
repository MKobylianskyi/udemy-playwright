import { test, expect } from '@playwright/test'

test.describe('Visial Reggresion Example testing', () => {
  test('Fullpage snapshot', async ({ page }) => {
    await page.goto('https://www.example.com')
    expect(await page.screenshot()).toMatchSnapshot('homepage.png')
  })

  test('Element snapshot', async ({ page }) => {
    await page.goto('https://www.example.com')
    const element = page.locator('h1')
    expect(await element.screenshot()).toMatchSnapshot('element.png')
  })
})
