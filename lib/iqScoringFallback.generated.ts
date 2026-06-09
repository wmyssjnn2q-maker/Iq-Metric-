/** Auto-generated — liczenie wyniku po stronie klienta (gdy API niedostępne). */
import { calculateIqStats, type IqAnswerResponse } from './iqScoring';
import { IQ_SESSION_ANSWERS } from './iqSessionAnswers.generated';

export function scoreSessionLocally(
  responses: IqAnswerResponse[],
  ageBracketId: string | null,
) {
  const stats = calculateIqStats(IQ_SESSION_ANSWERS, responses, ageBracketId);
  const questionIds = responses.map((r) => r.questionId);
  return { stats, questionIds };
}
