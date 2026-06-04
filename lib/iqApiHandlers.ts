import { calculateIqStats, type IqAnswerResponse } from './iqScoring';
import { getIqSessionAnswerMeta, getIqSessionPublicBundle } from './iqSessionData';
import { signIqResultOptional, verifyIqResult } from './resultToken';
import type { UserStats } from '../types';

export function handleIqQuestionsGet() {
  return getIqSessionPublicBundle();
}

export function handleScoreIqPost(body: {
  ageBracketId?: string | null;
  responses?: IqAnswerResponse[];
}) {
  const { ageBracketId = null, responses } = body;
  if (!Array.isArray(responses) || responses.length === 0) {
    throw new Error('Brak odpowiedzi do oceny.');
  }

  const meta = getIqSessionAnswerMeta();
  const questionIds: string[] = [];
  const scoringMeta = [];

  for (const r of responses) {
    if (!r?.questionId || typeof r.answerIndex !== 'number') {
      throw new Error('Nieprawidłowy format odpowiedzi.');
    }
    if (r.answerIndex < 0 || r.answerIndex > 7 || !Number.isInteger(r.answerIndex)) {
      throw new Error('Nieprawidłowy indeks odpowiedzi.');
    }
    const q = meta.get(r.questionId);
    if (!q) {
      throw new Error('Nieznane pytanie testowe.');
    }
    questionIds.push(r.questionId);
    scoringMeta.push(q);
  }

  const stats = calculateIqStats(scoringMeta, responses, ageBracketId ?? null);
  const resultToken = signIqResultOptional(stats, questionIds);

  return { stats, resultToken: resultToken ?? null, questionIds };
}

export function handleVerifyIqResultPost(body: {
  stats?: UserStats;
  resultToken?: string;
  questionIds?: string[];
}) {
  const { stats, resultToken, questionIds } = body;
  if (!stats || !resultToken || !Array.isArray(questionIds)) {
    throw new Error('Brak danych do weryfikacji wyniku.');
  }
  const valid = verifyIqResult(resultToken, stats, questionIds);
  return { valid };
}
