import { Page, Locator, expect } from '@playwright/test'
import { getCurrentTimeFormated } from '../../utils/data-helpers'
import { BasePage } from '../BasePage'

export class CalendarPage extends BasePage {
  readonly startButton: Locator

  constructor(page: Page) {
    super(page)
    this.startButton = page.locator(
      'button:has-text("Start compliance training")'
    )
  }

  async selectAvailableSlot(number) {
    // const testElement =
    //await this.page.$eval('text=18:45 - 19:45', (el) => el)

    await this.page.locator('.//*[@cursor="pointer"]').click()

    await this.page.pause()
    // await this.page
    //   .locator('div>[cursor="pointer"]>>nth=1')
    //   .click({ delay: 100 })
  }

  async openProvideTimesFromEmail(data) {
    const newPage = await this.page.context().newPage()
    await newPage.goto(
      await this.mailClient.getBookingLinkFromRequestTimesEmail(data)
    )
  }
}
