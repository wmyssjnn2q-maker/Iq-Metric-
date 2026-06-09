import { getAgeBracketById } from '../ageBrackets';
import { QuestionType, type UserStats } from './questionTypes';

export type ScoringQuestionMeta = {
  id: string;
  type: QuestionType;
  difficulty: number;
  correctAnswer: number;
};

export type IqAnswerResponse = {
  questionId: string;
  answerIndex: number;
};

export function calculateIqStats(
  questions: ScoringQuestionMeta[],
  responses: IqAnswerResponse[],
  ageBracketId: string | null,
): UserStats {
  const answerById = new Map(responses.map((r) => [r.questionId, r.answerIndex]));

  let rawScore = 0;
  let maxRawScore = 0;

  const domainCorrect: Record<QuestionType, number> = {
    [QuestionType.MATRIX]: 0,
    [QuestionType.NUMBER_SERIES]: 0,
    [QuestionType.LOGIC]: 0,
    [QuestionType.SPATIAL]: 0,
    [QuestionType.ANALOGY]: 0,
  };
  const domainTotal: Record<QuestionType, number> = { ...domainCorrect };

  questions.forEach((q) => {
    domainTotal[q.type]++;
    maxRawScore += q.difficulty;
    const answer = answerById.get(q.id);
    if (answer === q.correctAnswer) {
      rawScore += q.difficulty;
      domainCorrect[q.type]++;
    }
  });

  const bracket = getAgeBracketById(ageBracketId);
  const meanRaw = maxRawScore * bracket.meanRawFactor;
  const stdDevRaw = maxRawScore * bracket.stdRawFactor;

  let zScore = stdDevRaw > 0 ? (rawScore - meanRaw) / stdDevRaw : 0;
  zScore = Math.max(-3.0, Math.min(3.2, zScore));

  const iqScore = Math.round(100 + zScore * 15);

  const normalCDF = (x: number) => {
    const t = 1 / (1 + 0.2316419 * Math.abs(x));
    const d = 0.3989423 * Math.exp((-x * x) / 2);
    let p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    if (x > 0) p = 1 - p;
    return p;
  };

  let percentile = Math.round(normalCDF(zScore) * 1000) / 10;
  if (percentile > 99.9) percentile = 99.9;
  if (percentile < 0.1) percentile = 0.1;

  const domainScores = {} as UserStats['domainScores'];
  (Object.keys(domainCorrect) as QuestionType[]).forEach((key) => {
    const rawPct = (domainCorrect[key] / (domainTotal[key] || 1)) * 100;
    let uiScore: number;
    if (rawPct <= 45) {
      uiScore = (rawPct / 45) * 50;
    } else {
      uiScore = 50 + ((rawPct - 45) / 55) * 50;
    }
    domainScores[key] = Math.round(uiScore);
  });

  return {
    iqScore,
    percentile,
    domainScores,
    confidenceInterval: [iqScore - 5, iqScore + 5],
    ageBracketId: bracket.id,
    ageBracketLabel: bracket.label,
  };
}
