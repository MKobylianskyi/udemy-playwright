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

test.describe('BYOE: Adding and removing expert from shortlist', () => {
  let coveredCasesIDs
  let byoeData: Input
  let byoePage: ByoePage
  let loginPage: LoginPage
  let expertsPage: ExpertsPage
  const ENV = require('../../test-data/env-data.json')
  const api = new TestRail({
    host: 'https://prosapient.testrail.net',
    username: ENV.testRailEmail,
    password: ENV.testRailPassword,
  })
  const testRun = require('../../test-data/test-run.json')

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
    if (testRun.id != undefined) {
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
    }
  })

  test('BYOE:Adding & removing  expert to the shortlist', async ({
    page,
  }, testInfo) => {
    coveredCasesIDs = [14094, 14095]
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

  test('BYOE:Rejecting expert', async ({ page }, testInfo) => {
    coveredCasesIDs = [14096]
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
})