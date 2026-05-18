/**
 * Macierze 3×3 inspirowane polskimi ćwiczeniami (arkusz IQ) — same SVG w komórce 100×100.
 */

const sw = 3;

/** Mała siatka 3×3 w środku komórki; blacks jako [wiersz, kolumna] 0..2 (0 = góra). */
export const miniBlackGrid = (blacks: [number, number][], u = 9): string => {
  const g = 1.6;
  const total = 3 * u + 2 * g;
  const ox = 50 - total / 2;
  const oy = 50 - total / 2;
  const set = new Set(blacks.map(([r, c]) => `${r},${c}`));
  let out = '';
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const x = ox + c * (u + g);
      const y = oy + r * (u + g);
      const fill = set.has(`${r},${c}`) ? 'currentColor' : 'none';
      out += `<rect x="${x}" y="${y}" width="${u}" height="${u}" fill="${fill}" stroke="currentColor" stroke-width="1.6"/>`;
    }
  }
  return out;
};

/** Ćwiczenie 1: w polu (R,C) jedna czarna pod-komórka na pozycji (R,C) wewnętrznej siatki 3×3. */
export const buildExercise1 = () => {
  const cells: string[] = [];
  for (let R = 0; R < 3; R++) {
    for (let C = 0; C < 3; C++) {
      cells.push(miniBlackGrid([[R, C]]));
    }
  }
  const correct = cells[8];
  const innerOptions = [
    miniBlackGrid([[2, 0]]),
    miniBlackGrid([[2, 1]]),
    miniBlackGrid([[1, 2]]),
    miniBlackGrid([[1, 1]]),
    miniBlackGrid([[0, 0]]),
    miniBlackGrid([[0, 2]]),
  ];
  return {
    cells,
    missingIndex: 8 as const,
    innerOptions,
    explanation:
      'W polu w wierszu R i kolumnie C mała siatka ma dokładnie jedną czarną komórkę na pozycji (R, C) — w prawym dolnym polu dużej macierzy szukasz czarnego w prawym dolnym rogu małej siatki.',
    content: 'Wybierz odpowiedź',
  };
};

const outerCircle = `<circle cx="50" cy="50" r="32" fill="none" stroke="currentColor" stroke-width="${sw}"/>`;
const outerSquare = `<rect x="20" y="20" width="60" height="60" fill="none" stroke="currentColor" stroke-width="${sw}"/>`;
const outerTriangle = `<polygon points="50,18 82,78 18,78" fill="none" stroke="currentColor" stroke-width="${sw}"/>`;
const innerDot = `<circle cx="50" cy="50" r="4.5" fill="currentColor"/>`;
const innerPlus = `<g stroke="currentColor" stroke-width="${sw}" stroke-linecap="square"><line x1="50" y1="38" x2="50" y2="62"/><line x1="38" y1="50" x2="62" y2="50"/></g>`;

/** Ćwiczenie 3: wiersz = kształt obwódki; w wierszu występują pusty środek, kropka i plus w dowolnej kolejności. */
export const buildExercise3 = () => {
  const cells = [
    outerCircle,
    outerCircle + innerDot,
    outerCircle + innerPlus,
    outerSquare + innerPlus,
    outerSquare,
    outerSquare + innerDot,
    outerTriangle + innerDot,
    outerTriangle + innerPlus,
    outerTriangle,
  ];
  const correct = cells[8];
  const innerOptions = [
    outerTriangle + innerPlus,
    outerTriangle + innerDot,
    outerSquare + innerDot,
    outerSquare + innerPlus,
    outerCircle + innerDot,
  ].filter((s) => s !== correct);
  return {
    cells,
    missingIndex: 8 as const,
    innerOptions: innerOptions.slice(0, 5),
    explanation:
      'W każdym wierszu ta sama obwódka; w każdym wierszu występują trzy warianty środka (pusto, kropka, plus). Brakuje trójkąta bez środka.',
    content: 'Wybierz odpowiedź',
  };
};

