import { Page, Locator, expect } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly inputFirstName: Locator;
  readonly inputLastName: Locator;
  readonly inputPostalCode: Locator;
  readonly btnContinue: Locator;
  readonly btnFinish: Locator;
  readonly lblCompleteHeader: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('[data-test="title"]');
    this.inputFirstName = page.locator('[data-test="firstName"]');
    this.inputLastName = page.locator('[data-test="lastName"]');
    this.inputPostalCode = page.locator('[data-test="postalCode"]');
    this.btnContinue = page.locator('[data-test="continue"]');
    this.btnFinish = page.locator('[data-test="finish"]');
    this.lblCompleteHeader = page.locator('[data-test="complete-header"]');
  }

  async fillCheckoutForm(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await expect(this.pageTitle).toHaveText('Checkout: Your Information');
    await this.inputFirstName.fill(firstName);
    await this.inputLastName.fill(lastName);
    await this.inputPostalCode.fill(postalCode);
    await this.btnContinue.click();
    await expect(this.page).toHaveURL(/.*checkout-step-two\.html/);
  }

  async finishCheckout(): Promise<void> {
    await expect(this.pageTitle).toHaveText('Checkout: Overview');
    await this.btnFinish.click();
    await expect(this.page).toHaveURL(/.*checkout-complete\.html/);
  }

  async verifyOrderConfirmation(expectedMessage: string = 'Thank you for your order!'): Promise<void> {
    await expect(this.pageTitle).toHaveText('Checkout: Complete!');
    await expect(this.lblCompleteHeader).toBeVisible();
    await expect(this.lblCompleteHeader).toHaveText(expectedMessage);
  }
}

