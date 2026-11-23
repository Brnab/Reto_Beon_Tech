import { Page, Locator, expect } from '@playwright/test';
import { SelectedProduct } from './landingpage';

export class CartPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly cartItems: Locator;
  readonly btnCheckout: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('[data-test="title"]');
    this.cartItems = page.locator('[data-test="inventory-item"]');
    this.btnCheckout = page.locator('[data-test="checkout"]');
  }

  async verifyCartItemsAndQuantity(expectedProducts: SelectedProduct[]): Promise<void> {
    await expect(this.pageTitle).toHaveText('Your Cart');
    await expect(this.cartItems).toHaveCount(expectedProducts.length);

    for (let i = 0; i < expectedProducts.length; i++) {
      const expected = expectedProducts[i];
      const cartItem = this.cartItems.filter({ hasText: expected.name });

      await expect(cartItem).toBeVisible();
      await expect(cartItem.locator('[data-test="inventory-item-name"]')).toHaveText(expected.name);
      await expect(cartItem.locator('[data-test="inventory-item-price"]')).toHaveText(expected.price);
      await expect(cartItem.locator('[data-test="item-quantity"]')).toHaveText('1');
    }
  }

  async proceedToCheckout(): Promise<void> {
    await this.btnCheckout.click();
    await expect(this.page).toHaveURL(/.*checkout-step-one\.html/);
  }
}