const block = (x: number, y: number, w: number, h: number) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="currentColor"/>`;

/** Ćwiczenie 4: w każdym wierszu ta sama orientacja linii; znacznik przesuwa się: koniec → środek → drugi koniec. */
export const buildExercise4 = () => {
  const t = 5;
  const len = 56;
  const hw = 10;
  const hh = 7;
  const cx = 50;
  const cy = 50;
  const hLine = (bx: number) =>
    `<line x1="${cx - len / 2}" y1="${cy}" x2="${cx + len / 2}" y2="${cy}" stroke="currentColor" stroke-width="${t}" stroke-linecap="butt"/>` +
    block(bx - hw / 2, cy - hh / 2, hw, hh);
  const row0 = [hLine(cx + len / 2 - hw / 2), hLine(cx - hw / 2), hLine(cx - len / 2 + hw / 2)];
  const dLen = 40;
  const dLine = (bx: number, by: number) =>
    `<line x1="${cx - dLen / 2}" y1="${cy + dLen / 2}" x2="${cx + dLen / 2}" y2="${cy - dLen / 2}" stroke="currentColor" stroke-width="${t}" stroke-linecap="butt"/>` +
    block(bx - hw / 2, by - hh / 2, hw, hh);
  const row1 = [
    dLine(cx + dLen / 2 * 0.65, cy - dLen / 2 * 0.65),
    dLine(cx, cy),
    dLine(cx - dLen / 2 * 0.65, cy + dLen / 2 * 0.65),
  ];
  const vLine = (by: number) =>
    `<line x1="${cx}" y1="${cy - len / 2}" x2="${cx}" y2="${cy + len / 2}" stroke="currentColor" stroke-width="${t}" stroke-linecap="butt"/>` +
    block(cx - hw / 2, by - hh / 2, hw, hh);
  const row2 = [vLine(cy - len / 2 + hh / 2), vLine(cy), vLine(cy + len / 2 - hh / 2)];
  const cells = [...row0, ...row1, ...row2];
  const correct = cells[8];
  const innerOptions = [
    vLine(cy),
    hLine(cx - len / 2 + hw / 2),
    hLine(cx - hw / 2),
    dLine(cx - dLen / 2 * 0.65, cy + dLen / 2 * 0.65),
    `<line x1="${cx}" y1="${cy - len / 2}" x2="${cx}" y2="${cy + len / 2}" stroke="currentColor" stroke-width="${t}"/>` +
      block(cx - hw / 2, cy - len / 2 - 2, hw, hh),
  ].filter((s) => s !== correct);
  return {
    cells,
    missingIndex: 8 as const,
    innerOptions: innerOptions.slice(0, 5),
    explanation:
      'W każdym wierszu linia ma stałą orientację (pozioma / ukośna / pionowa), a prostokątny znacznik przesuwa się od jednego końca przez środek do drugiego końca.',
    content: 'Wybierz odpowiedź',
  };
};

const lineWithArrow = (x1: number, y1: number, x2: number, y2: number) => {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const px = -uy;
  const py = ux;
  const tip = 9;
  const base = 5;
  const bx = x2 - ux * tip;
  const by = y2 - uy * tip;
  return (
    `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="currentColor" stroke-width="${sw}" stroke-linecap="butt"/>` +
    `<polygon points="${x2},${y2} ${bx + px * base},${by + py * base} ${bx - px * base},${by - py * base}" fill="currentColor"/>`
  );
};

const lineWithVMid = (x1: number, y1: number, x2: number, y2: number) => {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const px = -uy * 6;
  const py = ux * 6;
  return (
    `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="currentColor" stroke-width="${sw}"/>` +
    `<line x1="${mx + px}" y1="${my + py}" x2="${mx - px}" y2="${my - py}" stroke="currentColor" stroke-width="${sw}" stroke-linecap="square"/>`
  );
};

const lineWithVEnd = (x1: number, y1: number, x2: number, y2: number, atStart: boolean) => {
  const ex = atStart ? x1 : x2;
  const ey = atStart ? y1 : y2;
  const mx = atStart ? x1 + (x2 - x1) * 0.12 : x2 - (x2 - x1) * 0.12;
  const my = atStart ? y1 + (y2 - y1) * 0.12 : y2 - (y2 - y1) * 0.12;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const px = (-dy / len) * 5;
  const py = (dx / len) * 5;
  return (
    `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="currentColor" stroke-width="${sw}"/>` +
    `<line x1="${ex + px}" y1="${ey + py}" x2="${ex - px}" y2="${ey - py}" stroke="currentColor" stroke-width="${sw}" stroke-linecap="square"/>`
  );
};

/** Ćwiczenie 5: rząd 1 strzałka na końcu, rząd 2 „V” w środku, rząd 3 „V” przy początku linii; obrót o 45° w prawo. */
export const buildExercise5 = () => {
  const cells = [
    lineWithArrow(50, 78, 50, 22),
    lineWithArrow(24, 72, 76, 28),
    lineWithArrow(22, 50, 78, 50),
    lineWithVMid(50, 78, 50, 22),
    lineWithVMid(24, 72, 76, 28),
    lineWithVMid(22, 50, 78, 50),
    lineWithVEnd(50, 78, 50, 22, true),
    lineWithVEnd(24, 72, 76, 28, true),
    lineWithVEnd(22, 50, 78, 50, true),
  ];
  const correct = cells[8];
  const innerOptions = [
    lineWithArrow(22, 50, 78, 50),
    lineWithVMid(22, 50, 78, 50),
    lineWithVEnd(24, 72, 76, 28, false),
    `<line x1="24" y1="72" x2="76" y2="28" stroke="currentColor" stroke-width="${sw}"/>` +
      `<polygon points="76,28 68,32 70,24" fill="currentColor"/>`,
    lineWithVEnd(50, 78, 50, 22, false),
  ].filter((s) => s !== correct);
  return {
    cells,
    missingIndex: 8 as const,
    innerOptions: innerOptions.slice(0, 5),
    explanation:
      'W każdym wierszu linia obraca się o 45° w prawo; w rzędzie 1 jest grot, w rzędzie 2 segment „V” w środku, w rzędzie 3 „V” przy początku (ogonie) odcinka — ostatnia komórka to pozioma linia z „V” po lewej.',
    content: 'Wybierz odpowiedź',
  };
};

/** Polinomino: lista [x,y] kwadratów jednostkowych (siatka ~12px, wyśrodkowana). */
const poly = (coords: [number, number][], u = 12) => {
  const minx = Math.min(...coords.map((c) => c[0]));
  const miny = Math.min(...coords.map((c) => c[1]));
  const maxx = Math.max(...coords.map((c) => c[0]));
  const maxy = Math.max(...coords.map((c) => c[1]));
  const w = (maxx - minx + 1) * u;
  const h = (maxy - miny + 1) * u;
  const ox = 50 - w / 2 - minx * u;
  const oy = 50 - h / 2 - miny * u;
  let s = '';
  for (const [x, y] of coords) {
    s += block(ox + x * u, oy + y * u, u - 0.8, u - 0.8);
  }
  return s;
};

/** Ćwiczenie 6: w każdym wierszu dokładamy kwadrat przy dolnym prawym „rogu” wzoru (jak na arkuszu). */
export const buildExercise6 = () => {
  const cells = [
    poly([
      [0, 0],
      [1, 0],
    ]),
    poly([
      [0, 0],
      [1, 0],
      [1, 1],
    ]),
    poly([
      [0, 0],
      [1, 0],
      [1, 1],
      [1, 2],
    ]),
    poly([
      [0, 0],
      [1, 0],
      [0, 1],
    ]),
    poly([
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ]),
    poly([
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
      [1, 2],
    ]),
    poly([
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
      [0, 2],
      [1, 2],
    ]),
    poly([
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
      [2, 0],
    ]),
    poly([
      [0, 0],
      [1, 0],
      [2, 0],
      [0, 1],
      [1, 1],
      [2, 1],
    ]),
  ];
  const correct = cells[8];
  const innerOptions = [
    cells[5],
    poly([
      [0, 0],
      [1, 0],
      [2, 0],
      [2, 1],
    ]),
    poly([
      [0, 0],
      [1, 0],
      [2, 0],
      [1, 1],
    ]),
    poly([
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
      [2, 2],
    ]),
    poly([
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
      [2, 0],
      [2, 1],
    ]),
  ].filter((s) => s !== correct);
  return {
    cells,
    missingIndex: 8 as const,
    innerOptions: innerOptions.slice(0, 5),
    explanation:
      'W każdym wierszu do wzoru dokładany jest jeden kwadrat od strony dolnego prawego narożnika — ostatnia figura to pełny prostokąt 2×3.',
    content: 'Wybierz odpowiedź',
  };
};

/** Ćwiczenie 7: przesunięcie wzdłuż przekątnej (jak w ćwiczeniu 7); brakujące pole = pełne środkowy i dolny rząd małej siatki. */
export const buildExercise7 = () => {
  const cells = [
    miniBlackGrid([[2, 2]]),
    miniBlackGrid([
      [1, 0],
      [2, 0],
    ]),
    miniBlackGrid([
      [0, 0],
      [0, 1],
      [0, 2],
    ]),
    miniBlackGrid([
      [1, 0],
      [2, 0],
    ]),
    miniBlackGrid([
      [0, 0],
      [0, 1],
      [0, 2],
    ]),
    miniBlackGrid([
      [1, 2],
      [2, 1],
      [2, 2],
    ]),
    miniBlackGrid([
      [0, 0],
      [0, 1],
      [0, 2],
    ]),
    miniBlackGrid([
      [1, 2],
      [2, 1],
      [2, 2],
    ]),
    miniBlackGrid([
      [1, 0],
      [1, 1],
      [1, 2],
      [2, 0],
      [2, 1],
      [2, 2],
    ]),
  ];
  const correct = cells[8];
  const innerOptions = [
    miniBlackGrid([
      [0, 2],
      [1, 1],
      [1, 2],
      [2, 0],
      [2, 1],
      [2, 2],
    ]),
    miniBlackGrid([
      [0, 0],
      [0, 1],
      [0, 2],
      [2, 0],
      [2, 1],
      [2, 2],
    ]),
    miniBlackGrid([
      [2, 0],
      [2, 1],
      [2, 2],
    ]),
    miniBlackGrid([
      [1, 1],
      [1, 2],
      [2, 1],
      [2, 2],
    ]),
    miniBlackGrid([
      [0, 0],
      [1, 0],
      [2, 0],
      [2, 1],
      [2, 2],
    ]),
  ].filter((s) => s !== correct);
  return {
    cells,
    missingIndex: 8 as const,
    innerOptions: innerOptions.slice(0, 5),
    explanation:
      'Wzorzec przesuwa się wzdłuż przekątnej macierzy; ostatnie pole domyka ciąg — pełne zajęcie środkowego i dolnego rzędu małej siatki.',
    content: 'Wybierz odpowiedź',
  };
};

/** Trójkąt „igła” z obrotem 0=góra, 1=prawo, 2=dół, 3=lewo; która połówka wypełniona: L,R,T,B w układzie igły. */
const needle = (rot: 0 | 1 | 2 | 3, half: 'L' | 'R' | 'T' | 'B') => {
  const tri = `<polygon points="50,22 74,68 26,68" fill="none" stroke="currentColor" stroke-width="${sw}"/>`;
  const fillL = `<polygon points="50,22 50,68 26,68" fill="currentColor" stroke="none"/>`;
  const fillR = `<polygon points="50,22 74,68 50,68" fill="currentColor" stroke="none"/>`;
  const fillMap = { L: fillL, R: fillR, T: fillL, B: fillR };
  const rotA = rot * 90;
  return `<g transform="rotate(${rotA} 50 50)">${fillMap[half]}${tri}</g>`;
};

/** Ćwiczenie 10: w rzędzie 3 obrót i cień jak w rzędzie 2 (przeciwnie do wskazówek). */
export const buildExercise10 = () => {
  const cells = [
    needle(0, 'L'),
    needle(1, 'B'),
    needle(2, 'R'),
    needle(1, 'B'),
    needle(0, 'R'),
    needle(3, 'T'),
    needle(2, 'R'),
    needle(1, 'T'),
    needle(0, 'L'),
  ];
  const correct = cells[8];
  const innerOptions = [
    needle(3, 'T'),
    needle(2, 'R'),
    needle(0, 'R'),
    needle(1, 'T'),
    needle(1, 'B'),
    needle(2, 'L'),
  ].filter((s) => s !== correct);
  return {
    cells,
    missingIndex: 8 as const,
    innerOptions: innerOptions.slice(0, 5),
    explanation:
      'W trzecim wierszu kierunek igły i położenie czarnej połowy zmieniają się tak jak w drugim wierszu (krok o 90° przeciwnie do wskazówek) — ostatnia komórka to igła w górę z czarną lewą połową.',
    content: 'Wybierz odpowiedź',
  };
};

const circleOutline = `<circle cx="50" cy="50" r="34" fill="none" stroke="currentColor" stroke-width="${sw}"/>`;

/** Kąt od 12:00 zgodnie ze wskazówkami, godz. z ułamkiem (np. 4.5 = 4:30). */
const radiusPoint = (hourFrac: number, r: number) => {
  const ang = (-Math.PI / 2) + (hourFrac / 12) * 2 * Math.PI;
  return { x: 50 + r * Math.cos(ang), y: 50 + r * Math.sin(ang) };
};

const dotAt = (hourFrac: number) => {
  const p = radiusPoint(hourFrac, 30);
  return `<circle cx="${p.x.toFixed(2)}" cy="${p.y.toFixed(2)}" r="3.2" fill="currentColor"/>`;
};

const lineTo = (hourFrac: number) => {
  const p = radiusPoint(hourFrac, 32);
  return `<line x1="50" y1="50" x2="${p.x.toFixed(2)}" y2="${p.y.toFixed(2)}" stroke="currentColor" stroke-width="${sw}"/>`;
};

/** Ćwiczenie 26 (uproszczone): kropki = część wspólna kolumn 1 i 2; linie — XOR w kolumnie wg wzoru z arkusza; (3,3) = jedna linia 4:30, bez kropek. */
export const buildExercise26 = () => {
  const cells = [
    circleOutline + dotAt(10.5 / 12) + dotAt(12 / 12) + lineTo(4.5 / 12),
    circleOutline + dotAt(12 / 12) + dotAt(4.5 / 12) + lineTo(1.5 / 12),
    circleOutline + dotAt(12 / 12) + lineTo(1.5 / 12) + lineTo(4.5 / 12),
    circleOutline + dotAt(9 / 12) + dotAt(6 / 12) + lineTo(1.5 / 12) + lineTo(4.5 / 12) + lineTo(7.5 / 12) + lineTo(10.5 / 12),
    circleOutline + dotAt(9 / 12) + dotAt(3 / 12) + lineTo(1.5 / 12) + lineTo(4.5 / 12) + lineTo(7.5 / 12) + lineTo(10.5 / 12),
    circleOutline + dotAt(9 / 12) + lineTo(1.5 / 12),
    circleOutline + dotAt(9 / 12) + lineTo(7.5 / 12) + lineTo(10.5 / 12),
    circleOutline + dotAt(3 / 12) + lineTo(7.5 / 12) + lineTo(10.5 / 12),
    circleOutline + lineTo(4.5 / 12),
  ];
  const correct = cells[8];
  const innerOptions = [
    circleOutline + lineTo(1.5 / 12),
    circleOutline + dotAt(12 / 12) + lineTo(4.5 / 12),
    circleOutline + dotAt(9 / 12) + lineTo(4.5 / 12),
    circleOutline + lineTo(7.5 / 12) + lineTo(10.5 / 12),
    circleOutline + dotAt(6 / 12) + dotAt(9 / 12),
  ].filter((s) => s !== correct);
  return {
    cells,
    missingIndex: 8 as const,
    innerOptions: innerOptions.slice(0, 5),
    explanation:
      'W trzecim wierszu wzorzec kropek i promieni domyka się jak w ćwiczeniu 26: ostatnie pole to okrąg z jednym promieniem w kierunku 4:30 i bez kropek.',
    content: 'Wybierz odpowiedź',
  };
};

const qLine = `<g stroke="currentColor" stroke-width="${sw}" stroke-linecap="square"><line x1="50" y1="22" x2="50" y2="78"/><line x1="22" y1="50" x2="78" y2="50"/></g>`;
const smallSquareAt = (x: number, y: number) =>
  `<rect x="${x - 7}" y="${y - 7}" width="14" height="14" fill="none" stroke="currentColor" stroke-width="${sw}"/>`;
const smallDotAt = (x: number, y: number) => `<circle cx="${x}" cy="${y}" r="3.8" fill="currentColor"/>`;

export const buildExercise9 = () => {
  const cell = (sq: [number, number], dot: [number, number]) =>
    qLine + smallSquareAt(...sq) + smallDotAt(...dot);
  const cells = [
    cell([67, 36], [32, 36]), cell([67, 64], [32, 36]), cell([33, 64], [32, 36]),
    cell([67, 36], [32, 64]), cell([67, 64], [32, 64]), qLine + smallSquareAt(33, 64) + smallDotAt(33, 64),
    cell([67, 36], [67, 64]), qLine + smallSquareAt(67, 64) + smallDotAt(67, 64), cell([33, 64], [67, 64]),
  ];
  const correct = cells[8];
  const innerOptions = [
    cell([33, 36], [67, 64]), cell([67, 64], [67, 36]), cell([67, 36], [67, 64]),
    qLine + smallSquareAt(33, 64) + smallDotAt(67, 64), cell([33, 36], [32, 64]), cell([67, 64], [32, 64]),
  ].filter((s) => s !== correct);
  return {
    cells,
    missingIndex: 8 as const,
    innerOptions,
    explanation: 'Kwadrat przesuwa się w kolumnach po narożnikach, a kropka zmienia położenie w kolejnych wierszach. Brakuje układu: kwadrat po lewej na dole, kropka po prawej na dole.',
    content: 'Wybierz odpowiedź',
  };
};

const shapeWithLine = (shape: 'circle' | 'square' | 'triangle', line: 'h' | 'v' | 'd') => {
  const base =
    shape === 'circle'
      ? `<circle cx="50" cy="50" r="18" fill="none" stroke="currentColor" stroke-width="${sw}"/>`
      : shape === 'square'
        ? `<rect x="34" y="34" width="32" height="32" fill="none" stroke="currentColor" stroke-width="${sw}"/>`
        : `<polygon points="50,30 70,68 30,68" fill="none" stroke="currentColor" stroke-width="${sw}"/>`;
  const slash =
    line === 'h'
      ? `<line x1="25" y1="50" x2="75" y2="50" stroke="currentColor" stroke-width="${sw}"/>`
      : line === 'v'
        ? `<line x1="50" y1="22" x2="50" y2="78" stroke="currentColor" stroke-width="${sw}"/>`
        : `<line x1="28" y1="72" x2="72" y2="28" stroke="currentColor" stroke-width="${sw}"/>`;
  return base + slash;
};

export const buildExercise14 = () => {
  const cells = [
    shapeWithLine('circle', 'd'), shapeWithLine('square', 'h'), shapeWithLine('triangle', 'v'),
    shapeWithLine('triangle', 'h'), shapeWithLine('circle', 'v'), shapeWithLine('square', 'd'),
    shapeWithLine('square', 'v'), shapeWithLine('triangle', 'd'), shapeWithLine('circle', 'h'),
  ];
  return {
    cells,
    missingIndex: 8 as const,
    innerOptions: [
      shapeWithLine('triangle', 'h'), shapeWithLine('circle', 'd'), shapeWithLine('square', 'd'),
      shapeWithLine('square', 'h'), shapeWithLine('triangle', 'v'),
    ],
    explanation: 'Kształty idą cyklicznie: koło, kwadrat, trójkąt. Kierunek linii też idzie cyklicznie: ukośna, pozioma, pionowa. Brakuje koła z linią poziomą.',
    content: 'Wybierz odpowiedź',
  };
};

const angleDots = (dir: 'up' | 'right' | 'down' | 'left', count: 1 | 2 | 3) => {
  const pts = {
    up: '35,70 50,30 65,70',
    right: '30,35 70,50 30,65',
    down: '35,30 50,70 65,30',
    left: '70,35 30,50 70,65',
  }[dir];
  const dotSets: Record<1 | 2 | 3, [number, number][]> = {
    1: [[50, 52]],
    2: [[44, 50], [56, 50]],
    3: [[44, 44], [54, 50], [44, 56]],
  };
  return `<polyline points="${pts}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>` +
    dotSets[count].map(([x, y]) => smallDotAt(x, y)).join('');
};

