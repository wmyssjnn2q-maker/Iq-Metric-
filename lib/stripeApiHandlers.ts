import type Stripe from 'stripe';
import {
  getPaymentProduct,
  isAuxiliaryProductId,
  PAYMENT_PRODUCTS,
  resolveRedirectPath,
  type AuxiliaryTestId,
  type PaymentIntent,
  type PaymentProductId,
} from './paymentProducts';
import { signPurchaseToken, verifyPurchaseToken } from './purchaseToken';
import { getAppOrigin, getStripePriceIdForProduct } from './stripeConfig';
import { getStripe } from './stripeServer';

export type CreateCheckoutSessionBody = {
  productId?: PaymentProductId;
  email?: string;
  intent?: PaymentIntent | null;
  resultTimestamp?: number | null;
  /** Pełny URL origin (np. https://brainmediq.com) — opcjonalnie z klienta. */
  origin?: string;
};

export type VerifyPurchaseBody = {
  sessionId?: string;
};

export type PurchaseEntitlements = {
  isPaid: boolean;
  isPro: boolean;
  isMax: boolean;
  auxiliaryTestId: AuxiliaryTestId | null;
};

export type VerifiedPurchase = {
  paid: true;
  sessionId: string;
  productId: PaymentProductId;
  productName: string;
  email: string;
  amountTotal: number;
  currency: string;
  paidAt: number;
  purchaseToken: string | null;
  entitlements: PurchaseEntitlements;
  redirectPath: string;
};

function buildEntitlements(productId: PaymentProductId): PurchaseEntitlements {
  const product = getPaymentProduct(productId);
  return {
    isPaid: product.isIqProduct,
    isPro: product.isPro,
    isMax: product.isMax,
    auxiliaryTestId: product.auxiliaryTestId,
  };
}

function resolveLineItem(productId: PaymentProductId) {
  const product = getPaymentProduct(productId);
  const priceId = getStripePriceIdForProduct(product.stripePriceEnvKey);

  if (priceId) {
    return { price: priceId, quantity: 1 };
  }

  return {
    quantity: 1,
    price_data: {
      currency: product.currency,
      unit_amount: product.unitAmount,
      product_data: {
        name: product.name,
        metadata: { productId: product.id },
      },
    },
  };
}

export async function handleCreateCheckoutSessionPost(
  body: CreateCheckoutSessionBody,
): Promise<{ url: string; sessionId: string }> {
  const productId = body.productId;
  if (!productId || !(productId in PAYMENT_PRODUCTS)) {
    throw Object.assign(new Error('Nieprawidłowy productId.'), { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  if (!email || !email.includes('@')) {
    throw Object.assign(new Error('Podaj poprawny adres e-mail.'), { status: 400 });
  }

  const product = getPaymentProduct(productId);
  const intent = body.intent ?? null;
  const origin = body.origin?.replace(/\/$/, '') || getAppOrigin();
  const stripe = await getStripe();

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

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    customer_email: email,
    line_items: [resolveLineItem(productId)],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata,
    locale: 'pl',
  });

  if (!session.url) {
    throw Object.assign(new Error('Stripe nie zwrócił URL checkoutu.'), { status: 500 });
  }

  return { url: session.url, sessionId: session.id };
}

export async function handleVerifyPurchasePost(body: VerifyPurchaseBody): Promise<VerifiedPurchase> {
  const sessionId = body.sessionId?.trim();
  if (!sessionId || !sessionId.startsWith('cs_')) {
    throw Object.assign(new Error('Brak lub nieprawidłowy sessionId.'), { status: 400 });
  }

  const stripe = await getStripe();
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['line_items'],
  });

  if (session.payment_status !== 'paid') {
    throw Object.assign(new Error('Płatność nie została jeszcze zaksięgowana.'), { status: 402 });
  }

  const productId = session.metadata?.productId as PaymentProductId | undefined;
  if (!productId || !(productId in PAYMENT_PRODUCTS)) {
    throw Object.assign(new Error('Brak metadanych produktu w sesji Stripe.'), { status: 400 });
  }

  const product = getPaymentProduct(productId);
  const email =
    session.customer_details?.email?.trim().toLowerCase() ||
    session.metadata?.email?.trim().toLowerCase() ||
    '';
  const paidAt = session.created * 1000;
  const intent = (session.metadata?.intent as PaymentIntent | '') || null;
  const hasIqStats = Boolean(session.metadata?.resultTimestamp);

  let purchaseToken: string | null = null;
  try {
    purchaseToken = signPurchaseToken({
      productId,
      sessionId: session.id,
      email,
      paidAt,
    });
  } catch {
    purchaseToken = null;
  }

  const tokenValid =
    purchaseToken !== null &&
    verifyPurchaseToken(purchaseToken, {
      productId,
      sessionId: session.id,
      email,
      paidAt,
    });

  return {
    paid: true,
    sessionId: session.id,
    productId,
    productName: product.name,
    email,
    amountTotal: session.amount_total ?? product.unitAmount,
    currency: session.currency ?? product.currency,
    paidAt,
    purchaseToken: tokenValid ? purchaseToken : null,
    entitlements: buildEntitlements(productId),
    redirectPath: resolveRedirectPath(product, intent, hasIqStats),
  };
}

export async function handleStripeWebhookPost(
  rawBody: Buffer,
  signature: string | undefined,
): Promise<{ received: true; type: string }> {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  if (!webhookSecret) {
    throw Object.assign(new Error('Brak STRIPE_WEBHOOK_SECRET.'), { status: 500 });
  }
  if (!signature) {
    throw Object.assign(new Error('Brak nagłówka stripe-signature.'), { status: 400 });
  }

  const stripe = await getStripe();
  const event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log(
      `[Stripe] checkout.session.completed | session=${session.id} | product=${session.metadata?.productId} | email=${session.customer_details?.email ?? session.metadata?.email}`,
    );
  }

  return { received: true, type: event.type };
}

export { isAuxiliaryProductId };
