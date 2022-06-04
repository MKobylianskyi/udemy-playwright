import { test } from '@playwright/test'
import { ByoePage } from '../../page-objects/project-pages/ByoePage'
import { LoginPage } from '../../page-objects/LoginPage'
import { ExpertsPage } from '../../page-objects/project-pages/ExpertsPage'
import { getRandomString } from '../../utils/data-helpers'
import { generateRandomDataBYOE } from '../../utils/data-factory'

test.describe('BYOE Scheduling feature', () => {
  var byoeData = {
    fisrtName: '',
    lastName: '',
    phoneNumber: '',
    randomJobTitle: '',
    companyName: '',
    rate: '',
    tag: '',
    timeZone: '',
    country: '',
  }
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

  test.beforeEach(async ({ page }) => {
    generateRandomDataBYOE(byoeData)
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
    await expertsPage.openExpertSchedulingPanel()
    await expertsPage.openSetTimeModal()
    await expertsPage.provideSetTimeSchedulingDetails('45 minutes')
    await expertsPage.assertRateOnSetTimeFrom(byoeData.rate)
    await expertsPage.bookCallOnSetTimeForm()
    await expertsPage.assertSuccessAllert('Call was scheduled')
    await expertsPage.searchForExpert(
      byoeData.fisrtName + ' ' + byoeData.lastName
    )
    await expertsPage.assertTitleCallScheduled()
  })

  test('BYOE:Schedule a call via request times  after adding', async ({
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
    await expertsPage.openExpertSchedulingPanel()
    await expertsPage.requestAvailabilityClick()
    await expertsPage.requestAvailabilityClick()
    await expertsPage.assertSuccessAllert('Request has been sent')
    //complete booking by link from email
    //assert that call booked
  })
})
