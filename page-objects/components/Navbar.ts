import { Page, Locator } from '@playwright/test'

export class Navbar {
  readonly page: Page
  readonly accountSummary: Locator
  readonly transferFunds: Locator
  readonly payBills: Locator
  readonly accountActivity: Locator
  readonly myMonayApp: Locator
  readonly onlineStatements: Locator

  constructor(page: Page) {
    this.accountSummary = page.locator('#acount_summery_tab')
    this.transferFunds = page.locator('#transfer_funds_tab')
    this.payBills = page.locator('#pay_bills_tab')
    this.accountActivity = page.locator('#acount_activity_tab')
    this.myMonayApp = page.locator('#money_app_tab')
    this.onlineStatements = page.locator('#online_statements_tab')
  }

  async clickOnTab(tabName) {
    switch (tabName) {
      case 'Account Summary':
        await this.accountSummary.click()
        break
      case 'Account Activity':
        await this.accountActivity.click()
        break
      case 'Pay Bills':
        await this.payBills.click()
        break
      case 'My Money App':
        await this.myMonayApp.click()
        break
      case 'Transfer Funds':
        await this.transferFunds.click()
        break
      case 'Online Statements':
        await this.onlineStatements.click()
        break
      default:
        throw new Error('This tab does not exist')
    }
  }
}
