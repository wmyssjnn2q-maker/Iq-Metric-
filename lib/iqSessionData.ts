import type { QuestionType } from '../types';
import type { PublicQuestion } from './publicQuestion';
import sessionPublicJson from '../generated/iq-session-public.json';
import sessionAnswersJson from '../generated/iq-session-answers.json';

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

const sessionPublicBundle = sessionPublicJson as IqSessionPublicBundle;
const sessionAnswersList = sessionAnswersJson as IqSessionAnswerMeta[];

let answerMeta: Map<string, IqSessionAnswerMeta> | null = null;

export const getIqSessionPublicBundle = (): IqSessionPublicBundle => sessionPublicBundle;

export const getIqSessionAnswerMeta = (): Map<string, IqSessionAnswerMeta> => {
  if (!answerMeta) {
    answerMeta = new Map(sessionAnswersList.map((item) => [item.id, item]));
  }
  return answerMeta;
};
