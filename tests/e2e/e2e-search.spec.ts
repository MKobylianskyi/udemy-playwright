import { test, expect } from '@playwright/test'
import { HomePage } from '../../page-objects/HomePage'

test.describe('Searching feature with typing', () => {
  let homePage: HomePage

  test('Search test', async ({ page }) => {
    homePage = new HomePage(page)
    await homePage.visit()
    await homePage.searchByText('bank')
    await homePage.checkSearchResults(2)
  })
})
