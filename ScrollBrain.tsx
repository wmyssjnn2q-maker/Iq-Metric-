import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent, useReducedMotion, type MotionValue } from 'motion/react';
import { Lightbulb, Layers, Shapes, Target, Zap, type LucideIcon } from 'lucide-react';

/**
 * ScrollBrain — sekcja na stronie głównej.
 * Kreskowy mózg (line-art SVG), którego zarys, bruzdy i zakręty kory oraz
 * połączenia neuronowe rysują się progresywnie w miarę scrollowania.
 * Sekcja jest "przypięta" (sticky) na wysokość ~2.6 ekranu.
 */

type Range = [number, number];

interface PathSpec {
  d: string;
  range: Range;
  width: number;
}

interface LinkSpec {
  x1: number; y1: number; x2: number; y2: number;
  range: Range;
}

interface NodeSpec {
  x: number; y: number; r: number;
  at: number;
}

interface LabelSpec {
  title: string;
  sub: string;
  at: number;
  className: string; // pozycjonowanie absolutne
  dot: { x: number; y: number }; // punkt na mózgu (w % kontenera)
  icon: LucideIcon;
}

// --- GEOMETRIA MÓZGU (viewBox 0 0 760 620, profil skierowany w lewo) ---

const STRUCTURE: PathSpec[] = [
  // Zarys kory: czoło → sklepienie → potylica
  { d: 'M 148 328 C 126 288 130 232 168 186 C 208 138 278 108 352 98 C 436 86 524 98 584 138 C 642 178 668 248 652 312 C 644 346 624 378 596 400', range: [0.04, 0.30], width: 3 },
  // Płat skroniowy (dół)
  { d: 'M 148 328 C 154 374 190 410 246 426 C 302 442 360 436 400 424 C 432 415 462 419 484 436', range: [0.10, 0.34], width: 3 },
  // Móżdżek
  { d: 'M 596 398 C 644 404 664 444 638 478 C 610 512 546 514 516 484 C 500 468 506 446 522 432', range: [0.20, 0.40], width: 2.6 },
  // Pień mózgu (dwie krawędzie)
  { d: 'M 524 486 C 526 512 514 542 490 566', range: [0.30, 0.44], width: 2.4 },
  { d: 'M 574 496 C 570 520 558 544 538 564', range: [0.33, 0.46], width: 2 },
];

const GYRI: PathSpec[] = [
  // Bruzda boczna (Sylwiusza) — oddziela płat skroniowy
  { d: 'M 172 316 C 232 330 292 338 344 328 C 386 320 420 330 448 356', range: [0.22, 0.42], width: 2.2 },
  // Bruzda środkowa (Rolanda) — od sklepienia w dół
  { d: 'M 402 96 C 396 142 380 188 352 226', range: [0.26, 0.42], width: 2.2 },
  // Bruzda ciemieniowo-potyliczna
  { d: 'M 588 158 C 570 198 564 242 572 286', range: [0.30, 0.46], width: 1.8 },
  // Zakręty czołowe — łuki równoległe do zarysu czoła
  { d: 'M 182 246 C 216 196 274 160 340 148', range: [0.30, 0.46], width: 2 },
  { d: 'M 200 296 C 240 254 298 228 360 220', range: [0.34, 0.50], width: 2 },
  // Zakręty ciemieniowe
  { d: 'M 428 128 C 488 126 544 150 586 194', range: [0.36, 0.52], width: 2 },
  { d: 'M 436 192 C 492 188 542 212 580 254', range: [0.40, 0.56], width: 2 },
  // Zakręt potyliczny
  { d: 'M 602 246 C 626 282 628 326 606 362', range: [0.44, 0.58], width: 1.8 },
  // Zakręt skroniowy
  { d: 'M 232 380 C 284 396 344 396 392 380', range: [0.46, 0.60], width: 2 },
  // Fałdy móżdżku
  { d: 'M 528 446 C 556 436 590 444 606 466', range: [0.48, 0.60], width: 1.6 },
  { d: 'M 522 466 C 550 456 582 464 598 484', range: [0.50, 0.62], width: 1.6 },
];

