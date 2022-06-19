import { Page, Locator, expect } from '@playwright/test'
import { getCurrentDay, getCurrentTimeFormated } from '../../utils/data-helpers'
import { BasePage } from '../BasePage'

export class ExpertsPage extends BasePage {
  readonly te1st: Locator
  readonly addToShortlistButton: Locator
  readonly removeFromShortlistButton: Locator
  readonly rejectExpertButton: Locator
  readonly unrejectExpertButton: Locator
  readonly callScheduledTitle: Locator
  readonly editExpertButton: Locator
  readonly scheduleCallButton: Locator
  readonly createCallButton: Locator
  readonly setTimeButton: Locator
  readonly provideAvailabilityButton: Locator
  readonly requestAvailabilityButton: Locator
  readonly callDateInput: Locator
  readonly rateInput: Locator
  readonly toolBarShowAs: Locator
  readonly toolBarSearch: Locator
  readonly exitRejectedFilterButton: Locator

  constructor(page: Page) {
    super(page)
    this.addToShortlistButton = page.locator(
      'button:has-text("Add to shortlist")'
    )
    this.removeFromShortlistButton = page.locator(
      'button:has-text("Remove from shortlist")'
    )
    this.rejectExpertButton = page.locator('button:has-text("Not interested")')
    this.unrejectExpertButton = page.locator(
      'button:has-text("Move back to list")'
    )
    this.exitRejectedFilterButton = page.locator(
      '#experts-filters div:has-text("Rejected experts") >> nth=1'
    )
    this.toolBarSearch = page.locator('#experts-top-toolbar>div>>nth=1>>input')
    this.toolBarShowAs = page.locator('#experts-top-toolbar>div>> nth=0')
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
  }

  async searchForExpert(data) {
    await this.toolBarSearch.type(data.firstName + ' ' + data.lastName, {
      delay: 10,
    })
  }
  async compactListView() {
    await this.toolBarShowAs.click()
    await this.page.click('#react-select-2-option-0')
  }
  async detailedListView() {
    await this.toolBarShowAs.click()
    await this.page.click('#react-select-2-option-1')
  }

  async assertExpertInExpertsList(data, expectedPresence: boolean) {
    await this.compactListView()
    if (expectedPresence) {
      await expect(
        this.page.locator(`text=${data.jobTitle} at ${data.companyName}`)
      ).toBeVisible()
      await expect(
        this.page.locator(`text= • ${data.firstName} ${data.lastName}`)
      ).toBeVisible()
    } else {
      await expect(
        this.page.locator(`text=${data.jobTitle} at ${data.companyName}`)
      ).not.toBeVisible()
      await expect(
        this.page.locator(`text= • ${data.firstName} ${data.lastName}`)
      ).not.toBeVisible()
    }
  }

  async asserExpertInProejct(data) {
    await this.searchForExpert(data)
    await this.asserExpertCardOpened(data)
  }
  async asserExpertCardOpened(data) {
    await this.page.pause()
    await expect(
      this.page.locator(
        `h3:has-text("${data.jobTitle} at ${data.companyName}")`
      )
    ).toBeVisible()
  }

  async openExpertTab(url, projectId) {
    await this.page.goto(url + '/client/projects/' + projectId + '/experts')
  }
  async bookCallOnSetTimeForm() {
    await this.createCallButton.click()
    await this.assertSuccessAllert('Call was scheduled')
  }
  async assertTitleCallScheduled() {
    await expect(this.callScheduledTitle).toBeVisible()
  }
  async assertRateOnSetTimeFrom(rate) {
    await expect(this.rateInput).toHaveValue(rate)
  }
  async filterExpertsBy(filterName) {
    await this.clickByText(filterName)
  }

  async addToShortlist() {
    await this.addToShortlistButton.click()
    await this.assertSuccessAllert('Expert was added to shortlist.')
  }
  async rejectExpert() {
    await this.rejectExpertButton.click()
    await this.assertSuccessAllert('Expert was marked as not interested.')
  }
  async unrejectExpert() {
    await this.unrejectExpertButton.click()
    await this.assertSuccessAllert('Expert was moved back to qualified.')
  }

  async exitFromRejectedFilter() {
    await this.exitRejectedFilterButton.click()
  }
  async removeFromShortlist(data) {
    await this.searchForExpert(data)
    await this.detailedListView()
    await expect(this.removeFromShortlistButton).toHaveCount(1)
    await expect(this.removeFromShortlistButton).toBeVisible()
    await this.removeFromShortlistButton.click()
    await this.assertSuccessAllert('Expert was removed from shortlist.')
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
