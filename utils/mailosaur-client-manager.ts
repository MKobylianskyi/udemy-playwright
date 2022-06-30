const Mailosaur = require('mailosaur')
const apiKey = '2d6p7S349brQ4LZL'
const mailosaur = new Mailosaur(apiKey)
const serverId = 'ccjat8kv'
const serverDomain = 'ccjat8kv.mailosaur.net'

export class MailClient {
  async getEmail(sentTo: string, emailSubject: string) {
    const email = await mailosaur.messages.get(serverId, {
      sentTo: sentTo,
      subject: emailSubject,
    })
    return email
  }

  async getLink(email, linkNumber) {
    return email.html.links[linkNumber].href
  }

  async assertReminderAndGetLink(data) {
    const email = await this.getEmail(
      data.email,
      `Please complete your compliance training ahead of your call`
    )
    return this.getLink(email, 1)
  }
  async assertPlaceholderAndGetLink(data) {
    const email = await this.getEmail(data.email, `ACTION NEEDED`)
    return this.getLink(email, 0)
  }
  async openCTfromPlaceholder(data) {
    const email = await this.getEmail(data.email, `ACTION NEEDED`)
  }
}
