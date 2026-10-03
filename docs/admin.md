# Site admin (WordPress-style) — /admin/

The site has a WordPress-like admin at **`/admin/`** powered by [Decap CMS](https://decapcms.org) (open source, free).
Editors log in with GitHub, edit with forms, upload photos and click **Publish**. Each publish is a Git commit
to `main`; Netlify rebuilds in ~1–2 minutes. If an edit is invalid (e.g. a wrong phone format), the build stops
with a clear message in the Netlify deploy log and **the live site stays on the previous version**.

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
| Blog posts | `content/blog/*.md` | /blog/ and each post (new posts appear automatically) |
| SEO titles | `content/seo.json` | Google title + description per page |

Page layouts and long-form page copy stay in code (`src/pages/*.tsx`) on purpose — they are built around search data and tested.

### Tokens
Write these in any text field; they are replaced on publish: `%PRICE%` (price per guest), `%HOURS%` (opening hours), `%PHONE%`.

## One-time setup (≈5 minutes, done by the GitHub repo owner)

1. **Create a GitHub OAuth app** — GitHub → Settings → Developer settings → OAuth Apps → **New OAuth App**
   - Application name: `Game Show Room Admin`
   - Homepage URL: `https://gameshowroom-rockaway.netlify.app` (change to the real domain at launch)
   - Authorization callback URL: **`https://api.netlify.com/auth/done`**
   - Register → copy the **Client ID** → **Generate a new client secret** → copy it.
2. **Connect it in Netlify** — Project → **Project configuration → Access & security → OAuth → Authentication providers → Install provider → GitHub** → paste Client ID + Client secret → Install.
3. Open **`/admin/`** on the site → **Login with GitHub** → Authorize.

### Adding editors
Anyone who should edit needs **write access** to `hridoydgency-dev/gameshowroom-rockaway` (GitHub repo → Settings → Collaborators → Add people). They then log in at `/admin/` with their own GitHub account.

## Good to know
- `/admin/` is excluded from search (noindex header + robots.txt).
- Uploaded photos are committed to `public/images/uploads/`; keep them under ~500 KB (resize to ~1600px wide).
- Want drafts and review before publishing (like WordPress "Pending review")? Add `publish_mode: editorial_workflow` to `public/admin/config.yml`; edits then open pull requests and Netlify builds a preview for each.
- Developers editing locally: change the same files under `content/`, run `npm run check`, push.
