import { expect } from '@playwright/test'

const Mailosaur = require('mailosaur')
const apiKey = 'VeAbI3lehwlNHCvw'
const mailosaur = new Mailosaur(apiKey)
const serverId = 'kfbjvete'
const serverDomain = 'kfbjvete.mailosaur.net'

export class MailClient {
  async getEmailBySubject(sentTo: string, emailSubject: string) {
    const email = await mailosaur.messages.get(
      serverId,
      {
        sentTo: sentTo,
        subject: emailSubject,
      },
      {
        timeout: 500000,
      }
    )
    return email
  }

  getServerDomain() {
    return serverDomain
  }

  async getEmailByAddressFrom(sentTo: string, fromEmail: string) {
    const email = await mailosaur.messages.get(
      serverId,
      {
        sentTo: sentTo,
        sentFrom: fromEmail,
      },
      {
        timeout: 500000,
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
  async getBookingLinkFromRequestTimesEmail(data) {
    const email = await this.getEmailBySubject(
      data.email,
      `Consultation request`
    )
    // await this.deleteEmail(email.id)
    return this.getLink(email, 0)
  }

  async assertInvitationRecevied(data) {
    const email = await this.getEmailByAddressFrom(
      data.email,
      `booking@pSapient.onmicrosoft.com`
    )
    // console.log(email.subject)
    await this.assertPresenceInEmailBody(
      email,
      'Please open the link in one of the following browsers: Chrome, Firefox, Safari'
    )
    await this.assertPresenceInEmailBody(
      email,
      'Please ensure a fast & stable internet connection by closing unnecessary programs and windows'
    )
    await this.deleteEmail(email.id)
  }

  async assertPlaceholderRecevied(data) {
    const email = await this.getEmailBySubject(data.email, `ACTION NEEDED`)
    await this.assertPresenceInEmailBody(
      email,
      'When you complete the training, you will get a new invitation with the call dial-in details.'
    )
    await this.assertPresenceInEmailBody(
      email,
      'To complete the mandatory compliance training, please'
    )
    await this.deleteEmail(email.id)
  }

  async assertCanceletionInvitationRecevied(data) {
    const email = await this.getEmailBySubject(data.email, `Canceled:`)
    await this.deleteEmail(email.id)
  }

  async assertRemindeRecevied(data) {
    const email = await this.getEmailBySubject(
      data.email,
      `Please complete your compliance training ahead of your call`
    )
    await this.assertPresenceInEmailBody(
      email,
      'Before you are able to participate in a consultation, we need to make sure that you are fully aware of the compliance rules that apply to the expert consultations.'
    )
    await this.assertPresenceInEmailBody(
      email,
      'We would like to have a call with you!'
    )
    await this.deleteEmail(email.id)
  }
}
