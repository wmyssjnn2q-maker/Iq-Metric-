import { createHmac, timingSafeEqual } from 'crypto';
import type { UserStats } from './questionTypes';
import { getScoreSecret, isScoreSecretConfigured } from './scoreSecret';

const TOKEN_VERSION = 1;

function payloadString(stats: UserStats, questionIds: string[]): string {
  return JSON.stringify({
    v: TOKEN_VERSION,
    stats,
    questionIds: [...questionIds].sort(),
  });
}

export function signIqResult(stats: UserStats, questionIds: string[]): string {
  const secret = getScoreSecret();
  if (!secret) {
    throw new Error('Brak konfiguracji SCORE_SECRET na serwerze (min. 16 znaków).');
  }
  return createHmac('sha256', secret).update(payloadString(stats, questionIds)).digest('base64url');
}

/** Podpis wyniku — tylko gdy SCORE_SECRET jest ustawiony (Vercel / .env.local). */
export function signIqResultOptional(stats: UserStats, questionIds: string[]): string | undefined {
  if (!isScoreSecretConfigured()) return undefined;
  return signIqResult(stats, questionIds);
}

export function verifyIqResult(token: string, stats: UserStats, questionIds: string[]): boolean {
  if (!token || !isScoreSecretConfigured()) return false;
  try {
    const expected = signIqResult(stats, questionIds);
    const a = Buffer.from(token);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
