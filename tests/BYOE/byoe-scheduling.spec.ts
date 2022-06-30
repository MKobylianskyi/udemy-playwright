import { expect, test } from '@playwright/test'
import { ByoePage } from '../../page-objects/project-pages/BYOePage'
import { CallsPage } from '../../page-objects/project-pages/ProjectCallsPage'
import { LoginPage } from '../../page-objects/LoginPage'
import { CallPage } from '../../page-objects/calls-pages/CallPage'
import { ExpertsPage } from '../../page-objects/project-pages/ProjectExpertsPage'
import { generateRandomDataBYOE } from '../../utils/data-factory'
import { sendTestStatusAPI } from '../../utils/data-testrails'
import { faker } from '@faker-js/faker'

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
  currency: string
  angleOptionIndex: number
  linkedinURl: string
}

test.describe.parallel('Scheduling', () => {
  let byoeData: Input
  let byoePage: ByoePage
  let callPage: CallPage
  let callsPage: CallsPage
  let loginPage: LoginPage
  let expertsPage: ExpertsPage
  const mandatoryFields = require('../../test-data/mandatory-fields-list.json')
  const ENV = require('../../test-data/env-data.json')

  test.beforeEach(async ({ page }) => {
    byoeData = generateRandomDataBYOE(1)
    await page.goto(ENV.URL)
    loginPage = new LoginPage(page)
    byoePage = new ByoePage(page)
    callsPage = new CallsPage(page)
    callPage = new CallPage(page)
    expertsPage = new ExpertsPage(page)
    await loginPage.fillLoginForm(ENV.email, ENV.password)
    await loginPage.submitCredentials()
    await loginPage.loginAsUser(ENV.URL, ENV.clientFullMode.client_user_ID)
    await expertsPage.openExpertTab(ENV.URL, ENV.clientFullMode.project1_ID)
  })

  test.afterEach(async ({ page }, testInfo) => {
    sendTestStatusAPI(testInfo)
  })

  test('Check that client is able to schedule a call with BYOE via Set time', async ({
    page,
  }, testInfo) => {
    await byoePage.assertExpertTabDisplayed()
    await byoePage.navigateToByoeForm()
    await byoePage.fillEmailInputWithUniqueEmail(byoeData)
    await byoePage.fillForm(byoeData)
    await byoePage.submitFormWithContinueButton()
    await byoePage.agreeOnAgreement()
    await expertsPage.asserExpertInProejct(byoeData)
    await expertsPage.openExpertSchedulingPanel()
    await expertsPage.openSetTimeModal()
    await expertsPage.provideSetTimeSchedulingDetails('30 minutes')
    await expertsPage.assertRateOnSetTimeFrom(byoeData.rate)
    await expertsPage.bookCallOnSetTimeForm()
  })

  test('Check call duration options on add BYOE modal', async ({
    page,
  }, testInfo) => {
    await byoePage.assertExpertTabDisplayed()
    await byoePage.navigateToByoeForm()
    await byoePage.fillEmailInputWithUniqueEmail(byoeData)
    await byoePage.fillForm(byoeData)
    await byoePage.enableCallScheduleFields()
    await byoePage.assertCallDurrationOptions()
  })

  test('Check duration options on Set Call modal for BYOE', async ({
    page,
  }, testInfo) => {
    await byoePage.assertExpertTabDisplayed()
    await byoePage.navigateToByoeForm()
    await byoePage.fillEmailInputWithUniqueEmail(byoeData)
    await byoePage.fillForm(byoeData)
    await byoePage.submitFormWithContinueButton()
    await byoePage.agreeOnAgreement()
    await expertsPage.asserExpertInProejct(byoeData)
    await expertsPage.openExpertSchedulingPanel()
    await expertsPage.openSetTimeModal()
    await byoePage.assertCallDurrationOptions()
  })

  test('Check expert status after scheduling (Call Scheduled)', async ({
    page,
  }, testInfo) => {
    await byoePage.assertExpertTabDisplayed()
    await byoePage.navigateToByoeForm()
    await byoePage.fillEmailInputWithUniqueEmail(byoeData)
    await byoePage.fillForm(byoeData)
    await byoePage.submitFormWithContinueButton()
    await byoePage.agreeOnAgreement()
    await expertsPage.asserExpertInProejct(byoeData)
    await expertsPage.openExpertSchedulingPanel()
    await expertsPage.openSetTimeModal()
    await expertsPage.provideSetTimeSchedulingDetails('30 minutes')
    await expertsPage.assertRateOnSetTimeFrom(byoeData.rate)
    await expertsPage.bookCallOnSetTimeForm()
    await expertsPage.searchForExpert(byoeData)
    await expertsPage.assertTitleCallScheduled()
  })

  test('Check that message about conflict call present during Set Time scheduling', async ({
    page,
  }, testInfo) => {
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
    await byoePage.submitFormWithContinueButton()
    await byoePage.agreeOnAgreement()
    await expertsPage.asserExpertInProejct(byoeData)
    await expertsPage.openExpertSchedulingPanel()
    await expertsPage.openSetTimeModal()
    await expertsPage.provideSetTimeSchedulingDetails('30 minutes')
    await expertsPage.assertRateOnSetTimeFrom(byoeData.rate)
    await expertsPage.assertConflictCallWarning()
    await expertsPage.bookCallOnSetTimeForm()
  })

  test('Check Create a call with expert form', async ({ page }, testInfo) => {
    await byoePage.assertExpertTabDisplayed()
    await byoePage.navigateToByoeForm()
    await byoePage.fillEmailInputWithUniqueEmail(byoeData)
    await byoePage.fillForm(byoeData)
    await byoePage.submitFormWithContinueButton()
    await byoePage.agreeOnAgreement()
    await expertsPage.asserExpertInProejct(byoeData)
    await expertsPage.openExpertSchedulingPanel()
    await expertsPage.openSetTimeModal()
    await expertsPage.assertSetTimeModal(byoeData)
    await expertsPage.provideSetTimeSchedulingDetails('30 minutes')
    await expertsPage.bookCallOnSetTimeForm()
    await expertsPage.searchForExpert(byoeData)
    await expertsPage.assertTitleCallScheduled()
  })

  test('Check call on expert card after scheduling (‘Call sheduled: Month, date. time’)', async ({
    page,
  }, testInfo) => {
    await byoePage.assertExpertTabDisplayed()
    await byoePage.navigateToByoeForm()
    await byoePage.fillEmailInputWithUniqueEmail(byoeData)
    await byoePage.fillForm(byoeData)
    await byoePage.submitFormWithContinueButton()
    await byoePage.agreeOnAgreement()
    await expertsPage.asserExpertInProejct(byoeData)
    await expertsPage.openExpertSchedulingPanel()
    await expertsPage.openSetTimeModal()
    await expertsPage.provideSetTimeSchedulingDetails('30 minutes')
    await expertsPage.assertRateOnSetTimeFrom(byoeData.rate)
    await expertsPage.bookCallOnSetTimeForm()
    await expertsPage.searchForExpert(byoeData)
    await expertsPage.assertTitleCallScheduled()
  })

  test('Check expert status after scheduling (Scheduled)', async ({
    page,
  }, testInfo) => {
    await byoePage.assertExpertTabDisplayed()
    await byoePage.navigateToByoeForm()
    await byoePage.fillEmailInputWithUniqueEmail(byoeData)
    await byoePage.fillForm(byoeData)
    await byoePage.submitFormWithContinueButton()
    await byoePage.agreeOnAgreement()
    await expertsPage.asserExpertInProejct(byoeData)
    await expertsPage.openExpertSchedulingPanel()
    await expertsPage.openSetTimeModal()
    await expertsPage.provideSetTimeSchedulingDetails('30 minutes')
    await expertsPage.assertRateOnSetTimeFrom(byoeData.rate)
    await expertsPage.bookCallOnSetTimeForm()
    await expertsPage.compactListView()
    await expertsPage.searchForExpert(byoeData)
    await expertsPage.assertExpertStatusInList('Call scheduled')
  })

  test('Check that  Rate and Currency is updated for the expert profile on the project level if change it on Set Time modal', async ({
    page,
  }, testInfo) => {
    await byoePage.assertExpertTabDisplayed()
    await byoePage.navigateToByoeForm()
    await byoePage.fillEmailInputWithUniqueEmail(byoeData)
    await byoePage.fillForm(byoeData)
    await byoePage.submitFormWithContinueButton()
    await byoePage.agreeOnAgreement()
    await expertsPage.asserExpertInProejct(byoeData)
    await expertsPage.openExpertSchedulingPanel()
    await expertsPage.openSetTimeModal()
    await expertsPage.provideSetTimeSchedulingDetails('30 minutes')
    await expertsPage.assertRateOnSetTimeFrom(byoeData.rate)
    byoeData.rate = faker.finance.amount(0, 1000, 0)
    await expertsPage.fillInputByPlaceholder('Rate', byoeData.rate)
    await expertsPage.bookCallOnSetTimeForm()
    await expertsPage.compactListView()
    await expertsPage.searchForExpert(byoeData)
    await expertsPage.assertExpertStatusInList('Call scheduled')
    await expertsPage.openExpertTab(ENV.URL, ENV.clientFullMode.project2_ID)
    await byoePage.assertExpertTabDisplayed()
    await byoePage.navigateToByoeForm()
    await byoePage.fillEmailInputWithUniqueEmail(byoeData)
    await byoePage.assertEmailAddressWarning()
    await byoePage.assertAutocompleteFormValues(byoeData)
  })

  test('Check scheduled call on the call tab', async ({ page }, testInfo) => {
    await byoePage.assertExpertTabDisplayed()
    await byoePage.navigateToByoeForm()
    await byoePage.fillEmailInputWithUniqueEmail(byoeData)
    await byoePage.fillForm(byoeData)
    await byoePage.submitFormWithContinueButton()
    await byoePage.agreeOnAgreement()
    await expertsPage.asserExpertInProejct(byoeData)
    await expertsPage.openExpertSchedulingPanel()
    await expertsPage.openSetTimeModal()
    // const callDateTime =
    await expertsPage.provideSetTimeSchedulingDetails('30 minutes')
    await expertsPage.assertRateOnSetTimeFrom(byoeData.rate)
    await expertsPage.bookCallOnSetTimeForm()
    await callsPage.openCallsTab(ENV.URL, ENV.clientFullMode.project1_ID)
    await callsPage.searchExpertCall(byoeData)
    await callsPage.assertCallPresence(byoeData)
    // console.log(callDateTime)
  })

  test('Check that call Data (time, duration, expert details) correct on the Call page', async ({
    page,
  }, testInfo) => {
    await byoePage.assertExpertTabDisplayed()
    await byoePage.navigateToByoeForm()
    await byoePage.fillEmailInputWithUniqueEmail(byoeData)
    await byoePage.fillForm(byoeData)
    await byoePage.submitFormWithContinueButton()
    await byoePage.agreeOnAgreement()
    await expertsPage.asserExpertInProejct(byoeData)
    await expertsPage.openExpertSchedulingPanel()
    await expertsPage.openSetTimeModal()
    await expertsPage.provideSetTimeSchedulingDetails('30 minutes')
    await expertsPage.assertRateOnSetTimeFrom(byoeData.rate)
    await expertsPage.bookCallOnSetTimeForm()
    await expertsPage.asserExpertCardOpened(byoeData)
    await expertsPage.clickButtonHasText('Call scheduled:')
    await expertsPage.assertPrecenceOnPage(ENV.URL, '/client/calls/')
    await callPage.assertExpertCardDetails(byoeData)
    await callPage.assertCallDetails(byoeData)
  })
})

