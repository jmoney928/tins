import { CATALOG } from "./catalog";

/**
 * Drop 01 allocation, held in memory. It resets whenever the server restarts,
 * which is fine for a pre-launch build but must move to a real store before
 * the drop opens — otherwise two instances will happily oversell the same tin.
 */
const left = new Map<string, number>(
  Object.values(CATALOG).map((p) => [p.id, p.remaining ?? Number.POSITIVE_INFINITY]),
);

/** Sessions already applied, so a redelivered webhook cannot double-count. */
const settled = new Set<string>();

export const remaining = (id: string) => left.get(id) ?? 0;

export function commit(sessionId: string, lines: { id: string; qty: number }[]) {
  if (settled.has(sessionId)) return false;
  settled.add(sessionId);

  for (const l of lines) {
    const now = left.get(l.id);
    if (now === undefined || now === Number.POSITIVE_INFINITY) continue;
    left.set(l.id, Math.max(0, now - l.qty));
  }
  return true;
}