export const buildExercise15 = () => {
  const cells = [
    angleDots('up', 1), angleDots('right', 3), angleDots('down', 2),
    angleDots('left', 3), angleDots('up', 2), angleDots('right', 1),
    angleDots('down', 2), angleDots('left', 1), angleDots('up', 3),
  ];
  const correct = cells[8];
  return {
    cells,
    missingIndex: 8 as const,
    innerOptions: [
      angleDots('down', 3), angleDots('up', 2), angleDots('right', 3), angleDots('left', 3), angleDots('right', 2),
    ].filter((s) => s !== correct),
    explanation: 'W każdym wierszu zmienia się kierunek kąta i liczba kropek. Ostatnie pole domyka układ: kąt skierowany w górę z trzema kropkami.',
    content: 'Wybierz odpowiedź',
  };
};

const lineObjects = (items: Array<'sqTopL' | 'sqTopR' | 'sqBottomL' | 'sqBottomR' | 'circTopL' | 'circTopR' | 'circBottomL' | 'circBottomR'>) => {
  const pos: Record<string, string> = {
    sqTopL: smallSquareAt(36, 34), sqTopR: smallSquareAt(64, 34), sqBottomL: smallSquareAt(36, 64), sqBottomR: smallSquareAt(64, 64),
    circTopL: `<circle cx="36" cy="34" r="6" fill="none" stroke="currentColor" stroke-width="${sw}"/>`,
    circTopR: `<circle cx="64" cy="34" r="6" fill="none" stroke="currentColor" stroke-width="${sw}"/>`,
    circBottomL: `<circle cx="36" cy="64" r="6" fill="none" stroke="currentColor" stroke-width="${sw}"/>`,
    circBottomR: `<circle cx="64" cy="64" r="6" fill="none" stroke="currentColor" stroke-width="${sw}"/>`,
  };
  return `<line x1="24" y1="50" x2="76" y2="50" stroke="currentColor" stroke-width="${sw}"/>` + items.map((i) => pos[i]).join('');
};

