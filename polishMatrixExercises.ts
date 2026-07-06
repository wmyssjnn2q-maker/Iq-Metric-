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

/** Kolory zgodne z paletą brainmediq (blue-600 / slate). */
const suitColor = {
  primary: '#2563eb',
  muted: '#475569',
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
    suitHeart('primary'), suitClub('muted'), suitDiamond('primary'),
    suitSpade('muted'), suitDiamond('primary'), suitSpade('muted'),
    suitClub('muted'), suitHeart('primary'), suitClub('muted'),
  ];
  const correct = cells[8];
  return {
    cells,
    missingIndex: 8 as const,
    innerOptions: [
      suitHeart('muted'),
      suitDiamond('primary'),
      suitSpade('muted'),
      suitHeart('primary'),
      suitSpade('primary'),
      suitClub('muted'),
    ].filter((s) => s !== correct),
    explanation:
      'Układ symboli kart powtarza się według wierszy: w dolnym wierszu po treflu i kierze ponownie występuje trefl. Brakujące pole to trefl w ciemnym odcieniu.',
    content: 'Wybierz odpowiedź',
  };
};

const bowlingBall = (tone: 'dark' | 'light', dots: 'topLeft' | 'bottomRight' | 'center', shine: 'left' | 'right' | 'none') => {
  const fill = tone === 'dark' ? '#2563eb' : '#eff6ff';
  const stroke = tone === 'dark' ? '#1d4ed8' : '#2563eb';
  const dotFill = tone === 'dark' ? '#dbeafe' : '#2563eb';
  const shineStroke = tone === 'dark' ? '#93c5fd' : '#bfdbfe';
  const dotSets: Record<typeof dots, [number, number][]> = {
    topLeft: [[40, 34], [53, 34], [40, 48]],
    bottomRight: [[48, 58], [61, 58], [61, 72]],
    center: [[43, 43], [57, 43], [50, 57]],
  };
  const shinePath =
    shine === 'left'
      ? `<path d="M25 38 C20 50 21 62 28 72" fill="none" stroke="${shineStroke}" stroke-width="3" stroke-linecap="round" opacity="0.9"/>`
      : shine === 'right'
        ? `<path d="M75 38 C80 50 79 62 72 72" fill="none" stroke="${shineStroke}" stroke-width="3" stroke-linecap="round" opacity="0.9"/>`
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
      'Kolumny zachowują kolor kul: ciemnoniebieska, jasnoniebieska, ciemnoniebieska. Wiersze zmieniają położenie trzech otworów: góra, dół, środek. Brakujące pole to ciemnoniebieska kula z otworami w środku i połyskiem po prawej.',
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

// --- ĆWICZENIA 40–50 (rozszerzenie banku do 30 zadań) ---

/** Ćwiczenie 40: kolumny to wielokrotności — ×1, ×2, ×3 wartości z pierwszej kolumny. */
export const buildExercise40 = () => {
  const rows = [
    [2, 4, 6],
    [3, 6, 9],
    [4, 8, 12],
  ];
  const cells = rows.flat().map(numberTile);
  const correct = cells[8];
  return {
    cells,
    missingIndex: 8 as const,
    innerOptions: [10, 11, 14, 9, 16].map(numberTile).filter((s) => s !== correct),
    explanation:
      'W każdym wierszu druga liczba to podwojenie pierwszej, a trzecia — potrojenie: 4 × 3 = 12.',
    content: 'Uzupełnij brakującą liczbę',
  };
};

const sizedCircle = (r: number) => `<circle cx="50" cy="50" r="${r}" fill="none" stroke="currentColor" stroke-width="${sw}"/>`;
const sizedSquare = (s: number) =>
  `<rect x="${50 - s / 2}" y="${50 - s / 2}" width="${s}" height="${s}" fill="none" stroke="currentColor" stroke-width="${sw}"/>`;
const sizedTriangle = (h: number) =>
  `<polygon points="50,${(52 - h * 0.55).toFixed(1)} ${(50 + h * 0.5).toFixed(1)},${(52 + h * 0.45).toFixed(1)} ${(50 - h * 0.5).toFixed(1)},${(52 + h * 0.45).toFixed(1)}" fill="none" stroke="currentColor" stroke-width="${sw}"/>`;

/** Ćwiczenie 41: wiersz = kształt, w kolumnach rozmiar rośnie: mały → średni → duży. */
export const buildExercise41 = () => {
  const cells = [
    sizedCircle(10), sizedCircle(17), sizedCircle(24),
    sizedSquare(20), sizedSquare(34), sizedSquare(48),
    sizedTriangle(22), sizedTriangle(37), sizedTriangle(52),
  ];
  const correct = cells[8];
  return {
    cells,
    missingIndex: 8 as const,
    innerOptions: [
      sizedTriangle(37),
      sizedTriangle(22),
      sizedCircle(24),
      sizedSquare(48),
      sizedSquare(34),
    ].filter((s) => s !== correct),
    explanation:
      'W każdym wierszu ten sam kształt powiększa się od lewej do prawej; brakuje największego trójkąta.',
    content: 'Wybierz odpowiedź',
  };
};

type Seg42 = 'h' | 'v' | 'd' | 'b';
const seg42 = (which: Seg42) => {
  const map: Record<Seg42, string> = {
    h: `<line x1="25" y1="50" x2="75" y2="50" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round"/>`,
    v: `<line x1="50" y1="25" x2="50" y2="75" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round"/>`,
    d: `<line x1="28" y1="72" x2="72" y2="28" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round"/>`,
    b: `<line x1="28" y1="28" x2="72" y2="72" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round"/>`,
  };
  return map[which];
};
const segSet42 = (segs: Seg42[]) => segs.map(seg42).join('');

/** Ćwiczenie 42: trzecia kolumna = różnica symetryczna (XOR) linii z kolumn 1 i 2. */
export const buildExercise42 = () => {
  const cells = [
    segSet42(['h', 'v']), segSet42(['v', 'd']), segSet42(['h', 'd']),
    segSet42(['v', 'b']), segSet42(['h', 'v', 'b']), segSet42(['h']),
    segSet42(['h', 'd', 'b']), segSet42(['d']), segSet42(['h', 'b']),
  ];
  const correct = cells[8];
  return {
    cells,
    missingIndex: 8 as const,
    innerOptions: [
      segSet42(['d', 'b']),
      segSet42(['h', 'd']),
      segSet42(['v', 'b']),
      segSet42(['h', 'v']),
      segSet42(['b']),
    ].filter((s) => s !== correct),
    explanation:
      'W trzecim polu wiersza zostają tylko te linie, które występują dokładnie w jednym z dwóch pierwszych pól (różnica symetryczna) — tu: pozioma i ukośna w lewo.',
    content: 'Wybierz odpowiedź',
  };
};

const mirrorV = (s: string) => `<g transform="translate(100,0) scale(-1,1)">${s}</g>`;
const mirrorH = (s: string) => `<g transform="translate(0,100) scale(1,-1)">${s}</g>`;

const flagTriangle =
  `<line x1="38" y1="26" x2="38" y2="74" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round"/>` +
  `<polygon points="38,26 66,34 38,42" fill="currentColor"/>`;
const flagRect =
  `<line x1="38" y1="26" x2="38" y2="74" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round"/>` +
  `<rect x="38" y="28" width="24" height="14" fill="currentColor"/>`;
const flagCircle =
  `<line x1="38" y1="26" x2="38" y2="74" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round"/>` +
  `<circle cx="58" cy="34" r="8" fill="currentColor"/>`;

/** Ćwiczenie 43: kolumna 2 to odbicie lustrzane w pionie, kolumna 3 — odbicie w poziomie. */
export const buildExercise43 = () => {
  const bases = [flagTriangle, flagRect, flagCircle];
  const cells = bases.flatMap((b) => [b, mirrorV(b), mirrorH(b)]);
  const correct = cells[8];
  return {
    cells,
    missingIndex: 8 as const,
    innerOptions: [
      mirrorV(flagCircle),
      flagCircle,
      mirrorH(flagRect),
      mirrorH(mirrorV(flagCircle)),
      mirrorH(flagTriangle),
    ].filter((s) => s !== correct),
    explanation:
      'Druga kolumna to lustrzane odbicie pierwszej względem osi pionowej, a trzecia — względem osi poziomej. Brakuje chorągiewki z kołem odbitej w poziomie (koło na dole).',
    content: 'Wybierz odpowiedź',
  };
};

/** Ćwiczenie 44: trzecia liczba to iloczyn dwóch pierwszych. */
export const buildExercise44 = () => {
  const rows = [
    [2, 3, 6],
    [3, 4, 12],
    [4, 5, 20],
  ];
  const cells = rows.flat().map(numberTile);
  const correct = cells[8];
  return {
    cells,
    missingIndex: 8 as const,
    innerOptions: [16, 18, 24, 9, 15].map(numberTile).filter((s) => s !== correct),
    explanation: 'W każdym wierszu trzecia liczba to iloczyn dwóch pierwszych: 4 × 5 = 20.',
    content: 'Uzupełnij brakującą liczbę',
  };
};

const countShapes45 = (shape: 'circle' | 'square' | 'triangle', count: 1 | 2 | 3) => {
  const xs = count === 1 ? [50] : count === 2 ? [38, 62] : [30, 50, 70];
  const one = (x: number) =>
    shape === 'circle'
      ? `<circle cx="${x}" cy="50" r="8" fill="none" stroke="currentColor" stroke-width="${sw}"/>`
      : shape === 'square'
        ? `<rect x="${x - 7.5}" y="42.5" width="15" height="15" fill="none" stroke="currentColor" stroke-width="${sw}"/>`
        : `<polygon points="${x},41 ${x + 8.5},58 ${x - 8.5},58" fill="none" stroke="currentColor" stroke-width="${sw}"/>`;
  return xs.map(one).join('');
};

/** Ćwiczenie 45: podwójny kwadrat łaciński — liczba figur i ich kształt niezależnie po wierszach/kolumnach. */
export const buildExercise45 = () => {
  const shapes: Array<'circle' | 'square' | 'triangle'> = ['circle', 'square', 'triangle'];
  const cells: string[] = [];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const count = (((r + c) % 3) + 1) as 1 | 2 | 3;
      const shape = shapes[(r + 2 * c) % 3];
      cells.push(countShapes45(shape, count));
    }
  }
  const correct = cells[8];
  return {
    cells,
    missingIndex: 8 as const,
    innerOptions: [
      countShapes45('circle', 3),
      countShapes45('circle', 1),
      countShapes45('square', 2),
      countShapes45('triangle', 2),
      countShapes45('square', 3),
    ].filter((s) => s !== correct),
    explanation:
      'Liczba figur oraz ich kształt tworzą niezależne kwadraty łacińskie: w każdym wierszu i kolumnie występują liczności 1, 2, 3 oraz trzy kształty. Brakuje dwóch kół.',
    content: 'Wybierz odpowiedź',
  };
};

