import { Page, Locator, expect } from '@playwright/test'
import { getCurrentDay, getCurrentTimeFormated } from '../../utils/data-helpers'
import { BasePage } from '../BasePage'

export class ExpertsPage extends BasePage {
  readonly te1st: Locator
  readonly expertSearchinput: Locator
  readonly addToShortlistButton: Locator
  readonly callScheduledTitle: Locator
  readonly editExpertButton: Locator

  constructor(page: Page) {
    super(page)
    this.addToShortlistButton = page.locator(
      'button:has-text("Add to shortlist")'
    )
    this.expertSearchinput = page.locator(
      '[placeholder="Filter by name, keyword or company"]'
    )
    this.callScheduledTitle = page.locator('button:has-text("Call scheduled")')
    this.editExpertButton = page.locator('button:has-text("Edit profile")')
  }

  async searchForExpert(expertFullName) {
    await this.expertSearchinput.type(expertFullName)
  }

  async asserExpertInProejct(expertFullName) {
    await this.searchForExpert(expertFullName)
    await expect(this.addToShortlistButton).toBeVisible()
  }

  async openExpertTab(url, projectId) {
    await this.page.goto(url + '/client/projects/' + projectId + '/experts')
  }

  async assertCallScheduled() {
    await expect(this.callScheduledTitle).toBeVisible()
  }

  async openEditExpertForm() {
    this.editExpertButton.click()
  }
}
