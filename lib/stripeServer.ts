import Stripe from 'stripe';
import { getStripeSecretKey } from './stripeConfig';

let stripeClient: Stripe | null = null;

export const getStripe = (): Stripe => {
  const secretKey = getStripeSecretKey();
  if (!secretKey) {
    throw new Error(
      'Brak konfiguracji STRIPE_SECRET_KEY. Dodaj klucz w Vercel → Environment Variables (Production) i zrób redeploy.',
    );
  }
  if (!stripeClient) {
    stripeClient = new Stripe(secretKey);
  }
  return stripeClient;
};
