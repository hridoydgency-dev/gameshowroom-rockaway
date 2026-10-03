/** Minimal static server for dist/ (local preview + QA). Honors trailing-slash dirs, 404.html and _redirects. */
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, extname, resolve } from 'node:path';

const types: Record<string, string> = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.xml': 'application/xml', '.txt': 'text/plain', '.json': 'application/json', '.yml': 'text/yaml; charset=utf-8',
};

export function serve(dir = resolve(import.meta.dirname, '../dist'), port = 4173, opts: { admin?: string } = {}) {
  const redirects = existsSync(join(dir, '_redirects'))
    ? readFileSync(join(dir, '_redirects'), 'utf8').trim().split('\n').map((l) => l.trim().split(/\s+/))
    : [];
  const server = createServer((req, res) => {
    const url = new URL(req.url || '/', 'http://x');
    const p = decodeURIComponent(url.pathname);
    const isAdmin = !!opts.admin && (p === '/admin' || p.startsWith('/admin/'));
    for (const [from, to, code] of isAdmin ? [] : redirects) {
      const wild = from.endsWith('/*');
      if (!(wild ? p.startsWith(from.slice(0, -1)) : p === from)) continue;
      const status = parseInt(code, 10);
      if (status === 404) { res.writeHead(404, { 'Content-Type': types['.html'] }); return res.end(readFileSync(join(dir, '404.html'))); }
      res.writeHead(status, { Location: to }); return res.end();
    }
    if (req.method === 'POST') { res.writeHead(303, { Location: '/thank-you/' }); return res.end(); } // emulate Netlify Forms
    // Local-only admin: served from the repo's /admin folder when enabled (npm run dev), never from dist.
    const base = isAdmin ? opts.admin! : dir;
    let f = base === dir ? join(dir, p) : join(base, p.replace(/^\/admin/, '') || '/');
    if (existsSync(f) && statSync(f).isDirectory()) {
      if (!p.endsWith('/')) { res.writeHead(301, { Location: p + '/' }); return res.end(); }
      f = join(f, 'index.html');
    }
    if (!existsSync(f)) { res.writeHead(404, { 'Content-Type': types['.html'] }); return res.end(readFileSync(join(dir, '404.html'))); }
    res.writeHead(200, { 'Content-Type': types[extname(f)] || 'application/octet-stream' });
    res.end(readFileSync(f));
  });
  return new Promise<typeof server>((r) => server.listen(port, () => r(server)));
}

if (process.argv[1]?.endsWith('serve.ts')) serve().then(() => console.log('http://localhost:4173'));
