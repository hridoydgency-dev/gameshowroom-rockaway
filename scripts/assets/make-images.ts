/** Generates raster brand assets (OG image, logo, icons) from the brand logo + venue photo via headless Chromium. */
import { chromium } from 'playwright';
import { mkdirSync, readFileSync } from 'node:fs';

mkdirSync('public/images', { recursive: true });
const data = (path: string, type: string) => `data:${type};base64,${readFileSync(path).toString('base64')}`;
const emblem = data('public/images/brand/logo-emblem.svg', 'image/svg+xml');
const photo = data('public/images/brand/home.webp', 'image/webp');
const fontFace = `@font-face{font-family:Oswald;src:url(${data('public/fonts/oswald.woff2', 'font/woff2')})}@font-face{font-family:SS3;src:url(${data('public/fonts/source-sans-3.woff2', 'font/woff2')})}`;

const og = `<html><head><style>${fontFace}</style></head><body style="margin:0;width:1200px;height:630px;position:relative;overflow:hidden;background:#080709;font-family:SS3,Arial,sans-serif;color:#fff">
<img src="${photo}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover">
<div style="position:absolute;inset:0;background:linear-gradient(90deg,rgba(8,7,9,.94) 0%,rgba(8,7,9,.82) 48%,rgba(8,7,9,.25) 100%)"></div>
<div style="position:absolute;left:64px;top:56px;width:640px">
<img src="${emblem}" style="height:120px">
<div style="font-weight:700;letter-spacing:5px;font-size:20px;margin-top:22px;color:#ca9342">ROCKAWAY TOWNSQUARE · NJ</div>
<div style="font-family:Oswald;font-weight:600;font-size:82px;line-height:1.02;margin-top:10px;color:#efe285;text-transform:uppercase">Live game show experience</div>
<div style="display:flex;gap:14px;margin-top:26px;font-size:24px;font-weight:700;text-transform:uppercase">
<span style="background:#d92123;border:1px solid #ff8c8c;border-radius:4px;padding:10px 22px;box-shadow:0 0 16px rgba(255,97,100,.6)">From $33/guest</span>
<span style="border:1px solid #fff;border-radius:4px;padding:10px 22px">60 min · Ages 6+</span></div></div>
<svg viewBox="0 0 1440 26" preserveAspectRatio="none" style="position:absolute;left:0;bottom:18px;width:100%;height:26px"><path d="M0 15 C 60 9, 95 21, 150 16 S 250 7, 320 13 S 420 22, 500 14 S 600 6, 690 12 S 790 21, 880 15 S 980 6, 1060 12 S 1170 22, 1250 15 S 1360 7, 1440 13" fill="none" stroke="#efe285" stroke-width="4"/></svg>
</body></html>`;
const square = (size: number, pad: number) =>
  `<html><body style="margin:0;width:${size}px;height:${size}px;background:#080709;display:flex;align-items:center;justify-content:center"><img src="${emblem}" style="width:${size - pad * 2}px"></body></html>`;

const browser = await chromium.launch();
const p = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await p.setContent(og); await p.waitForTimeout(300); await p.screenshot({ path: 'public/images/og-default.jpg', type: 'jpeg', quality: 84 });
for (const [file, size, pad] of [['public/images/logo.png', 512, 24], ['public/images/apple-touch-icon.png', 180, 14], ['public/favicon.png', 64, 3]] as const) {
  await p.setViewportSize({ width: size, height: size });
  await p.setContent(square(size, pad)); await p.waitForTimeout(150);
  await p.screenshot({ path: file });
}
await browser.close();
console.log('images written');
