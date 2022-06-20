import { test } from '@playwright/test'
import { ByoePage } from '../../page-objects/project-pages/ByoePage'
import { LoginPage } from '../../page-objects/LoginPage'
import { ExpertsPage } from '../../page-objects/project-pages/ExpertsPage'
import { generateRandomDataBYOE } from '../../utils/data-factory'
import TestRail from '@dlenroc/testrail'

type Input = {
  uniqueId: string
  firstName: string
  lastName: string
  jobTitle: string
  companyName: string
  phoneNumber: string
  rate: string
  tags: string[]
  country: string
  timeZone: string
  email: string
  sourceOption: string
  currencyOptionIndex: number
  angleOptionIndex: number
  linkedinURl: string
}

test.describe('BYOE Adding feature', () => {
  let coveredCasesIDs
  let byoeData: Input
  let byoePage: ByoePage
  let loginPage: LoginPage
  let expertsPage: ExpertsPage
  const fs = require('fs')
  let rawdata = fs.readFileSync('test-data/mandatory-fields-list.json')
  const mandatoryFields = JSON.parse(rawdata)
  rawdata = fs.readFileSync('test-data/env-data.json')
  const ENV = JSON.parse(rawdata)
  const api = new TestRail({
    host: 'https://prosapient.testrail.net',
    username: ENV.testRailEmail,
    password: ENV.testRailPassword,
  })

  rawdata = fs.readFileSync('test-data/test-run.json')
  let testRun = JSON.parse(rawdata)

  test.beforeEach(async ({ page }) => {
    byoeData = generateRandomDataBYOE(0)
    await page.goto(ENV.URL)
    loginPage = new LoginPage(page)
    byoePage = new ByoePage(page)
    expertsPage = new ExpertsPage(page)
    await loginPage.fillLoginForm(ENV.email, ENV.password)
    await loginPage.submitCredentials()
    await loginPage.loginAsUser(ENV.URL, ENV.client_user_ID)
    await expertsPage.openExpertTab(ENV.URL, ENV.project1_ID)
  })

  test.afterEach(async ({ page }, testInfo) => {
    let status
    switch (testInfo.status) {
      case 'passed':
        status = 1
        break
      case 'skipped':
        status = 4
        break
      default:
        status = 5
        break
    }
    for (var caseID of coveredCasesIDs)
      await api.addResultForCase(testRun.id, caseID, { status_id: status })
  })

  test('Adding w/o Scheduling call', async ({ page }, testInfo) => {
    coveredCasesIDs = [14013, 14023, 17851, 18289]
    await byoePage.assertExpertTabDisplayed()
    await byoePage.navigateToByoeForm()
    await byoePage.fillEmailInputWithUniqueEmail(byoeData)
    await byoePage.fillForm(byoeData)
    await byoePage.submitFormWithContinueButton()
    await byoePage.agreeOnAgreement()
    await expertsPage.asserExpertInProejct(byoeData)
  })

  test('Autocomplete during adding', async ({ page }, testInfo) => {
    coveredCasesIDs = [14037]
    await byoePage.assertExpertTabDisplayed()
    await byoePage.navigateToByoeForm()
    await byoePage.fillEmailInputWithUniqueEmail(byoeData)
    await byoePage.fillForm(byoeData)
    await byoePage.submitFormWithContinueButton()
    await byoePage.agreeOnAgreement()
    await expertsPage.asserExpertInProejct(byoeData)
    await expertsPage.openExpertTab(ENV.URL, ENV.project2_ID)
    await byoePage.assertExpertTabDisplayed()
    await byoePage.navigateToByoeForm()
    await byoePage.fillEmailInputWithUniqueEmail(byoeData)
    await byoePage.assertEmailAddressWarning()
    await byoePage.assertAutocompleteFormValues(byoeData)
  })

  test('Adding existed expert with updating info', async ({
    page,
  }, testInfo) => {
    coveredCasesIDs = [14037, 14038, 14039]
    await byoePage.assertExpertTabDisplayed()
    await byoePage.navigateToByoeForm()
    await byoePage.fillEmailInputWithUniqueEmail(byoeData)
    await byoePage.fillForm(byoeData)
    await byoePage.submitFormWithContinueButton()
    await byoePage.agreeOnAgreement()
    await expertsPage.asserExpertInProejct(byoeData)
    await expertsPage.openExpertTab(ENV.URL, ENV.project2_ID)
    await byoePage.assertExpertTabDisplayed()
    await byoePage.navigateToByoeForm()
    await byoePage.fillEmailInputWithUniqueEmail(byoeData)
    await byoePage.assertEmailAddressWarning()
    await byoePage.assertAutocompleteFormValues(byoeData)
    byoeData = generateRandomDataBYOE(1)
    await byoePage.fillForm(byoeData)
    await byoePage.submitFormWithContinueButton()
    await byoePage.agreeOnAgreement()
    await expertsPage.asserExpertInProejct(byoeData)
  })

  test('Checking Expert mandatory fields', async ({ page }, testInfo) => {
    coveredCasesIDs = [14013, 14034]
    await byoePage.assertExpertTabDisplayed()
    await byoePage.navigateToByoeForm()
    await byoePage.assertAddingFormUnavailable()
    await byoePage.fillEmailInputWithUniqueEmail(byoeData)
    await byoePage.assertBYOEFormAvailable()
    await byoePage.submitFormWithContinueButton()
    await byoePage.submitFormWithContinueButton()
    await byoePage.assertErrorMessageForFields(
      mandatoryFields,
      `can't be blank`
    )
    await byoePage.clearBYOEEmailField()
    await byoePage.fillEmailInputWithUniqueEmail(byoeData)
    await byoePage.fillForm(byoeData)
    await byoePage.submitFormWithContinueButton()
    await byoePage.agreeOnAgreement()
    await expertsPage.asserExpertInProejct(byoeData)
  })

  test('Checking Call mandatory fields', async ({ page }, testInfo) => {
    coveredCasesIDs = [15761]
    await byoePage.assertExpertTabDisplayed()
    await byoePage.navigateToByoeForm()
    await byoePage.fillEmailInputWithUniqueEmail(byoeData)
    await byoePage.fillForm(byoeData)
    await byoePage.enableCallScheduleFields()
    await byoePage.submitFormWithContinueButton()
    await byoePage.assertErrorMessageForFields(
      ['Call date', 'Call time (GMT+3)', 'Call duration'],
      `can't be blank`
    )
  })

  test('Adding expert + Scheduling call', async ({ page }, testInfo) => {
    coveredCasesIDs = [15761]
    await byoePage.assertExpertTabDisplayed()
    await byoePage.navigateToByoeForm()
    await byoePage.fillEmailInputWithUniqueEmail(byoeData)
    await byoePage.fillForm(byoeData)
    await byoePage.provideSchedulingDetails('45 minutes')
    await byoePage.submitFormWithContinueButton()
    await byoePage.agreeOnAgreement()
    await byoePage.assertSuccessAllert('Call was scheduled')
    await expertsPage.searchForExpert(byoeData)
    await expertsPage.assertTitleCallScheduled()
  })

  test('Adding  expert + Scheduling CONFLICT call ', async ({
    page,
  }, testInfo) => {
    coveredCasesIDs = [14318, 14084]
    await byoePage.assertExpertTabDisplayed()
    await byoePage.navigateToByoeForm()
    await byoePage.fillEmailInputWithUniqueEmail(byoeData)
    await byoePage.fillForm(byoeData)
    await byoePage.provideSchedulingDetails('45 minutes')
    await byoePage.submitFormWithContinueButton()
    await byoePage.agreeOnAgreement()
    await byoePage.assertSuccessAllert('Call was scheduled')
    byoeData = generateRandomDataBYOE(1)
    await byoePage.assertExpertTabDisplayed()
    await byoePage.navigateToByoeForm()
    await byoePage.fillEmailInputWithUniqueEmail(byoeData)
    await byoePage.fillForm(byoeData)
    await byoePage.provideSchedulingDetails('30 minutes')
    await byoePage.assertConflictCallWarning()
    await byoePage.submitFormWithContinueButton()
    await byoePage.agreeOnAgreement()
    await byoePage.assertSuccessAllert('Call was scheduled')
  })

  test('Checking Additional service info and  How it works modals', async ({
    page,
  }, testInfo) => {
    coveredCasesIDs = [14029, 14031]
    await byoePage.assertExpertTabDisplayed()
    await byoePage.navigateToByoeForm()
    await byoePage.fillEmailInputWithUniqueEmail(byoeData)
    await byoePage.openRateModal()
    await byoePage.assertRateModal()
    await byoePage.openHowItWorksModal()
    await byoePage.assertHowItWorksModal()
  })

  test('Add note on the expert after adding', async ({ page }, testInfo) => {
    coveredCasesIDs = [14041]
    await byoePage.assertExpertTabDisplayed()
    await byoePage.navigateToByoeForm()
    await byoePage.fillEmailInputWithUniqueEmail(byoeData)
    await byoePage.fillForm(byoeData)
    await byoePage.submitFormWithContinueButton()
    await byoePage.agreeOnAgreement()
    await expertsPage.asserExpertInProejct(byoeData)
    await expertsPage.addExpertNote(
      `${byoeData.lastName} works in the ${byoeData.companyName}`
    )
  })
})
