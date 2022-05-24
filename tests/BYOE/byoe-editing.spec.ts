import { test } from '@playwright/test'
import { ByoePage } from '../../page-objects/page-objects-BYOE/ByoePage'
import { LoginPage } from '../../page-objects/page-objects-BYOE/LoginPage'
import { getRandomNumber } from '../../utils/data-helpers'

test.describe.skip('BYOE Editing feature', () => {
  let byoePage: ByoePage
  let loginPage: LoginPage
  const fs = require('fs')
  let rawdata = fs.readFileSync('test-data/byoe-data.json')

  const byoeList = JSON.parse(rawdata)
  const BYOE = byoeList[1]

  rawdata = fs.readFileSync('test-data/mandatory-fields-list.json')
  const mandatoryFields = JSON.parse(rawdata)

  rawdata = fs.readFileSync('test-data/ENV.json')
  const envList = JSON.parse(rawdata)

  const ENV = envList[0]
  const date = new Date()
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
    let uniqueId = await getRandomNumber(100000)
    await byoePage.assertExpertTabDiplsyed()
    await byoePage.navigateToByoeForm()
    await byoePage.fillEmailInput(uniqueId, BYOE.emailpart)
    await byoePage.fillForm(uniqueId, BYOE)
    await byoePage.submitForm()
    await byoePage.agreeOnAgreement()
    //find added expert
    //Get to editing panel
    await byoePage.assertAddingFormAvailable()
    //check that all created DATA is present
    await byoePage.clearForm()
    await byoePage.clearBYOEEmailField()
    await byoePage.fillForm(uniqueId, BYOE)
    await byoePage.submitForm()
  })
  test('Editing required mandatory fields', async ({ page }, testInfo) => {
    let uniqueId = await getRandomNumber(100000)
    await byoePage.assertExpertTabDiplsyed()
    await byoePage.navigateToByoeForm()
    await byoePage.fillEmailInput(uniqueId, BYOE.emailpart)
    await byoePage.fillForm(uniqueId, BYOE)
    await byoePage.submitForm()
    await byoePage.agreeOnAgreement()
    //find added expert
    //Get to editing panel
    await byoePage.assertAddingFormAvailable()
    //check that all created DATA is present
    await byoePage.clearForm()
    await byoePage.submitForm()
    await byoePage.submitForm()
    await byoePage.assertErrorMessageForFields(
      mandatoryFields,
      `can't be blank`
    )
  })
})
