import React from 'react';

/**
 * Autorskie ilustracje kart testów (line-art, spójne z grafiką mózgu na stronie głównej).
 * Rysowane w viewBox 96×96, kolor dziedziczony przez currentColor z kafelka.
 */

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

/** Test Osobowości — profil głowy z warstwami osobowości. */
export const PersonalityArt = () => (
  <svg viewBox="0 0 96 96" className="w-full h-full" aria-hidden="true">
    <path
      d="M38 82 V71 C27 65 20 54 22 42 C24 27 37 16 52 17 C66 18 77 29 77 43 C77 52 72 60 64 65 L64 82"
      {...stroke}
      strokeWidth={4}
    />
    <circle cx={48} cy={42} r={4.5} fill="currentColor" />
    <circle
      cx={48} cy={42} r={12}
      {...stroke}
      strokeWidth={2.8}
      strokeDasharray="56 20"
      transform="rotate(-70 48 42)"
    />
    <circle
      cx={48} cy={42} r={19}
      {...stroke}
      strokeWidth={2.8}
      strokeDasharray="70 50"
      transform="rotate(120 48 42)"
      opacity={0.6}
    />
    <circle cx={60.5} cy={33} r={2.6} fill="currentColor" />
    <circle cx={33} cy={51} r={2.6} fill="currentColor" opacity={0.6} />
  </svg>
);

/** Test Pamięci — siatka z zapamiętywaną sekwencją. */
export const MemoryArt = () => (
  <svg viewBox="0 0 96 96" className="w-full h-full" aria-hidden="true">
    <rect x={16} y={16} width={64} height={64} rx={13} {...stroke} strokeWidth={4} />
    <g {...stroke} strokeWidth={2.4} opacity={0.4}>
      <line x1={37.3} y1={18} x2={37.3} y2={78} />
      <line x1={58.7} y1={18} x2={58.7} y2={78} />
      <line x1={18} y1={37.3} x2={78} y2={37.3} />
      <line x1={18} y1={58.7} x2={78} y2={58.7} />
    </g>
    <path
      d="M26.7 48 L48 26.7 L69.3 69.3"
      {...stroke}
      strokeWidth={2.6}
      strokeDasharray="4 5"
      opacity={0.75}
    />
    <circle cx={26.7} cy={48} r={4.2} fill="currentColor" />
    <circle cx={48} cy={26.7} r={4.2} fill="currentColor" />
    <circle cx={69.3} cy={69.3} r={4.2} fill="currentColor" />
  </svg>
);

/** Test Koncentracji — cel z pierścieniami uwagi. */
export const FocusArt = () => (
  <svg viewBox="0 0 96 96" className="w-full h-full" aria-hidden="true">
    <circle cx={48} cy={48} r={29} {...stroke} strokeWidth={4} />
    <circle cx={48} cy={48} r={17.5} {...stroke} strokeWidth={3.2} opacity={0.7} />
    <circle cx={48} cy={48} r={8.5} {...stroke} strokeWidth={2.6} opacity={0.45} />
    <circle cx={48} cy={48} r={4.5} fill="currentColor" />
    <g {...stroke} strokeWidth={4}>
      <line x1={48} y1={9} x2={48} y2={17} />
      <line x1={48} y1={79} x2={48} y2={87} />
      <line x1={9} y1={48} x2={17} y2={48} />
      <line x1={79} y1={48} x2={87} y2={48} />
    </g>
  </svg>
);

/** Szybkość Reakcji — stoper z błyskawicą i liniami pędu. */
export const ReactionArt = () => (
  <svg viewBox="0 0 96 96" className="w-full h-full" aria-hidden="true">
    <circle cx={54} cy={55} r={25} {...stroke} strokeWidth={4} />
    <line x1={54} y1={22} x2={54} y2={30} {...stroke} strokeWidth={4} />
    <line x1={47} y1={19} x2={61} y2={19} {...stroke} strokeWidth={4} />
    <line x1={73} y1={33} x2={79} y2={27} {...stroke} strokeWidth={3.4} />
    <path d="M57 44 L46 60 H54 L49 71 L63 53 H55 L59 44 Z" fill="currentColor" stroke="none" />
    <g {...stroke} strokeWidth={3.4} opacity={0.5}>
      <line x1={12} y1={43} x2={23} y2={43} />
      <line x1={8} y1={56} x2={19} y2={56} />
      <line x1={12} y1={69} x2={23} y2={69} />
    </g>
  </svg>
);

/** Test Funkcji Poznawczych — mózg z odznaką potwierdzenia. */
export const CognitiveArt = () => (
  <svg viewBox="0 0 96 96" className="w-full h-full" aria-hidden="true">
    <g {...stroke} strokeWidth={3.6}>
      <path d="M25 50 C21 43 22 33 29 27 C36 20 47 17 56 19 C66 22 72 30 71 39 C70.5 44 68 48 64 51" />
      <path d="M25 50 C26 56 31 61 38 63 C43 64.5 48 64 52 66" />
      <path d="M64 51 C69 52 71.5 56 68.5 60 C65 64 58 63 56 59.5" />
      <path d="M59 64 C59 67 57.5 70 55 72.5" />
    </g>
    <g {...stroke} strokeWidth={2.6} opacity={0.7}>
      <path d="M27 47 C33 48.5 39 48.5 44 46.5" />
      <path d="M31 37 C34 31.5 40 28 46.5 27.5" />
      <path d="M52.5 26 C58 28 61 32.5 59.5 37.5" />
    </g>
    <circle cx={68} cy={70} r={13.5} fill="currentColor" opacity={0.14} stroke="none" />
    <circle cx={68} cy={70} r={13.5} {...stroke} strokeWidth={3.2} />
    <path d="M62 70.5 L66.5 75 L75.5 64.5" {...stroke} strokeWidth={3.6} />
  </svg>
);

/** Test ADHD — suwaki natężenia z rozproszonymi punktami. */
export const AdhdArt = () => (
  <svg viewBox="0 0 96 96" className="w-full h-full" aria-hidden="true">
    <g {...stroke} strokeWidth={3.4} opacity={0.35}>
      <line x1={18} y1={31} x2={78} y2={31} />
      <line x1={18} y1={50} x2={78} y2={50} />
      <line x1={18} y1={69} x2={78} y2={69} />
    </g>
    <g {...stroke} strokeWidth={3.4}>
      <line x1={18} y1={31} x2={58} y2={31} />
      <line x1={18} y1={50} x2={34} y2={50} />
      <line x1={18} y1={69} x2={66} y2={69} />
    </g>
    <circle cx={58} cy={31} r={5.5} fill="currentColor" />
    <circle cx={34} cy={50} r={5.5} fill="currentColor" />
    <circle cx={66} cy={69} r={5.5} fill="currentColor" />
    <circle cx={74} cy={16} r={2.4} fill="currentColor" opacity={0.45} />
    <circle cx={83} cy={24} r={2} fill="currentColor" opacity={0.3} />
    <circle cx={14} cy={84} r={2.2} fill="currentColor" opacity={0.35} />
  </svg>
);

/** Mapa: id testu → ilustracja. */
export const TEST_ART: Record<string, React.ReactNode> = {
  osobowosc: <PersonalityArt />,
  pamiec: <MemoryArt />,
  koncentracja: <FocusArt />,
  reakcja: <ReactionArt />,
  alzheimer: <CognitiveArt />,
  adhd: <AdhdArt />,
};
