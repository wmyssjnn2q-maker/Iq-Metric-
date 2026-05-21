import { QuestionType } from './types';
import type { DetailedAnalysis, UserStats } from './types';

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

const buildStepDescription = (domain: DomainItem, score: number, index: number, total: number): string => {
  const pct = Math.round(score);
  const level = getDomainLevel(score);

  if (index === 0) {
    return `W tym teście ${domain.shortLabel} wyszło najsłabiej (${pct}%). ${domain.exerciseHint}`;
  }
  if (index === total - 1) {
    return `${domain.shortLabel} to jeden z Twoich mocniejszych obszarów w tym teście (${pct}%, ${level.label.toLowerCase()}). ${domain.exerciseHint} Ćwicz 2–3 razy w tygodniu, żeby utrzymać poziom.`;
  }
  return `Wynik w ${domain.shortLabel}: ${pct}% (${level.label.toLowerCase()}). ${domain.exerciseHint}`;
};

/** Plan 5 kroków — kolejność od najsłabszej do najmocniejszej domeny z TEGO testu. */
export const buildPlanFromDomains = (domainScores: UserStats['domainScores']): PlanStep[] => {
  const ranked = DOMAIN_ITEMS.map((d) => ({
    ...d,
    score: domainScores[d.key] ?? 50,
  })).sort((a, b) => a.score - b.score || a.key.localeCompare(b.key));

  return ranked.map((d, i) => {
    const level = getDomainLevel(d.score);
    return {
      title: `Krok ${i + 1}: ${d.shortLabel}`,
      time: level.tone === 'low' ? '10 min dziennie' : level.tone === 'mid' ? '12 min dziennie' : '8 min dziennie',
      diff: level.tone === 'low' ? 'Łatwe' : level.tone === 'mid' ? 'Średnie' : 'Utrwalenie',
      desc: buildStepDescription(d, d.score, i, ranked.length),
      domainLabel: `${d.label} · ${Math.round(d.score)}%`,
    };
  });
};

/** Zawsze oparty na wynikach domen z bieżącego testu (nie na szablonie AI). */
export const resolveDevelopmentPlan = (domainScores: UserStats['domainScores']): PlanStep[] =>
  buildPlanFromDomains(domainScores);

export interface RankedDomain {
  key: DomainKey;
  label: string;
  shortLabel: string;
  score: number;
  level: ReturnType<typeof getDomainLevel>;
}

const CAREER_BY_DOMAIN: Record<DomainKey, string[]> = {
  [QuestionType.MATRIX]: ['Analityk danych', 'Data Scientist', 'Badacz wzorców'],
  [QuestionType.LOGIC]: ['Konsultant strategiczny', 'Prawnik korporacyjny', 'Audytor'],
  [QuestionType.SPATIAL]: ['Architekt', 'Inżynier CAD', 'Projektant UX 3D'],
  [QuestionType.NUMBER_SERIES]: ['Analityk finansowy', 'Aktuar', 'Specjalista BI'],
  [QuestionType.ANALOGY]: ['Badacz rynku', 'Copywriter strategiczny', 'Mediator'],
};

const TRAITS_BY_DOMAIN: Record<DomainKey, string[]> = {
  [QuestionType.MATRIX]: ['Analityczność', 'Wykrywanie schematów'],
  [QuestionType.LOGIC]: ['Myślenie dedukcyjne', 'Konsekwencja'],
  [QuestionType.SPATIAL]: ['Wyobraźnia przestrzenna', 'Wizualizacja'],
  [QuestionType.NUMBER_SERIES]: ['Rachunek pod presją', 'Wyczucie trendów'],
  [QuestionType.ANALOGY]: ['Abstrakcyjne myślenie', 'Łączenie pojęć'],
};

export const rankDomainsByScore = (domainScores: UserStats['domainScores']): RankedDomain[] =>
  DOMAIN_ITEMS.map((d) => {
    const score = domainScores[d.key] ?? 50;
    return {
      key: d.key,
      label: d.label,
      shortLabel: d.shortLabel,
      score,
      level: getDomainLevel(score),
    };
  }).sort((a, b) => b.score - a.score || a.key.localeCompare(b.key));

const iqBandLabel = (iq: number) => {
  if (iq >= 130) return 'wybitny';
  if (iq >= 115) return 'wysoki';
  if (iq >= 100) return 'ponadprzeciętny';
  if (iq >= 85) return 'w normie';
  return 'wymagający treningu';
};

const buildCareerPaths = (ranked: RankedDomain[]): string[] => {
  const picks: string[] = [];
  for (const d of ranked.slice(0, 3)) {
    for (const career of CAREER_BY_DOMAIN[d.key]) {
      if (!picks.includes(career)) picks.push(career);
      if (picks.length >= 3) return picks;
    }
  }
  return picks.length ? picks : ['Specjalista', 'Koordynator projektów', 'Doradca'];
};

const buildPersonalityTraits = (ranked: RankedDomain[]): string[] => {
  const picks: string[] = [];
  for (const d of ranked.slice(0, 3)) {
    const trait = TRAITS_BY_DOMAIN[d.key][d.score >= 66 ? 0 : 1];
    if (!picks.includes(trait)) picks.push(trait);
  }
  return picks.length ? picks : ['Koncentracja', 'Systematyczność', 'Cierpliwość'];
};

/** Pełne podsumowanie raportu — zawsze z wyników tego testu. */
export const buildReportInsights = (stats: UserStats): DetailedAnalysis => {
  const ranked = rankDomainsByScore(stats.domainScores);
  const strongest = ranked[0];
  const second = ranked[1];
  const weakest = ranked[ranked.length - 1];
  const secondWeakest = ranked[ranked.length - 2];
  const band = iqBandLabel(stats.iqScore);
  const pct = Math.round(stats.percentile);

  const summary =
    `Twój wynik IQ ${stats.iqScore} (${band}) plasuje Cię na ${pct}. percentylu` +
    `${stats.ageBracketLabel ? ` w grupie ${stats.ageBracketLabel}` : ''}. ` +
    `W tym teście najlepiej wypadły: ${strongest.shortLabel} (${Math.round(strongest.score)}%)` +
    ` i ${second.shortLabel} (${Math.round(second.score)}%). ` +
    `Najwięcej do ćwiczeń daje ${weakest.shortLabel} (${Math.round(weakest.score)}%).`;

  const strengths = ranked
    .filter((d) => d.score >= 55)
    .slice(0, 4)
    .map((d) => `${d.shortLabel}: ${Math.round(d.score)}% — ${d.level.label.toLowerCase()} wynik w teście`);

  if (strengths.length < 2) {
    strengths.push(`Wynik ogólny IQ ${stats.iqScore} — ${band} poziom w skali testu`);
  }

  const weaknesses = [
    `${weakest.shortLabel}: ${Math.round(weakest.score)}% — priorytet w planie rozwoju`,
    `${secondWeakest.shortLabel}: ${Math.round(secondWeakest.score)}% — warto ćwiczyć regularnie`,
  ];

  if (stats.iqScore < 100) {
    weaknesses.push('Tempo pod presją czasu — rozwiązuj zadania z limitem minut');
  }

  return {
    summary,
    strengths,
    weaknesses,
    recommendations: buildPlanFromDomains(stats.domainScores).map((s) => ({
      title: s.title,
      time: s.time,
      diff: s.diff,
      desc: s.desc,
    })),
    careerPaths: buildCareerPaths(ranked),
    personalityTraits: buildPersonalityTraits(ranked),
  };
};
