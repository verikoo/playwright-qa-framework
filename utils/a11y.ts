// a11y.ts
// Runs an axe accessibility scan, attaches the full report, and returns blocking violations.

import { test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const BLOCKING_IMPACTS = ['serious', 'critical'];

/** Returns the ids of serious/critical violations that are not in the allow list. */
export async function scanA11y(page: Page, knownIssues: string[] = []): Promise<string[]> {
    const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();

    await test.info().attach('a11y-report', {
        body: JSON.stringify(results.violations, null, 2),
        contentType: 'application/json',
    });

    return results.violations
        .filter((violation) => BLOCKING_IMPACTS.includes(violation.impact ?? ''))
        .map((violation) => violation.id)
        .filter((id) => !knownIssues.includes(id));
}