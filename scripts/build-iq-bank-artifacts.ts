/**
 * Generuje artefakty testu IQ jako moduły TS (bundlowane na Vercel bez readFileSync).
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
const libDir = path.join(root, 'lib');

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

writeFileSync(path.join(generatedDir, 'iq-session-public.json'), JSON.stringify(sessionPublic));
writeFileSync(path.join(generatedDir, 'iq-session-answers.json'), JSON.stringify(sessionAnswers));
copyFileSync(path.join(generatedDir, 'iq-session-public.json'), path.join(publicDir, 'iq-session-public.json'));

writeFileSync(
  path.join(libDir, 'iqSessionAnswers.generated.ts'),
  `/** Auto-generated — klucz odpowiedzi bieżącej sesji testowej. */\n` +
    `import type { ScoringQuestionMeta } from './iqScoring';\n\n` +
    `export const IQ_SESSION_ANSWERS = ${JSON.stringify(sessionAnswers)} as ScoringQuestionMeta[];\n`,
);

writeFileSync(
  path.join(libDir, 'iqSessionPublic.generated.ts'),
  `/** Auto-generated — pytania bez klucza odpowiedzi. */\n` +
    `import type { PublicQuestion } from './publicQuestion';\n\n` +
    `export const IQ_SESSION_PUBLIC = ${JSON.stringify(sessionPublic)} as {\n` +
    `  questions: PublicQuestion[];\n` +
    `  questionIds: string[];\n` +
    `};\n`,
);

writeFileSync(
  path.join(libDir, 'iqScoringFallback.generated.ts'),
  `/** Auto-generated — liczenie wyniku po stronie klienta (gdy API niedostępne). */\n` +
    `import { calculateIqStats, type IqAnswerResponse } from './iqScoring';\n` +
    `import { IQ_SESSION_ANSWERS } from './iqSessionAnswers.generated';\n\n` +
    `export function scoreSessionLocally(\n` +
    `  responses: IqAnswerResponse[],\n` +
    `  ageBracketId: string | null,\n` +
    `) {\n` +
    `  const stats = calculateIqStats(IQ_SESSION_ANSWERS, responses, ageBracketId);\n` +
    `  const questionIds = responses.map((r) => r.questionId);\n` +
    `  return { stats, questionIds };\n` +
    `}\n`,
);

console.log(`[iq-bank] ${sessionPublic.questions.length} pytań → lib/*.generated.ts + public/`);
