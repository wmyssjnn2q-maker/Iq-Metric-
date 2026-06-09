export enum QuestionType {
  MATRIX = 'MATRIX',
  NUMBER_SERIES = 'NUMBER_SERIES',
  ANALOGY = 'ANALOGY',
  SPATIAL = 'SPATIAL',
  LOGIC = 'LOGIC',
}

export interface UserStats {
  iqScore: number;
  percentile: number;
  domainScores: Record<QuestionType, number>;
  confidenceInterval: [number, number];
  ageBracketId?: string;
  ageBracketLabel?: string;
}
