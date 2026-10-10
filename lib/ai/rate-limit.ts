// Simple in-memory limits to protect your API key and quota from abuse.
// Note: on serverless hosts (e.g. Vercel) each instance keeps its own counters,
// so this is best-effort. For strict limits, back it with Redis (e.g. Upstash).

const hits = new Map<string, number[]>();

export function rateLimit(
  key: string,
  limit = 8,
  windowMs = 10 * 60_000,
): { ok: boolean; retryAfter: number } {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    hits.set(key, recent);
    return {
      ok: false,
      retryAfter: Math.ceil((windowMs - (now - recent[0])) / 1000),
    };
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      if (v.every((t) => now - t >= windowMs)) hits.delete(k);
    }
  }
  return { ok: true, retryAfter: 0 };
}

let day = "";
let used = 0;

// Caps total requests per day across all visitors (AI_DAILY_LIMIT, default 300).
export function withinDailyBudget(max: number): boolean {
  const today = new Date().toISOString().slice(0, 10);
  if (today !== day) {
    day = today;
    used = 0;
  }
  if (used >= max) return false;
  used += 1;
  return true;
}
