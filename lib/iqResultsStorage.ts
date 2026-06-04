import type { DetailedAnalysis, ReportData, UserStats } from '../types';

export const IQ_RESULTS_STORAGE_KEY = 'iq_results';

const STORAGE_VERSION = 2;
/** Pełny wynik (przed wysyłką raportu na e-mail). */
const FULL_DATA_TTL_MS = 24 * 60 * 60 * 1000;
/** Po wysyłce — tylko status zakupu i skrót wyniku. */
const MINIMAL_TTL_MS = 2 * 60 * 60 * 1000;

export type IqResultsRecord = ReportData & {
  email?: string;
  storageVersion?: number;
  expiresAt?: number;
};

const SENSITIVE_KEYS = [
  'analysis',
  'resultToken',
  'testQuestionIds',
  'ageBracketId',
  'ageBracketLabel',
  'userName',
  'email',
] as const;

export const stripLegacyAuxiliaryAccessFlags = <T extends Record<string, unknown>>(data: T): T => {
  const next = { ...data };
  delete next.hasOsobowosc;
  delete next.hasPamiec;
  delete next.hasKoncentracja;
  delete next.hasReakcja;
  delete next.hasAlzheimer;
  delete next.hasADHD;
  return next;
};

export const hasFullReportPayload = (data: IqResultsRecord | null | undefined): boolean => {
  if (!data?.stats) return false;
  const domains = data.stats.domainScores;
  return Boolean(domains && Object.keys(domains).length > 0);
};

const isExpired = (data: IqResultsRecord): boolean =>
  typeof data.expiresAt === 'number' && Date.now() > data.expiresAt;

const parseRaw = (): IqResultsRecord | null => {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(IQ_RESULTS_STORAGE_KEY);
  if (!raw) return null;
  try {
    return stripLegacyAuxiliaryAccessFlags(
      JSON.parse(raw) as Record<string, unknown>,
    ) as unknown as IqResultsRecord;
  } catch {
    localStorage.removeItem(IQ_RESULTS_STORAGE_KEY);
    return null;
  }
};

const persist = (data: IqResultsRecord, tier: 'full' | 'minimal') => {
  const payload: IqResultsRecord = {
    ...data,
    storageVersion: STORAGE_VERSION,
    expiresAt: Date.now() + (tier === 'full' ? FULL_DATA_TTL_MS : MINIMAL_TTL_MS),
  };
  localStorage.setItem(IQ_RESULTS_STORAGE_KEY, JSON.stringify(payload));
  return payload;
};

export const clearIqResults = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(IQ_RESULTS_STORAGE_KEY);
};

/** Odczyt z automatycznym wygaśnięciem wpisu. */
export const readIqResults = (): IqResultsRecord | null => {
  const data = parseRaw();
  if (!data) return null;
  if (isExpired(data)) {
    clearIqResults();
    return null;
  }
  return data;
};

/** Jak readIqResults, ale pusty obiekt gdy brak danych (kompatybilność UI). */
export const readIqResultsOrEmpty = (): IqResultsRecord => {
  return readIqResults() ?? { timestamp: 0, isPaid: false };
};

export const writeIqResults = (data: IqResultsRecord, tier: 'full' | 'minimal' = 'full') =>
  persist(stripLegacyAuxiliaryAccessFlags(data as unknown as Record<string, unknown>) as unknown as IqResultsRecord, tier);

export const mergeIqResults = (patch: Partial<IqResultsRecord>, tier: 'full' | 'minimal' = 'full') => {
  const prev = readIqResultsOrEmpty();
  const hasStats = Boolean(patch.stats ?? prev.stats);
  const effectiveTier =
    tier === 'minimal' || prev.reportDeliveredAt ? 'minimal' : hasStats ? 'full' : 'minimal';
  return writeIqResults({ ...prev, ...patch, timestamp: patch.timestamp ?? prev.timestamp ?? Date.now() }, effectiveTier);
};

/** Zostaw tylko e-mail na czas trwania sesji checkoutu / formularza (bez przedłużania TTL pełnego wyniku). */
export const touchSessionEmail = (email: string) => {
  const prev = readIqResultsOrEmpty();
  if (!hasFullReportPayload(prev) && !prev.isPaid) {
    mergeIqResults({ email: email.trim().toLowerCase() }, 'minimal');
    return;
  }
  mergeIqResults({ email: email.trim().toLowerCase() }, 'full');
};

export const purgeSensitiveIqResultsAfterReportDelivery = (summary: {
  iqScore: number;
  percentile: number;
}) => {
  const prev = readIqResults();
  if (!prev) return;

  const minimal: IqResultsRecord = {
    timestamp: prev.timestamp,
    isPaid: prev.isPaid,
    isPro: prev.isPro,
    isMax: prev.isMax,
    reportDeliveredAt: Date.now(),
    stats: {
      iqScore: summary.iqScore,
      percentile: summary.percentile,
      confidenceInterval: [summary.iqScore - 5, summary.iqScore + 5],
      domainScores: {
        MATRIX: 0,
        NUMBER_SERIES: 0,
        ANALOGY: 0,
        SPATIAL: 0,
        LOGIC: 0,
      },
    } as UserStats,
  };

  writeIqResults(minimal, 'minimal');
};

export const purgeEmailFromIqResults = () => {
  const prev = readIqResults();
  if (!prev?.email) return;
  const next = { ...prev };
  delete next.email;
  writeIqResults(next, prev.reportDeliveredAt ? 'minimal' : hasFullReportPayload(prev) ? 'full' : 'minimal');
};

export const markCertEmailSent = (timestamp: number) => {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(`certEmailSent_${timestamp}`, '1');
};

export const wasCertEmailSent = (timestamp: number): boolean => {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem(`certEmailSent_${timestamp}`) === '1';
};

export const migrateIqResultsOnStartup = () => {
  if (typeof window === 'undefined') return;
  for (let i = localStorage.length - 1; i >= 0; i--) {
    const key = localStorage.key(i);
    if (key?.startsWith('certEmailSent_')) localStorage.removeItem(key);
  }

  const data = parseRaw();
  if (!data) return;

  if (isExpired(data)) {
    clearIqResults();
    return;
  }

  if (data.reportDeliveredAt && hasFullReportPayload(data)) {
    purgeSensitiveIqResultsAfterReportDelivery({
      iqScore: data.stats.iqScore,
      percentile: data.stats.percentile,
    });
    return;
  }

  if (!data.expiresAt || data.storageVersion !== STORAGE_VERSION) {
    writeIqResults(data, data.reportDeliveredAt ? 'minimal' : hasFullReportPayload(data) ? 'full' : 'minimal');
  }
};
