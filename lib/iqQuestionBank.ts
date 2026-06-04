import { buildCuratedQuestionBank } from '../curatedBank';
import type { Question } from '../types';

let cachedBank: Question[] | null = null;

/** Pełna baza z kluczem odpowiedzi — tylko po stronie serwera (API / server.ts). */
export function getIqQuestionBank(): Question[] {
  if (!cachedBank) {
    cachedBank = buildCuratedQuestionBank();
  }
  return cachedBank;
}

export function getIqScoringMeta(): Map<string, { id: string; type: Question['type']; difficulty: number; correctAnswer: number }> {
  const map = new Map<string, { id: string; type: Question['type']; difficulty: number; correctAnswer: number }>();
  for (const q of getIqQuestionBank()) {
    map.set(q.id, {
      id: q.id,
      type: q.type,
      difficulty: q.difficulty,
      correctAnswer: q.correctAnswer,
    });
  }
  return map;
}
