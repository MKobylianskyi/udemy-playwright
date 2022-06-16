import { faker } from '@faker-js/faker'
import { getRandomString } from '../utils/data-helpers'

export function generateRandomDataBYOE(env: number) {
  const fs = require('fs')
  let rawdata = fs.readFileSync('test-data/byoe-data.json')
  const byoeList = JSON.parse(rawdata)
  const byoeObject = byoeList[env]

  return {
    uniqueId: getRandomString(5),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    jobTitle: faker.name.jobTitle(),
    companyName: faker.company.companyName(),
    phoneNumber: faker.phone.phoneNumber('+38099#######'),
    rate: faker.finance.amount(0, 1000, 0),
    tag: faker.company.catchPhrase(),
    // timeZone: faker.address.timeZone(),
    // country: faker.address.country(),
    // HARDCODED UNTILL FIND OUT HOW TO REMOVE UNEXISTED TIMEZONE AND GEO FROM FAKER API
    timeZone: 'Kiev',
    country: 'Ukraine',
    emailpart: byoeObject.emailpart,
    sourceOption: byoeObject.sourceOption,
    currencyOptionIndex: byoeObject.currencyOptionIndex,
    angleOptionIndex: byoeObject.angleOptionIndex,
    linkedinURl: byoeObject.linkedinURl,
  }
}
