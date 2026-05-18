import { QuestionType } from './types';
import type { UserStats } from './types';

export type DomainKey = keyof UserStats['domainScores'];

export interface DomainItem {
  key: DomainKey;
  label: string;
  shortLabel: string;
  desc: string;
  exerciseHint: string;
}

export const DOMAIN_ITEMS: DomainItem[] = [
  {
    key: QuestionType.MATRIX,
    label: 'Wzorce i schematy',
    shortLabel: 'Macierze',
    desc: 'Szukanie reguł w układach wizualnych',
    exerciseHint: 'Rozwiązuj 5–10 zadań z macierz 3×3 dziennie. Szukaj, co się zmienia w wierszu i kolumnie.',
  },
  {
    key: QuestionType.LOGIC,
    label: 'Logika',
    shortLabel: 'Logika',
    desc: 'Wnioski z podanych informacji',
    exerciseHint: 'Ćwicz krótkie zagadki logiczne (kto kłamie, kolejność zdarzeń). Zapisuj krok po kroku, dlaczego tak wnioskujesz.',
  },
  {
    key: QuestionType.SPATIAL,
    label: 'Wyobraźnia przestrzenna',
    shortLabel: 'Przestrzeń',
    desc: 'Obroty figur i układ w przestrzeni',
    exerciseHint: 'Składaj puzzle 3D lub rysuj bryły z przodu i z boku. Ćwicz obracanie figur w głowie.',
  },
  {
    key: QuestionType.NUMBER_SERIES,
    label: 'Liczby i ciągi',
    shortLabel: 'Ciągi',
    desc: 'Wzorce w liczbach i kolejnościach',
    exerciseHint: 'Znajdź regułę w ciągu (np. +2, ×2, suma dwóch poprzednich). Zacznij od prostych ciągów, potem trudniejsze.',
  },
  {
    key: QuestionType.ANALOGY,
    label: 'Analogie',
    shortLabel: 'Analogie',
    desc: 'Relacje między pojęciami',
    exerciseHint: 'Ćwicz pary słów: „pies : szczenię = kot : ?”. Szukaj tej samej relacji, nie tylko podobieństwa.',
  },
];

export const getDomainLevel = (value: number): { label: string; tone: 'low' | 'mid' | 'high' } => {
  if (value >= 66) return { label: 'Wysoki', tone: 'high' };
  if (value >= 40) return { label: 'Średni', tone: 'mid' };
  return { label: 'Do ćwiczeń', tone: 'low' };
};

export const normalizeDiffLabel = (diff: string): string => {
  const d = diff.toLowerCase();
  if (d.includes('nisk') || d.includes('łatw') || d.includes('latw')) return 'Łatwe';
  if (d.includes('wysok') || d.includes('trudn')) return 'Trudniejsze';
  return 'Średnie';
};

export interface PlanStep {
  title: string;
  time: string;
  diff: string;
  desc: string;
  domainLabel?: string;
}

/** Plan z najsłabszych domen — gdy brak analizy AI lub jako uzupełnienie. */
export const resolveDevelopmentPlan = (
  domainScores: UserStats['domainScores'],
  aiRecs?: { title: string; time: string; diff: string; desc: string }[],
): PlanStep[] => {
  const domainPlan = buildPlanFromDomains(domainScores);
  if (!aiRecs?.length) return domainPlan;
  return domainPlan.map((step, i) => {
    const ai = aiRecs[i];
    if (!ai) return step;
    return {
      ...step,
      title: ai.title || step.title,
      time: ai.time || step.time,
      diff: ai.diff || step.diff,
      desc: ai.desc && ai.desc.length > 15 ? ai.desc : step.desc,
    };
  });
};

export const buildPlanFromDomains = (domainScores: UserStats['domainScores']): PlanStep[] => {
  const ranked = DOMAIN_ITEMS.map((d) => ({
    ...d,
    score: domainScores[d.key] ?? 50,
  })).sort((a, b) => a.score - b.score);

  return ranked.map((d, i) => {
    const level = getDomainLevel(d.score);
    return {
      title: `Krok ${i + 1}: ${d.shortLabel}`,
      time: level.tone === 'low' ? '10 min dziennie' : '15 min dziennie',
      diff: level.tone === 'low' ? 'Łatwe' : level.tone === 'mid' ? 'Średnie' : 'Utrwalenie',
      desc: d.exerciseHint,
      domainLabel: d.label,
    };
  });
};
