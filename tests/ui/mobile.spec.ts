// mobile.spec.ts
// Mobile-only checks; they skip themselves on desktop projects.

import { test, expect } from '../../fixtures/pages';

test.describe('Mobile', { tag: '@mobile' }, () => {
    test('products page fits a phone screen', async ({ page, inventoryPage, isMobile }) => {
        test.skip(!isMobile, 'Runs only on mobile projects');

        const viewport = page.viewportSize();
        expect(viewport?.width).toBeLessThan(500);
        await expect(inventoryPage.productNames).toHaveCount(6);
    });

    test('tapping a product opens its details', async ({ page, inventoryPage, isMobile }) => {
        test.skip(!isMobile, 'Runs only on mobile projects');

        await inventoryPage.productNames.first().tap();

        await expect(page).toHaveURL(/inventory-item\.html/);
        await expect(page.getByRole('button', { name: 'Back to products' })).toBeVisible();
    });
});