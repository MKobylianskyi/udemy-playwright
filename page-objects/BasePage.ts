import { Page, Locator, expect } from '@playwright/test'

export class BasePage {
  readonly page: Page
  readonly successAlert: Locator

  constructor(page: Page) {
    this.page = page
    this.successAlert = page.locator('[type=success]')
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

  async selectCallDate(currentDate) {
    await this.clickOnInputByPlaceholder('Pick date')
    await this.page.click('div:nth-child(6) div:nth-child(7)')
    await this.fillInputByPlaceholder('Pick date', currentDate)
    await this.page.click('text=Call date', { delay: 400 })
  }

  async pickSelectorFirstOption() {
    const firstOption = await this.page.locator('.select__option >> nth=0')
    await expect(firstOption).toBeVisible()
    await firstOption.click({ delay: 200 })
  }

  async fillSelectorInput(titleName, textValue) {
    const element = await this.page.$(
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
    await expect(this.successAlert).toBeVisible()
    await expect(this.successAlert).toContainText(message)
    await this.successAlert.waitFor({ state: 'detached' })
  }
  async selectorPickOptionByIndex(titleName: string, option: number) {
    const element = await this.page.$(
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
    const element = await this.page.$(
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
  //  FIX SELECTOR ASSSERTATION
  // async assertSelectorDisabled(titleName: string) {
  //   const element = await this.page.locator(
  //     ':text("' + titleName + '") + div >> nth=0'
  //   )
  //   await expect(element).toBeFalsy()
  // }
}
