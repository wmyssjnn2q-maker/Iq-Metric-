import React from 'react';
import { Question, QuestionType } from './types';

const defs = `
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

const getClassicShape = (shape: string, fillType: string, transform: string = '') => {
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
    case 'square': return `<rect x="20" y="20" width="60" height="60" ${props} />`;
    case 'circle': return `<circle cx="50" cy="50" r="30" ${props} />`;
    case 'triangle': return `<polygon points="50,15 85,75 15,75" ${props} />`;
    case 'diamond': return `<polygon points="50,15 85,50 50,85 15,50" ${props} />`;
    case 'hexagon': return `<polygon points="50,15 80,32 80,68 50,85 20,68 20,32" ${props} />`;
    default: return '';
  }
};

const wrapSvg = (content: string) => `<svg viewBox="0 0 100 100" class="w-full h-full text-slate-800 dark:text-slate-100">${defs}${content}</svg>`;

const generateMatrix3x3 = (cells: string[], missingIndex: number) => {
  let svg = `<svg viewBox="0 0 300 300" class="w-full h-full text-slate-800 dark:text-slate-100">${defs}`;
  // Grid lines
  svg += '<line x1="100" y1="0" x2="100" y2="300" stroke="currentColor" stroke-width="2" opacity="0.2" />';
  svg += '<line x1="200" y1="0" x2="200" y2="300" stroke="currentColor" stroke-width="2" opacity="0.2" />';
  svg += '<line x1="0" y1="100" x2="300" y2="100" stroke="currentColor" stroke-width="2" opacity="0.2" />';
  svg += '<line x1="0" y1="200" x2="300" y2="200" stroke="currentColor" stroke-width="2" opacity="0.2" />';
  
  for (let i = 0; i < 9; i++) {
    const x = (i % 3) * 100;
    const y = Math.floor(i / 3) * 100;
    if (i === missingIndex) {
      svg += `<text x="${x + 50}" y="${y + 65}" font-size="40" text-anchor="middle" fill="currentColor" opacity="0.5">?</text>`;
    } else {
      svg += `<g transform="translate(${x}, ${y})">${cells[i]}</g>`;
    }
  }
  svg += '</svg>';
  return svg;
};

const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

const generateNumberCell = (num: number | string) => {
  return `<text x="50" y="65" font-size="40" font-weight="bold" text-anchor="middle" fill="currentColor">${num}</text>`;
};

const generateQuestions = (): Question[] => {
  const qs: Question[] = [];
  let idCounter = 1;

  const shapesList = ['square', 'circle', 'triangle', 'diamond', 'hexagon'];
  const fillsList = ['none', 'solid', 'stripes_h', 'stripes_v', 'grid', 'dots'];

  // Pattern 1: Distribution (Shape & Fill) - 10 questions
  for (let i = 0; i < 10; i++) {
    const selectedShapes = shuffle(shapesList).slice(0, 3);
    const selectedFills = shuffle(fillsList).slice(0, 3);
    
    const cells = [
      getClassicShape(selectedShapes[0], selectedFills[0]), getClassicShape(selectedShapes[1], selectedFills[1]), getClassicShape(selectedShapes[2], selectedFills[2]),
      getClassicShape(selectedShapes[1], selectedFills[2]), getClassicShape(selectedShapes[2], selectedFills[0]), getClassicShape(selectedShapes[0], selectedFills[1]),
      getClassicShape(selectedShapes[2], selectedFills[1]), getClassicShape(selectedShapes[0], selectedFills[2]), getClassicShape(selectedShapes[1], selectedFills[0])
    ];
    
    const missingIndex = Math.floor(Math.random() * 9);
    const correct = wrapSvg(cells[missingIndex]);
    
    const wrongOptions = [];
    for (let s = 0; s < 3; s++) {
      for (let f = 0; f < 3; f++) {
        const opt = wrapSvg(getClassicShape(selectedShapes[s], selectedFills[f]));
        if (opt !== correct) wrongOptions.push(opt);
      }
    }
    
    const options = shuffle([correct, ...shuffle(wrongOptions).slice(0, 5)]).slice(0, 4);
    if (!options.includes(correct)) options[0] = correct;
    const finalOptions = shuffle(options);

    qs.push({
      id: `q_${idCounter++}`,
      type: QuestionType.MATRIX,
      difficulty: 1,
      content: 'Wybierz brakujący element',
      svgContent: generateMatrix3x3(cells, missingIndex),
      options: finalOptions,
      correctAnswer: finalOptions.indexOf(correct),
      explanation: 'W każdym rzędzie i kolumnie musi wystąpić dokładnie jedna figura każdego kształtu oraz jedno wypełnienie każdego rodzaju.'
    });
  }

  // Pattern 2: Addition (Superposition) - 10 questions
  for (let i = 0; i < 10; i++) {
    const outerShapes = shuffle(shapesList).slice(0, 3);
    const innerShapes = shuffle(shapesList).slice(0, 3);
    
    const cells = [];
    for (let row = 0; row < 3; row++) {
      const outer = getClassicShape(outerShapes[row], 'none');
      const inner = getClassicShape(innerShapes[row], 'solid', 'scale(0.4) translate(75,75)');
      cells.push(outer);
      cells.push(inner);
      cells.push(outer + inner);
    }
    
    const missingIndex = Math.floor(Math.random() * 9);
    const correct = wrapSvg(cells[missingIndex]);
    
    const wrongOptions = [];
    for (let o = 0; o < 3; o++) {
      for (let inr = 0; inr < 3; inr++) {
        const opt = wrapSvg(getClassicShape(outerShapes[o], 'none') + getClassicShape(innerShapes[inr], 'solid', 'scale(0.4) translate(75,75)'));
        if (opt !== correct) wrongOptions.push(opt);
      }
    }
    
    const options = shuffle([correct, ...shuffle(wrongOptions).slice(0, 5)]).slice(0, 4);
    if (!options.includes(correct)) options[0] = correct;
    const finalOptions = shuffle(options);

    qs.push({
      id: `q_${idCounter++}`,
      type: QuestionType.ANALOGY,
      difficulty: 3,
      content: 'Wybierz brakujący element',
      svgContent: generateMatrix3x3(cells, missingIndex),
      options: finalOptions,
      correctAnswer: finalOptions.indexOf(correct),
      explanation: 'W każdym rzędzie trzecia figura jest sumą (nałożeniem) pierwszej i drugiej figury.'
    });
  }

  // Pattern 3: XOR / Subtraction (Lines) - 10 questions
  const lineSegments = [
    `<line x1="20" y1="20" x2="80" y2="20" stroke="currentColor" stroke-width="4" stroke-linecap="round" />`, // Top
    `<line x1="20" y1="50" x2="80" y2="50" stroke="currentColor" stroke-width="4" stroke-linecap="round" />`, // Mid H
    `<line x1="20" y1="80" x2="80" y2="80" stroke="currentColor" stroke-width="4" stroke-linecap="round" />`, // Bot
    `<line x1="20" y1="20" x2="20" y2="80" stroke="currentColor" stroke-width="4" stroke-linecap="round" />`, // Left
    `<line x1="50" y1="20" x2="50" y2="80" stroke="currentColor" stroke-width="4" stroke-linecap="round" />`, // Mid V
    `<line x1="80" y1="20" x2="80" y2="80" stroke="currentColor" stroke-width="4" stroke-linecap="round" />`, // Right
    `<line x1="20" y1="20" x2="80" y2="80" stroke="currentColor" stroke-width="4" stroke-linecap="round" />`, // Diag 1
    `<line x1="80" y1="20" x2="20" y2="80" stroke="currentColor" stroke-width="4" stroke-linecap="round" />`, // Diag 2
  ];

  for (let i = 0; i < 10; i++) {
    const parts = shuffle(lineSegments);
    
    const cells = [
      parts[0] + parts[1], parts[1] + parts[2], parts[0] + parts[2],
      parts[3] + parts[4], parts[4] + parts[5], parts[3] + parts[5],
      parts[6] + parts[7], parts[7] + parts[0], parts[6] + parts[0]
    ];
    
    const missingIndex = Math.floor(Math.random() * 9);
    const correct = wrapSvg(cells[missingIndex]);
    
    const wrongOptions = [
      wrapSvg(parts[6] + parts[7]),
      wrapSvg(parts[7] + parts[0]),
      wrapSvg(parts[6]),
      wrapSvg(parts[0]),
      wrapSvg(parts[1] + parts[6])
    ].filter(opt => opt !== correct);
    
    const options = shuffle([correct, ...wrongOptions]).slice(0, 4);
    if (!options.includes(correct)) options[0] = correct;
    const finalOptions = shuffle(options);

    qs.push({
      id: `q_${idCounter++}`,
      type: QuestionType.LOGIC,
      difficulty: 4,
      content: 'Wybierz brakujący element',
      svgContent: generateMatrix3x3(cells, missingIndex),
      options: finalOptions,
      correctAnswer: finalOptions.indexOf(correct),
      explanation: 'W każdym rzędzie trzecia figura zawiera tylko te linie, które nie powtarzają się w pierwszej i drugiej figurze (operacja XOR).'
    });
  }

  // Pattern 4: Rotation - 10 questions
  for (let i = 0; i < 10; i++) {
    const shape = shuffle(['circle', 'square', 'hexagon'])[0];
    const baseShape = getClassicShape(shape, 'none');
    const pointer = `<path d="M 50 50 L 50 20 L 60 30 M 50 20 L 40 30" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round" />`;
    
    const startAngle = Math.floor(Math.random() * 8) * 45;
    const stepAngle = (Math.random() > 0.5 ? 1 : -1) * (Math.random() > 0.5 ? 45 : 90);
    
    const cells = [];
    for (let j = 0; j < 9; j++) {
      const angle = startAngle + j * stepAngle;
      cells.push(baseShape + `<g transform="rotate(${angle} 50 50)">${pointer}</g>`);
    }
    
    const missingIndex = Math.floor(Math.random() * 9);
    const correct = wrapSvg(cells[missingIndex]);
    
    const wrongOptions = [];
    for (let k = 1; k <= 4; k++) {
      const wrongAngle = startAngle + missingIndex * stepAngle + k * 45;
      wrongOptions.push(wrapSvg(baseShape + `<g transform="rotate(${wrongAngle} 50 50)">${pointer}</g>`));
    }
    
    const options = shuffle([correct, ...wrongOptions]).slice(0, 4);
    if (!options.includes(correct)) options[0] = correct;
    const finalOptions = shuffle(options);

    qs.push({
      id: `q_${idCounter++}`,
      type: QuestionType.SPATIAL,
      difficulty: 5,
      content: 'Wybierz brakujący element',
      svgContent: generateMatrix3x3(cells, missingIndex),
      options: finalOptions,
      correctAnswer: finalOptions.indexOf(correct),
      explanation: `Wskaźnik wewnątrz figury obraca się o stały kąt (${Math.abs(stepAngle)} stopni) w każdym kolejnym kroku.`
    });
  }

  // Pattern 5: Number Arithmetic Grid (3x3) - 10 questions
  for (let i = 0; i < 10; i++) {
    const base1 = Math.floor(Math.random() * 10) + 1;
    const base2 = Math.floor(Math.random() * 10) + 1;
    const op = Math.random() > 0.5 ? 'add' : 'sub';
    
    const rows = [];
    for (let r = 0; r < 3; r++) {
      const a = Math.floor(Math.random() * 20) + 5;
      const b = Math.floor(Math.random() * 20) + 5;
      const c = op === 'add' ? a + b : a - b;
      rows.push([a, b, c]);
    }
    
    const numbers = rows.flat();
    const cells = numbers.map(n => generateNumberCell(n));
    
    const missingIndex = 8; // Always missing the last one for simplicity in numbers
    const correctVal = numbers[missingIndex];
    const correct = wrapSvg(generateNumberCell(correctVal));
    
    const wrongOptions = [
      wrapSvg(generateNumberCell(correctVal + 1)),
      wrapSvg(generateNumberCell(correctVal - 1)),
      wrapSvg(generateNumberCell(correctVal + 2)),
      wrapSvg(generateNumberCell(correctVal + 5)),
      wrapSvg(generateNumberCell(Math.abs(correctVal - 5)))
    ].filter(opt => opt !== correct);
    
    const options = shuffle([correct, ...shuffle(wrongOptions).slice(0, 3)]).slice(0, 4);
    if (!options.includes(correct)) options[0] = correct;
    const finalOptions = shuffle(options);

    qs.push({
      id: `q_${idCounter++}`,
      type: QuestionType.NUMBER_SERIES,
      difficulty: 3,
      content: 'Uzupełnij brakującą liczbę',
      svgContent: generateMatrix3x3(cells, missingIndex),
      options: finalOptions,
      correctAnswer: finalOptions.indexOf(correct),
      explanation: op === 'add' ? 'W każdym rzędzie trzecia liczba jest sumą dwóch pierwszych.' : 'W każdym rzędzie trzecia liczba jest różnicą dwóch pierwszych.'
    });
  }

  // Pattern 6: Number Sequence Grid (3x3) - 10 questions
  for (let i = 0; i < 10; i++) {
    const start = Math.floor(Math.random() * 50) + 1;
    const step = Math.floor(Math.random() * 10) + 2;
    const type = Math.random() > 0.5 ? 'add' : 'mul';
    
    const numbers = [];
    let current = start;
    for (let j = 0; j < 9; j++) {
      numbers.push(current);
      if (type === 'add') current += step;
      else current += (j + 1) * 2; // Increasing step
    }
    
    const cells = numbers.map(n => generateNumberCell(n));
    const missingIndex = 8;
    const correctVal = numbers[missingIndex];
    const correct = wrapSvg(generateNumberCell(correctVal));
    
    const wrongOptions = [
      wrapSvg(generateNumberCell(correctVal + step)),
      wrapSvg(generateNumberCell(correctVal - step)),
      wrapSvg(generateNumberCell(correctVal + 1)),
      wrapSvg(generateNumberCell(correctVal * 2)),
      wrapSvg(generateNumberCell(Math.floor(correctVal / 2)))
    ].filter(opt => opt !== correct);
    
    const options = shuffle([correct, ...shuffle(wrongOptions).slice(0, 3)]).slice(0, 4);
    if (!options.includes(correct)) options[0] = correct;
    const finalOptions = shuffle(options);

    qs.push({
      id: `q_${idCounter++}`,
      type: QuestionType.NUMBER_SERIES,
      difficulty: 4,
      content: 'Uzupełnij brakującą liczbę',
      svgContent: generateMatrix3x3(cells, missingIndex),
      options: finalOptions,
      correctAnswer: finalOptions.indexOf(correct),
      explanation: type === 'add' ? `Liczby tworzą ciąg arytmetyczny o kroku ${step}.` : 'Różnica między kolejnymi liczbami zwiększa się o 2 w każdym kroku.'
    });
  }

  return qs;
};

export const QUESTIONS: Question[] = generateQuestions();
