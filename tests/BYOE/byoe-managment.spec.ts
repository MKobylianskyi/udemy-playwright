import { test } from '@playwright/test'
import { ByoePage } from '../../page-objects/client-pages/project-pages/BYOePage'
import { LoginPage } from '../../page-objects/public-pages/LoginPage'
import { CallPage } from '../../page-objects/client-pages/calls-pages/CallPage'
import { ExpertsPage } from '../../page-objects/client-pages/project-pages/ProjectExpertsPage'
import { generateRandomDataBYOE } from '../../utils/data-factory'
import { sendTestStatusAPI } from '../../utils/data-testrails'

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

test.describe.parallel('Managment', () => {
  let byoeData: Input
  let byoePage: ByoePage
  let callPage: CallPage

  let loginPage: LoginPage
  let expertsPage: ExpertsPage
  const ENV = require('../../test-data/env-data.json')

  test.beforeEach(async ({ page }) => {
    byoeData = generateRandomDataBYOE(1)
    await page.goto(ENV.URL)
    loginPage = new LoginPage(page)
    byoePage = new ByoePage(page)
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

  test('Check that client can add selected expert to the short list', async ({
    page,
  }, testInfo) => {
    await byoePage.assertExpertTabDisplayed()
    await byoePage.navigateToByoeForm()
    await byoePage.fillEmailInputWithUniqueEmail(byoeData)
    await byoePage.fillForm(byoeData)
    await byoePage.submitFormWithContinueButton()
    await byoePage.agreeOnAgreement()
    await expertsPage.addToShortlist()
    byoeData = generateRandomDataBYOE(1)
    await byoePage.assertExpertTabDisplayed()
    await byoePage.navigateToByoeForm()
    await byoePage.fillEmailInputWithUniqueEmail(byoeData)
    await byoePage.fillForm(byoeData)
    await byoePage.submitFormWithContinueButton()
    await byoePage.agreeOnAgreement()
    await expertsPage.addToShortlist()
    await expertsPage.filterExpertsBy('Shortlisted profiles')
    await expertsPage.assertExpertInExpertsList(byoeData, true)
    await expertsPage.removeFromShortlist(byoeData)
    await expertsPage.filterExpertsBy('Shortlisted profiles')
    await expertsPage.compactListView()
    await expertsPage.filterExpertsBy('Shortlisted profiles')
    await expertsPage.assertExpertInExpertsList(byoeData, false)
  })
  test('Check that client can remove selected expert from the short list', async ({
    page,
  }, testInfo) => {
    await byoePage.assertExpertTabDisplayed()
    await byoePage.navigateToByoeForm()
    await byoePage.fillEmailInputWithUniqueEmail(byoeData)
    await byoePage.fillForm(byoeData)
    await byoePage.submitFormWithContinueButton()
    await byoePage.agreeOnAgreement()
    await expertsPage.addToShortlist()
    byoeData = generateRandomDataBYOE(1)
    await byoePage.assertExpertTabDisplayed()
    await byoePage.navigateToByoeForm()
    await byoePage.fillEmailInputWithUniqueEmail(byoeData)
    await byoePage.fillForm(byoeData)
    await byoePage.submitFormWithContinueButton()
    await byoePage.agreeOnAgreement()
    await expertsPage.addToShortlist()
    await expertsPage.filterExpertsBy('Shortlisted profiles')
    await expertsPage.assertExpertInExpertsList(byoeData, true)
    await expertsPage.removeFromShortlist(byoeData)
    await expertsPage.filterExpertsBy('Shortlisted profiles')
    await expertsPage.compactListView()
    await expertsPage.filterExpertsBy('Shortlisted profiles')
    await expertsPage.assertExpertInExpertsList(byoeData, false)
  })

  test('Check that client can move BYOE to the Not Interested', async ({
    page,
  }, testInfo) => {
    await byoePage.navigateToByoeForm()
    await byoePage.fillEmailInputWithUniqueEmail(byoeData)
    await byoePage.fillForm(byoeData)
    await byoePage.submitFormWithContinueButton()
    await byoePage.agreeOnAgreement()
    await expertsPage.searchForExpert(byoeData)
    await expertsPage.rejectExpert()
    byoeData = generateRandomDataBYOE(1)
    await byoePage.navigateToByoeForm()
    await byoePage.fillEmailInputWithUniqueEmail(byoeData)
    await byoePage.fillForm(byoeData)
    await byoePage.submitFormWithContinueButton()
    await byoePage.agreeOnAgreement()
    await expertsPage.searchForExpert(byoeData)
    await expertsPage.rejectExpert()
    await expertsPage.filterExpertsBy('Show rejected experts')
    await expertsPage.compactListView()
    await expertsPage.assertExpertInExpertsList(byoeData, true)
    await expertsPage.detailedListView()
    await expertsPage.unrejectExpert()
    await expertsPage.exitFromRejectedFilter()
    await expertsPage.searchForExpert(byoeData)
    await expertsPage.compactListView()
    await expertsPage.assertExpertInExpertsList(byoeData, true)
  })
  test('Check that client is able to add a note for the BYOE after adding', async ({
    page,
  }, testInfo) => {
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
  test('Check that user is able to left notes on the Call page', async ({
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
    await expertsPage.mailClient.assertPlaceholderRecevied(byoeData)
    await expertsPage.mailClient.assertRemindeRecevied(byoeData)
    await expertsPage.asserExpertCardOpened(byoeData)
    await expertsPage.clickButtonHasText('Call scheduled:')
    await expertsPage.assertPrecenceOnPage(ENV.URL, '/client/calls/')
    await callPage.assertCallDetails(byoeData)
    await callPage.addCallNote(
      `${byoeData.lastName}  from ${byoeData.companyName} should be in this call`
    )
  })
})
