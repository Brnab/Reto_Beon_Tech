import { Page, Locator, expect } from '@playwright/test';

export interface SelectedProduct {
  name: string;
  price: string;
}

export class LandingPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly inventoryItems: Locator;
  readonly itembackPack: Locator;
  readonly itemFleeceJacketle: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('[data-test="title"]');
    this.inventoryItems = page.locator('[data-test="inventory-item"]');
    this.itembackPack = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');
    this.itemFleeceJacketle = page.locator('[data-test="add-to-cart-sauce-labs-fleece-jacket"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
  }

  async verifyOnInventoryPage(): Promise<void> {
    await expect(this.page).toHaveURL(/.*inventory\.html/);
    await expect(this.pageTitle).toHaveText('Products');
  }

  async selectItems(): Promise<void> {
    await this.itemFleeceJacketle.click();
    await this.itembackPack.click();
  }

  /**
   * Dynamically selects N distinct items from the inventory list,
   * clicks their "Add to cart" button, and returns their names and prices.
   */
  async addDistinctItemsDynamically(count: number = 2): Promise<SelectedProduct[]> {
    await this.verifyOnInventoryPage();
    const totalItems = await this.inventoryItems.count();
    expect(totalItems).toBeGreaterThanOrEqual(count);

    // Create an array of available indices and pick `count` distinct ones dynamically
    const availableIndices = Array.from({ length: totalItems }, (_, i) => i);
    for (let i = availableIndices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [availableIndices[i], availableIndices[j]] = [availableIndices[j], availableIndices[i]];
    }
    const chosenIndices = availableIndices.slice(0, count);

    const selectedProducts: SelectedProduct[] = [];

    for (const index of chosenIndices) {
      const itemCard = this.inventoryItems.nth(index);
      const name = (await itemCard.locator('[data-test="inventory-item-name"]').innerText()).trim();
      const price = (await itemCard.locator('[data-test="inventory-item-price"]').innerText()).trim();
      const addButton = itemCard.locator('button[data-test^="add-to-cart-"]');

      await addButton.click();
      // Wait for button state transition to "Remove"
      await expect(itemCard.locator('button[data-test^="remove-"]')).toBeVisible();

      selectedProducts.push({ name, price });
    }

    await expect(this.cartBadge).toHaveText(String(count));
    return selectedProducts;
  }

  async navigateToCart(): Promise<void> {
    await this.cartLink.click();
    await expect(this.page).toHaveURL(/.*cart\.html/);
  }
}

export { LandingPage as landingPage };