// import { expect, test } from '@playwright/test'
// import { ByoePage } from '../../page-objects/project-pages/BYOePage'
// import { LoginPage } from '../../page-objects/LoginPage'
// import { ExpertsPage } from '../../page-objects/project-pages/ProjectExpertsPage'
// import { generateRandomDataBYOE } from '../../utils/data-factory'
// import { getEmailLink, getEmail } from '../../utils/mailosour-manager'
// import { sendTestStatusAPI } from '../../utils/data-testrails'

// test.describe.parallel('login', () => {
//   let loginPage: LoginPage
//   const ENV = require('../../test-data/env-data.json')

//   test.beforeEach(async ({ page }) => {
//     await page.goto(ENV.URL)
//     loginPage = new LoginPage(page)
//   })

//   test.afterEach(async ({ page }, testInfo) => {
//     sendTestStatusAPI(testInfo)
//   })

//   test.only('reset test', async ({ page }, testInfo) => {
//     const userEmail = 'mykhailo@ccjat8kv.mailosaur.net'
//     await loginPage.clickByText('Reset My Password')
//     await loginPage.fillInputByPlaceholder('Enter here', userEmail)
//     await loginPage.clickByText('Send Instructions')
//     const email = await getEmail(userEmail)
//     const resetLink = await getEmailLink(userEmail, 1)

//     console.log(resetLink)
//     await expect(email.subject).toEqual(
//       '[STAGING] proSapient password recovery'
//     )
//     await page.goto(resetLink)
//     await page.pause()
//   })
// })
