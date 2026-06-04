import * as dotenv from 'dotenv';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

let envFilesLoaded = false;

export const ensureScoreEnv = (): void => {
  if (envFilesLoaded) return;
  envFilesLoaded = true;
  if (getScoreSecret()) return;

  for (const name of ['.env.local', '.env']) {
    const filePath = path.join(projectRoot, name);
    if (existsSync(filePath)) {
      dotenv.config({ path: filePath });
    }
  }
};

export const getScoreSecret = (): string | undefined => {
  const secret = process.env.SCORE_SECRET?.trim();
  if (!secret || secret.length < 16) return undefined;
  if (secret === 'zmien_na_dlugi_losowy_ciag_znakow') return undefined;
  return secret;
};

export const isScoreSecretConfigured = (): boolean => {
  ensureScoreEnv();
  return Boolean(getScoreSecret());
};
