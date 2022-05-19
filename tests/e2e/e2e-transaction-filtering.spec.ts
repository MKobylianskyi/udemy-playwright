import { test, expect } from '@playwright/test'
import { HomePage } from '../../page-objects/HomePage'
import { LoginPage } from '../../page-objects/LoginPage'
import { Navbar } from '../../page-objects/components/Navbar'
import { TransactionsPage } from '../../page-objects/TransactionsPage'

test.describe('Suite with filtering', () => {
  let homePage: HomePage
  let loginPage: LoginPage
  let navbar: Navbar
  let transactionsPage: TransactionsPage

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page)
    homePage = new HomePage(page)
    transactionsPage = new TransactionsPage(page)
    await homePage.visit()
    await homePage.clickOnSignIn()
    await loginPage.login('username', 'password')
    await page.goto('http://zero.webappsecurity.com/bank/account-activity.html')
    // await navbar.clickOnTab('')
  })

  test('Filtering test', async ({ page }) => {
    await transactionsPage.filterAndCheckResult('1', 3)
    await transactionsPage.filterAndCheckResult('2', 3)
    await transactionsPage.filterAndCheckResult('3', 3)
    await transactionsPage.filterAndCheckResult('4', 3)
    await transactionsPage.filterAndCheckResult('5', 0)
    await transactionsPage.filterAndCheckResult('6', 0)
  })
})
