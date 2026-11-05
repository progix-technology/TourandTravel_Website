/**
 * High-Performance Rate Limiting Middleware (Zero External Dependencies)
 * Sliding Window Token algorithm protecting APIs against DDoS, Brute-Force, and Bot Flooding.
 */

// Memory Store for Rate Limiting
class MemoryStore {
  constructor(cleanupIntervalMs = 5 * 60 * 1000) {
    this.hits = new Map() // ip -> { count, resetTime }

    // Periodically clean up expired entries to prevent memory leaks
    this.timer = setInterval(() => {
      const now = Date.now()
      for (const [key, value] of this.hits.entries()) {
        if (value.resetTime <= now) {
          this.hits.delete(key)
        }
      }
    }, cleanupIntervalMs)

    if (this.timer.unref) {
      this.timer.unref() // Allow node process to exit cleanly
    }
  }

  increment(key, windowMs) {
    const now = Date.now()
    const entry = this.hits.get(key)

    if (!entry || entry.resetTime <= now) {
      const newEntry = {
        count: 1,
        resetTime: now + windowMs,
      }
      this.hits.set(key, newEntry)
      return newEntry
    }

    entry.count += 1
    return entry
  }

  resetKey(key) {
    this.hits.delete(key)
  }
}

const defaultStore = new MemoryStore()

/**
 * Create a rate limiting middleware
 * @param {Object} options
 * @param {number} options.windowMs - Time frame for which requests are checked (default: 15 mins)
 * @param {number} options.max - Max number of connections during windowMs (default: 100)
 * @param {string} options.message - Error message when limit exceeded
 * @param {string} options.tierName - Label for the rate limiting tier
 */
export const createRateLimiter = ({
  windowMs = 15 * 60 * 1000,
  max = 100,
  message = 'Too many requests from this IP. Please try again after 15 minutes.',
  tierName = 'API',
  skip = null,
} = {}) => {
  return (req, res, next) => {
    // Optional custom skip (e.g., skip health checks or webhooks)
    if (skip && skip(req)) {
      return next()
    }

    // Extract Client IP address
    const clientIp =
      (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
      req.socket.remoteAddress ||
      req.ip ||
      'unknown_client'

    const key = `${tierName}_${clientIp}`
    const { count, resetTime } = defaultStore.increment(key, windowMs)

    const now = Date.now()
    const timeRemainingSeconds = Math.max(1, Math.ceil((resetTime - now) / 1000))
    const requestsRemaining = Math.max(0, max - count)

    // Standard RFC RateLimit HTTP Headers
    res.setHeader('RateLimit-Limit', max)
    res.setHeader('RateLimit-Remaining', requestsRemaining)
    res.setHeader('RateLimit-Reset', Math.ceil(resetTime / 1000))

    if (count > max) {
      res.setHeader('Retry-After', timeRemainingSeconds)
      console.warn(`⚠️ [RateLimit Blocked] IP: ${clientIp} exceeded ${tierName} limit (${count}/${max}). Retry in ${timeRemainingSeconds}s`)

      return res.status(429).json({
        success: false,
        isRateLimited: true,
        tier: tierName,
        message,
        retryAfterSeconds: timeRemainingSeconds,
      })
    }

    next()
  }
}

// ---------------------------------------------------------------------------
// PRE-CONFIGURED PRODUCTION RATE LIMITERS
// ---------------------------------------------------------------------------

// 1. General API Limiter: 400 requests per 15 mins (Prevents scrapers & DDoS)
export const globalApiLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 400,
  tierName: 'GlobalAPI',
  message: 'High traffic detected. You have reached the global API request limit. Please wait a few minutes.',
  skip: (req) => req.path === '/health' || req.path === '/api/v1/health',
})

// 2. Strict Auth Limiter: 10 attempts per 15 mins (Blocks password brute-force & credential stuffing)
export const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  tierName: 'Authentication',
  message: 'Too many authentication attempts from this IP. To protect account security, please wait 15 minutes before trying again.',
})

// 3. Bookings & Inquiries Limiter: 300 requests per 15 mins (Allows dashboard polling, protects POST endpoints)
export const bookingLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 300,
  tierName: 'BookingSystem',
  message: 'Too many booking inquiries submitted in a short time. Please wait a few minutes before submitting another itinerary request.',
  skip: (req) => req.method === 'GET' || req.headers.authorization,
})

// 4. Payment Gateway Limiter: 25 requests per 15 mins (Protects Razorpay order creation from bot spam)
export const paymentLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 25,
  tierName: 'PaymentGateway',
  message: 'Too many payment sessions initiated. Please wait 15 minutes before attempting payment checkout again.',
  skip: (req) => req.path === '/webhook', // Never rate-limit official Razorpay webhooks
})

export default globalApiLimiter

