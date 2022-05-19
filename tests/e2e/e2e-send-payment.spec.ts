import { test, expect } from '@playwright/test'
import { HomePage } from '../../page-objects/HomePage'
import { LoginPage } from '../../page-objects/LoginPage'
import { PaymentPage } from '../../page-objects/PaymentPage'
import { Navbar } from '../../page-objects/components/Navbar'

test.describe('sendgin payments', () => {
  let homePage: HomePage
  let loginPage: LoginPage
  let paymentPage: PaymentPage
  let navbar: Navbar

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page)
    homePage = new HomePage(page)
    paymentPage = new PaymentPage(page)
    navbar = new Navbar(page)
    await homePage.visit()
    await homePage.clickOnSignIn()
    await loginPage.login('username', 'password')
    await page.goto('http://zero.webappsecurity.com/bank/pay-bills.html')
    await navbar.clickOnTab('Pay Bills')
  })

  test('Send payment', async ({ page }) => {
    await paymentPage.createPayment('apple', '6', '501', '2021-11-09', 'text')
    await paymentPage.assertSuccessMessage()
  })
})