export const buildExercise22 = () => {
  const cells = [
    lineObjects(['sqTopL', 'circTopR', 'circBottomL', 'sqBottomR']),
    lineObjects(['sqTopL', 'circBottomL', 'sqBottomR']),
    lineObjects(['circTopL', 'sqTopR', 'circBottomL', 'sqBottomR']),
    lineObjects(['sqTopL', 'circTopR', 'circBottomL', 'sqBottomR']),
    lineObjects(['sqTopL', 'circBottomL', 'sqBottomR']),
    lineObjects(['circTopL', 'sqTopR', 'circBottomL', 'sqBottomR']),
    lineObjects(['sqTopL', 'circTopR', 'sqBottomL']),
    lineObjects(['sqTopL', 'sqBottomL']),
    lineObjects(['circTopL', 'sqTopR', 'sqBottomL', 'circBottomR']),
  ];
  const correct = cells[8];
  return {
    cells,
    missingIndex: 8 as const,
    innerOptions: [
      lineObjects(['sqTopL', 'sqBottomL', 'circBottomR']),
      lineObjects(['sqTopL', 'sqBottomR', 'circBottomR']),
      lineObjects(['circTopL', 'sqTopR', 'sqBottomR']),
      lineObjects(['circTopL', 'sqBottomL', 'circBottomR']),
      lineObjects(['sqTopR', 'sqBottomL', 'circBottomR']),
      lineObjects(['circTopL', 'sqTopR', 'sqBottomL']),
    ].filter((s, i, arr) => s !== correct && arr.indexOf(s) === i),
    explanation: 'Układ nad i pod linią zmienia się konsekwentnie po kolumnach. Brakujące pole ma koło i kwadrat nad linią oraz kwadrat z kołem pod linią.',
    content: 'Wybierz odpowiedź',
  };
};

