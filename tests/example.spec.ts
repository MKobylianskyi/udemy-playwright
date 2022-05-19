import { test, expect } from '@playwright/test'
import { LoadHomePage, AssertTitle } from '../helpers'
import { getRandomNumber, getRandomString } from '../utils/data-helpers'

test('Simple test @example', async ({ page }) => {
  //some code
  await page.goto('https://example.com')
  await expect(page).toHaveURL('https://example.com')
  await expect(page).toHaveTitle('Example Domain')
  const pageTitle = await page.locator('h1')
  await expect(pageTitle).toContainText('Example Domain')
})

test('checking title @example', async ({ page }) => {
  //some code
  await page.goto('https://example.com')
  await expect(page).toHaveURL('https://example.com')
  await expect(page).toHaveTitle('Example Domain')
  const pageTitle = await page.locator('h1')
  await expect(pageTitle).toBeVisible()
  await expect(pageTitle).toHaveText('Example Domain')
  await expect(pageTitle).toHaveCount(1)
  const faceLocator = await page.locator('h5')
  await expect(faceLocator).not.toBeVisible()
})
test.describe('My Suite', () => {
  test('Findinf an element @zero', async ({ page }) => {
    await page.goto('http://zero.webappsecurity.com/')
    await expect(page).toHaveURL('http://zero.webappsecurity.com/')
    await page.click('#signin_button')
    await page.click('text=Sign in')
    const errorMessage = await page.locator('.alert-error')
    await expect(errorMessage).toContainText('Login and/or password are wrong.')
  })

  test.skip('skiiped', async ({ page }) => {
    //something
  })
  test('working with inputs @zero', async ({ page }) => {
    await page.goto('http://zero.webappsecurity.com/')
    await expect(page).toHaveURL('http://zero.webappsecurity.com/')
    await page.click('#signin_button')
    await page.type('#user_login', 'test@test.test')
    await page.type('#user_password', '123456')
    await page.click('text=Sign in')
    const errorMessage = await page.locator('.alert-error')
    await expect(errorMessage).toContainText('Login and/or password are wrong.')
  })
})
test.describe.parallel('hooks', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://example.com')
  })

  test.skip('screenshoting', async ({ page }) => {
    //   await page.goto('https://example.com')
    await page.screenshot({ path: 'shr.png', fullPage: true })
  })

  test.skip('screenshot of element', async ({ page }) => {
    //    await page.goto('https://example.com')
    const element = await page.$('h1')
    await element.screenshot({ path: 'element.png' })
  })
})

test('test with helper', async ({ page }) => {
  await LoadHomePage(page, 'https://example.com')
  // await page.pause()
  await AssertTitle(page)
})

test.describe.parallel('tips', () => {
  const people = ['matt', 'Jordan', 'Sam']
  for (const name of people) {
    test(`Test search by name for ${name}`, async ({ page }, testInfo) => {
      await page.goto('http://zero.webappsecurity.com/index.html')
      await page.type('#searchTerm', `${name}`)
      console.log(testInfo.title, '==>', testInfo.expectedStatus)
    })
  }
})

test.describe.only('random test', async () => {
  test('random test string', async ({ page }) => {
    const randomLine = getRandomString(100)
    const randomnumber = getRandomNumber(27)
    console.log(randomLine)
    console.log(randomnumber)
  })
})
