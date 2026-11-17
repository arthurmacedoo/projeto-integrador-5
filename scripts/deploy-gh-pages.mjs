// scripts/deploy-gh-pages.mjs
// Gera a versão web do TchôEduca e publica no GitHub Pages (branch gh-pages).
//
//   npm run build:gh-pages   → só gera a pasta dist/ pronta para o Pages
//   npm run deploy:gh-pages  → gera e publica
//
// Link público: https://arthurmacedoo.github.io/projeto-integrador-5/
import { execSync } from 'node:child_process';
import { cpSync, copyFileSync, existsSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const BASE_URL = '/projeto-integrador-5';
const DIST = 'dist';
const publish = process.argv.includes('--publish');

const run = (cmd, opts = {}) => execSync(cmd, { stdio: 'inherit', ...opts });

// 1) Build web estático (SPA) com o subcaminho do GitHub Pages
rmSync(DIST, { recursive: true, force: true });
run('npx expo export -p web --clear', { env: { ...process.env, EXPO_BASE_URL: BASE_URL } });

// 2) Ajustes do GitHub Pages:
//    - 404.html = index.html → links diretos/recarregar página em rotas internas funcionam
//    - .nojekyll → o Pages não ignora a pasta "_expo"
copyFileSync(join(DIST, 'index.html'), join(DIST, '404.html'));
writeFileSync(join(DIST, '.nojekyll'), '');
console.log('\n✔ Build pronto em dist/');

if (!publish) process.exit(0);

// 3) Publica na branch gh-pages usando um worktree temporário
const worktree = mkdtempSync(join(tmpdir(), 'tchoeduca-gh-pages-'));
try {
  run('git fetch origin gh-pages');
  run(`git worktree add --force "${worktree}" origin/gh-pages --detach`);
  for (const entry of readdirSync(worktree)) {
    if (entry !== '.git') rmSync(join(worktree, entry), { recursive: true, force: true });
  }
  cpSync(DIST, worktree, { recursive: true });
  run('git add --all', { cwd: worktree });
  const changed = execSync('git status --porcelain', { cwd: worktree }).toString().trim();
  if (changed) {
    run('git commit -m "deploy: publica TchoEduca no GitHub Pages"', { cwd: worktree });
    run('git push origin HEAD:gh-pages', { cwd: worktree });
    console.log('\n✔ Publicado: https://arthurmacedoo.github.io/projeto-integrador-5/');
  } else {
    console.log('\nNada mudou desde o último deploy.');
  }
} finally {
  run(`git worktree remove --force "${worktree}"`);
  if (existsSync(worktree)) rmSync(worktree, { recursive: true, force: true });
}
