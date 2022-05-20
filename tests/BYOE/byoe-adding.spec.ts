import { test } from '@playwright/test'
import { ByoePage } from '../../page-objects/page-objects-BYOE/ByoePage'
import { LoginPage } from '../../page-objects/page-objects-BYOE/LoginPage'
import { getRandomNumber } from '../../utils/data-helpers'

test.describe('BYOE Adding feature', () => {
  let byoePage: ByoePage
  let loginPage: LoginPage
  const mandatoryFields = [
    'Source',
    'Angle',
    'First name',
    'Last name',
    'Relevant position',
    'Company relevant to project',
    'Project Hourly Rate',
  ]

  const BYOE = {
    emailpart: 'mykhailo.kobylianskyi.work',
    sourceOption: 'APAC',
    positionvalue: 'QA lead',
    companyname: 'proSapient',
    rate: '1000',
    currencyOptionIndex: 3,
    angleOptionIndex: 1,
    tagname: 'Tag sample name',
    expertGeo: 'Ukraine',
    phone: '+380992435802',
    timezoneName: 'Kiev',
    linkedinURl: 'https://www.linkedin.com/in/mykhailo-kobylianskyi-22023b133/',
  }

  const lekSpotENV = {
    URL: 'https://spot-aggregator-messaging-templates.test.prosapient.app/',
    email: 'admin@odin.expert',
    password: '1q2w3e4rA++!!',
    clientID: '1c628bf7-a32e-4f4c-ac56-f289b6430e09',
    expertsTabLink:
      'https://spot-aggregator-messaging-templates.test.prosapient.app/client/projects/fd59faf8-edf5-4f3e-9ef9-cf1496fa3659/experts',
  }

  const platfromAgregatorENV = {
    URL: 'https://platform-aggregator.test.prosapient.app/',
    email: 'test.admin@pSapient.onmicrosoft.com',
    password: '1q2w3e4rAA++!!!1',
    clientID: '6cbf9743-0f9c-4b36-91a3-0c22e84d28c6',
    expertsTabLink:
      'https://platform-aggregator.test.prosapient.app/client/projects/6b6f7169-14e9-42be-ada1-37e4caa96e4f/experts',
  }
  const ENV = lekSpotENV

  test.beforeEach(async ({ page }) => {
    await page.goto(ENV.URL)
    loginPage = new LoginPage(page)
    byoePage = new ByoePage(page)
    await loginPage.fillLoginForm(ENV.email, ENV.password)
    await loginPage.submitCredentials()
    await loginPage.loginAsUser(ENV.URL, ENV.clientID)
    await page.goto(ENV.expertsTabLink)
  })

  test('Successfull adding BYOE w/o shceduling call', async ({
    page,
  }, testInfo) => {
    let uniqueId = await getRandomNumber(100000)
    await byoePage.assertExpertTabDiplsyed()
    await byoePage.navigateToByoeForm()
    await byoePage.fillForm(uniqueId, BYOE)
    await byoePage.submitForm()
    await byoePage.agreeOnAgreement()
  })

  test('Adding BYOE w/o mandatory fields', async ({ page }, testInfo) => {
    let uniqueId = await getRandomNumber(100000)
    await byoePage.assertExpertTabDiplsyed()
    await byoePage.navigateToByoeForm()
    await byoePage.assertAddingFormBlocked()
    await byoePage.fillEmailInput(uniqueId, BYOE.emailpart)
    await byoePage.assertAddingFormUnblocked()
    await byoePage.submitForm()
    await byoePage.submitForm()
    await byoePage.assertErrorMessageForFields(
      mandatoryFields,
      `can't be blank`
    )
    await byoePage.clearBYOEForm()
    await byoePage.fillForm(uniqueId, BYOE)
    await byoePage.submitForm()
    await byoePage.agreeOnAgreement()
  })
})
