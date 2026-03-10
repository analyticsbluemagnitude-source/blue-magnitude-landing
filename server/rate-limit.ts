/**
 * Simple in-memory rate limiter for form submissions
 * Tracks IP addresses and submission timestamps
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS = 5; // Max 5 submissions per hour per IP

export function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry) {
    // First submission from this IP
    rateLimitMap.set(ip, {
      count: 1,
      resetTime: now + WINDOW_MS,
    });
    return true;
  }

  // Check if window has expired
  if (now > entry.resetTime) {
    // Reset the counter
    rateLimitMap.set(ip, {
      count: 1,
      resetTime: now + WINDOW_MS,
    });
    return true;
  }

  // Check if limit exceeded
  if (entry.count >= MAX_REQUESTS) {
    return false;
  }

  // Increment counter
  entry.count++;
  return true;
}

export function getRateLimitInfo(ip: string): { remaining: number; resetTime: number } {
  const entry = rateLimitMap.get(ip);
  const now = Date.now();

  if (!entry || now > entry.resetTime) {
    return {
      remaining: MAX_REQUESTS,
      resetTime: now + WINDOW_MS,
    };
  }

  return {
    remaining: Math.max(0, MAX_REQUESTS - entry.count),
    resetTime: entry.resetTime,
  };
}

// Clean up old entries every hour
setInterval(() => {
  const now = Date.now();
  const ipsToDelete: string[] = [];
  rateLimitMap.forEach((entry, ip) => {
    if (now > entry.resetTime) {
      ipsToDelete.push(ip);
    }
  });
  ipsToDelete.forEach(ip => rateLimitMap.delete(ip));
}, 60 * 60 * 1000);
