import { Question, QuestionType } from './types';
import { buildMatrixQuestion } from './questionHelpers';
import {
  buildExercise1,
  buildExercise10,
  buildExercise14,
  buildExercise15,
  buildExercise22,
  buildExercise25,
  buildExercise26,
  buildExercise31,
  buildExercise3,
  buildExercise35,
  buildExercise36,
  buildExercise37,
  buildExercise38,
  buildExercise4,
  buildExercise40,
  buildExercise41,
  buildExercise42,
  buildExercise43,
  buildExercise44,
  buildExercise45,
  buildExercise46,
  buildExercise47,
  buildExercise48,
  buildExercise49,
  buildExercise5,
  buildExercise50,
  buildExercise6,
  buildExercise7,
  buildExercise9,
} from './polishMatrixExercises';

/**
 * Macierz ze screena: ramka wynika z wiersza, a symbol w środku z kolumny.
 * Brakujące pole to kwadrat z rombem w środku.
 */
const buildRavenOuterInnerMatrix = () => {
  const sw = 3;
  const swFrame = 3.2;

  const frameDots =
    '<g fill="currentColor">' +
    '<circle cx="14" cy="14" r="4"/>' +
    '<circle cx="86" cy="14" r="4"/>' +
    '<circle cx="14" cy="86" r="4"/>' +
    '<circle cx="86" cy="86" r="4"/>' +
    '</g>';

  const frameStar = `<path d="M 50 6 L 76 28 L 94 50 L 76 72 L 50 94 L 24 72 L 6 50 L 24 28 Z" fill="none" stroke="currentColor" stroke-width="${swFrame}" stroke-linejoin="miter"/>`;
  const frameSquare = `<rect x="14" y="14" width="72" height="72" fill="none" stroke="currentColor" stroke-width="${swFrame}"/>`;

  const innerCircle = `<circle cx="50" cy="50" r="12" fill="none" stroke="currentColor" stroke-width="${sw}"/>`;
  const innerPlus = `<g stroke="currentColor" stroke-width="${sw}" stroke-linecap="square"><line x1="50" y1="32" x2="50" y2="68"/><line x1="32" y1="50" x2="68" y2="50"/></g>`;
  const innerDiamond = `<polygon points="50,30 70,50 50,70 30,50" fill="none" stroke="currentColor" stroke-width="${sw}"/>`;

  const optionF =
    '<g fill="currentColor" stroke="currentColor" stroke-width="' +
    swFrame +
    '" stroke-linecap="square" stroke-linejoin="miter">' +
    '<line x1="16" y1="16" x2="84" y2="16"/><line x1="84" y1="16" x2="84" y2="84"/>' +
    '<line x1="84" y1="84" x2="16" y2="84"/><line x1="16" y1="84" x2="16" y2="16"/>' +
    '<circle cx="16" cy="16" r="4.2"/><circle cx="84" cy="16" r="4.2"/>' +
    '<circle cx="84" cy="84" r="4.2"/><circle cx="16" cy="84" r="4.2"/>' +
    '</g>';

  const frames = [frameDots, frameStar, frameSquare];
  const inners = [innerCircle, innerPlus, innerDiamond];
  const cells: string[] = [];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      cells.push(frames[r] + inners[c]);
    }
  }
  return { cells, frames, optionF };
};

