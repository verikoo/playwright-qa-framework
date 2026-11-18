// cart.spec.ts
// Cart behavior (scenarios 1.1–1.4 of specs/cart-shopping.test-plan.md).
// First drafted by the Playwright Generator agent, then reviewed and refactored.

import { test, expect } from '../../fixtures/pages';
import { products } from '../../test-data/products';

const { backpack, bikeLight, boltTShirt, onesie } = products;

test.describe('Cart', () => {
  test('fresh cart is empty and Continue Shopping returns to Products', async ({ inventoryPage, cartPage }) => {
    await expect(inventoryPage.cartLink).toHaveAccessibleName('Cart, empty');
    await expect(inventoryPage.cartBadge).toHaveCount(0);

    await inventoryPage.openCart();
    await expect(cartPage.title).toHaveText('Your Cart');
    await expect(cartPage.itemNames).toHaveCount(0);
    await expect(cartPage.checkoutButton).toBeVisible();

    await cartPage.continueShopping();
    await expect(inventoryPage.title).toHaveText('Products');
    await expect(inventoryPage.cartBadge).toHaveCount(0);
  });

  test('adding several products updates the badge and cart contents', async ({ inventoryPage, cartPage }) => {
    const items = [backpack, bikeLight, boltTShirt];

    for (const [index, item] of items.entries()) {
      await inventoryPage.addToCart(item.slug);
      await expect(inventoryPage.cartBadge).toHaveText(String(index + 1));
    }

    await inventoryPage.openCart();
    await expect(cartPage.itemNames).toHaveText(items.map((item) => item.name));
    await expect(cartPage.itemQuantities).toHaveText(['1', '1', '1']);
    await expect(cartPage.itemPrices).toHaveText(items.map((item) => item.price));
  });

  test('Continue Shopping preserves cart selections', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCart(backpack.slug);
    await inventoryPage.addToCart(onesie.slug);
    await expect(inventoryPage.cartBadge).toHaveText('2');

    await inventoryPage.openCart();
    await cartPage.continueShopping();
    await expect(inventoryPage.cartBadge).toHaveText('2');
    await expect(inventoryPage.removeButton(backpack.slug)).toBeVisible();
    await expect(inventoryPage.removeButton(onesie.slug)).toBeVisible();
    await expect(inventoryPage.addToCartButton(bikeLight.slug)).toBeVisible();

    await inventoryPage.openCart();
    await expect(cartPage.itemNames).toHaveText([backpack.name, onesie.name]);
  });

  test('removing items from the cart updates rows and badge until empty', async ({ inventoryPage, cartPage }) => {
    for (const item of [backpack, bikeLight, boltTShirt]) {
      await inventoryPage.addToCart(item.slug);
    }
    await inventoryPage.openCart();

    await cartPage.remove(bikeLight.slug);
    await expect(cartPage.itemNames).toHaveText([backpack.name, boltTShirt.name]);
    await expect(inventoryPage.cartBadge).toHaveText('2');

    await cartPage.remove(backpack.slug);
    await expect(cartPage.itemNames).toHaveText([boltTShirt.name]);
    await expect(inventoryPage.cartBadge).toHaveText('1');

    await cartPage.remove(boltTShirt.slug);
    await expect(cartPage.itemNames).toHaveCount(0);
    await expect(inventoryPage.cartBadge).toHaveCount(0);
    await expect(inventoryPage.cartLink).toHaveAccessibleName('Cart, empty');
  });
});