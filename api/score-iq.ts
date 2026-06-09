import { calculateIqStats, type IqAnswerResponse } from '../lib/iqScoring';
import { IQ_SESSION_ANSWERS } from '../lib/iqSessionAnswers.generated';
import { signIqResultOptional } from '../lib/resultToken';

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
        : (req.body as { ageBracketId?: string | null; responses?: IqAnswerResponse[] }) || {};

    const { ageBracketId = null, responses } = body;
    if (!Array.isArray(responses) || responses.length === 0) {
      return res.status(400).json({ error: 'Brak odpowiedzi do oceny.' });
    }

    const metaById = new Map(IQ_SESSION_ANSWERS.map((q) => [q.id, q]));
    const questionIds: string[] = [];
    const scoringMeta = [];

    for (const r of responses) {
      if (!r?.questionId || typeof r.answerIndex !== 'number') {
        return res.status(400).json({ error: 'Nieprawidłowy format odpowiedzi.' });
      }
      if (r.answerIndex < 0 || r.answerIndex > 7 || !Number.isInteger(r.answerIndex)) {
        return res.status(400).json({ error: 'Nieprawidłowy indeks odpowiedzi.' });
      }
      const q = metaById.get(r.questionId);
      if (!q) {
        return res.status(400).json({ error: 'Nieznane pytanie testowe.' });
      }
      questionIds.push(r.questionId);
      scoringMeta.push(q);
    }

    const stats = calculateIqStats(scoringMeta, responses, ageBracketId ?? null);
    const resultToken = signIqResultOptional(stats, questionIds);

    return res.status(200).json({
      stats,
      resultToken: resultToken ?? null,
      questionIds,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Błąd serwera';
    return res.status(500).json({ error: message });
  }
}
