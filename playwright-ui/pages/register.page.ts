import { Page, Locator, expect } from '@playwright/test';

export class RegisterPage {
  readonly page: Page;
  readonly linkRegister: Locator;
  readonly radioGenderMale: Locator;
  readonly radioGenderFemale: Locator;
  readonly inputFirstName: Locator;
  readonly inputLastName: Locator;
  readonly inputEmail: Locator;
  readonly inputPassword: Locator;
  readonly inputConfirmPassword: Locator;
  readonly btnRegister: Locator;
  readonly msgResult: Locator;
  readonly linkLogOut: Locator;

  constructor(page: Page) {
    this.page = page;
    this.linkRegister = page.locator('a.ico-register');
    this.radioGenderMale = page.locator('#gender-male');
    this.radioGenderFemale = page.locator('#gender-female');
    this.inputFirstName = page.locator('#FirstName');
    this.inputLastName = page.locator('#LastName');
    this.inputEmail = page.locator('#Email');
    this.inputPassword = page.locator('#Password');
    this.inputConfirmPassword = page.locator('#ConfirmPassword');
    this.btnRegister = page.locator('#register-button');
    this.msgResult = page.locator('div.result');
    this.linkLogOut = page.locator('a.ico-logout');
  }

  async navigateToRegister(): Promise<void> {
    await this.page.goto('/register');
  }

  async registerUser(user: {
    gender: 'Male' | 'Female';
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Promise<void> {
    if (user.gender === 'Male') {
      await this.radioGenderMale.check();
    } else {
      await this.radioGenderFemale.check();
    }
    await this.inputFirstName.fill(user.firstName);
    await this.inputLastName.fill(user.lastName);
    await this.inputEmail.fill(user.email);
    await this.inputPassword.fill(user.password);
    await this.inputConfirmPassword.fill(user.password);
    await this.btnRegister.click();
  }

  async verifyRegistrationSuccess(): Promise<void> {
    await expect(this.msgResult).toHaveText('Your registration completed');
  }
}

