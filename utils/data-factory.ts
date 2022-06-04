import { faker } from '@faker-js/faker'

export function generateRandomDataBYOE(byoeData: object) {
  byoeData['fisrtName'] = faker.name.firstName()
  byoeData['lastName'] = faker.name.lastName()
  byoeData['phoneNumber'] = faker.phone.phoneNumber('+38099#######')
  byoeData['randomJobTitle'] = faker.name.jobTitle()
  byoeData['companyName'] = faker.company.companyName()
  byoeData['rate'] = faker.finance.amount(0, 1000, 0)
  byoeData['tag'] = faker.company.catchPhrase()
  byoeData['timeZone'] = faker.address.timeZone()
  byoeData['country'] = faker.address.country()
  return byoeData
}
