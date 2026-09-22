/**
 * Security & Anti-DDoS Utilities for PK ARK Assistant
 * Provides client-side request throttling, brute-force mitigation, input sanitization,
 * and key concealment functions.
 */

// In-memory rate limiting map for user actions
const actionTimestampMap = new Map<string, number>();
const authAttemptTracker = {
  failedAttempts: 0,
  lockedUntil: 0
};

/**
 * Throttle a client action by key (e.g. 'alarm-test', 'save-timer', 'post-tip')
 * Returns true if action is allowed, false if dropped due to high frequency (anti-spam / anti-flood)
 */
export function throttleClientAction(actionKey: string, minIntervalMs: number = 800): boolean {
  const now = Date.now();
  const lastTime = actionTimestampMap.get(actionKey) || 0;
  
  if (now - lastTime < minIntervalMs) {
    return false; // Action throttled
  }
  
  actionTimestampMap.set(actionKey, now);
  return true;
}

/**
 * Check if authentication attempts are currently locked out due to brute-force protection
 */
export function checkAuthBruteForceLock(): { isLocked: boolean; remainingSeconds: number } {
  const now = Date.now();
  if (authAttemptTracker.lockedUntil > now) {
    const remainingSeconds = Math.ceil((authAttemptTracker.lockedUntil - now) / 1000);
    return { isLocked: true, remainingSeconds };
  }
  return { isLocked: false, remainingSeconds: 0 };
}

/**
 * Record a failed login attempt; applies exponential backoff after 3 failures
 */
export function recordFailedAuthAttempt(): { isLocked: boolean; lockDurationSec: number } {
  authAttemptTracker.failedAttempts++;
  const now = Date.now();

  if (authAttemptTracker.failedAttempts >= 5) {
    // 60-second lockout for 5+ failures
    const lockDurationSec = 60;
    authAttemptTracker.lockedUntil = now + lockDurationSec * 1000;
    return { isLocked: true, lockDurationSec };
  } else if (authAttemptTracker.failedAttempts >= 3) {
    // 15-second lockout for 3 failures
    const lockDurationSec = 15;
    authAttemptTracker.lockedUntil = now + lockDurationSec * 1000;
    return { isLocked: true, lockDurationSec };
  }

  return { isLocked: false, lockDurationSec: 0 };
}

/**
 * Reset failed authentication counter on successful authentication
 */
export function resetAuthFailureCount(): void {
  authAttemptTracker.failedAttempts = 0;
  authAttemptTracker.lockedUntil = 0;
}

/**
 * Sanitize user string input to eliminate XSS injection vectors
 */
export function sanitizeUserInput(input: string): string {
  if (!input) return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .trim();
}

/**
 * Concealed cipher decoder to prevent plaintext key scraping from compiled client JS
 */
export function decodeSecurityToken(b64Token: string, cipherShift: number = 0x5a): string {
  if (!b64Token) return '';
  try {
    const raw = typeof window !== 'undefined' ? window.atob(b64Token) : Buffer.from(b64Token, 'base64').toString('binary');
    return raw
      .split('')
      .map((c, i) => String.fromCharCode(c.charCodeAt(0) ^ (cipherShift + (i % 7))))
      .join('');
  } catch (e) {
    console.error('[SECURITY] Error during token validation:', e);
    return '';
  }
}
