import { test } from '@playwright/test'
import { ByoePage } from '../../page-objects/project-pages/ByoePage'
import { LoginPage } from '../../page-objects/LoginPage'
import { ExpertsPage } from '../../page-objects/project-pages/ExpertsPage'
import { generateRandomDataBYOE } from '../../utils/data-factory'

type Input = {
  uniqueId: string
  firstName: string
  lastName: string
  jobTitle: string
  companyName: string
  phoneNumber: string
  rate: string
  tag: string
  country: string
  timeZone: string
  emailpart: string
  sourceOption: string
  currencyOptionIndex: number
  angleOptionIndex: number
  linkedinURl: string
}

test.describe('BYOE Scheduling feature', () => {
  let byoeData: Input
  let byoePage: ByoePage
  let loginPage: LoginPage
  let expertsPage: ExpertsPage
  const fs = require('fs')
  let rawdata = fs.readFileSync('test-data/mandatory-fields-list.json')
  const mandatoryFields = JSON.parse(rawdata)
  rawdata = fs.readFileSync('test-data/env-data.json')
  const ENV = JSON.parse(rawdata)

  test.beforeEach(async ({ page }) => {
    byoeData = generateRandomDataBYOE(1)
    await page.goto(ENV.URL)
    loginPage = new LoginPage(page)
    byoePage = new ByoePage(page)
    expertsPage = new ExpertsPage(page)
    await loginPage.fillLoginForm(ENV.email, ENV.password)
    await loginPage.submitCredentials()
    await loginPage.loginAsUser(ENV.URL, ENV.clientID)
    await expertsPage.openExpertTab(ENV.URL, ENV.projectID)
  })

  test('BYOE:Schedule a call via Set Time after adding', async ({
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
    await expertsPage.assertSuccessAllert('Call was scheduled')
    await expertsPage.searchForExpert(byoeData)
    await expertsPage.assertTitleCallScheduled()
  })

  test('BYOE:Schedule a call via request times  after adding', async ({
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
    await expertsPage.requestAvailabilityClick()
    await expertsPage.requestAvailabilityClick()
    await expertsPage.assertSuccessAllert('Request has been sent')
    //complete booking by link from email
    //assert that call booked
  })
})
