import { Page, Locator, expect } from '@playwright/test'
// import { getCurrentDay, getCurrentTimeFormated } from '../../utils/data-helpers'
import { BasePage } from '../BasePage'

export class ComplianceTrainingPage extends BasePage {
  readonly startButton: Locator

  constructor(page: Page) {
    super(page)
    this.startButton = page.locator(
      'button:has-text("Start compliance training")'
    )
  }
  async navigateCTpageFromReminder(data) {
    await this.page.goto(await this.mailClient.getCTLinkFromReminderEmail(data))
    await expect(this.startButton).toBeVisible()
  }
  async navigateCTpageFromPlaceholder(data) {
    await this.page.goto(
      await this.mailClient.getCTLinkFromPlaceholderEmail(data)
    )
    await expect(this.startButton).toBeVisible()
  }

  async completeCT() {
    await this.startButton.click()
    for (let i = 0; i < 9; i++) {
      await this.clickButtonHasText('Next')
    }
    await this.clickButtonHasText('Complete Training')
    await this.assertPresenceByText('Compliance training was completed')
  }
}
