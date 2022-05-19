import { Page, Locator, expect } from '@playwright/test'

export class FeedbackPage {
  readonly page: Page
  readonly nameInput: Locator
  readonly emailInput: Locator
  readonly subjectInput: Locator
  readonly commentInput: Locator
  readonly clearButton: Locator
  readonly submitButton: Locator
  readonly feedbackAlert: Locator

  constructor(page: Page) {
    this.page = page
    this.nameInput = page.locator('#name')
    this.emailInput = page.locator('#email')
    this.subjectInput = page.locator('#subject')
    this.commentInput = page.locator('#comment')
    this.clearButton = page.locator('[name="clear"]')
    this.submitButton = page.locator('[name="submit"]')
    this.feedbackAlert = page.locator('#feedback-title')
  }

  async fillForm(
    username: string,
    email: string,
    subject: string,
    comment: string
  ) {
    await this.nameInput.type(username)
    await this.emailInput.type(email)
    await this.subjectInput.type(subject)
    await this.commentInput.type(comment)
  }

  async resetForm() {
    await this.clearButton.click()
  }

  async submitForm() {
    await this.submitButton.click()
  }

  async assertFormReset() {
    await expect(this.nameInput).toBeEmpty()
    await expect(this.emailInput).toBeEmpty()
    await expect(this.subjectInput).toBeEmpty()
    await expect(this.commentInput).toBeEmpty()
  }

  async assertFeedbackSubmited() {
    await this.feedbackAlert.waitFor()
  }
}
