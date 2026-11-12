// mocking.spec.ts
// Network mocking: replace, modify and block requests to test scenarios the real server can't easily give us.

import { test, expect } from '@playwright/test';

const FRUITS_DEMO = 'https://demo.playwright.dev/api-mocking';
const FRUITS_API = '*/**/api/v1/fruits';

test.describe('Network mocking', () => {
    test('replaces the API response with fake data', async ({ page }) => {
        await page.route(FRUITS_API, async (route) => {
            await route.fulfill({ json: [{ name: 'Strawberry', id: 21 }] });
        });

        await page.goto(FRUITS_DEMO);

        await expect(page.getByText('Strawberry')).toBeVisible();
    });

    test('modifies the real API response', async ({ page }) => {
        await page.route(FRUITS_API, async (route) => {
            const response = await route.fetch();
            const fruits = await response.json();
            fruits.push({ name: 'Loquat', id: 100 });
            await route.fulfill({ response, json: fruits });
        });

        await page.goto(FRUITS_DEMO);

        await expect(page.getByText('Loquat')).toBeVisible();
    });

    test('shows a very long fruit name (edge case)', async ({ page }) => {
        const longName = 'Super'.repeat(20) + 'fruit';

        await page.route(FRUITS_API, async (route) => {
            await route.fulfill({ json: [{ name: longName, id: 1 }] });
        });

        await page.goto(FRUITS_DEMO);

        await expect(page.getByText(longName)).toBeVisible();
    });

    test('SauceDemo products still load when images are blocked', async ({ page }) => {
        // Block every image request: tests that the page works without them (and loads faster)
        await page.route('**/*.{png,jpg,jpeg,svg}', (route) => route.abort());

        await page.goto('https://www.saucedemo.com/inventory.html');

        await expect(page.getByTestId('inventory-item-name')).toHaveCount(6);
    });
});