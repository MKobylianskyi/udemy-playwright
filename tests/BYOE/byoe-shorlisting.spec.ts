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

test.describe('BYOE: Adding and removing expert from shortlist', () => {
  let byoeData: Input
  let byoePage: ByoePage
  let loginPage: LoginPage
  let expertsPage: ExpertsPage
  const fs = require('fs')
  let rawdata = fs.readFileSync('test-data/env-data.json')
  const ENV = JSON.parse(rawdata)

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

  test('BYOE:Adding & removing  expert to the shortlist', async ({
    page,
  }, testInfo) => {
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
    await byoePage.assertExpertTabDisplayed()
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
