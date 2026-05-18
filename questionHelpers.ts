import { Question, QuestionType } from './types';

export const defs = `
  <defs>
    <pattern id="stripes_h" patternUnits="userSpaceOnUse" width="10" height="10">
      <line x1="0" y1="5" x2="10" y2="5" stroke="currentColor" stroke-width="2" />
    </pattern>
    <pattern id="stripes_v" patternUnits="userSpaceOnUse" width="10" height="10">
      <line x1="5" y1="0" x2="5" y2="10" stroke="currentColor" stroke-width="2" />
    </pattern>
    <pattern id="grid" patternUnits="userSpaceOnUse" width="10" height="10">
      <line x1="0" y1="5" x2="10" y2="5" stroke="currentColor" stroke-width="1" />
      <line x1="5" y1="0" x2="5" y2="10" stroke="currentColor" stroke-width="1" />
    </pattern>
    <pattern id="dots" patternUnits="userSpaceOnUse" width="10" height="10">
      <circle cx="5" cy="5" r="1.5" fill="currentColor" />
    </pattern>
  </defs>
`;

export const getClassicShape = (shape: string, fillType: string, transform: string = '') => {
  let fill = 'none';
  if (fillType === 'solid') fill = 'currentColor';
  else if (fillType === 'stripes_h') fill = 'url(#stripes_h)';
  else if (fillType === 'stripes_v') fill = 'url(#stripes_v)';
  else if (fillType === 'grid') fill = 'url(#grid)';
  else if (fillType === 'dots') fill = 'url(#dots)';

  const stroke = 'currentColor';
  const sw = '3';
  const props = `fill="${fill}" stroke="${stroke}" stroke-width="${sw}" transform="${transform}"`;

  switch (shape) {
    case 'square':
      return `<rect x="20" y="20" width="60" height="60" ${props} />`;
    case 'circle':
      return `<circle cx="50" cy="50" r="30" ${props} />`;
    case 'triangle':
      return `<polygon points="50,15 85,75 15,75" ${props} />`;
    case 'diamond':
      return `<polygon points="50,15 85,50 50,85 15,50" ${props} />`;
    case 'hexagon':
      return `<polygon points="50,15 80,32 80,68 50,85 20,68 20,32" ${props} />`;
    default:
      return '';
  }
};

export const wrapSvg = (content: string) =>
  `<svg viewBox="0 0 100 100" class="iq-cell-svg w-full h-full text-slate-800 dark:text-slate-100" role="img" aria-hidden="true">${defs}${content}</svg>`;

let iqMatrixClipSeq = 0;

export const generateMatrix3x3 = (cells: string[], missingIndex: number) => {
  const clipId = `iq-mc-${++iqMatrixClipSeq}`;
  const defsWithClip = defs.replace(
    '</defs>',
    `<clipPath id="${clipId}" clipPathUnits="userSpaceOnUse"><rect x="0" y="0" width="100" height="100"/></clipPath></defs>`,
  );
  let svg = `<svg viewBox="0 0 300 300" class="iq-matrix-svg w-full h-full text-slate-800 dark:text-slate-100" role="img" aria-label="Macierz 3×3">${defsWithClip}`;
  svg +=
    '<line x1="100" y1="0" x2="100" y2="300" stroke="currentColor" stroke-width="2" opacity="0.28" />';
  svg +=
    '<line x1="200" y1="0" x2="200" y2="300" stroke="currentColor" stroke-width="2" opacity="0.28" />';
  svg +=
    '<line x1="0" y1="100" x2="300" y2="100" stroke="currentColor" stroke-width="2" opacity="0.28" />';
  svg +=
    '<line x1="0" y1="200" x2="300" y2="200" stroke="currentColor" stroke-width="2" opacity="0.28" />';

  for (let i = 0; i < 9; i++) {
    const x = (i % 3) * 100;
    const y = Math.floor(i / 3) * 100;
    if (i === missingIndex) {
      svg += `<rect x="${x + 8}" y="${y + 8}" width="84" height="84" rx="10" fill="currentColor" opacity="0.06" />`;
      svg += `<text x="${x + 50}" y="${y + 68}" font-size="38" font-weight="600" text-anchor="middle" fill="currentColor" opacity="0.45">?</text>`;
    } else {
      svg += `<g transform="translate(${x}, ${y})" clip-path="url(#${clipId})">${cells[i]}</g>`;
    }
  }
  svg += '</svg>';
  return svg;
};

export const generateNumberCell = (num: number | string) =>
  `<text x="50" y="65" font-size="40" font-weight="bold" text-anchor="middle" fill="currentColor">${num}</text>`;

/** Deterministic shuffle — same order dla danego seed (numer pytania). */
export const seededShuffle = <T,>(arr: T[], seed: number): T[] => {
  const result = [...arr];
  let s = seed >>> 0;
  for (let i = result.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) >>> 0;
    const j = s % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

export const latinSquareCells = (shapes: [string, string, string], fills: [string, string, string]) => {
  const cells: string[] = [];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const shape = shapes[(r + c) % 3];
      const fill = fills[(r + 2 * c) % 3];
      const rot = ((2 * r + c) % 3) * 90;
      cells.push(getClassicShape(shape, fill, `rotate(${rot} 50 50)`));
    }
  }
  return cells;
};

export const buildMatrixQuestion = (params: {
  id: string;
  type: QuestionType;
  difficulty: number;
  cells: string[];
  missingIndex: number;
  innerOptions: string[];
  explanation: string;
  content?: string;
  shuffleSeed: number;
}): Question => {
  const { cells, missingIndex, innerOptions, explanation, shuffleSeed } = params;
  const correctInner = cells[missingIndex];
  const correct = wrapSvg(correctInner);
  const wrappedPool = innerOptions.map((inner) => wrapSvg(inner)).filter((w) => w !== correct);
  const picks = seededShuffle(wrappedPool, shuffleSeed).slice(0, 5);
  const options = seededShuffle([correct, ...picks], shuffleSeed + 17);
  return {
    id: params.id,
    type: params.type,
    difficulty: params.difficulty,
    content: params.content ?? 'Wybierz brakujący element',
    svgContent: generateMatrix3x3(cells, missingIndex),
    options,
    correctAnswer: options.indexOf(correct),
    explanation,
  };
};

export const buildNumberMatrixQuestion = (params: {
  id: string;
  difficulty: number;
  numbers: number[];
  missingIndex: number;
  distractorValues: number[];
  explanation: string;
  shuffleSeed: number;
}): Question => {
  const cells = params.numbers.map((n) => generateNumberCell(n));
  const correctInner = generateNumberCell(params.numbers[params.missingIndex]);
  const correct = wrapSvg(correctInner);
  const wrappedWrong = params.distractorValues
    .filter((v) => v !== params.numbers[params.missingIndex])
    .map((v) => wrapSvg(generateNumberCell(v)));
  const picks = seededShuffle(wrappedWrong, params.shuffleSeed).slice(0, 5);
  const options = seededShuffle([correct, ...picks], params.shuffleSeed + 31);
  return {
    id: params.id,
    type: QuestionType.NUMBER_SERIES,
    difficulty: params.difficulty,
    content: 'Uzupełnij brakującą liczbę',
    svgContent: generateMatrix3x3(cells, params.missingIndex),
    options,
    correctAnswer: options.indexOf(correct),
    explanation: params.explanation,
  };
};
