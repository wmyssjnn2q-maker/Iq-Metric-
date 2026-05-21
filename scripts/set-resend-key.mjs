#!/usr/bin/env node
/**
 * Ustawia RESEND_API_KEY w .env.local
 * Użycie: node scripts/set-resend-key.mjs re_twoj_pelny_klucz
 *    lub: pbpaste | node scripts/set-resend-key.mjs
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const envPath = resolve(root, '.env.local');

let key = process.argv[2]?.trim();
if (!key && !process.stdin.isTTY) {
  key = await new Promise((res) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (c) => (data += c));
    process.stdin.on('end', () => res(data.trim()));
  });
}

if (!key || !/^re_[A-Za-z0-9_]+$/.test(key)) {
  console.error('Podaj pełny klucz Resend (zaczyna się od re_):');
  console.error('  node scripts/set-resend-key.mjs re_...');
  process.exit(1);
}

const template = existsSync(envPath)
  ? readFileSync(envPath, 'utf8')
  : readFileSync(resolve(root, '.env.example'), 'utf8');

const updated = template.includes('RESEND_API_KEY=')
  ? template.replace(/RESEND_API_KEY=.*/m, `RESEND_API_KEY=${key}`)
  : `${template.trim()}\nRESEND_API_KEY=${key}\n`;

writeFileSync(envPath, updated, 'utf8');
console.log(`Zapisano ${envPath} (klucz: ${key.slice(0, 12)}…)`);
