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

  return res.status(200).json({
    ok: true,
    emailConfigured: Boolean(resendKey),
    scoreSigningConfigured: Boolean(scoreSecret && scoreSecret.length >= 16),
  });
}
