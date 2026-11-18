import { test, expect } from '../../fixtures/pages';

test.describe('Cart', () => {
  test('Fresh cart is empty and Continue Shopping returns to Products', async ({ inventoryPage, cartPage }) => {
    // 1. Expect the user is logged in and Products is displayed; the cart is empty with no numeric badge.
    await expect(inventoryPage.title).toHaveText('Products');
    await expect(inventoryPage.cartLink).toHaveAccessibleName('Cart, empty');
    await expect(inventoryPage.cartBadge).toHaveCount(0);

    // 2. Open the empty cart and verify its empty state and available actions.
    await inventoryPage.openCart();
    await expect(cartPage.title).toHaveText('Your Cart');
    await expect(cartPage.itemNames).toHaveCount(0);
    await expect(cartPage.page.getByRole('button', { name: 'Remove' })).toHaveCount(0);
    await expect(cartPage.page.getByRole('button', { name: 'Continue Shopping' })).toBeVisible();
    await expect(cartPage.checkoutButton).toBeVisible();
    await expect(inventoryPage.cartLink).toHaveAccessibleName('Cart, empty');
    await expect(inventoryPage.cartBadge).toHaveCount(0);

    // 3. Return to Products and verify the cart remains empty.
    await cartPage.page.getByRole('button', { name: 'Continue Shopping' }).click();
    await expect(inventoryPage.title).toHaveText('Products');
    await expect(inventoryPage.cartLink).toHaveAccessibleName('Cart, empty');
    await expect(inventoryPage.cartBadge).toHaveCount(0);
  });

  test('Adding several products updates the badge and cart contents', async ({ inventoryPage, cartPage }) => {
    // 1. Add Sauce Labs Backpack and verify the badge count.
    await inventoryPage.addToCart('sauce-labs-backpack');
    await expect(inventoryPage.cartBadge).toHaveText('1');

    // 2. Add Bike Light and Bolt T-Shirt, verifying each badge update.
    await inventoryPage.addToCart('sauce-labs-bike-light');
    await expect(inventoryPage.cartBadge).toHaveText('2');
    await inventoryPage.addToCart('sauce-labs-bolt-t-shirt');
    await expect(inventoryPage.cartBadge).toHaveText('3');

    // 3. Open the cart and verify its exact contents, quantities, prices, and badge.
    await inventoryPage.openCart();
    await expect(cartPage.title).toHaveText('Your Cart');
    await expect(cartPage.itemNames).toHaveText([
      'Sauce Labs Backpack',
      'Sauce Labs Bike Light',
      'Sauce Labs Bolt T-Shirt',
    ]);
    await expect(cartPage.page.getByTestId('item-quantity')).toHaveText(['1', '1', '1']);
    await expect(cartPage.page.getByTestId('inventory-item-price')).toHaveText([
      '$29.99',
      '$9.99',
      '$15.99',
    ]);
    await expect(inventoryPage.cartBadge).toHaveText('3');
  });

  test('Continue Shopping preserves cart selections', async ({ inventoryPage, cartPage }) => {
    // 1. Add Backpack and Onesie and verify the badge count.
    await inventoryPage.addToCart('sauce-labs-backpack');
    await inventoryPage.addToCart('sauce-labs-onesie');
    await expect(inventoryPage.cartBadge).toHaveText('2');

    // 2. Open the cart, continue shopping, and verify selected and unselected product actions.
    await inventoryPage.openCart();
    await cartPage.page.getByRole('button', { name: 'Continue Shopping' }).click();
    await expect(inventoryPage.title).toHaveText('Products');
    await expect(inventoryPage.cartBadge).toHaveText('2');
    await expect(inventoryPage.removeButton('sauce-labs-backpack')).toBeVisible();
    await expect(inventoryPage.removeButton('sauce-labs-onesie')).toBeVisible();
    await expect(inventoryPage.addToCartButton('sauce-labs-bike-light')).toBeVisible();

    // 3. Reopen the cart and verify both selections remain with quantity 1.
    await inventoryPage.openCart();
    await expect(cartPage.itemNames).toHaveText(['Sauce Labs Backpack', 'Sauce Labs Onesie']);
    await expect(cartPage.page.getByTestId('item-quantity')).toHaveText(['1', '1']);
    await expect(inventoryPage.cartBadge).toHaveText('2');
  });

  test('Removing selected items updates rows and badge through empty', async ({ inventoryPage, cartPage }) => {
    // 1. Add Backpack, Bike Light, and Bolt T-Shirt, then verify the initial cart.
    await inventoryPage.addToCart('sauce-labs-backpack');
    await inventoryPage.addToCart('sauce-labs-bike-light');
    await inventoryPage.addToCart('sauce-labs-bolt-t-shirt');
    await inventoryPage.openCart();
    await expect(cartPage.itemNames).toHaveText([
      'Sauce Labs Backpack',
      'Sauce Labs Bike Light',
      'Sauce Labs Bolt T-Shirt',
    ]);
    await expect(inventoryPage.cartBadge).toHaveText('3');

    // 2. Remove Bike Light and verify the other two products remain.
    await cartPage.page.getByTestId('remove-sauce-labs-bike-light').click();
    await expect(cartPage.itemNames).toHaveText(['Sauce Labs Backpack', 'Sauce Labs Bolt T-Shirt']);
    await expect(inventoryPage.cartBadge).toHaveText('2');

    // 3. Remove Backpack and Bolt T-Shirt in turn, verifying the badge reaches an absent state.
    await cartPage.page.getByTestId('remove-sauce-labs-backpack').click();
    await expect(cartPage.itemNames).toHaveText(['Sauce Labs Bolt T-Shirt']);
    await expect(inventoryPage.cartBadge).toHaveText('1');
    await cartPage.page.getByTestId('remove-sauce-labs-bolt-t-shirt').click();
    await expect(cartPage.itemNames).toHaveCount(0);
    await expect(inventoryPage.cartBadge).toHaveCount(0);
    await expect(inventoryPage.cartLink).toHaveAccessibleName('Cart, empty');
    await expect(cartPage.page.getByRole('button', { name: 'Continue Shopping' })).toBeVisible();
    await expect(cartPage.checkoutButton).toBeVisible();
  });
});
