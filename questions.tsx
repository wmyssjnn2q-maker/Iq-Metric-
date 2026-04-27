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

const shuffle = <T,>(arr: T[]): T[] => {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

const generateNumberCell = (num: number | string) => {
  return `<text x="50" y="65" font-size="40" font-weight="bold" text-anchor="middle" fill="currentColor">${num}</text>`;
};

const generateQuestions = (): Question[] => {
  const qs: Question[] = [];
  let idCounter = 1;

  const shapesList = ['square', 'circle', 'triangle', 'diamond', 'hexagon'];
  const fillsList = ['none', 'solid', 'stripes_h', 'stripes_v', 'grid', 'dots'];

  // Pattern 1: Distribution with Distractors (Shape & Fill & Border) - 10 questions
  for (let i = 0; i < 10; i++) {
    const selectedShapes = shuffle(shapesList).slice(0, 3);
    const selectedFills = shuffle(['none', 'solid', 'stripes_h', 'stripes_v']).slice(0, 3);
    
    // Rule: Shape + Fill + Rotation (0, 90, 180)
    const cells = [];
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const s = selectedShapes[(r + c) % 3];
        const f = selectedFills[(r + 2 * c) % 3];
        const rot = ((2 * r + c) % 3) * 90;
        cells.push(getClassicShape(s, f, `rotate(${rot} 50 50)`));
      }
    }
    
    const missingIndex = i < 5 ? 8 : Math.floor(Math.random() * 3) + 6; // Randomize missing cell in last row for harder variants
    const correct = wrapSvg(cells[missingIndex]);
    
    const wrongOptions = [
      wrapSvg(getClassicShape(selectedShapes[0], selectedFills[0])),
      wrapSvg(getClassicShape(selectedShapes[1], selectedFills[1], `rotate(90 50 50)`)),
      wrapSvg(getClassicShape(selectedShapes[2], selectedFills[2], `rotate(180 50 50)`)),
      wrapSvg(getClassicShape(selectedShapes[(missingIndex) % 3], selectedFills[(missingIndex + 1) % 3], `rotate(45 50 50)`)),
      wrapSvg(getClassicShape(selectedShapes[1], 'solid', `scale(0.9)`))
    ].filter(opt => opt !== correct);
    
    // Ensure 6 options for higher difficulty
    const options = shuffle([correct, ...shuffle(wrongOptions).slice(0, 5)]).slice(0, 6);
    const finalOptions = shuffle(options);

    qs.push({
      id: `q_${idCounter++}`,
      type: QuestionType.MATRIX,
      difficulty: 4,
      content: 'Wybierz brakujący element',
      svgContent: generateMatrix3x3(cells, missingIndex),
      options: finalOptions,
      correctAnswer: finalOptions.indexOf(correct),
      explanation: 'W macierzy występują trzy niezależne reguły dla kształtu, wypełnienia i rotacji (system Latin Square na 3 cechach).'
    });
  }

  // Pattern 2: Addition (Superposition) with Inverse - 10 questions
  for (let i = 0; i < 10; i++) {
    const baseShapes = shuffle(shapesList).slice(0, 3);
    
    const cells = [];
    for (let row = 0; row < 3; row++) {
      const s1 = getClassicShape(baseShapes[0], 'none', `scale(0.8) translate(10,10)`);
      const s2 = getClassicShape(baseShapes[1], 'none', `rotate(45 50 50)`);
      const s3 = getClassicShape(baseShapes[2], 'none', `scale(1.2) translate(-8,-8)`);
      
      if (row === 0) {
        cells.push(s1, s2, s1 + s2);
      } else if (row === 1) {
        cells.push(s2, s3, s2 + s3);
      } else {
        cells.push(s1, s3, s1 + s3);
      }
    }
    
    const missingIndex = i < 5 ? 8 : Math.floor(Math.random() * 3) + 6;
    const correct = wrapSvg(cells[missingIndex]);
    
    const wrongOptions = [
      wrapSvg(getClassicShape(baseShapes[0], 'none') + getClassicShape(baseShapes[1], 'none')),
      wrapSvg(getClassicShape(baseShapes[2], 'solid')),
      wrapSvg(getClassicShape(baseShapes[0], 'none', 'scale(0.5)') + getClassicShape(baseShapes[2], 'none')),
      wrapSvg(cells[(missingIndex + 1) % 8]),
      wrapSvg(cells[(missingIndex + 2) % 8])
    ].filter(opt => opt !== correct);
    
    const options = shuffle([correct, ...shuffle(wrongOptions).slice(0, 5)]).slice(0, 6);
    const finalOptions = shuffle(options);

    qs.push({
      id: `q_${idCounter++}`,
      type: QuestionType.ANALOGY,
      difficulty: 5,
      content: 'Wybierz brakujący element',
      svgContent: generateMatrix3x3(cells, missingIndex),
      options: finalOptions,
      correctAnswer: finalOptions.indexOf(correct),
      explanation: 'Trzecia figura w rzędzie jest sumą geometryczną dwóch poprzednich.'
    });
  }

  // Pattern 3: Complex Logical XOR (Recursive) - 10 questions
  const lineSegments = [
    `<line x1="20" y1="20" x2="80" y2="20" stroke="currentColor" stroke-width="4" stroke-linecap="round" />`, // Top
    `<line x1="20" y1="50" x2="80" y2="50" stroke="currentColor" stroke-width="4" stroke-linecap="round" />`, // Mid H
    `<line x1="20" y1="80" x2="80" y2="80" stroke="currentColor" stroke-width="4" stroke-linecap="round" />`, // Bot
    `<line x1="20" y1="20" x2="20" y2="80" stroke="currentColor" stroke-width="4" stroke-linecap="round" />`, // Left
    `<line x1="50" y1="20" x2="50" y2="80" stroke="currentColor" stroke-width="4" stroke-linecap="round" />`, // Mid V
    `<line x1="80" y1="20" x2="80" y2="80" stroke="currentColor" stroke-width="4" stroke-linecap="round" />`, // Right
    `<line x1="20" y1="20" x2="80" y2="80" stroke="currentColor" stroke-width="4" stroke-linecap="round" />`, // Diag 1
    `<line x1="80" y1="20" x2="20" y2="80" stroke="currentColor" stroke-width="4" stroke-linecap="round" />`, // Diag 2
    `<circle cx="50" cy="50" r="10" fill="none" stroke="currentColor" stroke-width="3" />`, // Center Circle
    `<rect x="40" y="40" width="20" height="20" fill="none" stroke="currentColor" stroke-width="3" />`, // Center Square
  ];

  for (let i = 0; i < 10; i++) {
    const parts = shuffle(lineSegments);
    
    // More complex XOR distribution
    const row1_a = parts[0] + parts[1] + parts[4];
    const row1_b = parts[1] + parts[2] + parts[5];
    const row1_c = parts[0] + parts[4] + parts[2] + parts[5]; // XOR
    
    const row2_a = parts[3] + parts[4] + parts[6];
    const row2_b = parts[4] + parts[5] + parts[7];
    const row2_c = parts[3] + parts[6] + parts[5] + parts[7];
    
    const row3_a = parts[0] + parts[3] + parts[8];
    const row3_b = parts[1] + parts[4] + parts[8];
    const row3_c = parts[0] + parts[3] + parts[1] + parts[4];

    const cells = [row1_a, row1_b, row1_c, row2_a, row2_b, row2_c, row3_a, row3_b, row3_c];
    
    const missingIndex = i < 3 ? 8 : Math.floor(Math.random() * 3) + 6;
    const correctVal = cells[missingIndex];
    const correct = wrapSvg(correctVal);
    
    const wrongOptions = [
      wrapSvg(row3_a + row3_b),
      wrapSvg(row3_a),
      wrapSvg(row3_b),
      wrapSvg(row2_c),
      wrapSvg(row1_c),
      wrapSvg(parts[0] + parts[3] + parts[5] + parts[8])
    ].filter(opt => opt !== correct);
    
    const options = shuffle([correct, ...shuffle(wrongOptions).slice(0, 5)]).slice(0, 6);
    const finalOptions = shuffle(options);

    qs.push({
      id: `q_${idCounter++}`,
      type: QuestionType.LOGIC,
      difficulty: 8,
      content: 'Wybierz brakujący element',
      svgContent: generateMatrix3x3(cells, missingIndex),
      options: finalOptions,
      correctAnswer: finalOptions.indexOf(correct),
      explanation: 'Wysoce złożona operacja XOR: usunięcie nakładających się segmentów w każdym rzędzie.'
    });
  }

  // Pattern 4: Triple-Clock Rotation - 10 questions
  for (let i = 0; i < 10; i++) {
    const shape = shuffle(['circle', 'square', 'hexagon'])[0];
    const baseShape = getClassicShape(shape, 'none');
    
    const p1 = `<line x1="50" y1="50" x2="50" y2="20" stroke="currentColor" stroke-width="4" stroke-linecap="round" />`;
    const p2 = `<circle cx="50" cy="20" r="4" fill="currentColor" />`;
    const p3 = `<rect x="45" y="75" width="10" height="10" fill="currentColor" />`;
    
    const s1 = Math.floor(Math.random() * 8) * 45;
    const st1 = 45;
    const s2 = Math.floor(Math.random() * 8) * 45;
    const st2 = -45;
    const s3 = Math.floor(Math.random() * 8) * 45;
    const st3 = 90;
    
    const cells = [];
    for (let j = 0; j < 9; j++) {
      const a1 = s1 + j * st1;
      const a2 = s2 + j * st2;
      const a3 = s3 + j * st3;
      cells.push(baseShape + 
        `<g transform="rotate(${a1} 50 50)">${p1}</g>` + 
        `<g transform="rotate(${a2} 50 50)">${p2}</g>` +
        `<g transform="rotate(${a3} 50 50)">${p3}</g>`
      );
    }
    
    const missingIndex = i < 5 ? 8 : Math.floor(Math.random() * 3) + 6;
    const correct = wrapSvg(cells[missingIndex]);
    
    const wrongOptions = [];
    for (let k = 1; k <= 7; k++) {
      const wa1 = s1 + (missingIndex * st1) + (k % 2 === 0 ? 45 : -45);
      const wa2 = s2 + (missingIndex * st2) + (k * 22.5);
      const wa3 = s3 + (missingIndex * st3) + (k * 45);
      wrongOptions.push(wrapSvg(baseShape + 
        `<g transform="rotate(${wa1} 50 50)">${p1}</g>` + 
        `<g transform="rotate(${wa2} 50 50)">${p2}</g>` +
        `<g transform="rotate(${wa3} 50 50)">${p3}</g>`
      ));
    }
    
    const options = shuffle([correct, ...shuffle(wrongOptions).slice(0, 5)]).slice(0, 6);
    const finalOptions = shuffle(options);

    qs.push({
      id: `q_${idCounter++}`,
      type: QuestionType.SPATIAL,
      difficulty: 8,
      content: 'Wybierz brakujący element',
      svgContent: generateMatrix3x3(cells, missingIndex),
      options: finalOptions,
      correctAnswer: finalOptions.indexOf(correct),
      explanation: 'Trzy niezależne elementy obracają się według własnych reguł: linia o 45 (+), kropka o 45 (-) i kwadrat o 90 (+).'
    });
  }

  // Pattern 5: Matrix Multiplication Logic - 10 questions
  for (let i = 0; i < 10; i++) {
    const rows = [];
    for (let r = 0; r < 3; r++) {
      const a = Math.floor(Math.random() * 6) + 2;
      const b = Math.floor(Math.random() * 6) + 2;
      const c = (a * b) - r; // Compound rule
      rows.push([a, b, c]);
    }
    
    const numbers = rows.flat();
    const cells = numbers.map(n => generateNumberCell(n));
    
    const missingIndex = i < 4 ? 8 : Math.floor(Math.random() * 3) + 6;
    const correctVal = numbers[missingIndex];
    const correct = wrapSvg(generateNumberCell(correctVal));
    
    const wrongOptions = [
      wrapSvg(generateNumberCell(correctVal + 1)),
      wrapSvg(generateNumberCell(correctVal - 1)),
      wrapSvg(generateNumberCell(correctVal + 10)),
      wrapSvg(generateNumberCell(correctVal * 2)),
      wrapSvg(generateNumberCell(Math.floor(correctVal / 2))),
      wrapSvg(generateNumberCell(Math.abs(correctVal - 5)))
    ].filter(opt => opt !== correct);
    
    const options = shuffle([correct, ...shuffle(wrongOptions).slice(0, 5)]).slice(0, 6);
    const finalOptions = shuffle(options);

    qs.push({
      id: `q_${idCounter++}`,
      type: QuestionType.NUMBER_SERIES,
      difficulty: 7,
      content: 'Uzupełnij brakującą liczbę',
      svgContent: generateMatrix3x3(cells, missingIndex),
      options: finalOptions,
      correctAnswer: finalOptions.indexOf(correct),
      explanation: 'W każdym rzędzie trzecia liczba to wynik mnożenia dwóch pierwszych pomniejszony o indeks rzędu.'
    });
  }

  // Pattern 6: Triple Rule Progression (Raven-Style) - 10 questions
  for (let i = 0; i < 10; i++) {
    const shapes = shuffle(shapesList);
    const fills = shuffle(['none', 'solid', 'stripes_h', 'dots']);
    
    const cells = [];
    for (let j = 0; j < 9; j++) {
      const r = Math.floor(j / 3);
      const c = j % 3;
      
      const sIdx = (r + c) % 3;
      const fIdx = (r) % 3;
      const rot = (c) * 45;
      
      const dotsCount = r + c + 1;
      let dotsSvg = '';
      for (let d = 0; d < dotsCount; d++) {
        dotsSvg += `<circle cx="${20 + d * 12}" cy="15" r="3" fill="currentColor" />`;
      }
      
      cells.push(getClassicShape(shapes[sIdx], fills[fIdx], `rotate(${rot} 50 50)`) + dotsSvg);
    }
    
    const missingIndex = i < 3 ? 8 : Math.floor(Math.random() * 3) + 6;
    const correct = wrapSvg(cells[missingIndex]);
    
    const wrongOptions = [
      wrapSvg(cells[(missingIndex + 1) % 6]),
      wrapSvg(cells[(missingIndex + 2) % 6]),
      wrapSvg(cells[(missingIndex + 3) % 6]),
      wrapSvg(getClassicShape(shapes[1], fills[1], `rotate(180 50 50)`) + `<circle cx="20" cy="15" r="3" fill="currentColor" />`),
      wrapSvg(getClassicShape(shapes[0], fills[0]) + `<circle cx="50" cy="50" r="10" fill="rose" />`)
    ].filter(opt => opt !== correct);
    
    const options = shuffle([correct, ...shuffle(wrongOptions).slice(0, 5)]).slice(0, 6);
    const finalOptions = shuffle(options);

    qs.push({
      id: `q_${idCounter++}`,
      type: QuestionType.MATRIX,
      difficulty: 9,
      content: 'Wybierz brakujący element',
      svgContent: generateMatrix3x3(cells, missingIndex),
      options: finalOptions,
      correctAnswer: finalOptions.indexOf(correct),
      explanation: 'Kombinacja czterech reguł: kształt (przesunięcie), wypełnienie (stałe w rzędzie), obrót (stały w kolumnie) oraz liczba kropek (suma indeksów).'
    });
  }

  // Pattern 7: Triple Property Matrix (Shape + Fill + Ornament) - 10 questions
  for (let i = 0; i < 10; i++) {
    const selectedShapes = shuffle(shapesList).slice(0, 3);
    const selectedFills = ['none', 'solid', 'stripes_h'];
    const ornaments = [
      (c: string) => c + `<circle cx="20" cy="20" r="5" fill="currentColor" />`,
      (c: string) => c + `<rect x="75" y="75" width="10" height="10" fill="currentColor" />`,
      (c: string) => c + `<path d="M 20 80 L 30 70" stroke="currentColor" stroke-width="3" />`
    ];
    
    const cells = [];
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const sIdx = (r + c) % 3;
        const fIdx = (r * c) % 3; // Even more complex non-linear
        const oIdx = (r + 2 * c) % 3;
        const base = getClassicShape(selectedShapes[sIdx], selectedFills[fIdx]);
        cells.push(ornaments[oIdx](base));
      }
    }
    
    const missingIndex = i < 2 ? 8 : Math.floor(Math.random() * 3) + 6;
    const correct = wrapSvg(cells[missingIndex]);
    
    const wrongOptions = [
      wrapSvg(cells[0]),
      wrapSvg(cells[4]),
      wrapSvg(cells[2]),
      wrapSvg(ornaments[0](getClassicShape(selectedShapes[0], 'solid'))),
      wrapSvg(ornaments[1](getClassicShape(selectedShapes[1], 'none'))),
      wrapSvg(ornaments[2](getClassicShape(selectedShapes[2], 'stripes_h')))
    ].filter(opt => opt !== correct);
    
    const options = shuffle([correct, ...shuffle(wrongOptions).slice(0, 5)]).slice(0, 6);
    const finalOptions = shuffle(options);

    qs.push({
      id: `q_${idCounter++}`,
      type: QuestionType.LOGIC,
      difficulty: 10,
      content: 'Wybierz brakujący element',
      svgContent: generateMatrix3x3(cells, missingIndex),
      options: finalOptions,
      correctAnswer: finalOptions.indexOf(correct),
      explanation: 'Wysoce zaawansowana matryca atrybutów z nieliniowymi przesunięciami.'
    });
  }

  // Pattern 8: Non-Linear Geometric Sequence - 10 questions
  for (let i = 0; i < 10; i++) {
    const start1 = Math.floor(Math.random() * 4) + 1;
    const start2 = Math.floor(Math.random() * 4) + 2;
    const sequence = [start1, start2];
    for (let j = 2; j < 9; j++) {
      sequence.push(sequence[j-1] * 2 - sequence[j-2] + j);
    }
    
    const cells = sequence.map(n => generateNumberCell(n));
    const missingIndex = i < 4 ? 8 : Math.floor(Math.random() * 3) + 6;
    const correctVal = sequence[missingIndex];
    const correct = wrapSvg(generateNumberCell(correctVal));
    
    const wrongOptions = [
      wrapSvg(generateNumberCell(correctVal + 1)),
      wrapSvg(generateNumberCell(correctVal - 1)),
      wrapSvg(generateNumberCell(correctVal + 2)),
      wrapSvg(generateNumberCell(correctVal - 2)),
      wrapSvg(generateNumberCell(Math.floor(correctVal * 1.1))),
      wrapSvg(generateNumberCell(correctVal * 1.5))
    ].filter(opt => opt !== correct);
    
    const options = shuffle([correct, ...shuffle(wrongOptions).slice(0, 5)]).slice(0, 6);
    const finalOptions = shuffle(options);

    qs.push({
      id: `q_${idCounter++}`,
      type: QuestionType.NUMBER_SERIES,
      difficulty: 10,
      content: 'Uzupełnij brakującą liczbę',
      svgContent: generateMatrix3x3(cells, missingIndex),
      options: finalOptions,
      correctAnswer: finalOptions.indexOf(correct),
      explanation: 'Ciąg rekurencyjny: 2*a[n-1] - a[n-2] + n.'
    });
  }

  return qs;
};

export const QUESTIONS: Question[] = generateQuestions();
