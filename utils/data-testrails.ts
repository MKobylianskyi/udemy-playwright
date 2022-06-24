import TestRail from '@dlenroc/testrail'
const crypto = require('crypto')
const testRun = require('../test-data/test-run.json')
const ENV = require('../test-data/env-data.json')
const api = new TestRail({
  host: 'https://prosapient.testrail.net',
  username: ENV.testRailEmail,
  password: ENV.testRailPassword,
})

export async function getTestCase(testInfo) {
  const filteredTestCases = await api.getCases(testRun.project_id, {
    suite_id: testRun.suite_id,
    filter: testInfo.title,
    limit: 1,
  })
  return filteredTestCases[0]
}

export function getTestStatusID(status) {
  switch (status) {
    case 'passed':
      return 1
    case 'skipped':
      return 4
    default:
      return 5
  }
}
export async function updateTestCase(testCase, status) {
  await api.addResultForCase(testRun.id, testCase.id, {
    status_id: status,
  })
}
export async function sendTestStatusAPI(testInfo) {
  if (testRun.id != undefined) {
    const testCase = await getTestCase(testInfo)
    const status = getTestStatusID(testInfo.status)
    updateTestCase(testCase, status)
  }
}
