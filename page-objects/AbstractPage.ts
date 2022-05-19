import { Page } from '@playwright/test'

export class AbstractPage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async wait(timeout) {
    await this.page.waitForTimeout(timeout)
  }
}
