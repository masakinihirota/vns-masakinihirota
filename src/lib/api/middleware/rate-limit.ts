/**
 * API Rate Limiting Middleware for Hono
 *
 * @description
 * Protects API endpoints from abuse by limiting request rates
 * Uses in-memory store (production should use Redis)
 *
 * @usage
 * app.use('/api/*', rateLimit({ maxRequests: 100, windowMs: 60000 }))
 */

import { MiddlewareHandler } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { checkRateLimit, RATE_LIMIT_CONFIG } from '@/lib/auth/rate-limiter';

export interface RateLimitOptions {
  /**
   * Maximum number of requests per window
   * @default 60
   */
  maxRequests?: number;

  /**
   * Time window in milliseconds
   * @default 60000 (1 minute)
   */
  windowMs?: number;

  /**
   * Custom key generator (default: uses IP address)
   * @param c - Hono Context
   * @returns Unique identifier for rate limiting
   */
  keyGenerator?: (c: any) => string;

  /**
   * Skip rate limiting based on condition
   * @param c - Hono Context
   * @returns true to skip rate limiting
   */
  skip?: (c: any) => boolean;
}

/**
 * Get client IP address from request
 * Supports various proxy headers (X-Forwarded-For, X-Real-IP, etc.)
 */
function getClientIp(c: any): string {
  // Check various proxy headers
  const forwarded = c.req.header('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  const realIp = c.req.header('x-real-ip');
  if (realIp) {
    return realIp;
  }

  const cfConnectingIp = c.req.header('cf-connecting-ip');
  if (cfConnectingIp) {
    return cfConnectingIp;
  }

  // Fallback to connection remote address (may not work in all environments)
  return 'unknown';
}

/**
 * Create rate limiting middleware
 *
 * @param options - Rate limiting configuration
 * @returns Hono middleware handler
 *
 * @example
 * // Limit to 60 requests per minute
 * app.use('/api/*', rateLimit())
 *
 * @example
 * // Custom limits for admin routes
 * app.use('/api/admin/*', rateLimit({
 *   maxRequests: 30,
 *   windowMs: 60000
 * }))
 *
 * @example
 * // Rate limit by user ID instead of IP
 * app.use('/api/*', rateLimit({
 *   keyGenerator: (c) => c.get('session')?.user?.id || getClientIp(c)
 * }))
 */
export function rateLimit(options: RateLimitOptions = {}): MiddlewareHandler {
  const {
    maxRequests = RATE_LIMIT_CONFIG.API_MAX_ATTEMPTS,
    windowMs = RATE_LIMIT_CONFIG.API_WINDOW_MS,
    keyGenerator = getClientIp,
    skip,
  } = options;

  return async (c, next) => {
    // Skip if condition met
    if (skip && skip(c)) {
      await next();
      return;
    }

    // Generate unique key for this client
    const key = `api:${keyGenerator(c)}`;

    // Check rate limit
    const allowed = checkRateLimit(key, maxRequests, windowMs);

    if (!allowed) {
      // Calculate retry-after seconds
      const retryAfter = Math.ceil(windowMs / 1000);

      throw new HTTPException(429, {
        message: 'Too many requests. Please try again later.',
        res: new Response(
          JSON.stringify({
            success: false,
            error: {
              code: 'RATE_LIMIT_EXCEEDED',
              message: `Too many requests. Please try again in ${retryAfter} seconds.`,
              retryAfter,
            },
          }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'Retry-After': String(retryAfter),
              'X-RateLimit-Limit': String(maxRequests),
              'X-RateLimit-Reset': String(Date.now() + windowMs),
            },
          }
        ),
      });
    }

    // Set rate limit headers
    c.header('X-RateLimit-Limit', String(maxRequests));
    c.header('X-RateLimit-Remaining', String(maxRequests - 1)); // Approximate

    await next();
  };
}

/**
 * Stricter rate limit for authentication endpoints
 * 5 requests per minute
 */
export function authRateLimit(): MiddlewareHandler {
  return rateLimit({
    maxRequests: RATE_LIMIT_CONFIG.AUTH_MAX_ATTEMPTS,
    windowMs: RATE_LIMIT_CONFIG.AUTH_WINDOW_MS,
  });
}

/**
 * Standard rate limit for general API endpoints
 * 60 requests per minute
 */
export function apiRateLimit(): MiddlewareHandler {
  return rateLimit({
    maxRequests: 60,
    windowMs: 60000,
  });
}

/**
 * Stricter rate limit for admin endpoints
 * 30 requests per minute
 */
export function adminRateLimit(): MiddlewareHandler {
  return rateLimit({
    maxRequests: 30,
    windowMs: 60000,
  });
}
