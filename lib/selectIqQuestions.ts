import type { Question } from '../types';

/** Ta sama logika doboru pytań co w sesji testowej (łatwe / średnie / trudne). */
export function selectIqQuestions(pool: Question[]): Question[] {
  const qCount = pool.length;
  const byId = (a: { id: string }, b: { id: string }) => a.id.localeCompare(b.id);

  const easyPool = pool.filter((q) => q.difficulty <= 4).sort((a, b) => a.difficulty - b.difficulty || byId(a, b));
  const mediumPool = pool
    .filter((q) => q.difficulty >= 5 && q.difficulty <= 7)
    .sort((a, b) => a.difficulty - b.difficulty || byId(a, b));
  const hardPool = pool.filter((q) => q.difficulty >= 8).sort((a, b) => a.difficulty - b.difficulty || byId(a, b));

  const takeFromPool = (p: Question[], count: number) => p.slice(0, Math.min(count, p.length));

  let selected: Question[] = [...takeFromPool(easyPool, 10), ...takeFromPool(mediumPool, 10), ...takeFromPool(hardPool, 10)];

  if (selected.length < qCount) {
    const usedIds = new Set(selected.map((q) => q.id));
    const fallback = pool
      .filter((q) => !usedIds.has(q.id))
      .sort((a, b) => a.difficulty - b.difficulty || byId(a, b));
    selected = selected.concat(fallback.slice(0, qCount - selected.length));
  }

  return selected;
}
