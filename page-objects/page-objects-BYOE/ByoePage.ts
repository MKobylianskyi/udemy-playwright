import { Page, Locator, expect } from '@playwright/test'
import { getCurrentDay, getCurrentTimeFormated } from '../../utils/data-helpers'
import { BasePage } from './BasePage'

export class ByoePage extends BasePage {
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
  readonly callDateInput: Locator
  readonly callScheduleToggle: Locator

  constructor(page: Page) {
    super(page)
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
    this.callDateInput = page.locator('[placeholder="Pick date"]')
    this.callScheduleToggle = page.locator(':text("Create a call")')
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
    uniqueId: number,
    obj: {
      sourceOption: string
      positionvalue: string
      companyname: string
      rate: string
      currencyOptionIndex: number
      angleOptionIndex: number
      tagname: string
      expertGeo: string
      phone: string
      timezoneName: string
      linkedinURl: string
    }
  ) {
    await this.selectorPickOptionByName('Source', obj.sourceOption)
    await this.firstnameInput.type('FirstName-BYOE-' + uniqueId)
    await this.lastnameInput.type('LastName-BYOE-' + uniqueId)
    await this.positionInput.type(obj.positionvalue)
    await this.companyInput.type(obj.companyname)
    await this.rateInput.type(obj.rate)
    await this.selectorPickOptionByIndex('Currency', obj.currencyOptionIndex)
    await this.selectorPickOptionByIndex('Angle', obj.angleOptionIndex)
    await this.addSeveralTags(obj.tagname, 4)
    await this.phoneInput.type(obj.phone)
    await this.selectorPickOptionByName('Geography (optional)', obj.expertGeo)
    await this.selectorPickOptionByName('Timezone (optional)', obj.timezoneName)
    await this.linkedinInput.type(obj.linkedinURl)
  }

  async fillEmailInput(uniqueId, emailpart: string) {
    await this.selectorPickOptionByName(
      'Email Address',
      emailpart + '+a' + uniqueId + '@gmail.com'
    )
  }

  async clearForm() {
    // await this.selectorPickOptionByName('Source', obj.sourceOption)
    // await this.firstnameInput.type('FirstName-BYOE-' + uniqueId)
    // await this.lastnameInput.type('LastName-BYOE-' + uniqueId)
    // await this.positionInput.type(obj.positionvalue)
    // await this.companyInput.type(obj.companyname)
    // await this.rateInput.type(obj.rate)
    // await this.selectorPickOptionByIndex('Currency', obj.currencyOptionIndex)
    // await this.selectorPickOptionByIndex('Angle', obj.angleOptionIndex)
    // await this.addSeveralTags(obj.tagname, 4)
    // await this.phoneInput.type(obj.phone)
    // await this.selectorPickOptionByName('Geography (optional)', obj.expertGeo)
    // await this.selectorPickOptionByName('Timezone (optional)', obj.timezoneName)
    // await this.linkedinInput.type(obj.linkedinURl)
  }

  async assertAddingFormUnavailable() {
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
        this.page.locator(':text("' + titleName + '") + div + div')
      ).toBeVisible()
      await expect(
        this.page.locator(':text("' + titleName + '") + div + div')
      ).toContainText(errorMessage)
    }
  }
  async clearBYOEEmailField() {
    await this.clearFormIcon.click()
  }

  async assertAddingFormAvailable() {
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

  async provideSchedulingDetails(callDuration) {
    let currentDate = getCurrentDay()
    let currentTime = getCurrentTimeFormated(1)
    await this.callScheduleToggle.click()
    await this.callDateInput.type(currentDate)
    await this.selectorPickOptionByName('Call time (GMT+3)', currentTime)
    await this.selectorPickOptionByName('Call duration', callDuration)
  }
}
