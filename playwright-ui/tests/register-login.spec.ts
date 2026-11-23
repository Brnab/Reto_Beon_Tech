import { test } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { LandingPage } from '../pages/landingpage';
import { CartPage } from '../pages/cart.page';
import { CheckoutPage } from '../pages/checkout.page';

test.describe('Part 2: UI Automation Challenge - SauceDemo (Swag Labs)', () => {
  test('Should complete the critical e-commerce checkout flow selecting two distinct items dynamically', async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new LandingPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    // 1. Login: Use standard_user credentials
    await loginPage.navigateToLogin();
    await loginPage.login('standard_user', 'secret_sauce');

    // 2. Inventory Page: Add exactly two distinct items dynamically
    const selectedItems = await inventoryPage.addDistinctItemsDynamically(2);

    // 3. Cart Verification: Navigate to Cart & Validate items and quantity
    await inventoryPage.navigateToCart();
    await cartPage.verifyCartItemsAndQuantity(selectedItems);

    // 4. Checkout Flow: Complete checkout form
    await cartPage.proceedToCheckout();
    await checkoutPage.fillCheckoutForm('Barbara', 'Gordon', '10001');

    // 5. Final Verification: Complete purchase & Verify message "Thank you for your order!"
    await checkoutPage.finishCheckout();
    await checkoutPage.verifyOrderConfirmation('Thank you for your order!');
  });
});