const LINKS: LinkSpec[] = [
  { x1: 250, y1: 210, x2: 340, y2: 160, range: [0.46, 0.56] },
  { x1: 340, y1: 160, x2: 455, y2: 140, range: [0.48, 0.58] },
  { x1: 455, y1: 140, x2: 560, y2: 200, range: [0.50, 0.60] },
  { x1: 560, y1: 200, x2: 600, y2: 300, range: [0.52, 0.62] },
  { x1: 250, y1: 210, x2: 300, y2: 290, range: [0.52, 0.62] },
  { x1: 300, y1: 290, x2: 430, y2: 240, range: [0.54, 0.64] },
  { x1: 430, y1: 240, x2: 455, y2: 140, range: [0.56, 0.66] },
  { x1: 430, y1: 240, x2: 540, y2: 300, range: [0.58, 0.68] },
  { x1: 540, y1: 300, x2: 600, y2: 300, range: [0.60, 0.70] },
  { x1: 300, y1: 290, x2: 350, y2: 360, range: [0.60, 0.70] },
  { x1: 350, y1: 360, x2: 460, y2: 350, range: [0.62, 0.72] },
  { x1: 460, y1: 350, x2: 540, y2: 300, range: [0.64, 0.74] },
  { x1: 210, y1: 270, x2: 250, y2: 210, range: [0.64, 0.74] },
  { x1: 210, y1: 270, x2: 300, y2: 290, range: [0.66, 0.76] },
  { x1: 560, y1: 200, x2: 540, y2: 300, range: [0.66, 0.76] },
];

const NODES: NodeSpec[] = [
  { x: 250, y: 210, r: 5, at: 0.50 },
  { x: 340, y: 160, r: 4, at: 0.52 },
  { x: 455, y: 140, r: 5, at: 0.54 },
  { x: 560, y: 200, r: 4, at: 0.56 },
  { x: 300, y: 290, r: 5, at: 0.58 },
  { x: 430, y: 240, r: 6, at: 0.60 },
  { x: 540, y: 300, r: 5, at: 0.62 },
  { x: 350, y: 360, r: 4, at: 0.64 },
  { x: 460, y: 350, r: 4, at: 0.66 },
  { x: 600, y: 300, r: 3.5, at: 0.68 },
  { x: 210, y: 270, r: 3.5, at: 0.70 },
  { x: 566, y: 462, r: 3.5, at: 0.72 },
];

const LABELS: LabelSpec[] = [
  {
    title: 'Logika i wnioskowanie',
    sub: 'Inteligencja płynna (Gf)',
    at: 0.56,
    className: 'left-0 top-[16%]',
    dot: { x: 32.5, y: 34 },
    icon: Lightbulb,
  },
  {
    title: 'Pamięć robocza',
    sub: 'Przetwarzanie i zapamiętywanie (Gsm)',
    at: 0.62,
    className: 'right-0 top-[10%]',
    dot: { x: 60, y: 22.5 },
    icon: Layers,
  },
  {
    title: 'Percepcja przestrzenna',
    sub: 'Rotacje i wzorce wizualne (Gv)',
    at: 0.68,
    className: 'right-0 top-[58%]',
    dot: { x: 79, y: 48.5 },
    icon: Shapes,
  },
  {
    title: 'Koncentracja',
    sub: 'Uwaga selektywna i wykonawcza',
    at: 0.74,
    className: 'left-0 top-[60%]',
    dot: { x: 46, y: 58 },
    icon: Target,
  },
  {
    title: 'Szybkość przetwarzania',
    sub: 'Dynamika procesów myślowych (Gs)',
    at: 0.80,
    className: 'left-1/2 -translate-x-1/2 bottom-[2%]',
    dot: { x: 60.5, y: 56.5 },
    icon: Zap,
  },
];

// --- POD-KOMPONENTY ---

const DrawPath = ({ spec, progress, stroke = 'url(#sb-stroke)' }: { spec: PathSpec; progress: MotionValue<number>; stroke?: string; key?: React.Key }) => {
  const pathLength = useTransform(progress, spec.range, [0, 1]);
  const opacity = useTransform(progress, [spec.range[0], Math.min(spec.range[0] + 0.03, 1)], [0, 1]);
  return (
    <motion.path
      d={spec.d}
      fill="none"
      stroke={stroke}
      strokeWidth={spec.width}
      strokeLinecap="round"
      style={{ pathLength, opacity }}
    />
  );
};

const DrawLink = ({ spec, progress }: { spec: LinkSpec; progress: MotionValue<number>; key?: React.Key }) => {
  const pathLength = useTransform(progress, spec.range, [0, 1]);
  const opacity = useTransform(progress, spec.range, [0, 0.55]);
  return (
    <motion.line
      x1={spec.x1} y1={spec.y1} x2={spec.x2} y2={spec.y2}
      stroke="url(#sb-stroke)"
      strokeWidth={1.2}
      strokeDasharray="4 5"
      style={{ pathLength, opacity }}
    />
  );
};

