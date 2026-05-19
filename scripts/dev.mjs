import { spawn } from 'node:child_process';

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
