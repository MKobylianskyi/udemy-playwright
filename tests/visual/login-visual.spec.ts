import { Page, test, expect } from '@playwright/test'
import { LoginPage } from '../../page-objects/LoginPage'
import { HomePage } from '../../page-objects/HomePage'

test.describe.parallel('test vials login form', () => {
  let loginpage: LoginPage
  let homePage: HomePage
  test.beforeEach(async ({ page }) => {
    loginpage = new LoginPage(page)
    homePage = new HomePage(page)
    await homePage.visitLoginPage()
  })
  test('test login form', async ({ page }) => {
    await loginpage.snapLoginForm('login-form.png')
  })
  test('test error message', async ({ page }) => {
    await loginpage.login('username1', 'password1')
    await loginpage.snapErrorMessage('login-error.png')
  })
})
