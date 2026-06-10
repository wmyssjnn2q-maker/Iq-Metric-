export const getStripeSecretKey = (): string | undefined => {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key || !/^sk_(test|live)_/.test(key)) return undefined;
  return key;
};

export const getStripePublishableKey = (): string | undefined => {
  const key = process.env.STRIPE_PUBLISHABLE_KEY?.trim() || process.env.VITE_STRIPE_PUBLISHABLE_KEY?.trim();
  if (!key || !/^pk_(test|live)_/.test(key)) return undefined;
  return key;
};

export const getStripeWebhookSecret = (): string | undefined => {
  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  if (!secret || !secret.startsWith('whsec_')) return undefined;
  return secret;
};

export const getAppOrigin = (): string => {
  const fromEnv =
    process.env.APP_URL?.trim() ||
    process.env.VERCEL_URL?.trim() ||
    process.env.VITE_APP_URL?.trim();
  if (!fromEnv) return 'http://localhost:3000';
  if (fromEnv.startsWith('http://') || fromEnv.startsWith('https://')) return fromEnv.replace(/\/$/, '');
  return `https://${fromEnv.replace(/\/$/, '')}`;
};

export const isStripeConfigured = (): boolean => Boolean(getStripeSecretKey());

export const getStripePriceIdForProduct = (stripePriceEnvKey: string): string | undefined => {
  const value = process.env[stripePriceEnvKey]?.trim();
  if (!value || !value.startsWith('price_')) return undefined;
  return value;
};
