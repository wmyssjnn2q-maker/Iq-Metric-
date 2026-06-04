import type { Question } from '../types';
import { QuestionType } from '../types';

/** Pytanie wysyłane do przeglądarki — bez klucza odpowiedzi i wyjaśnienia. */
export type PublicQuestion = {
  id: string;
  type: QuestionType;
  difficulty: number;
  content: string;
  svgContent?: string;
  imageUrl?: string;
  options: string[];
};

export function toPublicQuestion(q: Question): PublicQuestion {
  return {
    id: q.id,
    type: q.type,
    difficulty: q.difficulty,
    content: typeof q.content === 'string' ? q.content : 'Wybierz odpowiedź',
    svgContent: typeof q.svgContent === 'string' ? q.svgContent : undefined,
    imageUrl: q.imageUrl,
    options: q.options.map((opt) => (typeof opt === 'string' ? opt : '')),
  };
}
