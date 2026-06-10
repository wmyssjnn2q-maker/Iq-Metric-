type ProductId =
  | 'iq_standard'
  | 'iq_pro'
  | 'iq_max'
  | 'osobowosc'
  | 'pamiec'
  | 'koncentracja'
  | 'reakcja'
  | 'alzheimer'
  | 'adhd';

type CheckoutBody = {
  productId?: ProductId;
  email?: string;
  intent?: string | null;
  resultTimestamp?: number | null;
  origin?: string;
};

const PRODUCTS: Record<
  ProductId,
  { name: string; unitAmount: number; priceEnv: string }
> = {
  iq_standard: { name: 'Test IQ Standard + Certyfikat', unitAmount: 499, priceEnv: 'STRIPE_PRICE_IQ_STANDARD' },
  iq_pro: { name: 'Analiza Ekspercka PRO + Certyfikat', unitAmount: 999, priceEnv: 'STRIPE_PRICE_IQ_PRO' },
  iq_max: { name: 'Test IQ MAX + Certyfikat', unitAmount: 499, priceEnv: 'STRIPE_PRICE_IQ_MAX' },
  osobowosc: { name: 'Test Osobowości (Big Five)', unitAmount: 499, priceEnv: 'STRIPE_PRICE_OSOBOWOSC' },
  pamiec: { name: 'Test Pamięci Przestrzennej', unitAmount: 499, priceEnv: 'STRIPE_PRICE_PAMIEC' },
  koncentracja: { name: 'Test Koncentracji (Stroop)', unitAmount: 499, priceEnv: 'STRIPE_PRICE_KONCENTRACJA' },
  reakcja: { name: 'Test Szybkości Reakcji', unitAmount: 499, priceEnv: 'STRIPE_PRICE_REAKCJA' },
  alzheimer: { name: 'Test Funkcji Poznawczych', unitAmount: 499, priceEnv: 'STRIPE_PRICE_ALZHEIMER' },
  adhd: { name: 'Test ADHD (ASRS)', unitAmount: 499, priceEnv: 'STRIPE_PRICE_ADHD' },
};

function getStripeSecretKey(): string | undefined {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key || !/^sk_(test|live)_/.test(key)) return undefined;
  return key;
}

function getAppOrigin(): string {
  const fromEnv =
    process.env.APP_URL?.trim() ||
    process.env.VERCEL_URL?.trim() ||
    process.env.VITE_APP_URL?.trim();
  if (!fromEnv) return 'https://brainmediq.com';
  if (fromEnv.startsWith('http://') || fromEnv.startsWith('https://')) return fromEnv.replace(/\/$/, '');
  return `https://${fromEnv.replace(/\/$/, '')}`;
}

async function readBody(req: { body?: unknown }): Promise<CheckoutBody> {
  if (req.body) {
    return typeof req.body === 'string' ? JSON.parse(req.body) : (req.body as CheckoutBody);
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

  const secretKey = getStripeSecretKey();
  if (!secretKey) {
    return res.status(503).json({
      error: 'Stripe nie jest skonfigurowany. Dodaj STRIPE_SECRET_KEY w Vercel.',
      code: 'stripe_not_configured',
    });
  }

  try {
    const body = await readBody(req);
    const productId = body.productId;
    if (!productId || !(productId in PRODUCTS)) {
      return res.status(400).json({ error: 'Nieprawidłowy productId.' });
    }

    const email = body.email?.trim().toLowerCase();
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Podaj poprawny adres e-mail.' });
    }

    const product = PRODUCTS[productId];
    const intent = body.intent ?? null;
    const origin = body.origin?.replace(/\/$/, '') || getAppOrigin();

    const priceId = process.env[product.priceEnv]?.trim();
    const lineItem = priceId?.startsWith('price_')
      ? { price: priceId, quantity: 1 }
      : {
          quantity: 1,
          price_data: {
            currency: 'pln',
            unit_amount: product.unitAmount,
            product_data: { name: product.name, metadata: { productId } },
          },
        };

    const successUrl = `${origin}/platnosc/sukces?session_id={CHECKOUT_SESSION_ID}`;
    const cancelType = productId === 'iq_standard' ? 'standard' : productId;
    const cancelParams = new URLSearchParams({ type: cancelType });
    if (intent) cancelParams.set('intent', intent);
    const cancelUrl = `${origin}/platnosc/anulowano?${cancelParams.toString()}`;

    const metadata: Record<string, string> = {
      productId,
      intent: intent ?? '',
      email,
    };
    if (body.resultTimestamp) {
      metadata.resultTimestamp = String(body.resultTimestamp);
    }

    const { default: Stripe } = await import('stripe');
    const stripe = new Stripe(secretKey);
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: email,
      line_items: [lineItem],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata,
      locale: 'pl',
    });

    if (!session.url) {
      return res.status(500).json({ error: 'Stripe nie zwrócił URL checkoutu.' });
    }

    return res.status(200).json({ url: session.url, sessionId: session.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Błąd serwera';
    console.error('[create-checkout-session]', message);
    return res.status(500).json({ error: message });
  }
}
