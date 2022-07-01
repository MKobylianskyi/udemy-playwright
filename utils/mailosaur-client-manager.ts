import { expect } from '@playwright/test'

const Mailosaur = require('mailosaur')
const apiKey = '2d6p7S349brQ4LZL'
const mailosaur = new Mailosaur(apiKey)
const serverId = 'ccjat8kv'
const serverDomain = 'ccjat8kv.mailosaur.net'

export class MailClient {
  async getEmailBySubject(sentTo: string, emailSubject: string) {
    const email = await mailosaur.messages.get(
      serverId,
      {
        sentTo: sentTo,
        subject: emailSubject,
      },
      {
        timeout: 60000,
      }
    )
    return email
  }

  async getEmailByAddressFrom(sentTo: string, fromEmail: string) {
    const email = await mailosaur.messages.get(
      serverId,
      {
        sentTo: sentTo,
        sentFrom: fromEmail,
      },
      {
        timeout: 60000,
      }
    )
    return email
  }
  async assertPresenceInEmailBody(email, text) {
    await expect(email.text.body.includes(text)).toBeTruthy()
  }

  async getLink(email, linkNumber) {
    return email.html.links[linkNumber].href
  }

  async deleteEmail(emailID) {
    await mailosaur.messages.del(emailID)
  }

  async getCTLinkFromReminderEmail(data) {
    const email = await this.getEmailBySubject(
      data.email,
      `Please complete your compliance training ahead of your call`
    )
    return this.getLink(email, 1)
  }

  async getCTLinkFromPlaceholderEmail(data) {
    const email = await this.getEmailBySubject(data.email, `ACTION NEEDED`)
    await this.deleteEmail(email.id)
    return this.getLink(email, 0)
  }

  async assertInvitation(data) {
    const email = await this.getEmailByAddressFrom(
      data.email,
      `booking@pSapient.onmicrosoft.com`
    )
    await this.assertPresenceInEmailBody(
      email,
      'Please open the link in one of the following browsers: Chrome, Firefox, Safari'
    )

    await this.assertPresenceInEmailBody(
      email,
      'Please ensure a fast & stable internet connection by closing unnecessary programs and windows'
    )
  }

  // async openCTfromPlaceholder(data) {
  //   const email = await this.getEmailBySubject(data.email, `ACTION NEEDED`)
  // }
}