export const buildCuratedQuestionBank = (): Question[] => {
  const q: Question[] = [];
  const roi = buildRavenOuterInnerMatrix();

  q.push(
    buildMatrixQuestion({
      id: 'screen_02',
      type: QuestionType.MATRIX,
      difficulty: 2,
      content: 'Wybierz odpowiedź',
      cells: roi.cells,
      missingIndex: 8,
      innerOptions: [roi.cells[6], roi.cells[5], roi.cells[7], roi.frames[2], roi.optionF],
      explanation:
        'W każdym wierszu powtarza się ta sama zewnętrzna ramka, a w każdej kolumnie ten sam centralny symbol; brakujące pole to kwadrat z rombem w środku.',
      shuffleSeed: 101,
    }),
  );

  const screenExercises = [
    { id: 'screen_01', type: QuestionType.MATRIX, difficulty: 2, build: buildExercise1, seed: 102 },
    { id: 'screen_03', type: QuestionType.ANALOGY, difficulty: 3, build: buildExercise3, seed: 103 },
    { id: 'screen_04', type: QuestionType.SPATIAL, difficulty: 3, build: buildExercise4, seed: 104 },
    { id: 'screen_05', type: QuestionType.SPATIAL, difficulty: 4, build: buildExercise5, seed: 105 },
    { id: 'screen_06', type: QuestionType.LOGIC, difficulty: 4, build: buildExercise6, seed: 106 },
    { id: 'screen_09', type: QuestionType.LOGIC, difficulty: 5, build: buildExercise9, seed: 107 },
    { id: 'screen_14', type: QuestionType.MATRIX, difficulty: 6, build: buildExercise14, seed: 108 },
    { id: 'screen_15', type: QuestionType.LOGIC, difficulty: 6, build: buildExercise15, seed: 109 },
    { id: 'screen_07', type: QuestionType.MATRIX, difficulty: 7, build: buildExercise7, seed: 110 },
    { id: 'screen_10', type: QuestionType.SPATIAL, difficulty: 7, build: buildExercise10, seed: 111 },
    { id: 'screen_22', type: QuestionType.LOGIC, difficulty: 8, build: buildExercise22, seed: 112 },
    { id: 'screen_26', type: QuestionType.SPATIAL, difficulty: 8, build: buildExercise26, seed: 113 },
    { id: 'screen_25', type: QuestionType.NUMBER_SERIES, difficulty: 9, build: buildExercise25, seed: 114 },
    { id: 'screen_31', type: QuestionType.MATRIX, difficulty: 9, build: buildExercise31, seed: 115 },
    { id: 'screen_35', type: QuestionType.ANALOGY, difficulty: 10, build: buildExercise35, seed: 116 },
    { id: 'screen_36', type: QuestionType.MATRIX, difficulty: 4, build: buildExercise36, seed: 117 },
    { id: 'screen_37', type: QuestionType.SPATIAL, difficulty: 5, build: buildExercise37, seed: 118 },
    { id: 'screen_38', type: QuestionType.NUMBER_SERIES, difficulty: 3, build: buildExercise38, seed: 119 },
    { id: 'screen_40', type: QuestionType.NUMBER_SERIES, difficulty: 3, build: buildExercise40, seed: 120 },
    { id: 'screen_41', type: QuestionType.ANALOGY, difficulty: 4, build: buildExercise41, seed: 121 },
    { id: 'screen_42', type: QuestionType.LOGIC, difficulty: 5, build: buildExercise42, seed: 122 },
    { id: 'screen_43', type: QuestionType.SPATIAL, difficulty: 5, build: buildExercise43, seed: 123 },
    { id: 'screen_44', type: QuestionType.NUMBER_SERIES, difficulty: 6, build: buildExercise44, seed: 124 },
    { id: 'screen_45', type: QuestionType.MATRIX, difficulty: 7, build: buildExercise45, seed: 125 },
    { id: 'screen_46', type: QuestionType.ANALOGY, difficulty: 8, build: buildExercise46, seed: 126 },
    { id: 'screen_47', type: QuestionType.SPATIAL, difficulty: 8, build: buildExercise47, seed: 127 },
    { id: 'screen_48', type: QuestionType.LOGIC, difficulty: 9, build: buildExercise48, seed: 128 },
    { id: 'screen_49', type: QuestionType.NUMBER_SERIES, difficulty: 9, build: buildExercise49, seed: 129 },
    { id: 'screen_50', type: QuestionType.ANALOGY, difficulty: 10, build: buildExercise50, seed: 130 },
  ];

  screenExercises.forEach(({ id, type, difficulty, build, seed }) => {
    const ex = build();
    q.push(
      buildMatrixQuestion({
        id,
        type,
        difficulty,
        cells: ex.cells,
        missingIndex: ex.missingIndex,
        innerOptions: ex.innerOptions,
        explanation: ex.explanation,
        content: ex.content,
        shuffleSeed: seed,
      }),
    );
  });

  return q;
};

export const CURATED_QUESTIONS: Question[] = buildCuratedQuestionBank();
