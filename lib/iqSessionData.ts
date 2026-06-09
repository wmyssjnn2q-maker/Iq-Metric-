import { IQ_SESSION_ANSWERS } from './iqSessionAnswers.generated';
import { IQ_SESSION_PUBLIC } from './iqSessionPublic.generated';
import type { QuestionType } from '../types';

export type IqSessionAnswerMeta = {
  id: string;
  type: QuestionType;
  difficulty: number;
  correctAnswer: number;
};

let answerMeta: Map<string, IqSessionAnswerMeta> | null = null;

export const getIqSessionPublicBundle = () => IQ_SESSION_PUBLIC;

export const getIqSessionAnswerMeta = (): Map<string, IqSessionAnswerMeta> => {
  if (!answerMeta) {
    answerMeta = new Map(IQ_SESSION_ANSWERS.map((item) => [item.id, item]));
  }
  return answerMeta;
};
