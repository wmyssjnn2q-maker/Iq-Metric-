/** Przedziały wiekowe do normowania wyniku (uproszczony model referencyjny w obrębie grupy). */
export type AgeBracket = {
  id: string;
  label: string;
  /** Średni oczekiwany wynik surowy jako ułamek maksimum (im wyżej, tym „wyższa” średnia w grupie dla tego typu zadań). */
  meanRawFactor: number;
  /** Odchylenie surowe względem maxRawScore — szersze dla skrajnych grup. */
  stdRawFactor: number;
};

export const IQ_AGE_BRACKETS: readonly AgeBracket[] = [
  { id: 'u16', label: 'Poniżej 16 lat', meanRawFactor: 0.44, stdRawFactor: 0.185 },
  { id: '16-24', label: '16–24 lata', meanRawFactor: 0.47, stdRawFactor: 0.175 },
  { id: '25-34', label: '25–34 lata', meanRawFactor: 0.45, stdRawFactor: 0.18 },
  { id: '35-44', label: '35–44 lata', meanRawFactor: 0.44, stdRawFactor: 0.182 },
  { id: '45-54', label: '45–54 lata', meanRawFactor: 0.42, stdRawFactor: 0.188 },
  { id: '55-64', label: '55–64 lata', meanRawFactor: 0.4, stdRawFactor: 0.195 },
  { id: '65+', label: '65 lat i więcej', meanRawFactor: 0.38, stdRawFactor: 0.2 },
] as const;

export const DEFAULT_AGE_BRACKET_ID = '25-34';

export function getAgeBracketById(id: string | null | undefined): AgeBracket {
  const found = IQ_AGE_BRACKETS.find((b) => b.id === id);
  return found ?? IQ_AGE_BRACKETS.find((b) => b.id === DEFAULT_AGE_BRACKET_ID)!;
}
