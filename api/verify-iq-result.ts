import { verifyIqResult } from '../lib/resultToken';
import type { UserStats } from '../lib/questionTypes';

export default async function handler(
  req: { method?: string; body?: unknown },
  res: {
    status: (code: number) => { json: (body: unknown) => void };
  },
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body =
      typeof req.body === 'string'
        ? JSON.parse(req.body)
        : (req.body as {
            stats?: UserStats;
            resultToken?: string;
            questionIds?: string[];
          }) || {};

    const { stats, resultToken, questionIds } = body;
    if (!stats || !resultToken || !Array.isArray(questionIds)) {
      return res.status(400).json({ error: 'Brak danych do weryfikacji wyniku.', valid: false });
    }

    return res.status(200).json({ valid: verifyIqResult(resultToken, stats, questionIds) });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Błąd serwera';
    return res.status(400).json({ error: message, valid: false });
  }
}
