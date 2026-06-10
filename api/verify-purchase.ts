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

const IQ_PRODUCTS = new Set<ProductId>(['iq_standard', 'iq_pro', 'iq_max']);

const PRODUCT_NAMES: Record<ProductId, string> = {
  iq_standard: 'Test IQ Standard + Certyfikat',
  iq_pro: 'Analiza Ekspercka PRO + Certyfikat',
  iq_max: 'Test IQ MAX + Certyfikat',
  osobowosc: 'Test Osobowości (Big Five)',
  pamiec: 'Test Pamięci Przestrzennej',
  koncentracja: 'Test Koncentracji (Stroop)',
  reakcja: 'Test Szybkości Reakcji',
  alzheimer: 'Test Funkcji Poznawczych',
  adhd: 'Test ADHD (ASRS)',
};

const DEFAULT_REDIRECT: Record<ProductId, string> = {
  iq_standard: '/raport',
  iq_pro: '/raport',
  iq_max: '/raport',
  osobowosc: '/test-osobowosci',
  pamiec: '/test-pamieci',
  koncentracja: '/test-koncentracji',
  reakcja: '/test-reakcji',
  alzheimer: '/test-funkcji-poznawczych',
  adhd: '/test-adhd',
};

function resolveRedirectPath(productId: ProductId, intent: string | null, hasIqStats: boolean): string {
  if (IQ_PRODUCTS.has(productId)) {
    if (intent === 'unlock' || hasIqStats) return '/raport';
    if (productId === 'iq_pro') return '/test?type=pro';
    if (productId === 'iq_max') return '/test?type=max';
    return '/test';
  }
  return DEFAULT_REDIRECT[productId];
}

function buildEntitlements(productId: ProductId) {
  const isIq = IQ_PRODUCTS.has(productId);
  return {
    isPaid: isIq,
    isPro: productId === 'iq_pro',
    isMax: productId === 'iq_max',
    auxiliaryTestId: isIq ? null : productId,
  };
}

function getStripeSecretKey(): string | undefined {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key || !/^sk_(test|live)_/.test(key)) return undefined;
  return key;
}

async function readBody(req: { body?: unknown }): Promise<{ sessionId?: string }> {
  if (req.body) {
    return typeof req.body === 'string' ? JSON.parse(req.body) : (req.body as { sessionId?: string });
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
    return res.status(503).json({ error: 'Stripe nie jest skonfigurowany.', code: 'stripe_not_configured' });
  }

  try {
    const { sessionId } = await readBody(req);
    if (!sessionId?.trim().startsWith('cs_')) {
      return res.status(400).json({ error: 'Brak lub nieprawidłowy sessionId.' });
    }

    const { default: Stripe } = await import('stripe');
    const stripe = new Stripe(secretKey);
    const session = await stripe.checkout.sessions.retrieve(sessionId.trim(), {
      expand: ['line_items'],
    });

    if (session.payment_status !== 'paid') {
      return res.status(402).json({ error: 'Płatność nie została jeszcze zaksięgowana.' });
    }

    const productId = session.metadata?.productId as ProductId | undefined;
    if (!productId || !(productId in PRODUCT_NAMES)) {
      return res.status(400).json({ error: 'Brak metadanych produktu w sesji Stripe.' });
    }

    const email =
      session.customer_details?.email?.trim().toLowerCase() ||
      session.metadata?.email?.trim().toLowerCase() ||
      '';
    const intent = session.metadata?.intent || null;
    const hasIqStats = Boolean(session.metadata?.resultTimestamp);

    return res.status(200).json({
      paid: true,
      sessionId: session.id,
      productId,
      productName: PRODUCT_NAMES[productId],
      email,
      amountTotal: session.amount_total ?? 0,
      currency: session.currency ?? 'pln',
      paidAt: session.created * 1000,
      purchaseToken: null,
      entitlements: buildEntitlements(productId),
      redirectPath: resolveRedirectPath(productId, intent, hasIqStats),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Błąd serwera';
    console.error('[verify-purchase]', message);
    return res.status(500).json({ error: message });
  }
}
