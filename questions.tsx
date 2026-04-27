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
  svg += '<line x1="100" y1="0" x2="100" y2="300" stroke="currentColor" stroke-width="4" opacity="0.3" />';
  svg += '<line x1="200" y1="0" x2="200" y2="300" stroke="currentColor" stroke-width="4" opacity="0.3" />';
  svg += '<line x1="0" y1="100" x2="300" y2="100" stroke="currentColor" stroke-width="4" opacity="0.3" />';
  svg += '<line x1="0" y1="200" x2="300" y2="200" stroke="currentColor" stroke-width="4" opacity="0.3" />';
  
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

  // 1. Pattern: ADVANCED XOR/LOGICAL MERGE (Mensa Grade)
  const generateMensaXor = () => {
    const segments = [
      '<line x1="20" y1="50" x2="80" y2="50" stroke="currentColor" stroke-width="4" stroke-linecap="round" />',
      '<line x1="50" y1="20" x2="50" y2="80" stroke="currentColor" stroke-width="4" stroke-linecap="round" />',
      '<circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" stroke-width="4" />',
      '<path d="M 20 20 L 80 80" stroke="currentColor" stroke-width="4" stroke-linecap="round" />',
      '<path d="M 80 20 L 20 80" stroke="currentColor" stroke-width="4" stroke-linecap="round" />',
      '<rect x="25" y="25" width="50" height="50" fill="none" stroke="currentColor" stroke-width="4" />',
      '<circle cx="50" cy="50" r="10" fill="currentColor" />',
      '<line x1="10" y1="10" x2="90" y2="90" stroke="currentColor" stroke-width="1" stroke-dasharray="2" />'
    ];

    const getXorResult = (p1: string[], p2: string[]) => {
      return segments.filter(s => (p1.includes(s) || p2.includes(s)) && !(p1.includes(s) && p2.includes(s)));
    };

    const getRandomSegments = () => shuffle(segments).slice(0, 2 + Math.floor(Math.random() * 2));

    const r1_p1 = getRandomSegments();
    const r1_p2 = getRandomSegments();
    const r1_xor = getXorResult(r1_p1, r1_p2);

    const r2_p1 = getRandomSegments();
    const r2_p2 = getRandomSegments();
    const r2_xor = getXorResult(r2_p1, r2_p2);

    const r3_p1 = getRandomSegments();
    const r3_p2 = getRandomSegments();
    const r3_xor = getXorResult(r3_p1, r3_p2);

    const cells = [
      r3_p1.join(''), r3_p2.join(''), r3_xor.join(''),
      r1_p1.join(''), r1_p2.join(''), r1_xor.join(''),
      r2_p1.join(''), r2_p2.join(''), r2_xor.join('')
    ];

    const correct = wrapSvg(cells[8]);
    const options = [correct];
    while(options.length < 6) {
      const cand = wrapSvg(getRandomSegments().join(''));
      if (!options.includes(cand)) options.push(cand);
    }

    return {
      id: `m_xor_${idCounter++}`,
      type: QuestionType.LOGIC,
      difficulty: 9,
      content: 'Wybierz brakujący element (Logika nakładania Mensa)',
      svgContent: generateMatrix3x3(cells, 8),
      options: options,
      correctAnswer: 0,
      explanation: 'Trzecia kolumna powstaje poprzez nałożenie dwóch pierwszych, przy czym elementy wspólne znikają.'
    };
  };

  // 2. Pattern: TRIPLE ATTRIBUTE ROTATION (Latin Square)
  const generateMensaLatin = () => {
    const allShapes: ("square" | "circle" | "triangle" | "diamond" | "hexagon")[] = ['square', 'circle', 'triangle', 'diamond', 'hexagon'];
    const allFills: ("none" | "solid" | "stripes_h" | "stripes_v" | "grid" | "dots")[] = ['solid', 'none', 'dots', 'grid', 'stripes_h'];
    
    const s = shuffle(allShapes).slice(0, 3);
    const f = shuffle(allFills).slice(0, 3);
    const o = [0, 45, 90, 135, 180].sort(() => 0.5 - Math.random()).slice(0, 3);

    const cells = [];
    for(let r=0; r<3; r++) {
      for(let c=0; c<3; c++) {
        const shape = s[(r + c) % 3];
        const fill = f[(r + 2*c) % 3];
        const rot = o[(2*r + c) % 3];
        cells.push(getClassicShape(shape, fill, `rotate(${rot} 50 50)`));
      }
    }

    const correct = wrapSvg(cells[8]);
    const options = [correct];
    while(options.length < 6) {
        const shape = s[Math.floor(Math.random()*3)];
        const fill = f[Math.floor(Math.random()*3)];
        const rot = o[Math.floor(Math.random()*3)] + (Math.random() > 0.5 ? 22.5 : 0);
        const cand = wrapSvg(getClassicShape(shape, fill, `rotate(${rot} 50 50)`));
        if(!options.includes(cand)) options.push(cand);
    }

    return {
      id: `m_latin_${idCounter++}`,
      type: QuestionType.MATRIX,
      difficulty: 8,
      content: 'Dopełnij macierz atrybutów (Raven/Mensa)',
      svgContent: generateMatrix3x3(cells, 8),
      options: options,
      correctAnswer: 0,
      explanation: 'Każdy kształt, wypełnienie i kąt obrotu występuje dokładnie raz w każdym wierszu i kolumnie.'
    };
  };

  // 3. Pattern: DUAL VECTOR ROTATION
  const generateMensaVector = () => {
    const baseRot = Math.floor(Math.random() * 8) * 45;
    const step1 = [45, 90, 135, -45, -90][Math.floor(Math.random()*5)];
    const step2 = [45, 90, 135, -45, -90].filter(s => s !== step1)[Math.floor(Math.random()*4)];
    
    const colors = ['currentColor', '#3b82f6', '#ef4444', '#10b981'];
    const mainColor = colors[Math.floor(Math.random() * colors.length)];

    const cells = [];
    const base = `<circle cx="50" cy="50" r="40" fill="none" stroke="${mainColor}" stroke-width="1.5" stroke-dasharray="3" />`;
    for(let i=0; i<9; i++) {
      const a1 = baseRot + i * step1;
      const a2 = baseRot + i * step2;
      const p1 = `<circle cx="50" cy="15" r="5" fill="${mainColor}" />`; 
      const p2 = `<rect x="45" y="72" width="10" height="10" fill="none" stroke="${mainColor}" stroke-width="2.5" />`; 
      cells.push(base + `<g transform="rotate(${a1} 50 50)">${p1}</g>` + `<g transform="rotate(${a2} 50 50)">${p2}</g>`);
    }

    const correct = wrapSvg(cells[8]);
    const options = [correct];
    while(options.length < 6) {
        const a1 = Math.floor(Math.random()*8)*45;
        const a2 = Math.floor(Math.random()*8)*45;
        const cand = wrapSvg(base + `<g transform="rotate(${a1} 50 50)"><circle cx="50" cy="15" r="5" fill="${mainColor}" /></g>` + `<g transform="rotate(${a2} 50 50)"><rect x="45" y="72" width="10" height="10" fill="none" stroke="${mainColor}" stroke-width="2.5" /></g>`);
        if(!options.includes(cand)) options.push(cand);
    }

    return {
      id: `m_vector_${idCounter++}`,
      type: QuestionType.SPATIAL,
      difficulty: 9,
      content: 'Widzenie przestrzenne i rotacja dwuosiowa',
      svgContent: generateMatrix3x3(cells, 8),
      options: options,
      correctAnswer: 0,
      explanation: 'Dwa elementy poruszają się po obwodzie koła ze stałymi, ale różnymi prędkościami kątowymi.'
    };
  };

  // 4. Pattern: SYMBOLIC ARITHMETIC (Visual Addition)
  const generateMensaArithmetic = () => {
    const symbols = [
        '<path d="M 20 20 L 50 50 L 20 80" stroke="currentColor" stroke-width="4" fill="none" />',
        '<path d="M 80 20 L 50 50 L 80 80" stroke="currentColor" stroke-width="4" fill="none" />',
        '<line x1="50" y1="20" x2="50" y2="80" stroke="currentColor" stroke-width="4" />',
        '<circle cx="50" cy="50" r="10" fill="currentColor" />',
        '<rect x="20" y="20" width="60" height="10" fill="currentColor" />',
        '<rect x="20" y="70" width="60" height="10" fill="currentColor" />'
    ];

    const getRow = () => {
        const s1 = shuffle(symbols).slice(0, 2);
        const s2 = shuffle(symbols).slice(0, 2);
        const s3 = Array.from(new Set([...s1, ...s2]));
        return [s1.join(''), s2.join(''), s3.join('')];
    };

    const r1 = getRow();
    const r2 = getRow();
    const r3 = getRow();
    const cells = [...r1, ...r2, ...r3];

    const correct = wrapSvg(cells[8]);
    const options = [correct];
    while(options.length < 6) {
        const cand = wrapSvg(shuffle(symbols).slice(0, 3).join(''));
        if(!options.includes(cand)) options.push(cand);
    }

    return {
      id: `m_arith_${idCounter++}`,
      type: QuestionType.MATRIX,
      difficulty: 8,
      content: 'Wizualne dodawanie elementów (Mensa)',
      svgContent: generateMatrix3x3(cells, 8),
      options: options,
      correctAnswer: 0,
      explanation: 'Trzecia figura w wierszu jest sumą zbiorów elementów dwóch poprzednich figur.'
    };
  };

  // 5. Pattern: PERSPECTIVE / SYMMETRY
  const generateMensaSymmetry = () => {
    const types = ['mirror_h', 'mirror_v', 'rot_180'];
    const selectedType = types[Math.floor(Math.random()*types.length)];
    const baseShapes = [
        '<path d="M 20 20 L 50 20 L 50 80 L 20 80 Z" fill="currentColor" opacity="0.3" /><path d="M 20 20 L 50 50 L 20 80" stroke="currentColor" stroke-width="4" fill="none" />',
        '<circle cx="35" cy="50" r="15" fill="none" stroke="currentColor" stroke-width="4" /><line x1="20" y1="20" x2="50" y2="80" stroke="currentColor" stroke-width="2" />',
        '<rect x="20" y="30" width="30" height="40" fill="none" stroke="currentColor" stroke-width="4" /><circle cx="35" cy="50" r="5" fill="currentColor" />'
    ];

    const transform = (svg: string, type: string) => {
        if(type === 'mirror_h') return `<g transform="scale(-1 1) translate(-100 0)">${svg}</g>`;
        if(type === 'mirror_v') return `<g transform="scale(1 -1) translate(0 -100)">${svg}</g>`;
        return `<g transform="rotate(180 50 50)">${svg}</g>`;
    };

    const r1_base = shuffle(baseShapes)[0];
    const r2_base = shuffle(baseShapes)[1];
    const r3_base = shuffle(baseShapes)[2];

    const cells = [
        r1_base, transform(r1_base, selectedType), r1_base + transform(r1_base, selectedType),
        r2_base, transform(r2_base, selectedType), r2_base + transform(r2_base, selectedType),
        r3_base, transform(r3_base, selectedType), r3_base + transform(r3_base, selectedType)
    ];

    const correct = wrapSvg(cells[8]);
    const options = [correct];
    while(options.length < 6) {
        const candBase = shuffle(baseShapes)[0];
        const cand = wrapSvg(candBase + transform(candBase, types[Math.floor(Math.random()*types.length)]));
        if(!options.includes(cand)) options.push(cand);
    }

    return {
      id: `m_symm_${idCounter++}`,
      type: QuestionType.SPATIAL,
      difficulty: 8,
      content: 'Symetria i nakładanie (Mensa)',
      svgContent: generateMatrix3x3(cells, 8),
      options: options,
      correctAnswer: 0,
      explanation: 'Trzecia figura jest połączeniem figury bazowej i jej odbicia lustrzanego lub obrotu.'
    };
  };

  // 6. Pattern: BASIC RAVEN (Simpler)
  const generateBasicRaven = (diff: number) => {
    const s = ['square', 'circle', 'triangle', 'diamond', 'hexagon'];
    const selectedS = shuffle(s)[0];
    const cells = [];
    for(let i=0; i<9; i++) {
        const fill = ['none', 'solid', 'dots', 'grid', 'stripes_h', 'stripes_v'][(i % 6)];
        cells.push(getClassicShape(selectedS as any, fill as any));
    }
    const correct = wrapSvg(cells[8]);
    return {
      id: `m_basic_${idCounter++}`,
      type: QuestionType.MATRIX,
      difficulty: diff,
      content: 'Prosty wzórRaven.',
      svgContent: generateMatrix3x3(cells, 8),
      options: shuffle([correct, wrapSvg(getClassicShape('square', 'none')), wrapSvg(getClassicShape('circle', 'solid')), wrapSvg(getClassicShape('triangle', 'dots')), wrapSvg(getClassicShape('diamond', 'grid')), wrapSvg(getClassicShape('hexagon', 'stripes_v'))]),
      correctAnswer: 0,
      explanation: 'Zmiana wypełnienia w stałym kształcie.'
    };
  };

  // 7. Pattern: USER CUSTOM MENSA (NOWE)
  const drawCustomMensaCell = (dots: string[], circles: string[]) => {
    let content = '';
    const pos: any = {
      lt: { x: 20, y: 20 }, rt: { x: 80, y: 20 },
      lb: { x: 20, y: 80 }, rb: { x: 80, y: 80 },
      t: { x: 50, y: 15 }, b: { x: 50, y: 85 },
      l: { x: 15, y: 50 }, r: { x: 85, y: 50 },
      bl: { x: 35, y: 85 } // bottom-leftish
    };
    
    dots.forEach(d => {
      content += `<circle cx="${pos[d].x}" cy="${pos[d].y}" r="11" fill="currentColor" />`;
    });
    circles.forEach(c => {
      content += `<circle cx="${pos[c].x}" cy="${pos[c].y}" r="13" fill="none" stroke="currentColor" stroke-width="5" />`;
    });
    
    return `<rect x="2" y="2" width="96" height="96" fill="none" stroke="currentColor" stroke-width="4" />${content}`;
  };

  const customCells = [
    drawCustomMensaCell(['rt', 'lb'], ['r', 'bl']), // 1,1
    drawCustomMensaCell(['rt', 'lb', 'rb'], ['l', 'r', 'b']), // 1,2
    drawCustomMensaCell(['rt', 'lb'], ['r', 'bl']), // 1,3
    drawCustomMensaCell(['lt', 'rt'], ['t', 'l', 'r', 'b']), // 2,1
    drawCustomMensaCell(['lt', 'lb'], ['t', 'b']), // 2,2
    drawCustomMensaCell(['lt'], ['t', 'b']), // 2,3
    drawCustomMensaCell(['rt'], ['r', 'bl']), // 3,1
    drawCustomMensaCell(['lb'], ['b']), // 3,2
    drawCustomMensaCell([], ['bl']) // 3,3 (Correct Answer)
  ];

  const customOptions = [
    wrapSvg(drawCustomMensaCell([], ['bl'])), // A: Correct
    wrapSvg(drawCustomMensaCell(['lt'], ['t'])), // B
    wrapSvg(drawCustomMensaCell(['rt'], ['b'])), // C
    wrapSvg(drawCustomMensaCell([], ['t', 'b'])), // D
    wrapSvg(drawCustomMensaCell(['lb'], [])), // E
    wrapSvg(drawCustomMensaCell(['rt', 'lb'], ['bl'])), // F
    wrapSvg(drawCustomMensaCell([], [])), // G
    wrapSvg(drawCustomMensaCell(['lt', 'rt', 'lb', 'rb'], ['t', 'b', 'l', 'r'])) // H
  ];

  const customMensaQ: Question = {
    id: `q_custom_mensa_${idCounter++}`,
    type: QuestionType.MATRIX,
    difficulty: 9,
    content: 'ZADANIE NOWE (Logika przecięcia): Wybierz brakujący element.',
    svgContent: generateMatrix3x3(customCells, 8),
    options: customOptions,
    correctAnswer: 0,
    explanation: 'Trzeci wiersz jest częścią wspólną (iloczynem logicznym) pierwszego i drugiego wiersza w każdej kolumnie.'
  };

  // Add more patterns to reach 30 questions with varied difficulty
  qs.push(customMensaQ);
  for(let i=0; i<4; i++) qs.push(generateBasicRaven(2 + i));
  for(let i=0; i<5; i++) qs.push(generateMensaXor());
  for(let i=0; i<5; i++) qs.push(generateMensaLatin());
  for(let i=0; i<5; i++) qs.push(generateMensaVector());
  for(let i=0; i<5; i++) qs.push(generateMensaArithmetic());
  for(let i=0; i<5; i++) qs.push(generateMensaSymmetry());

  // Final post-processing to set correct answer index correctly after shuffle
  return qs.map(q => {
    const correctSvg = q.options[0]; // We put it at 0 initially before a wrapper shuffle
    const finalOptions = shuffle(q.options);
    return {
      ...q,
      options: finalOptions,
      correctAnswer: finalOptions.indexOf(correctSvg)
    };
  });
};

export const QUESTIONS: Question[] = generateQuestions();
