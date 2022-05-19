import { test, expect } from '@playwright/test'
import { LoginPage } from '../../page-objects/LoginPage'
import { HomePage } from '../../page-objects/HomePage'

test.describe.parallel('Login and Logout Flow', () => {
  let loginPage: LoginPage
  let homePage: HomePage

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page)
    homePage = new HomePage(page)
    homePage.visitHomePage()
    homePage.clickOnSignIn()
  })
  test('Negative Case for login', async ({ page }) => {
    await loginPage.login('invalid login', 'invalid password')
    await loginPage.assertErrorMEssage('Login and/or password are wrong. ')
  })
  test('Possitive Case for login', async ({ page }) => {
    await loginPage.login('username', 'password')
    await page.goto('http://zero.webappsecurity.com/bank/transfer-funds.html')
    const accountSummaryTab = await page.locator('#account_summary_tab')
    await expect(accountSummaryTab).toBeVisible({ timeout: 2000 })
  })
})