const diceFrame = (open: Array<'l' | 'r' | 'b' | 't'>, dots: Array<'tl' | 'tr' | 'bl' | 'br'>) => {
  const openPos: Record<string, string> = {
    l: `<circle cx="31" cy="52" r="6" fill="none" stroke="currentColor" stroke-width="${sw}"/>`,
    r: `<circle cx="69" cy="52" r="6" fill="none" stroke="currentColor" stroke-width="${sw}"/>`,
    b: `<circle cx="50" cy="68" r="6" fill="none" stroke="currentColor" stroke-width="${sw}"/>`,
    t: `<circle cx="50" cy="32" r="6" fill="none" stroke="currentColor" stroke-width="${sw}"/>`,
  };
  const dotPos: Record<string, string> = {
    tl: smallDotAt(31, 31), tr: smallDotAt(69, 31), bl: smallDotAt(31, 69), br: smallDotAt(69, 69),
  };
  return `<rect x="25" y="25" width="50" height="50" fill="none" stroke="currentColor" stroke-width="${sw}"/>` +
    open.map((o) => openPos[o]).join('') + dots.map((d) => dotPos[d]).join('');
};

export const buildExercise25 = () => {
  const cells = [
    diceFrame(['r', 'b'], ['tr', 'bl']), diceFrame(['l', 'r', 'b'], ['tr', 'bl', 'br']), diceFrame(['r', 'b'], ['tr', 'bl']),
    diceFrame(['l', 'r', 'b', 't'], ['tl', 'tr']), diceFrame(['t', 'b'], ['tl', 'bl']), diceFrame(['t', 'b'], ['tl']),
    diceFrame(['r', 'b'], ['tr']), diceFrame(['b'], ['bl']), diceFrame(['b'], []),
  ];
  const correct = cells[8];
  return {
    cells,
    missingIndex: 8 as const,
    innerOptions: [
      diceFrame(['l', 'r'], ['br']), diceFrame(['l'], ['tr', 'br']), diceFrame([], ['tl', 'br']),
      diceFrame(['l', 'r'], ['tl', 'br']), diceFrame(['b'], []), diceFrame(['t', 'r', 'b'], []),
    ].filter((s) => s !== correct),
    explanation: 'W kolejnych polach znikają wybrane znaczniki narożne, a zostaje układ kół zgodny z kolumną. Brakujące pole to kwadrat z jednym pustym kołem na dole.',
    content: 'Wybierz odpowiedź',
  };
};

