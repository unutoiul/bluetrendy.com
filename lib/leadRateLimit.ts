import { createHash } from "node:crypto";

const windowMs = 10 * 60 * 1000;
const attempts = new Map<string, { count: number; expires: number }>();

// Best-effort per-instance protection; Resend idempotency also covers retries.
export function checkLeadRateLimit(email: string, ip?: string, now = Date.now()) {
  for (const [key, value] of attempts) {
    if (value.expires <= now) attempts.delete(key);
  }
  const keys = [`email:${email.toLowerCase()}`, ...(ip ? [`ip:${ip}`] : [])]
    .map((value) => createHash("sha256").update(value).digest("hex"));

  for (const key of keys) {
    const value = attempts.get(key);
    if (value && value.count >= 5) {
      return { allowed: false, retryAfter: Math.ceil((value.expires - now) / 1000) };
    }
  }
  // Keep memory bounded without evicting active limits.
  if (attempts.size + keys.filter((key) => !attempts.has(key)).length > 5000) {
    return { allowed: false, retryAfter: 60 };
  }
  for (const key of keys) {
    const value = attempts.get(key) ?? { count: 0, expires: now + windowMs };
    value.count++;
    attempts.set(key, value);
  }
  return { allowed: true, retryAfter: 0 };
}
