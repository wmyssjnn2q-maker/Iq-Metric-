export const getResendApiKey = (): string | undefined => {
  const key = process.env.RESEND_API_KEY?.trim() || process.env.RESEND_KEY?.trim();
  return key || undefined;
};

export const getResendFromEmail = (): string =>
  process.env.RESEND_FROM_EMAIL?.trim() || 'onboarding@resend.dev';

export const getResendFromName = (): string =>
  process.env.RESEND_FROM_NAME?.trim() || 'brainmediq';

export const isResendConfigured = (): boolean => Boolean(getResendApiKey());

/** Vercel wstrzykuje env — lokalnie ładuj .env.local w server.ts */
export const ensureResendEnv = (): void => {};
