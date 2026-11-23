import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly inputEmail: Locator;
  readonly inputPassword: Locator;
  readonly btnLogin: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.inputEmail = page.locator('[data-test="username"]');
    this.inputPassword = page.locator('[data-test="password"]');
    this.btnLogin = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  async navigateToLogin(): Promise<void> {
    await this.page.goto('/');
  }

  async login(username: string, password: string): Promise<void> {
    await this.inputEmail.fill(username);
    await this.inputPassword.fill(password);
    await this.btnLogin.click();
  }
}
