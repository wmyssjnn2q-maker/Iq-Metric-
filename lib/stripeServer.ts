import type Stripe from 'stripe';
import { getStripeSecretKey } from './stripeConfig';

let stripeClient: Stripe | null = null;

export const getStripe = async (): Promise<Stripe> => {
  const secretKey = getStripeSecretKey();
  if (!secretKey) {
    throw new Error(
      'Brak konfiguracji STRIPE_SECRET_KEY. Dodaj klucz w Vercel → Environment Variables (Production) i zrób redeploy.',
    );
  }
  if (!stripeClient) {
    const { default: StripeSdk } = await import('stripe');
    stripeClient = new StripeSdk(secretKey);
  }
  return stripeClient;
};
