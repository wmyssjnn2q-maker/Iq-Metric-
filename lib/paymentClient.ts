import type { PaymentIntent, PaymentProductId } from './paymentProducts';

export type PaymentHealth = {
  ok: boolean;
  emailConfigured: boolean;
  scoreSigningConfigured: boolean;
  stripeConfigured: boolean;
  stripePublishableKey: string | null;
  paymentSigningConfigured: boolean;
};

export type CreateCheckoutSessionResponse = {
  url: string;
  sessionId: string;
};

export type VerifiedPurchaseResponse = {
  paid: true;
  sessionId: string;
  productId: PaymentProductId;
  productName: string;
  email: string;
  amountTotal: number;
  currency: string;
  paidAt: number;
  purchaseToken: string | null;
  entitlements: {
    isPaid: boolean;
    isPro: boolean;
    isMax: boolean;
    auxiliaryTestId: string | null;
  };
  redirectPath: string;
};

const getLocalApiBase = (): string | null => {
  if (typeof window === 'undefined') return null;
  const host = window.location.hostname;
  if (host === 'localhost' || host === '127.0.0.1') {
    return 'http://127.0.0.1:3002';
  }
  return null;
};

const getApiEndpoints = (path: string): string[] => {
  const endpoints = [path];
  const local = getLocalApiBase();
  if (local) endpoints.push(`${local}${path}`);
  return endpoints;
};

async function fetchPaymentApi<T>(path: string, init?: RequestInit): Promise<T> {
  let lastError = 'Brak połączenia z API płatności.';
  for (const endpoint of getApiEndpoints(path)) {
    try {
      const res = await fetch(endpoint, init);
      const body = await res.json().catch(() => null);
      if (res.ok) return body as T;
      lastError = body?.error || `Błąd serwera (${res.status})`;
      if (res.status === 404) continue;
      throw new Error(lastError);
    } catch (err) {
      lastError = err instanceof Error ? err.message : lastError;
    }
  }
  throw new Error(lastError);
}

export async function fetchPaymentHealth(): Promise<PaymentHealth> {
  return fetchPaymentApi<PaymentHealth>('/api/health');
};

export async function createCheckoutSession(input: {
  productId: PaymentProductId;
  email: string;
  intent?: PaymentIntent | null;
  resultTimestamp?: number | null;
}): Promise<CreateCheckoutSessionResponse> {
  return fetchPaymentApi<CreateCheckoutSessionResponse>('/api/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...input,
      origin: typeof window !== 'undefined' ? window.location.origin : undefined,
    }),
  });
}

export async function verifyPurchase(sessionId: string): Promise<VerifiedPurchaseResponse> {
  return fetchPaymentApi<VerifiedPurchaseResponse>('/api/verify-purchase', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId }),
  });
}
