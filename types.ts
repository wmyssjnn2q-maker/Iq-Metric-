
import React from 'react';
import { QuestionType, type UserStats } from './lib/questionTypes';

export { QuestionType, type UserStats };

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
  /** Podpis zakupu z serwera (Stripe) — weryfikacja uprawnień */
  purchaseToken?: string;
  /** ID sesji Stripe Checkout po udanej płatności */
  stripeSessionId?: string;
  /** ID pytań z danej sesji (do weryfikacji podpisu) */
  testQuestionIds?: string[];
  /** E-mail użytkownika (zapisany przy checkout / wysyłce wyniku) */
  email?: string;
  /** Duplikat dla starszych zapisów w localStorage — preferuj stats.ageBracket* */
  ageBracketId?: string;
  ageBracketLabel?: string;
}
