
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

export interface TestState {
  currentQuestionIndex: number;
  answers: (number | null)[];
  startTime: number | null;
  endTime: number | null;
  questions: Question[];
  isFinished: boolean;
}

export interface UserStats {
  iqScore: number;
  percentile: number;
  domainScores: {
    [key in QuestionType]: number;
  };
  confidenceInterval: [number, number];
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
  stats: UserStats;
  isPaid: boolean;
  timestamp: number;
  userName?: string;
  analysis?: DetailedAnalysis;
  isPro?: boolean;
  isMax?: boolean;
}
