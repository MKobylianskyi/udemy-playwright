import { test } from '@playwright/test'
import { ByoePage } from '../../page-objects/page-objects-BYOE/ByoePage'
import { LoginPage } from '../../page-objects/page-objects-BYOE/LoginPage'
import { getRandomNumber, getRandomString } from '../../utils/data-helpers'

test.describe('BYOE Adding feature', () => {
  let byoePage: ByoePage
  let loginPage: LoginPage
  const fs = require('fs')
  let rawdata = fs.readFileSync('test-data/byoe-data.json')
  const byoeList = JSON.parse(rawdata)
  //Specify BYOE data set
  const BYOE = byoeList[0]
  //Specify BYOE data set
  rawdata = fs.readFileSync('test-data/mandatory-fields-list.json')
  const mandatoryFields = JSON.parse(rawdata)
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

  test('Successfull adding BYOE w/o scheduling call', async ({
    page,
  }, testInfo) => {
    let uniqueId = await getRandomString(5)
    await byoePage.assertExpertTabDiplsyed()
    await byoePage.navigateToByoeForm()
    await byoePage.fillEmailInput(uniqueId, BYOE.emailpart)
    await byoePage.fillForm(uniqueId, BYOE)
    await byoePage.submitFormWithContinueButton()
    await byoePage.agreeOnAgreement()
  })

  test.skip('Autocomplete BYOE details during adding', async ({
    page,
  }, testInfo) => {
    let uniqueId = await getRandomString(5)
    await byoePage.assertExpertTabDiplsyed()
    await byoePage.navigateToByoeForm()
    await byoePage.fillEmailInput(uniqueId, BYOE.emailpart)
    await byoePage.fillForm(uniqueId, BYOE)
    await byoePage.submitFormWithContinueButton()
    await byoePage.agreeOnAgreement()
    //Navigate to the new project
    await byoePage.assertExpertTabDiplsyed()
    await byoePage.navigateToByoeForm()
    await byoePage.fillEmailInput(uniqueId, BYOE.emailpart)
    //check that fields are prepopuldated
  })

  test('Successfull adding BYOE with scheduling call', async ({
    page,
  }, testInfo) => {
    let uniqueId = await getRandomString(5)
    await byoePage.assertExpertTabDiplsyed()
    await byoePage.navigateToByoeForm()
    await byoePage.fillEmailInput(uniqueId, BYOE.emailpart)
    await byoePage.fillForm(uniqueId, BYOE)
    await byoePage.provideSchedulingDetails('45 minutes')
    await byoePage.submitFormWithContinueButton()
    await byoePage.agreeOnAgreement()
  })

  test('Adding BYOE w/o mandatory fields', async ({ page }, testInfo) => {
    let uniqueId = await getRandomString(5)
    await byoePage.assertExpertTabDiplsyed()
    await byoePage.navigateToByoeForm()
    await byoePage.assertAddingFormUnavailable()
    await byoePage.fillEmailInput(uniqueId, BYOE.emailpart)
    await byoePage.assertAddingFormAvailable()
    await byoePage.submitFormWithContinueButton()
    await byoePage.submitFormWithContinueButton()
    await byoePage.assertErrorMessageForFields(
      mandatoryFields,
      `can't be blank`
    )
    await byoePage.clearBYOEEmailField()
    await byoePage.fillEmailInput(uniqueId, BYOE.emailpart)
    await byoePage.fillForm(uniqueId, BYOE)
    await byoePage.submitFormWithContinueButton()
    await byoePage.agreeOnAgreement()
  })
})
