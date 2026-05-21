import { spawn } from 'node:child_process';
import { config } from 'dotenv';
import { existsSync } from 'node:fs';

const envPath = '.env.local';
if (existsSync(envPath)) {
  config({ path: envPath });
} else {
  console.warn(
    `[dev] Brak pliku ${envPath} — maile nie będą działać. Skopiuj: cp .env.example .env.local`
  );
}

if (!process.env.RESEND_API_KEY?.trim()) {
  console.warn('[dev] Brak RESEND_API_KEY — endpoint /api/send-email zwróci błąd 500.');
}

const commands = [
  ['api', './node_modules/.bin/tsx', ['server.ts']],
  ['vite', './node_modules/.bin/vite', ['--host', '127.0.0.1', '--port', '3000']],
];

const children = commands.map(([name, command, args]) => {
  const child = spawn(command, args, {
    cwd: process.cwd(),
    env: process.env,
    stdio: ['inherit', 'pipe', 'pipe'],
  });

  child.stdout.on('data', (data) => process.stdout.write(`[${name}] ${data}`));
  child.stderr.on('data', (data) => process.stderr.write(`[${name}] ${data}`));

  child.on('exit', (code, signal) => {
    if (code !== 0 && signal !== 'SIGTERM') {
      console.error(`[${name}] exited with code ${code ?? signal}`);
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
