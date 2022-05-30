import { test } from '@playwright/test'
import { ByoePage } from '../../page-objects/project-pages/ByoePage'
import { LoginPage } from '../../page-objects/LoginPage'
import { ExpertsPage } from '../../page-objects/project-pages/ExpertsPage'
import { getRandomString } from '../../utils/data-helpers'
import { ProjectsPage } from '../../page-objects/ProjectsPage'

test.describe('BYOE Adding feature', () => {
  let byoePage: ByoePage
  let loginPage: LoginPage
  let expertsPage: ExpertsPage
  const fs = require('fs')
  let rawdata = fs.readFileSync('test-data/byoe-data.json')
  const byoeList = JSON.parse(rawdata)
  //Specify BYOE data set
  const BYOE = byoeList[0]
  //Specify BYOE data set
  rawdata = fs.readFileSync('test-data/mandatory-fields-list.json')
  const mandatoryFields = JSON.parse(rawdata)
  rawdata = fs.readFileSync('test-data/env-data.json')
  const envList = JSON.parse(rawdata)
  //Specify ENV
  // 0 - LEK spot | 1 - Platfrom Aggregator | 2  - Staging
  const ENV = envList[0]

  test.beforeEach(async ({ page }) => {
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
    await byoePage.fillForm(uniqueId, BYOE)
    await byoePage.submitFormWithContinueButton()
    await byoePage.agreeOnAgreement()
    await expertsPage.asserExpertInProejct(
      'FirstName-BYOE-' + uniqueId + ' LastName-BYOE-' + uniqueId
    )
  })

  test('BYOE:Autocomplete during adding', async ({ page }, testInfo) => {
    let uniqueId = await getRandomString(5)
    await byoePage.assertExpertTabDisplayed()
    await byoePage.navigateToByoeForm()
    await byoePage.fillEmailInputWithUniqueEmail(uniqueId, BYOE.emailpart)
    await byoePage.fillForm(uniqueId, BYOE)
    await byoePage.submitFormWithContinueButton()
    await byoePage.agreeOnAgreement()
    await expertsPage.asserExpertInProejct(
      'FirstName-BYOE-' + uniqueId + ' LastName-BYOE-' + uniqueId
    )
    await expertsPage.openExpertTab(ENV.URL, ENV.projectID2)
    await byoePage.assertExpertTabDisplayed()
    await byoePage.navigateToByoeForm()
    await byoePage.fillEmailInputWithUniqueEmail(uniqueId, BYOE.emailpart)
    await byoePage.assertEmailAddressWarning()
    await byoePage.assertFormValues(uniqueId, BYOE)
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
    await byoePage.fillForm(uniqueId, BYOE)
    await byoePage.submitFormWithContinueButton()
    await byoePage.agreeOnAgreement()
    await expertsPage.asserExpertInProejct(
      'FirstName-BYOE-' + uniqueId + ' LastName-BYOE-' + uniqueId
    )
  })

  test('BYOE:Checking Call mandatory fields', async ({ page }, testInfo) => {
    let uniqueId = await getRandomString(5)
    await byoePage.assertExpertTabDisplayed()
    await byoePage.navigateToByoeForm()
    await byoePage.fillEmailInputWithUniqueEmail(uniqueId, BYOE.emailpart)
    await byoePage.fillForm(uniqueId, BYOE)
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
    await byoePage.fillForm(uniqueId, BYOE)
    await byoePage.provideSchedulingDetails('45 minutes')
    await byoePage.submitFormWithContinueButton()
    await byoePage.agreeOnAgreement()
    await byoePage.assertSuccessAllert('Call was scheduled')
    await expertsPage.searchForExpert(
      'FirstName-BYOE-' + uniqueId + ' LastName-BYOE-' + uniqueId
    )
    await expertsPage.assertCallScheduled()
  })

  test('BYOE:Adding + Scheduling CONFLICT call ', async ({
    page,
  }, testInfo) => {
    let uniqueId = await getRandomString(5)
    await byoePage.assertExpertTabDisplayed()
    await byoePage.navigateToByoeForm()
    await byoePage.fillEmailInputWithUniqueEmail(uniqueId, BYOE.emailpart)
    await byoePage.fillForm(uniqueId, BYOE)
    await byoePage.provideSchedulingDetails('45 minutes')
    await byoePage.submitFormWithContinueButton()
    await byoePage.agreeOnAgreement()
    await byoePage.assertSuccessAllert('Call was scheduled')
    uniqueId = await getRandomString(5)
    await byoePage.assertExpertTabDisplayed()
    await byoePage.navigateToByoeForm()
    await byoePage.fillEmailInputWithUniqueEmail(uniqueId, BYOE.emailpart)
    await byoePage.fillForm(uniqueId, BYOE)
    await byoePage.provideSchedulingDetails('45 minutes')
    await byoePage.assertConflictCallWarning()
    await byoePage.submitFormWithContinueButton()
    await byoePage.agreeOnAgreement()
    await byoePage.assertSuccessAllert('Call was scheduled')
  })
})
