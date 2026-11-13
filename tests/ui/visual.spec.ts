// visual.spec.ts
// Visual regression: compare pages and elements against saved baseline screenshots.

import { test, expect } from '../../fixtures/pages';

test.describe('Visual regression', { tag: '@visual' }, () => {
    test('login page looks the same', async ({ page, loginPage }) => {
        await loginPage.goto();

        await expect(page).toHaveScreenshot('login-page.png');
    });

    test('products page looks the same', async ({ page, inventoryPage }) => {
        await expect(inventoryPage.title).toHaveText('Products');

        await page.addStyleTag({ content: '[data-test="title"] { color: red !important; }' });

        await expect(page).toHaveScreenshot('products-page.png', { fullPage: true });
    });

    test('backpack card looks the same', async ({ page, inventoryPage }) => {
        await expect(inventoryPage.title).toHaveText('Products');
        // No data-test on the card container, so a CSS class is the fallback here
        const backpackCard = page.locator('.inventory_item').filter({ hasText: 'Sauce Labs Backpack' });

        await expect(backpackCard).toHaveScreenshot('backpack-card.png');
    });
});