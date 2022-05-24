import { Page, Locator, expect } from '@playwright/test'
export class BasePage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async selectorPickOptionByName(titleName: string, textValue: string) {
    const element = await this.page.$(
      ':text("' + titleName + '") + div >> nth=0'
    )
    await element.click()
    await element.type(textValue)
    const firstOption = await this.page.locator('.select__option >> nth=0')
    await expect(firstOption).toBeVisible()
    await firstOption.click({ delay: 200 })
  }

  async clearField(field) {
    await field.fill('')
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
