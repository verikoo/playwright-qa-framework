// seed.spec.ts
// Starting point for Playwright Test Agents: a logged-in SauceDemo products page,
// using our fixtures so generated tests follow the same patterns.

import { test, expect } from '../../fixtures/pages';

test.describe('Seed', () => {
  test('seed', async ({ inventoryPage }) => {
    await expect(inventoryPage.title).toHaveText('Products');
  });
});