const spokes46 = (hours: number[]) => circleOutline + hours.map((h) => lineTo(h / 12)).join('');

/** Ćwiczenie 46: trzecia kolumna = promienie z kolumny 1 minus promienie z kolumny 2. */
export const buildExercise46 = () => {
  const cells = [
    spokes46([0, 3, 6, 9]), spokes46([3, 9]), spokes46([0, 6]),
    spokes46([1.5, 4.5, 7.5, 10.5]), spokes46([4.5]), spokes46([1.5, 7.5, 10.5]),
    spokes46([0, 1.5, 3, 4.5, 6]), spokes46([1.5, 4.5]), spokes46([0, 3, 6]),
  ];
  const correct = cells[8];
  return {
    cells,
    missingIndex: 8 as const,
    innerOptions: [
      spokes46([0, 6]),
      spokes46([3, 6]),
      spokes46([0, 3]),
      spokes46([0, 4.5, 6]),
      spokes46([1.5, 3, 6]),
    ].filter((s) => s !== correct),
    explanation:
      'Trzecie pole wiersza zawiera promienie z pierwszego pola po usunięciu promieni z drugiego: zostają kierunki 12:00, 3:00 i 6:00.',
    content: 'Wybierz odpowiedź',
  };
};

const arrowDot47 = (angleDeg: number, dotOpposite = true) => {
  const rad = (angleDeg * Math.PI) / 180;
  const tipX = 50 + 30 * Math.sin(rad);
  const tipY = 50 - 30 * Math.cos(rad);
  const dotAngle = dotOpposite ? rad + Math.PI : rad;
  const dotX = 50 + 26 * Math.sin(dotAngle);
  const dotY = 50 - 26 * Math.cos(dotAngle);
  return (
    lineWithArrow(50, 50, Number(tipX.toFixed(2)), Number(tipY.toFixed(2))) +
    `<circle cx="${dotX.toFixed(2)}" cy="${dotY.toFixed(2)}" r="4" fill="currentColor"/>`
  );
};