const denseGrid = (black: [number, number][], u = 12) => miniBlackGrid(black, u);

export const buildExercise31 = () => {
  const cells = [
    denseGrid([[1, 2], [2, 2]]), denseGrid([[1, 2]]), denseGrid([[2, 1], [2, 2]]),
    denseGrid([[0, 1], [2, 0]]), denseGrid([[1, 0], [1, 1], [2, 0], [2, 2]]), denseGrid([[0, 0], [1, 0], [2, 2]]),
    denseGrid([[0, 1], [1, 0], [1, 2], [2, 0], [2, 2]]), denseGrid([[1, 0], [1, 1], [1, 2], [2, 0], [2, 2]]), denseGrid([[0, 2], [1, 2], [2, 0]]),
  ];
  const correct = cells[8];
  return {
    cells,
    missingIndex: 8 as const,
    innerOptions: [
      denseGrid([[0, 2], [1, 1], [2, 1]]), denseGrid([[0, 0], [1, 1], [2, 2]]),
      denseGrid([[1, 0], [1, 1], [2, 0]]), denseGrid([[0, 0], [2, 0]]),
      denseGrid([[0, 2], [1, 2], [2, 0]]), denseGrid([[1, 2], [2, 0]]),
    ].filter((s) => s !== correct),
    explanation: 'Czarne pola przesuwają się i redukują zgodnie z pozycją w macierzy. Brakujące pole odpowiada układowi z prawej kolumny i dolnego wiersza.',
    content: 'Wybierz odpowiedź',
  };
};

