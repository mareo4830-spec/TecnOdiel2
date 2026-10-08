// Build único para Vercel: landing + portal (SPA de la raíz) y la Oficina Virtual en /oficina/.
import { execSync } from 'node:child_process';
import { cpSync, rmSync } from 'node:fs';

const run = (cmd, opts = {}) => execSync(cmd, { stdio: 'inherit', ...opts });

run('npx vite build');
run('npm install --no-audit --no-fund', { cwd: 'oficina' });
run('npm run build', { cwd: 'oficina', env: { ...process.env, VITE_BASE: '/oficina/' } });
rmSync('dist/oficina', { recursive: true, force: true });
cpSync('oficina/dist', 'dist/oficina', { recursive: true });
