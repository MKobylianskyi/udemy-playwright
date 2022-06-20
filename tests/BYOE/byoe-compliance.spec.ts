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

test.describe('BYOE: Compliance Training', () => {
  let coveredCasesIDs
  let byoeData: Input
  let byoePage: ByoePage
  let loginPage: LoginPage
  let expertsPage: ExpertsPage
  const fs = require('fs')
  let rawdata = fs.readFileSync('test-data/env-data.json')
  const ENV = JSON.parse(rawdata)
  const api = new TestRail({
    host: 'https://prosapient.testrail.net',
    username: ENV.testRailEmail,
    password: ENV.testRailPassword,
  })
  rawdata = fs.readFileSync('test-data/test-run.json')
  let testRun = JSON.parse(rawdata)

  test.beforeEach(async ({ page }) => {
    byoeData = generateRandomDataBYOE(1)
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

  test('Checking message "Expert will be required to complete CT"', async ({
    page,
  }, testInfo) => {
    coveredCasesIDs = [14118]
    await byoePage.assertExpertTabDisplayed()
    await byoePage.navigateToByoeForm()
    await byoePage.fillEmailInputWithUniqueEmail(byoeData)
    await byoePage.assertComplainceMessage()
    await byoePage.fillForm(byoeData)
    await byoePage.submitFormWithContinueButton()
    await byoePage.agreeOnAgreement()
    await byoePage.assertComplainceMessage()
    await expertsPage.openExpertTab(ENV.URL, ENV.project2_ID)
    await byoePage.assertExpertTabDisplayed()
    await byoePage.navigateToByoeForm()
    await byoePage.fillEmailInputWithUniqueEmail(byoeData)
    await byoePage.assertEmailAddressWarning()
    await byoePage.assertAutocompleteFormValues(byoeData)
    await byoePage.assertComplainceMessage()
    //for future -  on the call details page for the scheduled call
  })
})
