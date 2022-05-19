import { Locator, expect, Page } from '@playwright/test'

export class HomePage {
  readonly page: Page
  readonly signInButton: Locator
  readonly searchField: Locator
  readonly searchResults: Locator
  readonly titleFeedback: Locator

  constructor(page: Page) {
    this.page = page
    this.signInButton = page.locator('#signin_button')
    this.searchField = page.locator('#searchTerm')
    this.searchResults = page.locator('li > a')
    this.titleFeedback = page.locator('#feedback-title')
  }

  async assertFeedbackPage() {
    // await this.page.pause()
    await expect(this.titleFeedback).toContainText('Feedback')
  }
  async visitHomePage() {
    await this.page.goto('http://zero.webappsecurity.com/')
  }

  async visitLoginPage() {
    await this.page.goto('http://zero.webappsecurity.com/login.html')
  }

  async searchByText(text: string) {
    await this.searchField.type('bank')
    await this.page.keyboard.press('Enter')
  }

  async checkSearchResults(expectednumber: number) {
    await expect(this.searchResults).toHaveCount(expectednumber)
  }

  async clickOnSignIn() {
    await this.signInButton.click()
  }
}
