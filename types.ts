
import React from 'react';

export enum QuestionType {
  MATRIX = 'MATRIX',
  NUMBER_SERIES = 'NUMBER_SERIES',
  ANALOGY = 'ANALOGY',
  SPATIAL = 'SPATIAL',
  LOGIC = 'LOGIC'
}

export interface Question {
  id: string;
  type: QuestionType;
  difficulty: number; // 1-5
  content: string | React.ReactNode;
  svgContent?: string | React.ReactNode; // For matrices and spatial
  imageUrl?: string; // For image-based questions
  options: (string | React.ReactNode)[];
  correctAnswer: number;
  explanation: string;
}

/** Pytanie w sesji testowej — bez klucza odpowiedzi (dostarczane z API). */
export type ClientQuestion = Omit<Question, 'correctAnswer' | 'explanation'>;

export interface TestState {
  currentQuestionIndex: number;
  answers: (number | null)[];
  startTime: number | null;
  endTime: number | null;
  questions: ClientQuestion[];
  isFinished: boolean;
  /** null = użytkownik jeszcze nie wybrał przedziału wiekowego */
  ageBracketId: string | null;
}

export interface UserStats {
  iqScore: number;
  percentile: number;
  domainScores: {
    [key in QuestionType]: number;
  };
  confidenceInterval: [number, number];
  /** Przedział wiekowy zadeklarowany przed testem — użyty do normy wyniku */
  ageBracketId?: string;
  ageBracketLabel?: string;
}

export interface DetailedAnalysis {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: { title: string; time: string; diff: string; desc: string }[];
  careerPaths: string[];
  personalityTraits: string[];
}

export interface ReportData {
  stats?: UserStats;
  isPaid: boolean;
  timestamp: number;
  /** Po wysłaniu raportu e-mailem — szczegóły usunięte z localStorage. */
  reportDeliveredAt?: number;
  userName?: string;
  analysis?: DetailedAnalysis;
  isPro?: boolean;
  isMax?: boolean;
  /** HMAC wyniku z serwera — weryfikacja przed raportem / płatnością */
  resultToken?: string;
  /** ID pytań z danej sesji (do weryfikacji podpisu) */
  testQuestionIds?: string[];
  /** Duplikat dla starszych zapisów w localStorage — preferuj stats.ageBracket* */
  ageBracketId?: string;
  ageBracketLabel?: string;
}
