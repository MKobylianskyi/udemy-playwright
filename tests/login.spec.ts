import { expect, test } from '@playwright/test'
import { LoginPage } from '../page-objects/LoginPage'

test.describe.skip('Login feature', () => {
  let loginPage: LoginPage
  const fs = require('fs')
  let rawdata = fs.readFileSync('test-data/env-data.json')
  const envList = JSON.parse(rawdata)
  //Specify ENV
  // 0 - LEK spot | 1 - Platfrom Aggregator | 2  - Staging
  const ENV = envList[0]

  test.beforeEach(async ({ page }) => {
    await page.goto(ENV.URL)
    loginPage = new LoginPage(page)
  })

  test('Login as Admin', async ({ page }, testInfo) => {
    await loginPage.fillLoginForm(ENV.email, ENV.password)
    await loginPage.submitCredentials()
    await expect(page.url()).toBe(ENV.URL + '/admin/clients')
  })
})
