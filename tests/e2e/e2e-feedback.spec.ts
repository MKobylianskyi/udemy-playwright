import { test, expect } from '@playwright/test'
import { FeedbackPage } from '../../page-objects/FeedbackPage'
import { HomePage } from '../../page-objects/HomePage'
import { LoginPage } from '../../page-objects/LoginPage'

test.describe('Feedback form', () => {
  let homePage: HomePage
  let loginPage: LoginPage
  let feedbackPage: FeedbackPage

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page)
    homePage = new HomePage(page)
    feedbackPage = new FeedbackPage(page)
    await homePage.visit()
    await homePage.clickOnSignIn()
    await loginPage.login('username', 'password')
    await page.goto('http://zero.webappsecurity.com/feedback.html')
  })
  test('ClearFeedback test', async ({ page }) => {
    await homePage.assertFeedbackPage()
    // await page.pause()
    await feedbackPage.fillForm(
      'username',
      'test@test.test',
      'Subject Test',
      'Subkect text'
    )
    await feedbackPage.resetForm()
    await feedbackPage.assertFormReset()
  })

  test('SubmitFeedback test', async ({ page }) => {
    await homePage.assertFeedbackPage()
    await feedbackPage.fillForm(
      'username',
      'test@test.test',
      'Subject Test',
      'Subkect text'
    )
    await feedbackPage.submitForm()
    await feedbackPage.assertFeedbackSubmited()
  })
})
