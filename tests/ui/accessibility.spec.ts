// accessibility.spec.ts
// Accessibility checks: automated axe scans + a keyboard-only login.

import { test, expect } from '../../fixtures/pages';
import { scanA11y } from '../../utils/a11y';
import { users } from '../../test-data/users';

// Known issues found on the first run go here (with a comment), so new issues still fail the test
const KNOWN_A11Y_ISSUES: string[] = [
    'select-name', // sort dropdown has no label (found 2026-11-13)
];

test.describe('Accessibility', { tag: '@a11y' }, () => {
    test('products page has no new serious accessibility issues', async ({ page, inventoryPage }) => {
        await expect(inventoryPage.title).toHaveText('Products');

        const blocking = await scanA11y(page, KNOWN_A11Y_ISSUES);

        expect(blocking, 'Serious/critical accessibility violations').toEqual([]);
    });

    test.describe('logged out', () => {
        test.use({ storageState: { cookies: [], origins: [] } });

        test('login page has no new serious accessibility issues', async ({ page, loginPage }) => {
            await loginPage.goto();

            const blocking = await scanA11y(page, KNOWN_A11Y_ISSUES);

            expect(blocking, 'Serious/critical accessibility violations').toEqual([]);
        });

        test('user can log in with the keyboard only', async ({ page, loginPage }) => {
            await loginPage.goto();

            await loginPage.usernameInput.focus();
            await page.keyboard.type(users.standard.username);
            await page.keyboard.press('Tab');
            await expect(loginPage.passwordInput).toBeFocused();
            await page.keyboard.type(users.standard.password);
            await page.keyboard.press('Enter');

            await expect(page).toHaveURL(/inventory\.html/);
        });
    });
});