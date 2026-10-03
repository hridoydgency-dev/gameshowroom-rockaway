/**
 * Local development: build, serve dist/ on http://localhost:4173 and rebuild whenever
 * content/, src/ or public/ changes (e.g. after saving in the local /admin).
 * Usage: npm run dev   (with `npx decap-server` running for local /admin editing)
 */
import { spawnSync } from 'node:child_process';
import { watch } from 'node:fs';
import { resolve } from 'node:path';
import { serve } from './serve';

const ROOT = resolve(import.meta.dirname, '..');
const build = () => {
  const t = Date.now();
  const r = spawnSync(process.execPath, ['--import', 'tsx', 'scripts/build.tsx'], { cwd: ROOT, stdio: 'inherit', env: process.env });
  console.log(r.status === 0 ? `✓ rebuilt in ${Date.now() - t}ms` : '✖ build failed — fix the message above (the previous build is still being served)');
};

build();
await serve(resolve(ROOT, 'dist'), 4173, { admin: resolve(ROOT, 'admin') });
console.log('\n  Site:  http://localhost:4173/\n  Admin: http://localhost:4173/admin/  (needs `npx decap-server` running)\n');

let timer: NodeJS.Timeout | undefined;
for (const dir of ['content', 'src', 'public']) {  // admin/ is served live, no rebuild needed
  watch(resolve(ROOT, dir), { recursive: true }, (_e, file) => {
    clearTimeout(timer);
    timer = setTimeout(() => { console.log(`changed: ${dir}/${file}`); build(); }, 300);
  });
}
