import { Page, Locator, expect } from '@playwright/test'
import { generateUniqueEmail } from '../../utils/data-factory'
import { mapCurrencyWithIndex } from '../../utils/data-helpers'
import {
  removeSpaces,
  getCurrentDay,
  getCurrentTimeFormated,
} from '../../utils/data-helpers'
import { BasePage } from '../BasePage'

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
  readonly saveFormButton: Locator
  readonly agreementCheckbox: Locator
  readonly submitAgreementButton: Locator
  readonly phoneInput: Locator
  readonly linkedinInput: Locator
  readonly clearEmailFormIcon: Locator
  readonly callDateInput: Locator
  readonly callScheduleToggle: Locator
  readonly modalDialog: Locator

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
    this.saveFormButton = page.locator('button:has-text("Save")')
    this.agreementCheckbox = page.locator(
      '//*[@class="sc-qYSYK kDbsfS"]//child::span[@class="tick"]'
    )
    this.submitAgreementButton = page.locator('button:has-text("Add Expert")')
    this.phoneInput = page.locator('[name=phone]')
    this.linkedinInput = page.locator('[label="LinkedIn URL (optional)"]')
    this.clearEmailFormIcon = page.locator(':text("Email")+div>>svg >> nth=0')
    this.callDateInput = page.locator('[placeholder="Pick date"]')
    this.callScheduleToggle = page.locator(':text("Create a call")')

    this.modalDialog = this.page.locator('div[role="dialog"]')
  }

  async addTags(tags) {
    const arrayLength = tags.length
    for (var i = 0; i < arrayLength; i++) {
      await this.selectorPickOptionByName('Expertise tags (optional)', tags[i])
    }
  }

  async assertExpertTabDisplayed() {
    await expect(
      this.page.locator('text=Please confirm to add new expert')
    ).not.toBeVisible()
    await expect(this.addByoeTitle).toBeVisible()
  }

  async navigateToByoeForm() {
    await this.addByoeButton.click()
    await this.howItWorksLabel.waitFor({ timeout: 15000 })
  }

  async assertComplainceMessage() {
    await this.assertPresenceByText(
      'Expert will be required to complete compliance training before they can join the call.'
    )
    await this.assertPresenceByText(
      'They will only get access to the call dial in details when the compliance training is completed.'
    )
  }
  async openRateModal() {
    await this.clickOnInputByPlaceholder('Rate')
    await this.assertPresenceByText('Additional service fee will be applied')
    await this.clickByText('Additional service fee will be applied')
    await this.page.click(`text=Learn more`, { delay: 300 })
    await this.modalDialog.waitFor({ state: 'attached' })
    await expect(this.modalDialog).toBeVisible()
  }
  async openHowItWorksModal() {
    await this.page.click(`button:has-text("How it works")`, { delay: 500 })
    await expect(this.modalDialog).toBeVisible()
  }

  async assertRateModal() {
    await this.assertPresenceByText(
      'How to pay for the calls with your experts?'
    )
    await this.assertPresenceByText(
      'proSapient will automatically pay the expert for your call with them. The expert will be paid pro-rata based on the hourly rate that you set for them.'
    )
    await this.assertPresenceByText(
      'proSapient will then invoice your organisation for this call. The invoice will be a sum of the expert’s fee and proSapient service fee plus any applicable taxes. The fee to proSapient for calls shorter than 30min is 50 USD; the fee for calls longer than 30min is 100 USD. The service fee is charged in the currency set in your office billing details on the proSapient platform.'
    )
    await this.page.locator('div[role="dialog"]>svg[role="img"]').click()
    await expect(this.modalDialog).not.toBeVisible()
  }
  async assertHowItWorksModal() {
    await this.assertPresenceByText(
      'Schedule calls with your own experts with no hustle!'
    )
    await this.assertPresenceByText(
      'We will pay the expert pro-rata and invoice you back that amount plus a small service fee and any applicable taxes. The fee to proSapient for calls shorter than 30min is 50 USD; the fee for calls longer than 30min is 100 USD. The service fee is charged in your preferred currency.'
    )
    await this.page.locator('div[role="dialog"]>svg[role="img"]').click()
    await expect(this.modalDialog).not.toBeVisible()
  }

  async fillForm(data) {
    await this.selectorPickOptionByName('Source', data.sourceOption)
    await this.firstnameInput.type(data.firstName)
    await this.lastnameInput.type(data.lastName)
    await this.positionInput.type(data.jobTitle)
    await this.companyInput.type(data.companyName)
    await this.phoneInput.type(data.phoneNumber)
    await this.rateInput.type(data.rate)
    await this.selectorPickOptionByIndex(
      'Currency',
      mapCurrencyWithIndex(data.currency)
    )
    await this.selectorPickOptionByIndex('Angle', data.angleOptionIndex)
    await this.addTags(data.tags)
    await this.selectorPickOptionByName('Geography (optional)', data.country)
    await this.selectorPickOptionByName('Timezone (optional)', data.timeZone)
    await this.linkedinInput.fill(data.linkedinURl)
  }

  async assertFormValues(byoeData) {
    await expect(this.firstnameInput).toHaveValue(byoeData.firstName)
    await expect(this.lastnameInput).toHaveValue(byoeData.lastName)
    await expect(this.rateInput).toHaveValue(byoeData.rate)
    await expect(this.companyInput).toHaveValue(byoeData.companyName)
    await expect(this.positionInput).toHaveValue(byoeData.jobTitle)
    const phoneNumber = await this.phoneInput.getAttribute('value')
    await expect(removeSpaces(phoneNumber)).toEqual(byoeData.phoneNumber)
    await expect(this.linkedinInput).toHaveValue(byoeData.linkedinURl)
    await this.selectorPickOptionByName('Source', byoeData.sourceOption)
    await this.assertValueInSelector('Geography (optional)', byoeData.country)
    await this.assertValueInSelector('Timezone (optional)', byoeData.timeZone)
    await this.assertValueInSelector('Currency', byoeData.currency)
    // add checking tags
  }

  async assertAutocompleteFormValues(byoeData) {
    await expect(this.firstnameInput).toHaveValue(byoeData.firstName)
    await expect(this.lastnameInput).toHaveValue(byoeData.lastName)
    await expect(this.rateInput).toHaveValue(byoeData.rate)
    let phoneNumber = await this.phoneInput.getAttribute('value')
    await expect(removeSpaces(phoneNumber)).toEqual(byoeData.phoneNumber)
    await expect(this.linkedinInput).toHaveValue(byoeData.linkedinURl)
    await this.selectorPickOptionByName('Source', byoeData.sourceOption)
    await this.assertValueInSelector('Geography (optional)', byoeData.country)
    await this.assertValueInSelector('Timezone (optional)', byoeData.timeZone)
    await this.assertValueInSelector('Currency', byoeData.currency)
    // add checking tags
  }

  async fillEmailInputWithUniqueEmail(data) {
    const uniqueEmail = generateUniqueEmail(data)
    await this.selectorPickOptionByName('Email Address', uniqueEmail)
  }

  async clearForm() {
    await this.clearField(this.firstnameInput)
    await this.clearField(this.lastnameInput)
    await this.clearField(this.positionInput)
    await this.clearField(this.companyInput)
    await this.clearField(this.rateInput)
    await this.clearField(this.phoneInput)
    await this.clearField(this.linkedinInput)
    // add clearing tags
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
    await this.clearEmailFormIcon.click()
  }

  async assertEmailAddressWarning() {
    await expect(
      this.page.locator(
        `:text("This email belongs to an existing expert. Changing name, timezone or contact information will affect the expert’s profile.")`
      )
    ).toBeVisible()
  }

  async assertBYOEFormAvailable() {
    await expect(this.rateInput).toBeEnabled()
    await expect(this.phoneInput).toBeEnabled()
    await expect(this.companyInput).toBeEnabled()
    await expect(this.lastnameInput).toBeEnabled()
    await expect(this.firstnameInput).toBeEnabled()
    await expect(this.positionInput).toBeEnabled()
    await expect(this.linkedinInput).toBeEnabled()
  }

  async submitFormWithContinueButton() {
    await this.submitFormButton.click()
  }

  async assertConflictCallWarning() {
    await this.assertPresenceByText(
      'Please note, you have another call at this timeslot'
    )
  }

  async submitFormWithSaveButton() {
    await this.saveFormButton.click()
  }
  async assertSubmitAgreementButtonEnebled(state) {
    if (state) {
      await expect(this.submitAgreementButton).not.toBeDisabled()
    } else {
      await expect(this.submitAgreementButton).toBeDisabled()
    }
  }

  async checkAggrementCheckbox() {
    await this.agreementCheckbox.click()
  }
  async agreeOnAgreement() {
    await this.checkAggrementCheckbox()
    await this.assertSubmitAgreementButtonEnebled(true)
    await this.submitAgreementButton.click()
    // await expect(this.submitAgreementButton).toBeVisible({ timeout: 10000 })
    await this.agreementCheckbox.waitFor({ state: 'detached' })
  }

  async enableCallScheduleFields() {
    await this.callScheduleToggle.click()
  }
  async provideSchedulingDetails(callDuration) {
    let currentDate = getCurrentDay()
    let currentTime = getCurrentTimeFormated(1)
    await this.enableCallScheduleFields()
    await this.selectCallDate(currentDate)
    await this.selectorPickOptionByName('Call time (GMT+3)', currentTime)
    await this.selectorPickOptionByName('Call duration', callDuration)
  }
}
