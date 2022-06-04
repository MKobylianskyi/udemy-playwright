import { test } from '@playwright/test'
import { ByoePage } from '../../page-objects/project-pages/ByoePage'
import { LoginPage } from '../../page-objects/LoginPage'
import { ExpertsPage } from '../../page-objects/project-pages/ExpertsPage'
import { getRandomString } from '../../utils/data-helpers'
import { generateRandomDataBYOE } from '../../utils/data-factory'

test.describe('BYOE Adding feature', () => {
  var byoeData
  let byoePage: ByoePage
  let loginPage: LoginPage
  let expertsPage: ExpertsPage
  const fs = require('fs')
  let rawdata = fs.readFileSync('test-data/byoe-data.json')
  const byoeList = JSON.parse(rawdata)
  const BYOE = byoeList[0]
  rawdata = fs.readFileSync('test-data/mandatory-fields-list.json')
  const mandatoryFields = JSON.parse(rawdata)
  rawdata = fs.readFileSync('test-data/env-data.json')
  const envList = JSON.parse(rawdata)
  //Specify ENV
  // 0 - LEK spot | 1 - Platfrom Aggregator | 2  - Staging
  const ENV = envList[2]
  //Specify ENV
  test.beforeEach(async ({ page }) => {
    byoeData = generateRandomDataBYOE()

    await page.goto(ENV.URL)
    loginPage = new LoginPage(page)
    byoePage = new ByoePage(page)
    expertsPage = new ExpertsPage(page)
    await loginPage.fillLoginForm(ENV.email, ENV.password)
    await loginPage.submitCredentials()
    await loginPage.loginAsUser(ENV.URL, ENV.clientID)
    await expertsPage.openExpertTab(ENV.URL, ENV.projectID)
  })

  test('BYOE:Adding w/o Scheduling call', async ({ page }, testInfo) => {
    let uniqueId = await getRandomString(5)
    await byoePage.assertExpertTabDisplayed()
    await byoePage.navigateToByoeForm()
    await byoePage.fillEmailInputWithUniqueEmail(uniqueId, BYOE.emailpart)
    await byoePage.fillForm(
      byoeData.fisrtName,
      byoeData.lastName,
      byoeData.randomJobTitle,
      byoeData.companyName,
      byoeData.phoneNumber,
      byoeData.rate,
      byoeData.tag,
      byoeData.country,
      byoeData.timeZone,
      BYOE
    )
    await byoePage.submitFormWithContinueButton()
    await byoePage.agreeOnAgreement()
    await expertsPage.asserExpertInProejct(
      byoeData.fisrtName + ' ' + byoeData.lastName
    )
  })

  test('BYOE:Autocomplete during adding', async ({ page }, testInfo) => {
    let uniqueId = await getRandomString(5)
    await byoePage.assertExpertTabDisplayed()
    await byoePage.navigateToByoeForm()
    await byoePage.fillEmailInputWithUniqueEmail(uniqueId, BYOE.emailpart)
    await byoePage.fillForm(
      byoeData.fisrtName,
      byoeData.lastName,
      byoeData.randomJobTitle,
      byoeData.companyName,
      byoeData.phoneNumber,
      byoeData.rate,
      byoeData.tag,
      byoeData.country,
      byoeData.timeZone,
      BYOE
    )
    await byoePage.submitFormWithContinueButton()
    await byoePage.agreeOnAgreement()
    await expertsPage.asserExpertInProejct(
      byoeData.fisrtName + ' ' + byoeData.lastName
    )
    await expertsPage.openExpertTab(ENV.URL, ENV.projectID2)
    await byoePage.assertExpertTabDisplayed()
    await byoePage.navigateToByoeForm()
    await byoePage.fillEmailInputWithUniqueEmail(uniqueId, BYOE.emailpart)
    await byoePage.assertEmailAddressWarning()
    await byoePage.assertAutocompleteFormValues(
      byoeData.fisrtName,
      byoeData.lastName,
      byoeData.phoneNumber,
      byoeData.rate,
      byoeData.tag,
      byoeData.country,
      byoeData.timeZone,
      BYOE
    )
  })

  test('BYOE:Adding existed expert with updating info', async ({
    page,
  }, testInfo) => {
    let uniqueId = await getRandomString(5)
    await byoePage.assertExpertTabDisplayed()
    await byoePage.navigateToByoeForm()
    await byoePage.fillEmailInputWithUniqueEmail(uniqueId, BYOE.emailpart)
    await byoePage.fillForm(
      byoeData.fisrtName,
      byoeData.lastName,
      byoeData.randomJobTitle,
      byoeData.companyName,
      byoeData.phoneNumber,
      byoeData.rate,
      byoeData.tag,
      byoeData.country,
      byoeData.timeZone,
      BYOE
    )
    await byoePage.submitFormWithContinueButton()
    await byoePage.agreeOnAgreement()
    await expertsPage.asserExpertInProejct(
      byoeData.fisrtName + ' ' + byoeData.lastName
    )
    await expertsPage.openExpertTab(ENV.URL, ENV.projectID2)
    await byoePage.assertExpertTabDisplayed()
    await byoePage.navigateToByoeForm()
    await byoePage.fillEmailInputWithUniqueEmail(uniqueId, BYOE.emailpart)
    await byoePage.assertEmailAddressWarning()
    await byoePage.assertAutocompleteFormValues(
      byoeData.fisrtName,
      byoeData.lastName,
      byoeData.phoneNumber,
      byoeData.rate,
      byoeData.tag,
      byoeData.country,
      byoeData.timeZone,
      BYOE
    )
    byoeData = generateRandomDataBYOE()
    let newBYOE = byoeList[1]
    await byoePage.fillForm(
      byoeData.fisrtName,
      byoeData.lastName,
      byoeData.randomJobTitle,
      byoeData.companyName,
      byoeData.phoneNumber,
      byoeData.rate,
      byoeData.tag,
      byoeData.country,
      byoeData.timeZone,
      newBYOE
    )
    await byoePage.submitFormWithContinueButton()
    await byoePage.agreeOnAgreement()
    await expertsPage.asserExpertInProejct(
      byoeData.fisrtName + ' ' + byoeData.lastName
    )
  })

  test('BYOE:Checking Expert mandatory fields', async ({ page }, testInfo) => {
    let uniqueId = await getRandomString(5)
    await byoePage.assertExpertTabDisplayed()
    await byoePage.navigateToByoeForm()
    await byoePage.assertAddingFormUnavailable()
    await byoePage.fillEmailInputWithUniqueEmail(uniqueId, BYOE.emailpart)
    await byoePage.assertBYOEFormAvailable()
    await byoePage.submitFormWithContinueButton()
    await byoePage.submitFormWithContinueButton()
    await byoePage.assertErrorMessageForFields(
      mandatoryFields,
      `can't be blank`
    )
    await byoePage.clearBYOEEmailField()
    await byoePage.fillEmailInputWithUniqueEmail(uniqueId, BYOE.emailpart)
    await byoePage.fillForm(
      byoeData.fisrtName,
      byoeData.lastName,
      byoeData.randomJobTitle,
      byoeData.companyName,
      byoeData.phoneNumber,
      byoeData.rate,
      byoeData.tag,
      byoeData.country,
      byoeData.timeZone,
      BYOE
    )
    await byoePage.submitFormWithContinueButton()
    await byoePage.agreeOnAgreement()
    await expertsPage.asserExpertInProejct(
      byoeData.fisrtName + ' ' + byoeData.lastName
    )
  })

  test('BYOE:Checking Call mandatory fields', async ({ page }, testInfo) => {
    let uniqueId = await getRandomString(5)
    await byoePage.assertExpertTabDisplayed()
    await byoePage.navigateToByoeForm()
    await byoePage.fillEmailInputWithUniqueEmail(uniqueId, BYOE.emailpart)
    await byoePage.fillForm(
      byoeData.fisrtName,
      byoeData.lastName,
      byoeData.randomJobTitle,
      byoeData.companyName,
      byoeData.phoneNumber,
      byoeData.rate,
      byoeData.tag,
      byoeData.country,
      byoeData.timeZone,
      BYOE
    )
    await byoePage.enableCallScheduleFields()
    await byoePage.submitFormWithContinueButton()
    await byoePage.assertErrorMessageForFields(
      ['Call date', 'Call time (GMT+3)', 'Call duration'],
      `can't be blank`
    )
  })

  test('BYOE:Adding + Scheduling call', async ({ page }, testInfo) => {
    let uniqueId = await getRandomString(5)
    await byoePage.assertExpertTabDisplayed()
    await byoePage.navigateToByoeForm()
    await byoePage.fillEmailInputWithUniqueEmail(uniqueId, BYOE.emailpart)
    await byoePage.fillForm(
      byoeData.fisrtName,
      byoeData.lastName,
      byoeData.randomJobTitle,
      byoeData.companyName,
      byoeData.phoneNumber,
      byoeData.rate,
      byoeData.tag,
      byoeData.country,
      byoeData.timeZone,
      BYOE
    )
    await byoePage.provideSchedulingDetails('45 minutes')
    await byoePage.submitFormWithContinueButton()
    await byoePage.agreeOnAgreement()
    await byoePage.assertSuccessAllert('Call was scheduled')
    await expertsPage.searchForExpert(
      byoeData.fisrtName + ' ' + byoeData.lastName
    )
    await expertsPage.assertTitleCallScheduled()
  })

  test('BYOE:Adding + Scheduling CONFLICT call ', async ({
    page,
  }, testInfo) => {
    let uniqueId = await getRandomString(5)
    await byoePage.assertExpertTabDisplayed()
    await byoePage.navigateToByoeForm()
    await byoePage.fillEmailInputWithUniqueEmail(uniqueId, BYOE.emailpart)
    await byoePage.fillForm(
      byoeData.fisrtName,
      byoeData.lastName,
      byoeData.randomJobTitle,
      byoeData.companyName,
      byoeData.phoneNumber,
      byoeData.rate,
      byoeData.tag,
      byoeData.country,
      byoeData.timeZone,
      BYOE
    )
    await byoePage.provideSchedulingDetails('45 minutes')
    await byoePage.submitFormWithContinueButton()
    await byoePage.agreeOnAgreement()
    await byoePage.assertSuccessAllert('Call was scheduled')
    uniqueId = await getRandomString(5)
    await byoePage.assertExpertTabDisplayed()
    await byoePage.navigateToByoeForm()
    await byoePage.fillEmailInputWithUniqueEmail(uniqueId, BYOE.emailpart)
    await byoePage.fillForm(
      byoeData.fisrtName,
      byoeData.lastName,
      byoeData.randomJobTitle,
      byoeData.companyName,
      byoeData.phoneNumber,
      byoeData.rate,
      byoeData.tag,
      byoeData.country,
      byoeData.timeZone,
      BYOE
    )
    await byoePage.provideSchedulingDetails('45 minutes')
    await byoePage.assertConflictCallWarning()
    await byoePage.submitFormWithContinueButton()
    await byoePage.agreeOnAgreement()
    await byoePage.assertSuccessAllert('Call was scheduled')
  })
})
