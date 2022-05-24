import { test } from '@playwright/test'
import { ByoePage } from '../../page-objects/page-objects-BYOE/ByoePage'
import { LoginPage } from '../../page-objects/page-objects-BYOE/LoginPage'
import { getRandomNumber, getRandomString } from '../../utils/data-helpers'

test.describe.only('BYOE Adding feature', () => {
  let byoePage: ByoePage
  let loginPage: LoginPage
  const fs = require('fs')
  let rawdata = fs.readFileSync('test-data/byoe-data.json')

  const byoeList = JSON.parse(rawdata)
  const BYOE = byoeList[0]

  rawdata = fs.readFileSync('test-data/mandatory-fields-list.json')
  const mandatoryFields = JSON.parse(rawdata)

  rawdata = fs.readFileSync('test-data/ENV.json')
  const envList = JSON.parse(rawdata)
  const ENV = envList[0]
  test.beforeEach(async ({ page }) => {
    await page.goto(ENV.URL)
    loginPage = new LoginPage(page)
    byoePage = new ByoePage(page)
    await loginPage.fillLoginForm(ENV.email, ENV.password)
    await loginPage.submitCredentials()
    await loginPage.loginAsUser(ENV.URL, ENV.clientID)
    await page.goto(ENV.expertsTabLink)
  })

  test('Successfull adding BYOE w/o scheduling call', async ({
    page,
  }, testInfo) => {
    let uniqueId = await getRandomString(8)
    await byoePage.assertExpertTabDiplsyed()
    await byoePage.navigateToByoeForm()
    await byoePage.fillEmailInput(uniqueId, BYOE.emailpart)
    await byoePage.fillForm(uniqueId, BYOE)
    await byoePage.submitForm()
    await byoePage.agreeOnAgreement()
    //catch success message
  })

  test('Successfull adding BYOE with scheduling call', async ({
    page,
  }, testInfo) => {
    let uniqueId = await getRandomString(8)
    await byoePage.assertExpertTabDiplsyed()
    await byoePage.navigateToByoeForm()
    await byoePage.fillEmailInput(uniqueId, BYOE.emailpart)
    await byoePage.fillForm(uniqueId, BYOE)
    await byoePage.provideSchedulingDetails('45 minutes')
    await byoePage.submitForm()
    await byoePage.agreeOnAgreement()
    //catch success message
  })

  test('Adding BYOE w/o mandatory fields', async ({ page }, testInfo) => {
    let uniqueId = await getRandomString(8)
    await byoePage.assertExpertTabDiplsyed()
    await byoePage.navigateToByoeForm()
    await byoePage.assertAddingFormUnavailable()
    await byoePage.fillEmailInput(uniqueId, BYOE.emailpart)
    await byoePage.assertAddingFormAvailable()
    await byoePage.submitForm()
    await byoePage.submitForm()
    await byoePage.assertErrorMessageForFields(
      mandatoryFields,
      `can't be blank`
    )
    await byoePage.clearBYOEEmailField()
    await byoePage.fillEmailInput(uniqueId, BYOE.emailpart)
    await byoePage.fillForm(uniqueId, BYOE)
    await byoePage.submitForm()
    await byoePage.agreeOnAgreement()
    //catch success message
  })
})