/** Ćwiczenie 47: strzałka obraca się o 45° w każdej kolumnie (start wiersza +90°), kropka zawsze naprzeciw grotu. */
export const buildExercise47 = () => {
  const cells: string[] = [];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      cells.push(arrowDot47(90 * r + 45 * c));
    }
  }
  const correct = cells[8];
  return {
    cells,
    missingIndex: 8 as const,
    innerOptions: [
      arrowDot47(225),
      arrowDot47(315),
      arrowDot47(270, false),
      arrowDot47(90),
      arrowDot47(180),
    ].filter((s) => s !== correct),
    explanation:
      'W każdym wierszu strzałka obraca się o 45° w prawo, a kolejne wiersze zaczynają o 90° dalej; kropka leży zawsze po przeciwnej stronie niż grot. Brakuje strzałki skierowanej w lewo (270°) z kropką po prawej.',
    content: 'Wybierz odpowiedź',
  };
};

const ringDots48 = (n: number) => {
  let out = circleOutline;
  for (let i = 0; i < n; i++) {
    out += dotAt(i * (12 / n) / 12);
  }
  return out;
};

/** Ćwiczenie 48: liczba kropek w trzeciej kolumnie = suma kropek z dwóch pierwszych pól. */
export const buildExercise48 = () => {
  const cells = [
    ringDots48(1), ringDots48(2), ringDots48(3),
    ringDots48(2), ringDots48(2), ringDots48(4),
    ringDots48(3), ringDots48(2), ringDots48(5),
  ];
  const correct = cells[8];
  return {
    cells,
    missingIndex: 8 as const,
    innerOptions: [
      ringDots48(4),
      ringDots48(6),
      ringDots48(3),
      ringDots48(7),
      ringDots48(2),
    ].filter((s) => s !== correct),
    explanation:
      'Liczba kropek w trzecim polu wiersza jest sumą kropek z dwóch pierwszych pól: 3 + 2 = 5.',
    content: 'Wybierz odpowiedź',
  };
};

