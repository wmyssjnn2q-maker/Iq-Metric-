import type { IncomingMessage } from 'node:http';
import { readRawBody } from './stripe/readRawBody';
import { handleStripeWebhookPost } from './stripe/handlers';

export default async function handler(
  req: IncomingMessage & { method?: string; body?: unknown; headers?: Record<string, string | string[] | undefined> },
  res: {
    status: (code: number) => { json: (body: unknown) => void };
  },
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const rawBody = await readRawBody(req);
    const signatureHeader = req.headers?.['stripe-signature'];
    const signature = Array.isArray(signatureHeader) ? signatureHeader[0] : signatureHeader;
    const result = await handleStripeWebhookPost(rawBody, signature);
    return res.status(200).json(result);
  } catch (err) {
    const status = typeof err === 'object' && err !== null && 'status' in err ? Number((err as { status: number }).status) : 500;
    const message = err instanceof Error ? err.message : 'Błąd serwera';
    console.error('[Stripe webhook]', message);
    return res.status(status >= 400 && status < 600 ? status : 500).json({ error: message });
  }
}
