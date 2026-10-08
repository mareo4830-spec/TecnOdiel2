// Build único para Vercel: landing + portal (SPA de la raíz) y la Oficina Virtual en /oficina/.
import { execSync } from 'node:child_process';
import { cpSync, rmSync } from 'node:fs';

const run = (cmd, opts = {}) => execSync(cmd, { stdio: 'inherit', ...opts });

run('npx vite build');
run('npm install --no-audit --no-fund', { cwd: 'oficina' });
run('npm run build', {
  cwd: 'oficina',
  env: {
    ...process.env,
    VITE_BASE: '/oficina/',
    // La Oficina Virtual es un proyecto Supabase distinto del de TecnoDiel (leads/portal), con sus
    // propias variables VITE_VD_*. Sin este remapeo, hereda VITE_SUPABASE_URL/ANON_KEY del build
    // raíz y se conecta a la BD equivocada (o arranca en modo demo si esas tampoco están puestas).
    VITE_SUPABASE_URL: process.env.VITE_VD_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: process.env.VITE_VD_SUPABASE_ANON_KEY,
  },
});
rmSync('dist/oficina', { recursive: true, force: true });
cpSync('oficina/dist', 'dist/oficina', { recursive: true });