const PulseNode = ({ spec, progress }: { spec: NodeSpec; progress: MotionValue<number>; key?: React.Key }) => {
  const scale = useTransform(progress, [spec.at, spec.at + 0.05], [0, 1]);
  const opacity = useTransform(progress, [spec.at, spec.at + 0.04], [0, 1]);
  return (
    <motion.g style={{ scale, opacity, transformOrigin: `${spec.x}px ${spec.y}px` }}>
      <circle cx={spec.x} cy={spec.y} r={spec.r * 3.2} fill="url(#sb-node-glow)" />
      <circle cx={spec.x} cy={spec.y} r={spec.r} fill="#3b82f6" className="dark:fill-blue-400">
        <animate attributeName="opacity" values="1;0.5;1" dur="2.6s" begin={`${(spec.at * 4).toFixed(2)}s`} repeatCount="indefinite" />
      </circle>
    </motion.g>
  );
};

// Etykiety i elementy HTML sterowane stanem (niezawodne w każdej przeglądarce)
const FloatingLabel = ({ spec, p }: { spec: LabelSpec; p: number; key?: React.Key }) => {
  const on = p >= spec.at;
  const Icon = spec.icon;
  return (
    <>
      {/* Punkt kotwiczący na mózgu */}
      <span
        style={{ left: `${spec.dot.x}%`, top: `${spec.dot.y}%` }}
        className={`absolute hidden md:block w-2.5 h-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500 ring-4 ring-blue-500/20 dark:bg-blue-400 dark:ring-blue-400/20 transition-opacity duration-300 ${on ? 'opacity-100' : 'opacity-0'}`}
      />
      <div
        className={`absolute hidden md:block max-w-[240px] transition-all duration-500 ${spec.className} ${on ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}
      >
        <div className="inline-flex items-start gap-3 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border border-slate-200/80 dark:border-slate-700/60 rounded-2xl px-4 py-3 shadow-xl shadow-blue-500/10 text-left">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-500 text-white shadow-md shadow-blue-500/30">
            <Icon size={15} strokeWidth={2.5} />
          </span>
          <span>
            <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{spec.title}</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">{spec.sub}</p>
          </span>
        </div>
      </div>
    </>
  );
};

const MobileChip = ({ spec, p }: { spec: LabelSpec; p: number; key?: React.Key }) => {
  const on = p >= spec.at;
  const Icon = spec.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold shadow-sm border transition-all duration-300 ${
        on
          ? 'opacity-100 scale-100 bg-blue-50/80 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800 text-slate-800 dark:text-slate-200'
          : 'opacity-25 scale-95 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
      }`}
    >
      <Icon size={12} strokeWidth={2.5} className="text-blue-600 dark:text-blue-400" />
      {spec.title}
    </span>
  );
};

// Statyczna wersja dla prefers-reduced-motion
const StaticBrain = () => (
  <svg viewBox="0 0 760 620" className="w-full h-auto" aria-hidden="true">
    <SvgDefs />
    {[...STRUCTURE, ...GYRI].map((p, i) => (
      <path key={i} d={p.d} fill="none" stroke="url(#sb-stroke)" strokeWidth={p.width} strokeLinecap="round" />
    ))}
    {LINKS.map((l, i) => (
      <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke="url(#sb-stroke)" strokeWidth={1.2} strokeDasharray="4 5" opacity={0.55} />
    ))}
    {NODES.map((n, i) => (
      <g key={i}>
        <circle cx={n.x} cy={n.y} r={n.r * 3.2} fill="url(#sb-node-glow)" />
        <circle cx={n.x} cy={n.y} r={n.r} fill="#3b82f6" />
      </g>
    ))}
  </svg>
);

const SvgDefs = () => (
  <defs>
    <linearGradient id="sb-stroke" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#2563eb" />
      <stop offset="55%" stopColor="#6366f1" />
      <stop offset="100%" stopColor="#06b6d4" />
    </linearGradient>
    <radialGradient id="sb-node-glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.35" />
      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
    </radialGradient>
  </defs>
);

// --- GŁÓWNY KOMPONENT ---

