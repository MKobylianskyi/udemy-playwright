import { test, expect } from '@playwright/test'
import { HomePage } from '../../page-objects/HomePage'
import { LoginPage } from '../../page-objects/LoginPage'
import { TransferPage } from '../../page-objects/TransferPage'

test.describe('transfer Found Suite', () => {
  let homePage: HomePage
  let loginPage: LoginPage
  let transferPage: TransferPage

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page)
    homePage = new HomePage(page)
    transferPage = new TransferPage(page)
    await homePage.visitHomePage()
    await homePage.clickOnSignIn()
    await loginPage.login('username', 'password')
    await page.goto('http://zero.webappsecurity.com/bank/transfer-funds.html')
  })
  test('test for transfer', async ({ page }) => {
    await transferPage.fillForm('2', '3', '255', 'test')
    await transferPage.submitForm()
    await transferPage.assertVerityTitle()
    await transferPage.submitForm()
    await transferPage.assertTransaction()
  })
})
