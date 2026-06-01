import { spawn } from 'node:child_process';
import { config } from 'dotenv';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(root, '..');
const node = process.execPath;

const envPath = path.join(projectRoot, '.env.local');
if (existsSync(envPath)) {
  config({ path: envPath });
} else {
  console.warn('[dev] Brak .env.local — maile mogą nie działać. Skopiuj: cp .env.example .env.local');
}

if (!process.env.RESEND_API_KEY?.trim()) {
  console.warn('[dev] Brak RESEND_API_KEY — /api/send-email zwróci błąd.');
}

const viteBin = path.join(projectRoot, 'node_modules/vite/bin/vite.js');
const tsxBin = path.join(projectRoot, 'node_modules/tsx/dist/cli.mjs');

const commands = [
  ['api', node, [tsxBin, path.join(projectRoot, 'server.ts')]],
  ['vite', node, [viteBin, '--host', '127.0.0.1', '--port', '3000']],
];

const children = commands.map(([name, command, args]) => {
  const child = spawn(command, args, {
    cwd: projectRoot,
    env: process.env,
    stdio: ['inherit', 'pipe', 'pipe'],
  });

  child.stdout.on('data', (data) => process.stdout.write(`[${name}] ${data}`));
  child.stderr.on('data', (data) => process.stderr.write(`[${name}] ${data}`));

  child.on('exit', (code, signal) => {
    if (shuttingDown) return;
    if (code !== 0 && signal !== 'SIGTERM') {
      console.error(`[${name}] zakończył się (kod ${code ?? signal}). Zatrzymuję pozostałe procesy.`);
      shutdown(code ?? 1);
    }
  });

  return child;
});

let shuttingDown = false;

function shutdown(code = 0) {
  if (shuttingDown) return;
  shuttingDown = true;
  children.forEach((child) => {
    if (!child.killed) child.kill('SIGTERM');
  });
  setTimeout(() => process.exit(typeof code === 'number' ? code : 1), 150);
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));

console.log('[dev] Frontend: http://127.0.0.1:3000/');
console.log('[dev] API:      http://127.0.0.1:3002/');
