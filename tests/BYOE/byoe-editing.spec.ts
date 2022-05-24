import { test } from '@playwright/test'
import { ByoePage } from '../../page-objects/page-objects-BYOE/ByoePage'
import { LoginPage } from '../../page-objects/page-objects-BYOE/LoginPage'
import { getRandomNumber, getRandomString } from '../../utils/data-helpers'

test.describe('BYOE Editing feature', () => {
  let byoePage: ByoePage
  let loginPage: LoginPage
  const fs = require('fs')
  let rawdata = fs.readFileSync('test-data/byoe-data.json')
  const byoeList = JSON.parse(rawdata)
  //Specify BYOE data set
  let BYOE = byoeList[1]
  //Specify BYOE data set
  rawdata = fs.readFileSync('test-data/ENV.json')
  const envList = JSON.parse(rawdata)
  //Specify ENV
  const ENV = envList[0]
  //Specify ENV
  test.beforeEach(async ({ page }) => {
    await page.goto(ENV.URL)
    loginPage = new LoginPage(page)
    byoePage = new ByoePage(page)
    await loginPage.fillLoginForm(ENV.email, ENV.password)
    await loginPage.submitCredentials()
    await loginPage.loginAsUser(ENV.URL, ENV.clientID)
    await page.goto(ENV.expertsTabLink)
  })

  test('Editing existing expert', async ({ page }, testInfo) => {
    let uniqueId = await getRandomString(5)
    await byoePage.assertExpertTabDiplsyed()
    await byoePage.navigateToByoeForm()
    await byoePage.fillEmailInput(uniqueId, BYOE.emailpart)
    await byoePage.fillForm(uniqueId, BYOE)
    await byoePage.submitFormWithContinueButton()
    await byoePage.agreeOnAgreement()
    await byoePage.openEditExpertFormByExpertName(uniqueId)
    await byoePage.assertAddingFormAvailable()
    await byoePage.clearForm()
    BYOE = byoeList[2]
    await byoePage.fillForm(uniqueId, BYOE)
    await byoePage.submitFormWithSaveButton()
  })

  test('Editing required mandatory fields', async ({ page }, testInfo) => {
    let uniqueId = await getRandomString(5)
    await byoePage.assertExpertTabDiplsyed()
    await byoePage.navigateToByoeForm()
    await byoePage.fillEmailInput(uniqueId, BYOE.emailpart)
    await byoePage.fillForm(uniqueId, BYOE)
    await byoePage.submitFormWithContinueButton()
    await byoePage.agreeOnAgreement()
    await byoePage.openEditExpertFormByExpertName(uniqueId)
    await byoePage.assertAddingFormAvailable()
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
