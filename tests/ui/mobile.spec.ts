// mobile.spec.ts
// Mobile-only checks; the whole group is skipped on desktop projects before any setup runs.

import { test, expect } from '../../fixtures/pages';

test.describe('Mobile', { tag: '@mobile' }, () => {
    test.skip(({ isMobile }) => !isMobile, 'Runs only on mobile projects');

    test('products page fits a phone screen', async ({ page, inventoryPage }) => {
        const viewport = page.viewportSize();
        expect(viewport?.width).toBeLessThan(500);
        await expect(inventoryPage.productNames).toHaveCount(6);
    });

    test('tapping a product opens its details', async ({ page, inventoryPage }) => {
        await inventoryPage.productNames.first().tap();

        await expect(page).toHaveURL(/inventory-item\.html/);
        await expect(page.getByRole('button', { name: 'Back to products' })).toBeVisible();
    });
});