const geo35 = (name: 'v' | 'rect' | 'topV' | 'w' | 'triDown' | 'triDownLine' | 'double' | 'x' | 'rectRoof') => {
  const line = (x1: number, y1: number, x2: number, y2: number) =>
    `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="currentColor" stroke-width="${sw}" stroke-linecap="square"/>`;
  const map: Record<typeof name, string> = {
    v: line(30, 30, 50, 52) + line(70, 30, 50, 52),
    rect: `<rect x="30" y="38" width="40" height="24" fill="none" stroke="currentColor" stroke-width="${sw}"/>`,
    topV: line(28, 34, 72, 34) + line(38, 64, 50, 44) + line(62, 64, 50, 44),
    w: line(25, 32, 25, 62) + line(25, 62, 42, 44) + line(42, 44, 58, 62) + line(58, 62, 75, 32) + line(75, 32, 75, 62),
    triDown: `<polygon points="30,38 70,38 50,65" fill="none" stroke="currentColor" stroke-width="${sw}"/>`,
    triDownLine: `<polygon points="30,38 70,38 50,65" fill="none" stroke="currentColor" stroke-width="${sw}"/>` + line(30, 70, 70, 70),
    double: line(30, 40, 70, 40) + line(30, 62, 70, 62),
    x: line(30, 35, 70, 65) + line(70, 35, 30, 65) + line(42, 65, 58, 35) + line(58, 65, 42, 35),
    rectRoof: `<rect x="30" y="36" width="40" height="28" fill="none" stroke="currentColor" stroke-width="${sw}"/>` + line(30, 64, 50, 44) + line(70, 64, 50, 44),
  };
  return map[name];
};

export const buildExercise35 = () => {
  const cells = [geo35('v'), geo35('rect'), geo35('topV'), geo35('w'), geo35('triDown'), geo35('triDownLine'), geo35('double'), geo35('x'), geo35('rectRoof')];
  const correct = cells[8];
  return {
    cells,
    missingIndex: 8 as const,
    innerOptions: [
      geo35('rect'),
      `<polygon points="30,65 50,35 70,65" fill="none" stroke="currentColor" stroke-width="${sw}"/>`,
      geo35('w'),
      geo35('topV'),
      geo35('triDownLine'),
      geo35('double'),
    ].filter((s) => s !== correct),
    explanation: 'Trzecie pole łączy cechy dwóch pierwszych pól w wierszu. W dolnym wierszu połączenie dwóch linii i układu X daje prostokąt z wewnętrznym daszkiem.',
    content: 'Wybierz odpowiedź',
  };
};

const suitColor = {
  red: '#ef0000',
  dark: '#3f3f3f',
} as const;

const suitHeart = (color: keyof typeof suitColor) =>
  `<path d="M50 76 C31 58 20 47 20 34 C20 24 27 17 37 17 C43 17 48 20 50 26 C52 20 57 17 63 17 C73 17 80 24 80 34 C80 47 69 58 50 76 Z" fill="${suitColor[color]}"/>`;

