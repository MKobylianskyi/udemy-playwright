import { test, expect } from '@playwright/test'
import { HomePage } from '../../page-objects/HomePage'
import { LoginPage } from '../../page-objects/LoginPage'

test.describe('testing last', () => {
  let homePage: HomePage
  let loginPage: LoginPage
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page)
    homePage = new HomePage(page)
    await homePage.visit()
    await homePage.clickOnSignIn()
    await loginPage.login('username', 'password')
    await page.goto('http://zero.webappsecurity.com/bank/account-activity.html')
  })

  test('purchase', async ({ page }) => {
    await page.click('#pay_bills_tab')
    const tab = await page.locator('text=Purchase Foreign Currency')
    await expect(tab).toBeEnabled()
    await tab.click()
    await page.selectOption('#pc_currency', 'EUR')
    const textMessage = await page.locator('#sp_sell_rate')
    await expect(textMessage).toBeVisible()
    await expect(textMessage).toContainText(
      '1 euro (EUR) = 1.3862 U.S. dollar (USD)'
    )
    await page.type('#pc_amount', '1000')
    await page.click('#pc_inDollars_false')
    const textMessage2 = await page.locator('#pc_conversion_amount')
    // await expect(textMessage2).toHaveCount(0)
    await page.click('#pc_calculate_costs')
    await expect(textMessage2).toBeVisible()
    await expect(textMessage2).toContainText(
      '1000.00 euro (EUR) = 1386.20 U.S. dollar (USD)'
    )
    await page.click('#purchase_cash')
    const alert = await page.locator('#alert_container')
    await expect(alert).toBeVisible()
    await expect(alert).toContainText(
      'Foreign currency cash was successfully purchased.'
    )
  })
})
