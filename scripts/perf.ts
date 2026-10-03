/** Lab Core Web Vitals check (LCP, CLS, TBT proxy, bytes) under mobile throttling via Chromium CDP.
 *  Usage: tsx scripts/perf.ts [baseUrl]  (defaults to local dist server) */
import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'node:fs';
import { serve } from './serve';

const paths = ['/', '/birthday-parties/', '/birthday-parties/kids/', '/game-show-experience/', '/lp/kids-birthday-party/', '/pricing/'];
const base = process.argv[2];
const server = base ? null : await serve(undefined, 4175);
const BASE = base ?? 'http://localhost:4175';
const browser = await chromium.launch();
const rows: any[] = [];
for (const p of paths) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, deviceScaleFactor: 3 });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  // "Slow 4G"-ish + 4x CPU slowdown (Lighthouse mobile defaults)
  await cdp.send('Network.enable');
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  let bytes = 0; let requests = 0;
  page.on('response', async (r) => { requests++; try { bytes += (await r.body()).length; } catch { /* redirects */ } });
  await page.addInitScript(() => {
    (window as any).__cwv = { lcp: 0, cls: 0, longTasks: 0 };
    new PerformanceObserver((l) => { for (const e of l.getEntries()) (window as any).__cwv.lcp = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver((l) => { for (const e of l.getEntries() as any) if (!e.hadRecentInput) (window as any).__cwv.cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
    new PerformanceObserver((l) => { for (const e of l.getEntries()) (window as any).__cwv.longTasks += Math.max(0, e.duration - 50); }).observe({ type: 'longtask', buffered: true });
  });
  await page.goto(BASE + p, { waitUntil: 'load' });
  await page.waitForTimeout(1500);
  const m = await page.evaluate(() => ({ ...(window as any).__cwv, fcp: performance.getEntriesByName('first-contentful-paint')[0]?.startTime ?? 0 }));
  rows.push({ path: p, fcp_ms: Math.round(m.fcp), lcp_ms: Math.round(m.lcp), cls: +m.cls.toFixed(3), tbt_ms: Math.round(m.longTasks), requests, kb: +(bytes / 1024).toFixed(1) });
  await ctx.close();
}
await browser.close(); server?.close();
mkdirSync('qa-artifacts', { recursive: true });
writeFileSync('qa-artifacts/perf.json', JSON.stringify(rows, null, 2));
console.table(rows);
const bad = rows.filter((r) => r.lcp_ms > 2500 || r.cls > 0.1 || r.tbt_ms > 200);
if (bad.length) { console.log('Over budget:', bad.map((b) => b.path)); process.exit(1); }
console.log('All pages within budget (LCP ≤ 2.5s, CLS ≤ 0.1, TBT ≤ 200ms) under throttled mobile lab conditions.');
