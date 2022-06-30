import { Page, Locator, expect } from '@playwright/test'
import {
  getCurrentDay,
  getCurrentTimeFormated,
} from '../../../utils/data-helpers'
import { BasePage } from '../../BasePage'

export class CallPage extends BasePage {
  readonly addToShortlistButton: Locator
  readonly expertStatus: Locator
  readonly removeFromShortlistButton: Locator

  constructor(page: Page) {
    super(page)
    this.addToShortlistButton = page.locator('button:has-text(" ")')
  }
  async assertExpertCardDetails(data) {
    await this.assertPresenceByText(`${data.firstName} ${data.lastName}`)
    await this.assertPresenceByText(`${data.jobTitle} at ${data.companyName}`)
    await this.assertPresenceByText(data.country)
  }

  async addCallNote(noteText) {
    await this.noteInput.waitFor({ state: 'attached' })
    await this.noteInput.type(noteText)
    await this.clickButtonHasText('Add note')
    await this.assertPresenceByText(noteText)
  }

  async assertCallDetails(data) {
    await this.assertPresenceByText('Call scheduled')
    //check date
    //check time
    // check duration
  }

  async addExpertNote(noteText) {
    await this.clickButtonHasText('Add a note')
    await this.noteInput.waitFor({ state: 'attached' })
    await this.noteInput.type(noteText)
    await this.clickButtonHasText('Post a note')
    await this.assertPresenceByText(noteText)
  }
}
