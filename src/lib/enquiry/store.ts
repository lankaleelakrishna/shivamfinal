/**
 * In-memory guards for POST /api/enquiries.
 *
 * Limits are per server instance. On Vercel, instances are short-lived and
 * several can run at once, so these are best-effort brakes, not a hard global
 * quota. The authoritative rate limit is a Vercel Firewall rule (see README).
 */

const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX_REQUESTS = 5;
const RATE_MAX_KEYS = 5000;

const DEDUPE_TTL_MS = 60 * 60 * 1000;
const DEDUPE_MAX_KEYS = 5000;

const hits = new Map<string, { count: number; resetAt: number }>();
const seen = new Map<string, number>();

function pruneExpired<T>(map: Map<string, T>, isExpired: (value: T) => boolean, maxKeys: number): void {
  if (map.size < maxKeys) return;
  for (const [key, value] of map) {
    if (isExpired(value)) map.delete(key);
  }
  // Still full of live entries: drop the oldest so memory stays bounded.
  while (map.size >= maxKeys) {
    const oldest = map.keys().next().value;
    if (oldest === undefined) break;
    map.delete(oldest);
  }
}

/** Counts every POST from this client, valid or not, so floods are throttled before any parsing. */
export function checkRateLimit(clientKey: string): { ok: true } | { ok: false; retryAfterSeconds: number } {
  const now = Date.now();
  pruneExpired(hits, (h) => h.resetAt <= now, RATE_MAX_KEYS);

  const entry = hits.get(clientKey);
  if (!entry || entry.resetAt <= now) {
    hits.set(clientKey, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return { ok: true };
  }
  if (entry.count >= RATE_MAX_REQUESTS) {
    return { ok: false, retryAfterSeconds: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)) };
  }
  entry.count += 1;
  return { ok: true };
}

/**
 * Claims a submission id so a repeated request does not send a second email.
 * Returns false if the id was already claimed. Call releaseSubmission on failure
 * so the visitor can retry with the same data.
 */
export function claimSubmission(submissionId: string): boolean {
  const now = Date.now();
  pruneExpired(seen, (t) => now - t > DEDUPE_TTL_MS, DEDUPE_MAX_KEYS);
  const existing = seen.get(submissionId);
  if (existing !== undefined && now - existing <= DEDUPE_TTL_MS) return false;
  seen.set(submissionId, now);
  return true;
}

export function releaseSubmission(submissionId: string): void {
  seen.delete(submissionId);
}
