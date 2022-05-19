import { Page, Locator, expect } from '@playwright/test'

export class TransferPage {
  readonly page: Page
  readonly selectFrom: Locator
  readonly selectTo: Locator
  readonly amount: Locator
  readonly description: Locator
  readonly submitButton: Locator
  readonly verifyTitle: Locator
  readonly successMessage: Locator

  constructor(page: Page) {
    this.page = page
    this.selectFrom = page.locator('#tf_fromAccountId')
    this.selectTo = page.locator('#tf_toAccountId')
    this.amount = page.locator('#tf_amount')
    this.description = page.locator('#tf_description')
    this.submitButton = page.locator('#btn_submit')
    this.verifyTitle = page.locator('h2.board-header')
    this.successMessage = page.locator('.alert.alert-success')
  }

  async fillForm(
    fromoption: string,
    tooption: string,
    amount: string,
    description: string
  ) {
    await this.selectFrom.selectOption(fromoption)
    await this.selectTo.selectOption(tooption)
    await this.amount.type(amount)
    await this.description.type(description)
  }
  async submitForm() {
    await this.submitButton.click()
  }
  async assertVerityTitle() {
    await expect(this.verifyTitle).toContainText('Verify')
  }

  async assertTransaction() {
    await expect(this.successMessage).toContainText(
      'You successfully submitted your transaction.'
    )
  }
}
