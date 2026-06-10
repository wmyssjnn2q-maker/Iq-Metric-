import type { PaymentIntent, PaymentProductId } from './paymentProducts';
import type { PurchaseEntitlements } from './stripeApiHandlers';
import {
  type IqResultsRecord,
  readIqResultsOrEmpty,
  stripLegacyAuxiliaryAccessFlags,
  writeIqResults,
} from './iqResultsStorage';

const AUXILIARY_ACCESS_STORAGE_KEY = 'iq_auxiliary_access';

type AuxiliaryTestId = NonNullable<PurchaseEntitlements['auxiliaryTestId']>;

const grantAuxiliaryAccess = (testId: AuxiliaryTestId) => {
  try {
    const current = JSON.parse(sessionStorage.getItem(AUXILIARY_ACCESS_STORAGE_KEY) || '{}');
    sessionStorage.setItem(
      AUXILIARY_ACCESS_STORAGE_KEY,
      JSON.stringify({ ...current, [testId]: true }),
    );
  } catch {
    sessionStorage.setItem(AUXILIARY_ACCESS_STORAGE_KEY, JSON.stringify({ [testId]: true }));
  }
};

export type ApplyPurchaseOptions = {
  productId: PaymentProductId;
  email: string;
  entitlements: PurchaseEntitlements;
  purchaseToken?: string | null;
  sessionId?: string;
  intent?: PaymentIntent | null;
  clearIqStatsOnStart?: boolean;
};

/** Zapisuje uprawnienia po udanej płatności (Stripe lub mock). */
export function applyPurchaseToStorage(options: ApplyPurchaseOptions): IqResultsRecord {
  const saved = readIqResultsOrEmpty() as IqResultsRecord;
  const updated: IqResultsRecord = {
    ...saved,
    email: options.email || saved.email,
    purchaseToken: options.purchaseToken ?? saved.purchaseToken,
    stripeSessionId: options.sessionId ?? saved.stripeSessionId,
  };

  if (options.clearIqStatsOnStart) {
    delete updated.stats;
    delete updated.analysis;
    delete updated.ageBracketId;
    delete updated.ageBracketLabel;
    delete updated.testQuestionIds;
    delete updated.resultToken;
  }

  if (options.entitlements.auxiliaryTestId) {
    grantAuxiliaryAccess(options.entitlements.auxiliaryTestId);
  } else {
    updated.isPaid = options.entitlements.isPaid;
    updated.isPro = options.entitlements.isPro;
    updated.isMax = options.entitlements.isMax;
  }

  const normalized = stripLegacyAuxiliaryAccessFlags(
    updated as unknown as Record<string, unknown>,
  ) as unknown as IqResultsRecord;
  writeIqResults(normalized, updated.stats ? 'full' : 'minimal');

  return normalized;
}

export const PURCHASE_SESSION_STORAGE_KEY = 'iq_stripe_checkout_context';

export type CheckoutContext = {
  productId: PaymentProductId;
  intent: PaymentIntent | null;
  resultTimestamp: number | null;
};

export function saveCheckoutContext(context: CheckoutContext): void {
  sessionStorage.setItem(PURCHASE_SESSION_STORAGE_KEY, JSON.stringify(context));
}

export function readCheckoutContext(): CheckoutContext | null {
  try {
    const raw = sessionStorage.getItem(PURCHASE_SESSION_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CheckoutContext;
  } catch {
    return null;
  }
}

export function clearCheckoutContext(): void {
  sessionStorage.removeItem(PURCHASE_SESSION_STORAGE_KEY);
}
