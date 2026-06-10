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

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  const secretKey = process.env.STRIPE_SECRET_KEY?.trim();
  if (!webhookSecret?.startsWith('whsec_') || !secretKey) {
    return res.status(500).json({ error: 'Brak STRIPE_WEBHOOK_SECRET lub STRIPE_SECRET_KEY.' });
  }

  const signatureHeader = req.headers?.['stripe-signature'];
  const signature = Array.isArray(signatureHeader) ? signatureHeader[0] : signatureHeader;
  if (!signature) {
    return res.status(400).json({ error: 'Brak nagłówka stripe-signature.' });
  }

  try {
    const rawBody = await readRawBody(req);
    const { default: Stripe } = await import('stripe');
    const stripe = new Stripe(secretKey);
    const event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as { id?: string; metadata?: Record<string, string> };
      console.log(
        `[Stripe webhook] checkout.session.completed session=${session.id} product=${session.metadata?.productId}`,
      );
    }

    return res.status(200).json({ received: true, type: event.type });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Błąd serwera';
    console.error('[stripe-webhook]', message);
    return res.status(400).json({ error: message });
  }
}