export const ScrollBrain = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // Postęp scrolla jako stan Reacta — steruje elementami HTML (etykiety, nagłówek, podpisy)
  const [p, setP] = useState(0);
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setP(Math.round(v * 200) / 200);
  });

  const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
  const headT = clamp01(p / 0.08);
  const captionT = clamp01((p - 0.82) / 0.1);
  const glowT = clamp01((p - 0.7) / 0.25) * 0.5;
  const hintOn = p < 0.6;
  const barT = clamp01((p - 0.04) / 0.91);

  if (reduceMotion) {
    return (
      <section className="relative z-10 py-24 bg-gradient-to-b from-transparent via-blue-50/40 to-transparent dark:via-blue-950/20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold dark:text-white mb-4">
            Mapa Twojego <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500 bg-clip-text text-transparent">umysłu</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg mb-10 max-w-2xl mx-auto">
            Test analizuje 5 kluczowych domen poznawczych, budując pełny obraz architektury Twojej inteligencji.
          </p>
          <StaticBrain />
          <div className="flex flex-wrap justify-center gap-2 mt-8">
            {LABELS.map((l) => {
              const Icon = l.icon;
              return (
                <span key={l.title} className="inline-flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full px-3 py-1.5 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                  <Icon size={12} strokeWidth={2.5} className="text-blue-600 dark:text-blue-400" />
                  {l.title}
                </span>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="relative z-10 h-[260vh]" aria-label="Domeny poznawcze badane w teście">
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-transparent via-blue-50/40 to-transparent dark:via-blue-950/20">

        {/* Pasek postępu rysowania */}
        <div
          style={{ transform: `scaleX(${barT})` }}
          className="absolute top-0 left-0 right-0 h-[3px] origin-left bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500"
        />

        {/* Nagłówek */}
        <div style={{ opacity: headT, transform: `translateY(${(1 - headT) * 24}px)` }} className="text-center px-6 mb-2 md:mb-6">
          <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            Neuroanaliza
          </div>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight dark:text-white">
            Mapa Twojego{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500 dark:from-blue-400 dark:via-indigo-400 dark:to-cyan-400 bg-clip-text text-transparent">umysłu</span>
          </h2>
        </div>

        {/* Mózg + etykiety */}
        <div className="relative w-full max-w-[420px] md:max-w-[720px] px-6">
          {/* Poświata finałowa */}
          <div
            style={{ opacity: glowT }}
            className="absolute inset-[12%] rounded-full bg-blue-500/20 dark:bg-blue-400/15 blur-[80px] pointer-events-none"
          />
          <svg viewBox="0 0 760 620" className="relative w-full h-auto" aria-hidden="true">
            <SvgDefs />
            <g>
              {STRUCTURE.map((p, i) => <DrawPath key={`s-${i}`} spec={p} progress={scrollYProgress} />)}
              {GYRI.map((p, i) => <DrawPath key={`g-${i}`} spec={p} progress={scrollYProgress} />)}
              {LINKS.map((l, i) => <DrawLink key={`l-${i}`} spec={l} progress={scrollYProgress} />)}
              {NODES.map((n, i) => <PulseNode key={`n-${i}`} spec={n} progress={scrollYProgress} />)}
            </g>
          </svg>
          {LABELS.map((l) => <FloatingLabel key={l.title} spec={l} p={p} />)}
        </div>

        {/* Chipy na mobile */}
        <div className="flex md:hidden flex-wrap justify-center gap-2 px-6 mt-4 max-w-sm">
          {LABELS.map((l) => <MobileChip key={l.title} spec={l} p={p} />)}
        </div>

        {/* Podpis końcowy */}
        <p
          style={{ opacity: captionT, transform: `translateY(${(1 - captionT) * 16}px)` }}
          className="text-center text-slate-600 dark:text-slate-400 text-sm md:text-lg max-w-xl px-6 mt-4 md:mt-8"
        >
          5 domen poznawczych. Jeden kompleksowy pomiar.{' '}
          <span className="font-semibold text-slate-900 dark:text-white">Zobacz pełny obraz swojej inteligencji.</span>
        </p>

        {/* Wskazówka scrolla */}
        <div
          className={`absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-slate-400 dark:text-slate-500 transition-opacity duration-500 ${hintOn ? 'opacity-100' : 'opacity-0'}`}
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.25em]">Przewijaj</span>
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            className="block w-[1px] h-6 bg-gradient-to-b from-slate-400 to-transparent dark:from-slate-500"
          />
        </div>
      </div>
    </section>
  );
};

export default ScrollBrain;
