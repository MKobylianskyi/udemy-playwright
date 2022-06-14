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
    await this.page.click(`text=${text}`)
  }

  async selectorPickOptionByName(titleName: string, textValue: string) {
    await this.fillSelectorInput(titleName, textValue)
    await this.pickSelectorFirstOption()
  }

  async selectCallDate(currentDate) {
    await this.page.locator('[placeholder="Pick date"]').click()
    await this.page.click('div:nth-child(6) div:nth-child(7)')
    await this.page.locator('[placeholder="Pick date"]').fill(currentDate)
    await this.page.click('text=Call date')
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

  async assertSelectorInput(titleName, textValue) {
    const element = await this.page.locator(
      ':text("' + titleName + '") + div >> nth=0'
    )
    await expect(element).toContainText(textValue)
  }

  async clearField(field) {
    await field.fill('')
  }

  async assertSuccessAllert(message) {
    await expect(this.successAlert).toBeVisible()
    await expect(this.successAlert).toContainText(message)
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
}
