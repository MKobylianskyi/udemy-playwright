const ENV = require('../test-data/env-data.json')
const Mailosaur = require('mailosaur')
const apiKey = '2d6p7S349brQ4LZL'
const mailosaur = new Mailosaur(apiKey)

const serverId = 'ccjat8kv'
const serverDomain = 'ccjat8kv.mailosaur.net'

export async function getEmail(sentTo: string) {
  const email = await mailosaur.messages.get(serverId, {
    sentTo: sentTo,
  })
  return email
}
export async function getEmailLink(sentTo: string, linkNumber: number) {
  const email = await mailosaur.messages.get(serverId, {
    sentTo: sentTo,
  })
  const firstLink = email.html.links[linkNumber].href
  return firstLink
}
