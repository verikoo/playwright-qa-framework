// performance.ts
// Reads page timings and Core Web Vitals from the browser, and emulates a slow phone (Chromium only).

import { type Page } from '@playwright/test';

export interface PageMetrics {
    ttfb: number;              // ms until the first byte of the page arrived
    domContentLoaded: number;  // ms until the HTML was parsed
    load: number;              // ms until all files finished loading
    lcp: number;               // ms until the largest content appeared (-1 = not reported)
    cls: number;               // layout shift score, 0 = perfectly stable
    transferKB: number;        // total downloaded size in KB
}

/** Collects metrics for the page's current navigation. Call after page.goto(). */
export async function collectMetrics(page: Page): Promise<PageMetrics> {
    return page.evaluate(async () => {
        const lcp = await new Promise<number>((resolve) => {
            new PerformanceObserver((list) => {
                const entries = list.getEntries();
                resolve(entries[entries.length - 1].startTime);
            }).observe({ type: 'largest-contentful-paint', buffered: true });
            setTimeout(() => resolve(-1), 3000);
        });

        let cls = 0;
        for (const entry of performance.getEntriesByType('layout-shift') as any[]) {
            if (!entry.hadRecentInput) cls += entry.value;
        }

        const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
        const bytes = resources.reduce((sum, r) => sum + r.transferSize, nav.transferSize);

        return {
            ttfb: Math.round(nav.responseStart),
            domContentLoaded: Math.round(nav.domContentLoadedEventEnd),
            load: Math.round(nav.loadEventEnd),
            lcp: Math.round(lcp),
            cls: Number(cls.toFixed(3)),
            transferKB: Math.round(bytes / 1024),
        };
    });
}

/** Makes Chromium behave like a phone on slow 4G (same settings as Lighthouse mobile). */
export async function emulateSlowPhone(page: Page): Promise<void> {
    const client = await page.context().newCDPSession(page);
    await client.send('Network.enable');
    await client.send('Network.emulateNetworkConditions', {
        offline: false,
        latency: 150,                                 // ms per round trip
        downloadThroughput: (1.6 * 1024 * 1024) / 8,  // 1.6 Mbps, in bytes per second
        uploadThroughput: (750 * 1024) / 8,           // 750 Kbps
    });
    await client.send('Emulation.setCPUThrottlingRate', { rate: 4 }); // CPU 4x slower
}