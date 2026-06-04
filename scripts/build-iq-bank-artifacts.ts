/**
 * Generuje lekkie JSON-y dla API (Vercel) i fallbacku klienta.
 * Uruchamiane przed buildem i w dev.
 */
import { mkdirSync, writeFileSync, copyFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildCuratedQuestionBank } from '../curatedBank';
import { selectIqQuestions } from '../lib/selectIqQuestions';
import { toPublicQuestion } from '../lib/publicQuestion';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const generatedDir = path.join(root, 'generated');
const publicDir = path.join(root, 'public');

const bank = buildCuratedQuestionBank();
const selected = selectIqQuestions(bank);

const sessionPublic = {
  questions: selected.map(toPublicQuestion),
  questionIds: selected.map((q) => q.id),
};

const sessionAnswers = selected.map((q) => ({
  id: q.id,
  type: q.type,
  difficulty: q.difficulty,
  correctAnswer: q.correctAnswer,
}));

mkdirSync(generatedDir, { recursive: true });
mkdirSync(publicDir, { recursive: true });

const publicPath = path.join(generatedDir, 'iq-session-public.json');
const answersPath = path.join(generatedDir, 'iq-session-answers.json');

writeFileSync(publicPath, JSON.stringify(sessionPublic));
writeFileSync(answersPath, JSON.stringify(sessionAnswers));
copyFileSync(publicPath, path.join(publicDir, 'iq-session-public.json'));

console.log(`[iq-bank] ${sessionPublic.questions.length} pytań → generated/ + public/`);
