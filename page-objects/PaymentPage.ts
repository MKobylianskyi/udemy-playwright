import { expect, Locator, Page } from '@playwright/test'

export class PaymentPage {
  readonly page: Page
  readonly payeeSelectbox: Locator
  readonly payeeDetailButton: Locator
  readonly payeeDetail: Locator
  readonly accountSelectbox: Locator
  readonly amountInput: Locator
  readonly dateInput: Locator
  readonly descriptionInput: Locator
  readonly submitPaymentButton: Locator
  readonly message: Locator

  constructor(page: Page) {
    this.page = page
    this.payeeSelectbox = page.locator('#sp_payee')
    this.payeeDetailButton = page.locator('#sp_get_payee_details')
    this.payeeDetail = page.locator('#sp_payee_details')
    this.accountSelectbox = page.locator('#sp_account')
    this.amountInput = page.locator('#sp_amount')
    this.dateInput = page.locator('#sp_date')
    this.descriptionInput = page.locator('#sp_description')
    this.submitPaymentButton = page.locator('#pay_saved_payees')
    this.message = page.locator('#alert_content > span')
  }

  async createPayment(
    payeeoption: string,
    accountoption: string,
    amount: string,
    date: string,
    decsription: string
  ) {
    await this.payeeSelectbox.selectOption(payeeoption)
    await this.payeeDetailButton.click()
    await expect(this.payeeDetail).toBeVisible()
    await this.accountSelectbox.selectOption(accountoption)
    await this.amountInput.type(amount)
    await this.dateInput.type(date)
    await this.descriptionInput.type(decsription)
    await this.submitPaymentButton.click()
  }

  async assertSuccessMessage() {
    await expect(this.message).toBeVisible()
    await expect(this.message).toContainText(
      'The payment was successfully submitted'
    )
  }
}
