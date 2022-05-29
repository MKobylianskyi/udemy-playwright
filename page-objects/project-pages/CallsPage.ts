import { Page, Locator, expect } from '@playwright/test'
import { getCurrentDay, getCurrentTimeFormated } from '../../utils/data-helpers'
import { BasePage } from '../BasePage'

export class CallsPage extends BasePage {
  readonly te1st: Locator

  constructor(page: Page) {
    super(page)
  }
  async openCallsTab(url, projectId) {
    await this.page.goto(url + 'client/projects/' + projectId + '/calls')
  }
}
