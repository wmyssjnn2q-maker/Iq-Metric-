import type { IncomingMessage } from 'node:http';

async function readRawBody(req: IncomingMessage & { body?: unknown }): Promise<Buffer> {
  if (Buffer.isBuffer(req.body)) return req.body;
  if (typeof req.body === 'string') return Buffer.from(req.body);

  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

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
    const { handleStripeWebhookPost } = await import('../lib/stripeApiHandlers');
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
