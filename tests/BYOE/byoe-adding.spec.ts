import { test } from '@playwright/test'
import { ByoePage } from '../../page-objects/page-objects-BYOE/ByoePage'
import { LoginPage } from '../../page-objects/page-objects-BYOE/LoginPage'
import { getRandomNumber } from '../../utils/data-helpers'

test.describe('BYOE Adding feature', () => {
  let byoePage: ByoePage
  // test.setTimeout(100000)
  let loginPage: LoginPage

  ///ENVIROMENT DETAILS
  //  --1--
  const URL = 'https://spot-aggregator-messaging-templates.test.prosapient.app/'
  const email = 'admin@odin.expert'
  const password = '1q2w3e4rA++!!'
  const clientID = '52d1a9e0-942b-4b2d-8bc1-bca60364ae1c'
  const expertsTabLink =
    'https://spot-aggregator-messaging-templates.test.prosapient.app/client/projects/fd59faf8-edf5-4f3e-9ef9-cf1496fa3659/experts'
  //  --2--
  // const URL = 'https://platform-aggregator.test.prosapient.app/'
  // const email = 'admin@odin.expert'
  // const password = '1q2w3e4rA++!!'
  // const clientID = '6cbf9743-0f9c-4b36-91a3-0c22e84d28c6'
  // const expertsTabLink = 'https://platform-aggregator.test.prosapient.app/client/projects/6b6f7169-14e9-42be-ada1-37e4caa96e4f/experts'

  test.beforeEach(async ({ page }) => {
    await page.goto(URL)
    loginPage = new LoginPage(page)
    byoePage = new ByoePage(page)
    await loginPage.fillLoginForm(email, password)
    await loginPage.submitCredentials()
    await loginPage.loginAsUser(URL, clientID)
    await page.goto(expertsTabLink)
  })

  test('Successfull adding BYOE w/o shceduling call', async ({
    page,
  }, testInfo) => {
    let uniqueId = await getRandomNumber(100000)
    await byoePage.assertExpertTabDiplsyed()
    await byoePage.navigateToByoeForm()
    await byoePage.fillForm(
      uniqueId,
      'mykhailo.kobylianskyi.work',
      'APAC',
      'QA lead',
      'proSapient',
      '1000',
      3,
      1,
      'Tag sample name',
      'Ukraine',
      '+380992435802',
      'Kiev',
      'https://www.linkedin.com/in/mykhailo-kobylianskyi-22023b133/'
    )
    await byoePage.submitForm()
    await byoePage.agreeOnAgreement()
  })

  test('Adding BYOE w/o mandatory fields', async ({ page }, testInfo) => {
    let uniqueId = await getRandomNumber(100000)
    await byoePage.assertExpertTabDiplsyed()
    await byoePage.navigateToByoeForm()
    await byoePage.assertAddingFormBlocked()
    await byoePage.fillEmailInput(uniqueId, 'mykhailo.kobylianskyi.work')
    await byoePage.assertAddingFormUnblocked()
    await byoePage.submitForm()
    await byoePage.submitForm()
    await byoePage.assertErrorMessageForFields(
      [
        'Source',
        'Angle',
        'First name',
        'Last name',
        'Relevant position',
        'Company relevant to project',
        'Project Hourly Rate',
      ],
      `can't be blank`
    )
    await byoePage.clearBYOEForm()
    await byoePage.fillForm(
      uniqueId,
      'mykhailo.kobylianskyi.work',
      'APAC',
      'QA lead',
      'proSapient',
      '1000',
      3,
      1,
      'Tag sample name',
      'Ukraine',
      '+380992435802',
      'Kiev',
      'https://www.linkedin.com/in/mykhailo-kobylianskyi-22023b133/'
    )
    await byoePage.submitForm()
    await byoePage.agreeOnAgreement()
  })
})
