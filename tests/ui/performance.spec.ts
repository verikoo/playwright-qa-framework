// performance.spec.ts
// Measures the products page on desktop and on an emulated slow phone (Chromium only).

import { test, expect, devices } from '@playwright/test';
import { collectMetrics, emulateSlowPhone } from '../../utils/performance';

const { defaultBrowserType, ...pixel7 } = devices['Pixel 7'];

test.describe('Performance', { tag: '@perf' }, () => {
  test.skip(({ browserName }) => browserName !== 'chromium', 'Web Vitals APIs and CDP throttling are Chromium-only');

  test('products page metrics on desktop', async ({ page }) => {
    await page.goto('/inventory.html');

    const metrics = await collectMetrics(page);

    console.table(metrics);
    await test.info().attach('metrics-desktop', { body: JSON.stringify(metrics, null, 2), contentType: 'application/json' });
    expect(metrics.lcp).toBeGreaterThan(0);
  });

  test.describe('slow phone', () => {
    test.use(pixel7);

    test('products page metrics on a slow 4G phone', async ({ page }) => {
      await emulateSlowPhone(page);
      await page.goto('/inventory.html');

      const metrics = await collectMetrics(page);

      console.table(metrics);
      await test.info().attach('metrics-slow-phone', { body: JSON.stringify(metrics, null, 2), contentType: 'application/json' });
      expect(metrics.lcp).toBeGreaterThan(0);
    });
  });
});