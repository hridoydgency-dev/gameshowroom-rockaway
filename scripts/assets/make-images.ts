/** Generates raster brand assets (OG image, logo, touch icon) from HTML via headless Chromium. */
import { chromium } from 'playwright';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';
import { StageArt } from '../../src/components/StageArt';
import { mkdirSync } from 'node:fs';

mkdirSync('public/images', { recursive: true });
const art = renderToStaticMarkup(createElement(StageArt, { className: 'art' }));
const icon = `<svg viewBox="0 0 40 40" width="100%" height="100%"><rect width="40" height="40" rx="10" fill="#ffc53d" stroke="#15102f" stroke-width="2.5"/><ellipse cx="20" cy="17" rx="10" ry="4.5" fill="#e5336b" stroke="#15102f" stroke-width="2.5"/><path d="M10 17v5c0 2.5 4.5 4.5 10 4.5s10-2 10-4.5v-5" fill="#b8174c" stroke="#15102f" stroke-width="2.5"/><path d="M8 32h24" stroke="#15102f" stroke-width="3" stroke-linecap="round"/></svg>`;
const og = `<html><body style="margin:0;width:1200px;height:630px;background:radial-gradient(120% 80% at 50% 0%,#3b2a9a 0%,#231a57 55%,#15102f 100%);font-family:'DejaVu Sans',Arial,sans-serif;color:#fff;display:flex;align-items:center;gap:40px;padding:0 60px;box-sizing:border-box">
<div style="flex:1.1"><div style="color:#ffc53d;font-weight:700;letter-spacing:4px;font-size:22px">ROCKAWAY TOWNSQUARE · NJ</div>
<div style="font-size:78px;font-weight:900;line-height:1.02;margin-top:14px">Live Game Show Room</div>
<div style="font-size:28px;margin-top:18px;opacity:.92">Birthday parties · Team building</div>
<div style="display:flex;gap:12px;margin-top:28px;font-size:24px;font-weight:700">
<span style="background:#ffc53d;color:#15102f;border-radius:999px;padding:10px 22px;white-space:nowrap">From $33/guest</span>
<span style="border:2px solid #ffffff66;border-radius:999px;padding:10px 22px;white-space:nowrap">60 min · Ages 6+</span></div></div>
<div style="flex:1">${art.replace('class="art"', 'style="width:100%"')}</div></body></html>`;
const browser = await chromium.launch();
const p = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await p.setContent(og); await p.screenshot({ path: 'public/images/og-default.png' });
await p.setViewportSize({ width: 512, height: 512 });
await p.setContent(`<html><body style="margin:0;width:512px;height:512px">${icon}</body></html>`);
await p.screenshot({ path: 'public/images/logo.png', omitBackground: true });
await p.setViewportSize({ width: 180, height: 180 });
await p.setContent(`<html><body style="margin:0;width:180px;height:180px;background:#15102f">${icon}</body></html>`);
await p.screenshot({ path: 'public/images/apple-touch-icon.png' });
await browser.close();
console.log('images written');
