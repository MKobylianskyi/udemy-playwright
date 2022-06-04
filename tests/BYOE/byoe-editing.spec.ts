import { test } from '@playwright/test'
import { ByoePage } from '../../page-objects/project-pages/ByoePage'
import { LoginPage } from '../../page-objects/LoginPage'
import { getRandomString } from '../../utils/data-helpers'
import { ExpertsPage } from '../../page-objects/project-pages/ExpertsPage'
import { faker } from '@faker-js/faker'

test.describe('BYOE Editing feature', () => {
  let randomFisrtName
  let randomLastName
  let randomPhoneNumber
  let randomJobTitle
  let randomCompanyName
  let randomRate
  let randomTag
  let randomTimeZone
  let randomCountry
  let byoePage: ByoePage
  let loginPage: LoginPage
  let expertsPage: ExpertsPage
  const fs = require('fs')
  let rawdata = fs.readFileSync('test-data/byoe-data.json')
  const byoeList = JSON.parse(rawdata)
  let BYOE = byoeList[1]
  rawdata = fs.readFileSync('test-data/env-data.json')
  const envList = JSON.parse(rawdata)
  //Specify ENV
  // 0 - LEK spot | 1 - Platfrom Aggregator | 2  - Staging
  const ENV = envList[2]
  //Specify ENV

  test.beforeEach(async ({ page }) => {
    randomFisrtName = faker.name.firstName()
    randomLastName = faker.name.lastName()
    randomPhoneNumber = faker.phone.phoneNumber('+38099#######')
    randomJobTitle = faker.name.jobTitle()
    randomCompanyName = faker.company.companyName()
    randomRate = faker.finance.amount(0, 1000, 0)
    randomTag = faker.company.catchPhrase()
    randomCountry = faker.address.country()
    randomTimeZone = faker.address.timeZone()
    await page.goto(ENV.URL)
    loginPage = new LoginPage(page)
    byoePage = new ByoePage(page)
    expertsPage = new ExpertsPage(page)
    await loginPage.fillLoginForm(ENV.email, ENV.password)
    await loginPage.submitCredentials()
    await loginPage.loginAsUser(ENV.URL, ENV.clientID)
    await expertsPage.openExpertTab(ENV.URL, ENV.projectID)
  })

  test('Editing existing expert', async ({ page }, testInfo) => {
    let uniqueId = await getRandomString(5)
    await byoePage.assertExpertTabDisplayed()
    await byoePage.navigateToByoeForm()
    await byoePage.fillEmailInputWithUniqueEmail(uniqueId, BYOE.emailpart)
    await byoePage.fillForm(
      randomFisrtName,
      randomLastName,
      randomJobTitle,
      randomCompanyName,
      randomPhoneNumber,
      randomRate,
      randomTag,
      randomCountry,
      randomTimeZone,
      BYOE
    )
    await byoePage.submitFormWithContinueButton()
    await byoePage.agreeOnAgreement()
    await expertsPage.searchForExpert(randomFisrtName + ' ' + randomLastName)
    await expertsPage.openEditExpertForm()
    await byoePage.assertBYOEFormAvailable()
    await byoePage.clearForm()
    randomFisrtName = faker.name.firstName()
    randomLastName = faker.name.lastName()
    randomPhoneNumber = faker.phone.phoneNumber('+38099#######')
    randomJobTitle = faker.name.jobTitle()
    randomCompanyName = faker.company.companyName()
    randomRate = faker.finance.amount(0, 1000, 0)
    randomTag = faker.company.catchPhrase()
    randomCountry = faker.address.country()
    randomTimeZone = faker.address.timeZone()
    BYOE = byoeList[2]
    await byoePage.fillForm(
      randomFisrtName,
      randomLastName,
      randomJobTitle,
      randomCompanyName,
      randomPhoneNumber,
      randomRate,
      randomTag,
      randomCountry,
      randomTimeZone,
      BYOE
    )
    await byoePage.submitFormWithSaveButton()
  })

  test('Checking mandatory fields', async ({ page }, testInfo) => {
    let uniqueId = await getRandomString(5)
    await byoePage.assertExpertTabDisplayed()
    await byoePage.navigateToByoeForm()
    await byoePage.fillEmailInputWithUniqueEmail(uniqueId, BYOE.emailpart)
    await byoePage.fillForm(
      randomFisrtName,
      randomLastName,
      randomJobTitle,
      randomCompanyName,
      randomPhoneNumber,
      randomRate,
      randomTag,
      randomCountry,
      randomTimeZone,
      BYOE
    )
    await byoePage.submitFormWithContinueButton()
    await byoePage.agreeOnAgreement()
    await expertsPage.searchForExpert(randomFisrtName + ' ' + randomLastName)
    await expertsPage.openEditExpertForm()
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
