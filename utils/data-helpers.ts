const crypto = require('crypto')

export async function getRandomNumber(max) {
  return Math.floor(Math.random() * max + 1)
}

// export async function getRandomString(length:number) {
//     return crypto.randomBytes(length).tos
// }

export async function getRandomString(length) {
  return crypto.randomBytes(length).toString('hex')
}
