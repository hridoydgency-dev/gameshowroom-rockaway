/** Mobile/desktop screenshot QA across the brief's required widths. Usage: tsx scripts/screens.ts [/path ...] */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { serve } from './serve';

const widths = [320, 375, 390, 414, 768, 1280];
const paths = process.argv.slice(2).length ? process.argv.slice(2) : ['/'];
const out = 'qa-artifacts/screens';
mkdirSync(out, { recursive: true });
const server = await serve();
const browser = await chromium.launch();
const problems: string[] = [];
for (const p of paths) {
  for (const w of widths) {
    const page = await browser.newPage({ viewport: { width: w, height: 900 }, deviceScaleFactor: 1 });
    await page.goto('http://localhost:4173' + p, { waitUntil: 'load' });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (overflow > 0) problems.push(`${p} @${w}px horizontal overflow ${overflow}px`);
    const small = await page.evaluate(() =>
      [...document.querySelectorAll('a,button,summary,input,select,textarea')]
        .filter((e) => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && (r.height < 24) && !e.closest('p,li,dd,address') && !e.closest('.sr-only'); })
        .map((e) => (e.textContent || e.getAttribute('name') || '').trim().slice(0, 30)),
    );
    if (small.length && w < 768) problems.push(`${p} @${w}px tap targets <24px: ${small.slice(0, 5).join(' | ')}`);
    const name = `${p.replace(/\//g, '_') || '_'}-${w}.png`;
    await page.screenshot({ path: `${out}/${name}`, fullPage: w === 390 || w === 1280 });
    await page.close();
  }
}
await browser.close();
server.close();
console.log(problems.length ? problems.join('\n') : 'No overflow / tap-target problems found');
