import { faker } from '@faker-js/faker'

export function generateRandomDataBYOE() {
  return {
    fisrtName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    phoneNumber: faker.phone.phoneNumber('+38099#######'),
    randomJobTitle: faker.name.jobTitle(),
    companyName: faker.company.companyName(),
    rate: faker.finance.amount(0, 1000, 0),
    tag: faker.company.catchPhrase(),
    timeZone: faker.address.timeZone(),
    country: faker.address.country(),
  }
}
