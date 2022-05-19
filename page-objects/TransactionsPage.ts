import { Locator, expect, Page } from '@playwright/test'

export class TransactionsPage {
  readonly page: Page
  readonly filteringSelect: Locator
  readonly results: Locator
  readonly emptyList: Locator

  constructor(page: Page) {
    this.page = page
    this.filteringSelect = page.locator('#aa_accountId')
    this.emptyList = page.locator('.well')
    this.results = page.locator('tbody tr')
  }
  async filterAndCheckResult(option: string, count: number) {
    await this.filteringSelect.selectOption(option)
    switch (option) {
      case '5':
        await expect(this.emptyList).toBeVisible()
      case '6':
        await expect(this.emptyList).toBeVisible()
      default:
        await expect(this.results).toHaveCount(count)
    }
  }
}
