# Site admin (WordPress-style) — local only

The site has a WordPress-like admin powered by [Decap CMS](https://decapcms.org) (open source, free).
**It runs only on your computer** at `http://localhost:4173/admin/`. It is never deployed: the build does not
include it and the live site returns 404 for `/admin`.

## Start it (Windows)
1. Install **Node.js LTS** from https://nodejs.org (once).
2. Open **`start-local-dev.bat`** in the project folder. First run installs the tools (~1 minute).
   It opens two windows (keep both open) and your browser at `http://localhost:4173/admin/`:
   - the local site + auto-rebuild (`npm run dev`)
   - the admin's file backend (`npx decap-server`, port 8081)
3. Edit and click **Publish** → the file in `/content` is saved and the local site rebuilds in about a second.
4. Happy with it? Open **`push-updates.bat`** → GitHub → Netlify updates the live site in ~1–2 minutes.

If an edit is invalid (e.g. a wrong phone format) the rebuild stops with a clear message in the dev window,
and the previous version keeps being served; Netlify would also refuse to publish it.

## What can be edited

| Admin menu | File | Shows up on |
|---|---|---|
| Settings → Business info & hours | `content/business.json` | Every page: header, footer, hours, map links, structured data. **Price** flows into every "from $X" via `%PRICE%`. |
| Settings → Site settings | `content/settings.json` | Announcement bar (all pages), homepage headline, GTM ID (turns on tracking) |
| FAQs | `content/faqs.json` | FAQ page + any page whose topic is ticked |
| Reviews | `content/reviews.json` | /reviews/, rating line, review snippets on chosen pages |
| Promotions | `content/promotions.json` | Banner on chosen pages between start/end dates |
| Party packages | `content/packages.json` | Package card on birthday, pricing and landing pages |
| Photos | `content/gallery.json` + `public/images/uploads/` | "Inside the room" on the game show page |
| Blog posts | `content/blog/*.md` | /blog/ and each post |
| SEO titles | `content/seo.json` | Google title + description per page |

Tokens usable in any text: `%PRICE%`, `%HOURS%`, `%PHONE%`.

## Files
- `admin/index.html`, `admin/config.yml` — the admin (served only by `npm run dev`).
- `start-local-preview.bat` — read-only preview without Node.js (no editing).