/** Ćwiczenie 49: trzecia liczba = kwadrat pierwszej minus druga. */
export const buildExercise49 = () => {
  const rows = [
    [3, 2, 7],
    [4, 5, 11],
    [5, 6, 19],
  ];
  const cells = rows.flat().map(numberTile);
  const correct = cells[8];
  return {
    cells,
    missingIndex: 8 as const,
    innerOptions: [17, 21, 18, 23, 20].map(numberTile).filter((s) => s !== correct),
    explanation:
      'W każdym wierszu trzecia liczba to kwadrat pierwszej pomniejszony o drugą: 5² − 6 = 19.',
    content: 'Uzupełnij brakującą liczbę',
  };
};

const pennant50 = (angleDeg: number, mirrored = false) => {
  const inner =
    `<line x1="50" y1="50" x2="50" y2="22" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round"/>` +
    `<polygon points="50,22 68,28 52,38" fill="currentColor"/>` +
    `<circle cx="50" cy="50" r="3.5" fill="currentColor"/>`;
  const body = mirrored ? `<g transform="translate(100,0) scale(-1,1)">${inner}</g>` : inner;
  return `<g transform="rotate(${angleDeg} 50 50)">${body}</g>`;
};

/** Ćwiczenie 50: chorągiewka obraca się o 135° w każdej kolumnie; wiersze startują o 30° dalej. */
export const buildExercise50 = () => {
  const cells: string[] = [];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      cells.push(pennant50(30 * r + 135 * c));
    }
  }
  const correct = cells[8];
  return {
    cells,
    missingIndex: 8 as const,
    innerOptions: [
      pennant50(315),
      pennant50(0),
      pennant50(285),
      pennant50(330, true),
      pennant50(195),
    ].filter((s) => s !== correct),
    explanation:
      'W każdym wierszu figura obraca się o 135° zgodnie ze wskazówkami zegara, a kolejne wiersze zaczynają obrócone o 30°. Brakuje chorągiewki obróconej o 330°.',
    content: 'Wybierz odpowiedź',
  };
};
