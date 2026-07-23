// Best-effort, single-instance in-memory rate limiter for the enquiry form.
// NOT distributed — on a multi-instance/serverless deployment (e.g. several
// concurrent Vercel lambda instances) each instance keeps its own counts, so
// the real-world limit is "N per window per instance," not a hard global
// cap. That's an accepted tradeoff for a small hotel contact form that gets
// a handful of submissions a day: it stops one naive script hammering the
// endpoint, without needing Redis/Upstash for something this low-traffic.
// Revisit with a shared store (e.g. Upstash Ratelimit) if abuse becomes real.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;

const hits = new Map<string, { count: number; resetAt: number }>();

/** Returns true if `key` (typically a client IP) has exceeded the limit. */
export function isRateLimited(key: string): boolean {
  const now = Date.now();
  const entry = hits.get(key);

  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_REQUESTS;
}
