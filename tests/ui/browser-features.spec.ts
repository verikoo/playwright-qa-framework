// browser-features.spec.ts
// New tabs, frames and file upload on The Internet practice site.

import { test, expect } from '@playwright/test';
import * as path from 'path';

const THE_INTERNET = 'https://the-internet.herokuapp.com';

test.describe('Browser features', () => {
    test('link opens a new tab', async ({ page }) => {
        await page.goto(`${THE_INTERNET}/windows`);

        const popupPromise = page.waitForEvent('popup');
        await page.getByRole('link', { name: 'Click Here' }).click();
        const newTab = await popupPromise;

        await expect(newTab.getByRole('heading', { name: 'New Window' })).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Opening a new window' })).toBeVisible();
    });

    test('reads content inside nested frames', async ({ page }) => {
        await page.goto(`${THE_INTERNET}/nested_frames`);

        const bottomFrame = page.frameLocator('frame[name="frame-bottom"]');
        await expect(bottomFrame.locator('body')).toContainText('BOTTOM');

        const middleFrame = page
            .frameLocator('frame[name="frame-top"]')
            .frameLocator('frame[name="frame-middle"]');
        await expect(middleFrame.locator('body')).toContainText('MIDDLE');
    });

    test('uploads a file', async ({ page }) => {
        const filePath = path.resolve(__dirname, '../../test-data/files/sample.txt');
        await page.goto(`${THE_INTERNET}/upload`);

        await page.locator('#file-upload').setInputFiles(filePath);
        await page.getByRole('button', { name: 'Upload' }).click();

        await expect(page.getByRole('heading', { name: 'File Uploaded!' })).toBeVisible();
        await expect(page.locator('#uploaded-files')).toHaveText('sample.txt');
    });
});