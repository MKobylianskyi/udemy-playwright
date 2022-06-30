import { Page, Locator, expect } from '@playwright/test'
import {
  getCurrentDay,
  getCurrentTimeFormated,
} from '../../../utils/data-helpers'
import { BasePage } from '../../BasePage'

export class CallsPage extends BasePage {
  readonly searchInput: Locator

  constructor(page: Page) {
    super(page)
    this.searchInput = page.locator(
      '[placeholder="Filter by expert name, angle, geography"]'
    )
  }
  async openCallsTab(url, projectId) {
    await this.page.goto(url + '/client/projects/' + projectId + '/calls')
  }
  async searchExpertCall(data) {
    await this.clearField(this.searchInput)
    await this.searchInput.type(data.firstName + ' ' + data.lastName, {
      delay: 10,
    })
  }

  async assertCallPresence(data) {
    await this.assertPresenceByText(`${data.firstName} ${data.lastName}`)
    await this.assertPresenceByText(`${data.jobTitle} at ${data.companyName}`)
    await this.assertPresenceByText(data.country)
    //add checking call date
    //add checking call duration
  }
}