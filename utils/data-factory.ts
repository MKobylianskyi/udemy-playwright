import { faker } from '@faker-js/faker'
import { getRandomNumber, getRandomString } from '../utils/data-helpers'

export function generateRandomDataBYOE(env: number) {
  const fs = require('fs')
  let rawdata = fs.readFileSync('test-data/byoe-data.json')
  const byoeList = JSON.parse(rawdata)
  const byoeObject = byoeList[env]

  return {
    uniqueId: getRandomString(3),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    jobTitle: faker.name.jobTitle(),
    companyName: faker.company.companyName(),
    phoneNumber: faker.phone.phoneNumber('+38099#######'),
    rate: faker.finance.amount(0, 1000, 0),
    tags: [
      faker.company.catchPhrase(),
      faker.company.catchPhrase(),
      faker.company.catchPhrase(),
      faker.company.catchPhrase(),
    ],
    // timeZone: faker.address.timeZone(),
    // country: faker.address.country(),
    // HARDCODED UNTILL FIND OUT HOW TO REMOVE UNEXISTED TIMEZONE AND GEO FROM FAKER API
    timeZone: 'Kiev',
    country: 'Ukraine',
    email: byoeObject.email,
    sourceOption: byoeObject.sourceOption,
    currencyOptionIndex: getRandomNumber(6),
    angleOptionIndex: byoeObject.angleOptionIndex,
    linkedinURl: byoeObject.linkedinURl,
  }
}
export function generateUniqueEmail(data) {
  const index = data.email.indexOf('@')
  var uniqueEmail =
    data.email.slice(0, index) +
    `+${data.firstName}${data.lastName}-${data.uniqueId}` +
    data.email.slice(index)

  return uniqueEmail
}
