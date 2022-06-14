import { Page, Locator, expect } from '@playwright/test'
import { getCurrentDay, getCurrentTimeFormated } from '../../utils/data-helpers'
import { BasePage } from '../BasePage'

export class ExpertsPage extends BasePage {
  readonly te1st: Locator
  readonly expertSearchinput: Locator
  readonly addToShortlistButton: Locator
  readonly callScheduledTitle: Locator
  readonly editExpertButton: Locator
  readonly scheduleCallButton: Locator
  readonly createCallButton: Locator
  readonly setTimeButton: Locator
  readonly provideAvailabilityButton: Locator
  readonly requestAvailabilityButton: Locator
  readonly callDateInput: Locator
  readonly rateInput: Locator

  constructor(page: Page) {
    super(page)
    this.addToShortlistButton = page.locator(
      'button:has-text("Add to shortlist")'
    )
    this.expertSearchinput = page.locator(
      '[placeholder="Filter by name, keyword or company"]'
    )
    this.callScheduledTitle = page.locator('button:has-text("Call scheduled")')
    this.rateInput = page.locator('[placeholder="Rate"]')
    this.editExpertButton = page.locator('button:has-text("Edit profile")')
    this.scheduleCallButton = page.locator('button:has-text("Schedule a call")')
    this.createCallButton = page.locator('button:has-text("Create call")')
    this.setTimeButton = page.locator(
      'button:has-text("Set time for a call with your expert")'
    )
    this.provideAvailabilityButton = page.locator(
      'button:has-text("Provide availability")'
    )
    this.requestAvailabilityButton = page.locator(
      'button:has-text("Request availability")'
    )
    this.callDateInput = page.locator('[placeholder="Pick date"]')
  }

  async searchForExpert(data) {
    await this.expertSearchinput.type(data.firstName + ' ' + data.lastName)
  }

  async asserExpertInProejct(data) {
    await this.searchForExpert(data)
    await expect(this.addToShortlistButton).toBeVisible()
  }

  async openExpertTab(url, projectId) {
    await this.page.goto(url + '/client/projects/' + projectId + '/experts')
  }
  async bookCallOnSetTimeForm() {
    await this.createCallButton.click()
  }
  async assertTitleCallScheduled() {
    await expect(this.callScheduledTitle).toBeVisible()
  }
  async assertRateOnSetTimeFrom(rate) {
    await expect(this.rateInput).toHaveValue(rate)
  }

  async openExpertSchedulingPanel() {
    await this.scheduleCallButton.click()
    await expect(
      this.page.locator(
        'text=Selected. Please use the panel on the left to request an expert.'
      )
    ).toBeVisible()
  }
  async openEditExpertForm() {
    this.editExpertButton.click()
  }

  async openSetTimeModal() {
    await this.setTimeButton.click()
  }

  async requestAvailabilityClick() {
    await this.requestAvailabilityButton.click()
  }
  async provideSetTimeSchedulingDetails(callDuration) {
    let currentDate = getCurrentDay()
    let currentTime = getCurrentTimeFormated(1)
    await this.selectCallDate(currentDate)
    await this.selectorPickOptionByName('Call time (GMT+3)', currentTime)
    await this.selectorPickOptionByName('Call duration', callDuration)
  }
}
