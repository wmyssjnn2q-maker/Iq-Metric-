import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { QuestionType } from '../types';
import type { PublicQuestion } from './publicQuestion';

export type IqSessionPublicBundle = {
  questions: PublicQuestion[];
  questionIds: string[];
};

export type IqSessionAnswerMeta = {
  id: string;
  type: QuestionType;
  difficulty: number;
  correctAnswer: number;
};

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const readJson = <T,>(relativePath: string): T => {
  const filePath = path.join(rootDir, relativePath);
  return JSON.parse(readFileSync(filePath, 'utf8')) as T;
};

let publicBundle: IqSessionPublicBundle | null = null;
let answerMeta: Map<string, IqSessionAnswerMeta> | null = null;

export const getIqSessionPublicBundle = (): IqSessionPublicBundle => {
  if (!publicBundle) {
    publicBundle = readJson<IqSessionPublicBundle>('generated/iq-session-public.json');
  }
  return publicBundle;
};

export const getIqSessionAnswerMeta = (): Map<string, IqSessionAnswerMeta> => {
  if (!answerMeta) {
    const list = readJson<IqSessionAnswerMeta[]>('generated/iq-session-answers.json');
    answerMeta = new Map(list.map((item) => [item.id, item]));
  }
  return answerMeta;
};
