import { test, expect } from '@playwright/test'

export async function LoadHomePage(page, URL: string) {
  await page.goto(URL)
}

export async function selectorPickOptionByName(
  page,
  titleName: string,
  textValue: string
) {
  const element = await page.$(':text("' + titleName + '") + div >> nth=0')
  await element.click()
  await element.type(textValue)
  const firstOption = await page.locator('.select__option >> nth=0')
  await expect(firstOption).toBeVisible()
  await firstOption.click({ delay: 500 })
}

export async function selectorPickOptionByIndex(
  page,
  titleName: string,
  option: number
) {
  const element = await page.$(':text("' + titleName + '") + div >> nth=0')
  await element.click()

  const optionItem = await page.locator(
    '.select__option >> nth=' + (option - 1)
  )
  await expect(optionItem).toBeVisible()
  await optionItem.click({ delay: 500 })
}

export async function AssertTitle(page) {
  await page.waitForSelector('h5')
}
