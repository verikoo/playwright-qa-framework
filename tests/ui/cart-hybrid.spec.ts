// cart-hybrid.spec.ts
// Hybrid test: set up the cart directly in browser storage (fast), then verify it in the UI.

import { test, expect } from '../../fixtures/pages';

// Product ids used by SauceDemo in local storage ('cart-contents')
const BACKPACK_ID = 4;
const BIKE_LIGHT_ID = 0;

test.describe('Cart (hybrid setup)', () => {
    test('cart shows products placed directly in storage', async ({ page, cartPage }) => {
        // Fast setup: write the cart into local storage BEFORE the page loads
        await page.addInitScript((ids) => {
            window.localStorage.setItem('cart-contents', JSON.stringify(ids));
        }, [BACKPACK_ID, BIKE_LIGHT_ID]);

        // Verify in the UI
        await page.goto('/cart.html');
        await expect(cartPage.title).toHaveText('Your Cart');
        await expect(cartPage.itemNames).toHaveCount(2);
        await expect(cartPage.itemNames).toHaveText(['Sauce Labs Backpack', 'Sauce Labs Bike Light']);
    });
});