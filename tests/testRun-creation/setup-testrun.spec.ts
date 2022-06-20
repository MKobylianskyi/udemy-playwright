import { test } from '@playwright/test'
import TestRail from '@dlenroc/testrail'
import { getCurrentDay, getCurrentTimeFormated } from '../../utils/data-helpers'

test.describe('Setup test rail', () => {
  let testRun
  let rawdata
  const fs = require('fs')
  rawdata = fs.readFileSync('test-data/env-data.json')
  const ENV = JSON.parse(rawdata)
  const api = new TestRail({
    host: 'https://prosapient.testrail.net',
    username: ENV.testRailEmail,
    password: ENV.testRailPassword,
  })

  test('Setup test Run', async ({ page }, testInfo) => {
    testRun = await api.addRun(2, {
      suite_id: 60,
      name: `BYOE AQA: ${getCurrentDay()} ${getCurrentTimeFormated(0)} `,
      assignedto_id: 4,
      include_all: true,
    })
    fs.writeFileSync('test-data/test-run.json', JSON.stringify(testRun))
  })
})
