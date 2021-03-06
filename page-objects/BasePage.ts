import { Page, Locator, expect } from '@playwright/test'
import {
  getCurrentDayForDatepicker,
  getCurrentTimeFormated,
} from '../utils/data-helpers'
import { MailClient } from '../utils/mailosaur-client-manager'

export class BasePage {
  readonly page: Page
  readonly mailClient: MailClient
  readonly successAlert: Locator
  readonly noteInput: Locator
  readonly modalWindow: Locator

  constructor(page: Page) {
    this.mailClient = new MailClient()
    this.page = page

    this.successAlert = page.locator('[type=success]')
    this.noteInput = page.locator('textarea')
    this.modalWindow = page.locator('[role="dialog"]')
  }

  async provideSetTimeSchedulingDetails(callDuration) {
    let currentDate = getCurrentDayForDatepicker()
    let currentTime = getCurrentTimeFormated(1)
    await this.selectCallDate(currentDate)
    await this.selectorPickOptionByName('Call time (GMT+3)', currentTime)
    await this.selectorPickOptionByName('Call duration', callDuration)
    return { currentDate, currentTime, callDuration }
  }
  async assertErrorMessageForFields(fields: string[], errorMessage: string) {
    for (const titleName of fields) {
      await expect(
        this.page.locator(':text("' + titleName + '") + div + div')
      ).toBeVisible()
      await expect(
        this.page.locator(':text("' + titleName + '") + div + div')
      ).toContainText(errorMessage)
    }
  }

  async assertPresenceByText(text) {
    await expect(this.page.locator(`text=${text}`)).toBeVisible()
  }

  async clickByText(text) {
    await this.page.click(`text=${text}`, { delay: 200 })
  }
  async clickButtonHasText(text) {
    await this.page.locator(`button:has-text("${text}")`).click()
  }

  async fillInputByPlaceholder(placeholder, value) {
    await this.page.locator(`[placeholder="${placeholder}"]`).fill(value)
  }
  async clickOnInputByPlaceholder(placeholder) {
    await this.page.locator(`[placeholder="${placeholder}"]`).click()
  }

  async selectorPickOptionByName(titleName: string, textValue: string) {
    await this.fillSelectorInput(titleName, textValue)
    await this.pickSelectorFirstOption()
  }

  async blurElement(element) {
    await element.evaluate((e) => e.blur())
  }
  async setAttribute(element, name, value) {
    await element.evaluate((node) => node.setAttribute(name, value))
  }

  async assertPrecenceOnPage(rout) {
    await expect(this.page).toHaveURL(new RegExp(`${rout}`))
  }

  // FIX method after adding ID to the calendar date picker
  async selectCallDate(date) {
    await this.clickOnInputByPlaceholder('Pick date')
    await this.page.click('div:nth-child(6) div:nth-child(7)')
    await this.fillInputByPlaceholder('Pick date', date)
    await this.page.click('text=Call date', { delay: 400 })
    // const element = await this.page.locator(`[placeholder="Pick date"]`)
    // await this.clickOnInputByPlaceholder('Pick date')
    // await this.page.locator('div:has(label:has-text("Call date"))').click()
    // const day = date.substring(0, 2)
    // let dayElement
    // if ((await this.page.locator(`text=${day}`).count()) > 1) {
    //   dayElement = await this.page.locator(`text=${day}>>nth=1`)
    // } else {
    //   dayElement = await this.page.locator(`text=${day}>>nth=0`)
    // }
    // await dayElement.click()
  }

  async pickSelectorFirstOption() {
    const firstOption = await this.page.locator('.select__option >> nth=0')
    await expect(firstOption).toBeVisible()
    await firstOption.click({ delay: 200 })
  }

  async fillSelectorInput(titleName, textValue) {
    const element = await this.page.locator(
      ':text("' + titleName + '") + div >> nth=0'
    )
    await element.click()
    await element.type(textValue)
  }

  async assertSelectorFieldPresence(titleName) {
    const element = await this.page.locator(
      ':text("' + titleName + '") + div >> nth=0'
    )
    await expect(element).toBeTruthy()
    await expect(element).toBeEnabled()
  }

  async assertValueInSelector(titleName, textValue) {
    const element = await this.page.locator(
      ':text("' + titleName + '") + div >> nth=0'
    )
    await expect(element).toContainText(textValue)
  }

  async clearField(field) {
    await field.fill('')
    await this.page.waitForTimeout(200)
  }

  async assertSuccessAllert(message) {
    await expect(this.successAlert).toBeVisible({ timeout: 10000 })
    await expect(this.successAlert).toContainText(message, { timeout: 10000 })
    await this.successAlert.waitFor({ state: 'detached' })
  }
  async selectorPickOptionByIndex(titleName: string, option: number) {
    const element = await this.page.locator(
      ':text("' + titleName + '") + div >> nth=0'
    )
    await element.click()

    const optionItem = await this.page.locator(
      '.select__option >> nth=' + (option - 1)
    )
    await expect(optionItem).toBeVisible()
    await optionItem.click({ delay: 200 })
  }

  async assertErrorMessageForField(titleName: string, errorMessage: string) {
    await expect(
      this.page.locator(':text("' + titleName + '")+ div + div')
    ).toBeTruthy()
    await expect(
      this.page.locator(':text("' + titleName + '") + div + div')
    ).toContainText(errorMessage)
  }

  async assertSelectorOptions(titleName: string, options) {
    const element = await this.page.locator(
      ':text("' + titleName + '") + div >> nth=0'
    )
    await element.click()
    let optionElement
    for (const option of options) {
      optionElement = await this.page.locator(
        '.select__option >> nth=' + options.indexOf(option)
      )
      await expect(optionElement).toContainText(option)
    }
  }

  async addScreenshotUponFailure(testInfo) {
    if (testInfo.status == 'failed') {
      const screenshot = await this.page.screenshot()
      await testInfo.attach('screenshot.png', {
        body: screenshot,
        contentType: 'image/png',
      })
    }
  }
}
