/** Identyfikatory produktów — mapowane na Stripe Price ID w env (STRIPE_PRICE_*). */
export type PaymentProductId =
  | 'iq_standard'
  | 'iq_pro'
  | 'iq_max'
  | 'osobowosc'
  | 'pamiec'
  | 'koncentracja'
  | 'reakcja'
  | 'alzheimer'
  | 'adhd';

export type PaymentIntent = 'unlock' | 'start';

export type AuxiliaryTestId =
  | 'osobowosc'
  | 'pamiec'
  | 'koncentracja'
  | 'reakcja'
  | 'alzheimer'
  | 'adhd';

export type PaymentProduct = {
  id: PaymentProductId;
  name: string;
  /** Kwota w groszach (PLN). */
  unitAmount: number;
  currency: 'pln';
  /** Klucz zmiennej env ze Stripe Price ID, np. STRIPE_PRICE_IQ_STANDARD */
  stripePriceEnvKey: string;
  isIqProduct: boolean;
  isPro: boolean;
  isMax: boolean;
  auxiliaryTestId: AuxiliaryTestId | null;
  /** Ścieżka po udanej płatności (domyślna). */
  defaultRedirectPath: string;
};

export const PAYMENT_PRODUCTS: Record<PaymentProductId, PaymentProduct> = {
  iq_standard: {
    id: 'iq_standard',
    name: 'Test IQ Standard + Certyfikat',
    unitAmount: 499,
    currency: 'pln',
    stripePriceEnvKey: 'STRIPE_PRICE_IQ_STANDARD',
    isIqProduct: true,
    isPro: false,
    isMax: false,
    auxiliaryTestId: null,
    defaultRedirectPath: '/raport',
  },
  iq_pro: {
    id: 'iq_pro',
    name: 'Analiza Ekspercka PRO + Certyfikat',
    unitAmount: 999,
    currency: 'pln',
    stripePriceEnvKey: 'STRIPE_PRICE_IQ_PRO',
    isIqProduct: true,
    isPro: true,
    isMax: false,
    auxiliaryTestId: null,
    defaultRedirectPath: '/raport',
  },
  iq_max: {
    id: 'iq_max',
    name: 'Test IQ MAX + Certyfikat',
    unitAmount: 499,
    currency: 'pln',
    stripePriceEnvKey: 'STRIPE_PRICE_IQ_MAX',
    isIqProduct: true,
    isPro: false,
    isMax: true,
    auxiliaryTestId: null,
    defaultRedirectPath: '/raport',
  },
  osobowosc: {
    id: 'osobowosc',
    name: 'Test Osobowości (Big Five)',
    unitAmount: 499,
    currency: 'pln',
    stripePriceEnvKey: 'STRIPE_PRICE_OSOBOWOSC',
    isIqProduct: false,
    isPro: false,
    isMax: false,
    auxiliaryTestId: 'osobowosc',
    defaultRedirectPath: '/test-osobowosci',
  },
  pamiec: {
    id: 'pamiec',
    name: 'Test Pamięci Przestrzennej',
    unitAmount: 499,
    currency: 'pln',
    stripePriceEnvKey: 'STRIPE_PRICE_PAMIEC',
    isIqProduct: false,
    isPro: false,
    isMax: false,
    auxiliaryTestId: 'pamiec',
    defaultRedirectPath: '/test-pamieci',
  },
  koncentracja: {
    id: 'koncentracja',
    name: 'Test Koncentracji (Stroop)',
    unitAmount: 499,
    currency: 'pln',
    stripePriceEnvKey: 'STRIPE_PRICE_KONCENTRACJA',
    isIqProduct: false,
    isPro: false,
    isMax: false,
    auxiliaryTestId: 'koncentracja',
    defaultRedirectPath: '/test-koncentracji',
  },
  reakcja: {
    id: 'reakcja',
    name: 'Test Szybkości Reakcji',
    unitAmount: 499,
    currency: 'pln',
    stripePriceEnvKey: 'STRIPE_PRICE_REAKCJA',
    isIqProduct: false,
    isPro: false,
    isMax: false,
    auxiliaryTestId: 'reakcja',
    defaultRedirectPath: '/test-reakcji',
  },
  alzheimer: {
    id: 'alzheimer',
    name: 'Test Funkcji Poznawczych',
    unitAmount: 499,
    currency: 'pln',
    stripePriceEnvKey: 'STRIPE_PRICE_ALZHEIMER',
    isIqProduct: false,
    isPro: false,
    isMax: false,
    auxiliaryTestId: 'alzheimer',
    defaultRedirectPath: '/test-funkcji-poznawczych',
  },
  adhd: {
    id: 'adhd',
    name: 'Test ADHD (ASRS)',
    unitAmount: 499,
    currency: 'pln',
    stripePriceEnvKey: 'STRIPE_PRICE_ADHD',
    isIqProduct: false,
    isPro: false,
    isMax: false,
    auxiliaryTestId: 'adhd',
    defaultRedirectPath: '/test-adhd',
  },
};

const AUXILIARY_IDS = new Set<PaymentProductId>([
  'osobowosc',
  'pamiec',
  'koncentracja',
  'reakcja',
  'alzheimer',
  'adhd',
]);

export const isAuxiliaryProductId = (id: PaymentProductId): id is AuxiliaryTestId =>
  AUXILIARY_IDS.has(id);

/** Mapuje parametr `?type=` z URL checkoutu na produkt. */
export const resolveProductIdFromQuery = (
  typeParam: string | null,
  options?: { savedIsPro?: boolean },
): PaymentProductId => {
  if (typeParam === 'pro') return 'iq_pro';
  if (typeParam === 'max') return 'iq_max';
  if (typeParam && typeParam in PAYMENT_PRODUCTS) {
    return typeParam as PaymentProductId;
  }
  if (options?.savedIsPro) return 'iq_pro';
  return 'iq_standard';
};

export const getPaymentProduct = (id: PaymentProductId): PaymentProduct => PAYMENT_PRODUCTS[id];

export const formatPlnPrice = (unitAmount: number): string =>
  (unitAmount / 100).toFixed(2).replace('.', ',');

export const resolveRedirectPath = (
  product: PaymentProduct,
  intent: PaymentIntent | null,
  hasIqStats: boolean,
): string => {
  if (product.isIqProduct) {
    if (intent === 'unlock' || (hasIqStats && intent !== 'start')) {
      return '/raport';
    }
    if (product.id === 'iq_pro') return '/test?type=pro';
    if (product.id === 'iq_max') return '/test?type=max';
    return '/test';
  }
  return product.defaultRedirectPath;
};
