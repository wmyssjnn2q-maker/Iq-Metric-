import { createHmac, timingSafeEqual } from 'crypto';
import type { UserStats } from '../types';

const TOKEN_VERSION = 1;

function getScoreSecret(): string {
  const secret = process.env.SCORE_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error('Brak konfiguracji SCORE_SECRET na serwerze (min. 16 znaków).');
  }
  return secret;
}

function payloadString(stats: UserStats, questionIds: string[]): string {
  return JSON.stringify({
    v: TOKEN_VERSION,
    stats,
    questionIds: [...questionIds].sort(),
  });
}

export function signIqResult(stats: UserStats, questionIds: string[]): string {
  return createHmac('sha256', getScoreSecret()).update(payloadString(stats, questionIds)).digest('base64url');
}

export function verifyIqResult(token: string, stats: UserStats, questionIds: string[]): boolean {
  if (!token) return false;
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
