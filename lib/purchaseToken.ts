import { createHmac, timingSafeEqual } from 'crypto';
import type { PaymentProductId } from './paymentProducts';

const TOKEN_VERSION = 1;

export type PurchaseTokenPayload = {
  v: number;
  productId: PaymentProductId;
  sessionId: string;
  email: string;
  paidAt: number;
};

export const getPaymentSigningSecret = (): string | undefined => {
  const dedicated = process.env.PAYMENT_SIGNING_SECRET?.trim();
  if (dedicated && dedicated.length >= 16) return dedicated;

  const score = process.env.SCORE_SECRET?.trim();
  if (score && score.length >= 16 && score !== 'zmien_na_dlugi_losowy_ciag_znakow') {
    return score;
  }
  return undefined;
};

export const isPaymentSigningConfigured = (): boolean => Boolean(getPaymentSigningSecret());

function payloadString(payload: PurchaseTokenPayload): string {
  return JSON.stringify(payload);
}

export function signPurchaseToken(payload: Omit<PurchaseTokenPayload, 'v'>): string {
  const secret = getPaymentSigningSecret();
  if (!secret) {
    throw new Error('Brak PAYMENT_SIGNING_SECRET (min. 16 znaków) do podpisu zakupu.');
  }
  const full: PurchaseTokenPayload = { v: TOKEN_VERSION, ...payload };
  return createHmac('sha256', secret).update(payloadString(full)).digest('base64url');
}

export function verifyPurchaseToken(token: string, payload: Omit<PurchaseTokenPayload, 'v'>): boolean {
  if (!token || !isPaymentSigningConfigured()) return false;
  try {
    const expected = signPurchaseToken(payload);
    const a = Buffer.from(token);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
