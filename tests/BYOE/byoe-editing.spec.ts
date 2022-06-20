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

test.describe('BYOE Editing feature', () => {
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

  test('Editing existing expert', async ({ page }, testInfo) => {
    coveredCasesIDs = [14028]
    await byoePage.assertExpertTabDisplayed()
    await byoePage.navigateToByoeForm()
    await byoePage.fillEmailInputWithUniqueEmail(byoeData)
    await byoePage.fillForm(byoeData)
    await byoePage.submitFormWithContinueButton()
    await byoePage.agreeOnAgreement()
    await expertsPage.searchForExpert(byoeData)
    await expertsPage.openEditExpertForm()
    await byoePage.assertFormValues(byoeData)
    await byoePage.assertBYOEFormAvailable()
    await byoePage.clearForm()
    byoeData = generateRandomDataBYOE(2)
    await byoePage.fillForm(byoeData)
    await byoePage.submitFormWithSaveButton()
  })

  test('Checking mandatory fields', async ({ page }, testInfo) => {
    coveredCasesIDs = [14028]
    await byoePage.assertExpertTabDisplayed()
    await byoePage.navigateToByoeForm()
    await byoePage.fillEmailInputWithUniqueEmail(byoeData)
    await byoePage.fillForm(byoeData)
    await byoePage.submitFormWithContinueButton()
    await byoePage.agreeOnAgreement()
    await expertsPage.searchForExpert(byoeData)
    await expertsPage.openEditExpertForm()
    await byoePage.assertFormValues(byoeData)
    await byoePage.assertBYOEFormAvailable()
    await byoePage.clearForm()
    await byoePage.submitFormWithSaveButton()
    await byoePage.submitFormWithSaveButton()
    await byoePage.assertErrorMessageForFields(
      [
        'First name',
        'Last name',
        'Relevant position',
        'Company relevant to project',
        'Project Hourly Rate',
      ],
      `can't be blank`
    )
  })
})
