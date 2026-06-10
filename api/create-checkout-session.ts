import {
  handleCreateCheckoutSessionPost,
  type CreateCheckoutSessionBody,
} from '../lib/stripeApiHandlers';
import { isStripeConfigured } from '../lib/stripeConfig';

async function readBody(req: { body?: unknown }): Promise<CreateCheckoutSessionBody> {
  if (req.body) {
    return typeof req.body === 'string' ? JSON.parse(req.body) : (req.body as CreateCheckoutSessionBody);
  }
  return {};
}

export default async function handler(
  req: { method?: string; body?: unknown },
  res: {
    status: (code: number) => { json: (body: unknown) => void };
  },
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!isStripeConfigured()) {
    return res.status(503).json({
      error:
        'Stripe nie jest skonfigurowany. Dodaj STRIPE_SECRET_KEY i STRIPE_PUBLISHABLE_KEY w Vercel → Environment Variables.',
      code: 'stripe_not_configured',
    });
  }

  try {
    const body = await readBody(req);
    const result = await handleCreateCheckoutSessionPost(body);
    return res.status(200).json(result);
  } catch (err) {
    const status = typeof err === 'object' && err !== null && 'status' in err ? Number((err as { status: number }).status) : 500;
    const message = err instanceof Error ? err.message : 'Błąd serwera';
    return res.status(status >= 400 && status < 600 ? status : 500).json({ error: message });
  }
}
