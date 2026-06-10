export default async function handler(
  req: { method?: string },
  res: {
    status: (code: number) => { json: (body: unknown) => void };
  },
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const resendKey = process.env.RESEND_API_KEY?.trim() || process.env.RESEND_KEY?.trim();
  const scoreSecret = process.env.SCORE_SECRET?.trim();
  const stripeSecret = process.env.STRIPE_SECRET_KEY?.trim();
  const stripePublishable =
    process.env.STRIPE_PUBLISHABLE_KEY?.trim() || process.env.VITE_STRIPE_PUBLISHABLE_KEY?.trim();
  const paymentSigning =
    process.env.PAYMENT_SIGNING_SECRET?.trim() ||
    (scoreSecret && scoreSecret !== 'zmien_na_dlugi_losowy_ciag_znakow' ? scoreSecret : '');

  const stripeConfigured = Boolean(stripeSecret && /^sk_(test|live)_/.test(stripeSecret));
  const stripePublishableKey =
    stripePublishable && /^pk_(test|live)_/.test(stripePublishable) ? stripePublishable : null;

  return res.status(200).json({
    ok: true,
    emailConfigured: Boolean(resendKey),
    scoreSigningConfigured: Boolean(scoreSecret && scoreSecret.length >= 16),
    stripeConfigured,
    stripePublishableKey,
    paymentSigningConfigured: Boolean(paymentSigning && paymentSigning.length >= 16),
  });
}
