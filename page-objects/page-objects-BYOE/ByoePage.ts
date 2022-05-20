import { Page, Locator, expect } from '@playwright/test'

export class ByoePage {
  readonly page: Page
  readonly addByoeTitle: Locator
  readonly addByoeButton: Locator
  readonly howItWorksLabel: Locator
  readonly firstnameInput: Locator
  readonly lastnameInput: Locator
  readonly positionInput: Locator
  readonly companyInput: Locator
  readonly rateInput: Locator
  readonly submitFormButton: Locator
  readonly agreementCheckbox: Locator
  readonly submitAgreementButton: Locator
  readonly phoneInput: Locator
  readonly linkedinInput: Locator
  readonly clearFormIcon: Locator

  constructor(page: Page) {
    this.page = page
    this.addByoeTitle = page.locator('text=Add your own expert')
    this.addByoeButton = page.locator('text=Add your own expert')
    this.howItWorksLabel = page.locator('button:has-text("How it works")')
    this.firstnameInput = page.locator('[name=firstName]')
    this.lastnameInput = page.locator('[name=lastName]')
    this.positionInput = page.locator('[name=position]')
    this.companyInput = page.locator('[name=company]')
    this.rateInput = page.locator('[name=rate]')
    this.submitFormButton = page.locator('button:has-text("Continue")')
    this.agreementCheckbox = page.locator(
      '//*[@class="sc-qYSYK kDbsfS"]//child::span[@class="tick"]'
    )
    this.submitAgreementButton = page.locator('button:has-text("Add Expert")')
    this.phoneInput = page.locator('[name=phone]')
    this.linkedinInput = page.locator('[label="LinkedIn URL (optional)"]')
    this.clearFormIcon = page.locator(':text("Email")+div>>svg >> nth=0')
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

  async addSeveralTags(name: string, quantity: number) {
    let i = 0
    while (i < quantity) {
      await this.selectorPickOptionByName('Expertise tags (optional)', name + i)
      i++
    }
  }

  async assertExpertTabDiplsyed() {
    await expect(this.addByoeTitle).toBeVisible()
  }
  async navigateToByoeForm() {
    await this.addByoeButton.click()
    await this.howItWorksLabel.waitFor({ timeout: 15000 })
  }

  async fillForm(
    uniqueId,
    emailpart: string,
    sourceOption: string,
    positionvalue: string,
    companyname: string,
    rate: string,
    currencyOptionIndex: number,
    angleOptionIndex: number,
    tagname: string,
    expertGeo: string,
    phone: string,
    timezoneName: string,
    linkedinURl: string
  ) {
    await this.fillEmailInput(uniqueId, emailpart)
    await this.selectorPickOptionByName('Source', sourceOption)
    await this.firstnameInput.type('FirstName-BYOE-' + uniqueId)
    await this.lastnameInput.type('LastName-BYOE-' + uniqueId)
    await this.positionInput.type(positionvalue)
    await this.companyInput.type(companyname)
    await this.rateInput.type(rate)
    await this.selectorPickOptionByIndex('Currency', currencyOptionIndex)
    await this.selectorPickOptionByIndex('Angle', angleOptionIndex)
    await this.addSeveralTags(tagname, 4)
    await this.phoneInput.type(phone)
    await this.selectorPickOptionByName('Geography (optional)', expertGeo)
    await this.selectorPickOptionByName('Timezone (optional)', timezoneName)
    await this.linkedinInput.type(linkedinURl)
  }

  async fillEmailInput(uniqueId, emailpart: string) {
    await this.selectorPickOptionByName(
      'Email Address',
      emailpart + '+a' + uniqueId + '@gmail.com'
    )
  }

  async assertAddingFormBlocked() {
    await expect(this.submitFormButton).toBeVisible()
    await expect(this.rateInput).toBeDisabled()
    await expect(this.phoneInput).toBeDisabled()
    await expect(this.companyInput).toBeDisabled()
    await expect(this.lastnameInput).toBeDisabled()
    await expect(this.firstnameInput).toBeDisabled()
    await expect(this.positionInput).toBeDisabled()
    await expect(this.linkedinInput).toBeDisabled()
  }

  async assertErrorMessageForFields(fields: string[], errorMessage: string) {
    for (const titleName of fields) {
      await expect(
        this.page.locator(':text("' + titleName + '") + div >> nth=1')
      ).toBeTruthy()
      await expect(
        this.page.locator(':text("' + titleName + '") + div + div')
      ).toContainText(errorMessage)
    }
  }
  async clearBYOEForm() {
    await this.clearFormIcon.click()
  }

  async assertErrorMessageForField(titleName: string, errorMessage: string) {
    await expect(
      this.page.locator(':text("' + titleName + '") + div >> nth=1')
    ).toBeTruthy()
    await expect(
      this.page.locator(':text("' + titleName + '") + div + div')
    ).toContainText(errorMessage)
  }
  async assertAddingFormUnblocked() {
    await expect(this.submitFormButton).toBeVisible()
    await expect(this.rateInput).toBeEnabled()
    await expect(this.phoneInput).toBeEnabled()
    await expect(this.companyInput).toBeEnabled()
    await expect(this.lastnameInput).toBeEnabled()
    await expect(this.firstnameInput).toBeEnabled()
    await expect(this.positionInput).toBeEnabled()
    await expect(this.linkedinInput).toBeEnabled()
  }

  async submitForm() {
    await this.submitFormButton.click()
  }
  async agreeOnAgreement() {
    await this.agreementCheckbox.click()
    await expect(this.submitAgreementButton).toBeVisible()
    await this.submitAgreementButton.click()
    await expect(this.submitAgreementButton).toBeVisible({ timeout: 10000 })
  }
}
