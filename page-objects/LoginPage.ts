import { Locator, Page, expect } from '@playwright/test'
import { AbstractPage } from '../page-objects/AbstractPage'

export class LoginPage extends AbstractPage {
  readonly usernameInput: Locator
  readonly passwordInout: Locator
  readonly submitBytton: Locator
  readonly errorMessage: Locator
  readonly loginForm: Locator

  constructor(page: Page) {
    super(page)
    this.usernameInput = page.locator('#user_login')
    this.passwordInout = page.locator('#user_password')
    this.submitBytton = page.locator('text =Sign in')
    this.errorMessage = page.locator('.alert-error')
    this.loginForm = page.locator('#login_form')
  }

  async login(username: string, password: string) {
    await this.usernameInput.type(username)
    await this.passwordInout.type(password)
    await this.submitBytton.click()
  }
  async assertErrorMEssage(errortext: string) {
    await expect(this.errorMessage).toContainText(errortext)
  }
  async snapLoginForm(path: string) {
    expect(await this.loginForm.screenshot()).toMatchSnapshot(path)
  }
  async snapErrorMessage(path: string) {
    expect(await this.errorMessage.screenshot()).toMatchSnapshot(path)
  }
}