const suitDiamond = (color: keyof typeof suitColor) =>
  `<polygon points="50,16 74,50 50,84 26,50" fill="${suitColor[color]}"/>`;

const suitSpade = (color: keyof typeof suitColor) =>
  `<g fill="${suitColor[color]}"><path d="M50 17 C30 35 20 47 20 60 C20 70 27 77 37 77 C43 77 48 74 50 68 C52 74 57 77 63 77 C73 77 80 70 80 60 C80 47 70 35 50 17 Z"/><path d="M45 69 L55 69 L60 86 L40 86 Z"/></g>`;

const suitClub = (color: keyof typeof suitColor) =>
  `<g fill="${suitColor[color]}"><circle cx="50" cy="31" r="15"/><circle cx="34" cy="52" r="15"/><circle cx="66" cy="52" r="15"/><path d="M45 60 L55 60 L60 86 L40 86 Z"/></g>`;

export const buildExercise36 = () => {
  const cells = [
    suitHeart('red'), suitClub('dark'), suitDiamond('red'),
    suitSpade('dark'), suitDiamond('red'), suitSpade('dark'),
    suitClub('dark'), suitHeart('red'), suitClub('dark'),
  ];
  const correct = cells[8];
  return {
    cells,
    missingIndex: 8 as const,
    innerOptions: [
      suitHeart('dark'),
      suitDiamond('red'),
      suitSpade('dark'),
      suitHeart('red'),
      suitSpade('red'),
      suitClub('dark'),
    ].filter((s) => s !== correct),
    explanation:
      'Układ symboli kart powtarza się według wierszy: w dolnym wierszu po treflu i kierze ponownie występuje trefl. Brakujące pole to czarny trefl.',
    content: 'Wybierz odpowiedź',
  };
};

const bowlingBall = (tone: 'dark' | 'light', dots: 'topLeft' | 'bottomRight' | 'center', shine: 'left' | 'right' | 'none') => {
  const fill = tone === 'dark' ? '#4a4a4a' : '#ffffff';
  const stroke = tone === 'dark' ? '#4a4a4a' : '#4a4a4a';
  const dotFill = tone === 'dark' ? '#ffffff' : '#4a4a4a';
  const dotSets: Record<typeof dots, [number, number][]> = {
    topLeft: [[40, 34], [53, 34], [40, 48]],
    bottomRight: [[48, 58], [61, 58], [61, 72]],
    center: [[43, 43], [57, 43], [50, 57]],
  };
  const shinePath =
    shine === 'left'
      ? '<path d="M25 38 C20 50 21 62 28 72" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" opacity="0.8"/>'
      : shine === 'right'
        ? '<path d="M75 38 C80 50 79 62 72 72" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" opacity="0.8"/>'
        : '';
  return (
    `<circle cx="50" cy="50" r="34" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>` +
    shinePath +
    dotSets[dots].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4" fill="${dotFill}"/>`).join('')
  );
};

export const buildExercise37 = () => {
  const cells = [
    bowlingBall('dark', 'topLeft', 'left'), bowlingBall('light', 'topLeft', 'none'), bowlingBall('dark', 'topLeft', 'right'),
    bowlingBall('dark', 'bottomRight', 'right'), bowlingBall('light', 'bottomRight', 'none'), bowlingBall('dark', 'bottomRight', 'right'),
    bowlingBall('dark', 'center', 'none'), bowlingBall('light', 'center', 'none'), bowlingBall('dark', 'center', 'right'),
  ];
  const correct = cells[8];
  return {
    cells,
    missingIndex: 8 as const,
    innerOptions: [
      bowlingBall('light', 'bottomRight', 'none'),
      bowlingBall('light', 'center', 'none'),
      bowlingBall('dark', 'topLeft', 'right'),
      bowlingBall('light', 'topLeft', 'none'),
      bowlingBall('dark', 'center', 'none'),
      bowlingBall('dark', 'center', 'right'),
    ].filter((s) => s !== correct),
    explanation:
      'Kolumny zachowują kolor kul: ciemna, jasna, ciemna. Wiersze zmieniają położenie trzech otworów: góra, dół, środek. Brakujące pole to ciemna kula z otworami w środku i połyskiem po prawej.',
    content: 'Wybierz odpowiedź',
  };
};

const numberTile = (n: number) =>
  `<rect x="22" y="18" width="56" height="64" fill="none" stroke="currentColor" stroke-width="1.8"/>` +
  `<text x="50" y="61" font-size="34" font-weight="700" text-anchor="middle" fill="currentColor">${n}</text>`;

export const buildExercise38 = () => {
  const cells = [1, 4, 3, 2, 6, 4, 5, 7, 2].map(numberTile);
  const correct = cells[8];
  return {
    cells,
    missingIndex: 8 as const,
    innerOptions: [3, 4, 5, 1, 9, 2].map(numberTile).filter((s) => s !== correct),
    explanation:
      'W każdym wierszu liczba środkowa jest sumą lewej i prawej: 1 + 3 = 4, 2 + 4 = 6, więc 5 + 2 = 7. Brakuje liczby 2.',
    content: 'Uzupełnij brakującą liczbę',
  };
};
