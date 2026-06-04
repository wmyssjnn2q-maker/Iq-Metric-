import * as dotenv from 'dotenv';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

let envFilesLoaded = false;

/** Ładuje .env.local / .env gdy klucz nie jest już w process.env (dev, vercel dev). */
export const ensureResendEnv = (): void => {
  if (envFilesLoaded) return;
  envFilesLoaded = true;
  if (getResendApiKey()) return;

  for (const name of ['.env.local', '.env']) {
    const filePath = path.join(projectRoot, name);
    if (existsSync(filePath)) {
      dotenv.config({ path: filePath });
    }
  }
};

export const getResendApiKey = (): string | undefined => {
  const key = process.env.RESEND_API_KEY?.trim() || process.env.RESEND_KEY?.trim();
  return key || undefined;
};

export const getResendFromEmail = (): string =>
  process.env.RESEND_FROM_EMAIL?.trim() || 'onboarding@resend.dev';

export const getResendFromName = (): string =>
  process.env.RESEND_FROM_NAME?.trim() || 'brainmediq';

export const isResendConfigured = (): boolean => {
  ensureResendEnv();
  return Boolean(getResendApiKey());
};
