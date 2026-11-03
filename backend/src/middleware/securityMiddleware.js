/**
 * Enterprise Security Architecture Middleware
 * Includes:
 * 1. HTTP Security Headers (Helmet Equivalent)
 * 2. NoSQL Injection Prevention (Sanitizes Mongo operator keys like $gt, $ne, $where)
 * 3. XSS Sanitization (Cleans dangerous script tags and event handlers from input)
 * 4. Cookie Parser (Native, zero-dependency httpOnly token parser)
 */

/**
 * 1. Enterprise HTTP Security Headers Middleware
 * Protects against Clickjacking, MIME-Sniffing, XSS, and Protocol Downgrades.
 */
export const securityHeaders = (req, res, next) => {
  // Hide Express server footprint
  res.removeHeader('X-Powered-By')

  // Prevent Clickjacking by disabling framing from foreign domains
  res.setHeader('X-Frame-Options', 'SAMEORIGIN')

  // Prevent MIME-type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff')

  // Enable browser XSS filtering
  res.setHeader('X-XSS-Protection', '1; mode=block')

  // Enforce HTTPS in production via HTTP Strict Transport Security
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
  }

  // Control referrer information sent in HTTP requests
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')

  // Cross-Origin Isolation Policies (allows popups like Razorpay Checkout)
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups')
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin')

  next()
}

/**
 * 2. NoSQL Injection Prevention Middleware
 * Recursively scans and strips keys starting with '$' or containing '.' from req.body, req.query, and req.params.
 * Protects against payloads like: {"email": {"$gt": ""}} or {"$where": "..."}
 */
const hasMongoOperator = (str) => {
  return typeof str === 'string' && (str.startsWith('$') || str.includes('.'))
}

const sanitizeObject = (obj, depth = 0) => {
  if (!obj || typeof obj !== 'object' || depth > 10) return obj

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeObject(item, depth + 1))
  }

  const cleaned = {}
  for (const [key, val] of Object.entries(obj)) {
    // If key contains MongoDB operator, drop it or block it
    if (hasMongoOperator(key)) {
      console.warn(`🚨 [Security Alert] Blocked suspicious NoSQL operator key: "${key}"`)
      continue // Strip dangerous operator
    }

    if (val && typeof val === 'object') {
      cleaned[key] = sanitizeObject(val, depth + 1)
    } else {
      cleaned[key] = val
    }
  }
  return cleaned
}

export const mongoSanitize = (req, res, next) => {
  if (req.body) {
    req.body = sanitizeObject(req.body)
  }
  if (req.query) {
    req.query = sanitizeObject(req.query)
  }
  if (req.params) {
    req.params = sanitizeObject(req.params)
  }
  next()
}

/**
 * 3. Cross-Site Scripting (XSS) Input Sanitization
 * Strips script tags, javascript: protocols, and malicious event handlers from user text inputs.
 */
const cleanXssString = (val) => {
  if (typeof val !== 'string') return val
  return val
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove <script>...</script>
    .replace(/javascript:/gi, '') // Remove javascript: pseudo-protocol
    .replace(/onload\s*=/gi, '')
    .replace(/onerror\s*=/gi, '')
    .replace(/onclick\s*=/gi, '')
}

const sanitizeXss = (obj, depth = 0) => {
  if (!obj || typeof obj !== 'object' || depth > 10) return obj

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeXss(item, depth + 1))
  }

  const cleaned = {}
  for (const [key, val] of Object.entries(obj)) {
    if (typeof val === 'string') {
      cleaned[key] = cleanXssString(val)
    } else if (val && typeof val === 'object') {
      cleaned[key] = sanitizeXss(val, depth + 1)
    } else {
      cleaned[key] = val
    }
  }
  return cleaned
}

export const xssSanitize = (req, res, next) => {
  if (req.body) {
    req.body = sanitizeXss(req.body)
  }
  next()
}

/**
 * 4. Lightweight Cookie Parser Middleware
 * Parses incoming cookies into req.cookies for httpOnly secure auth cookies.
 */
export const cookieParser = (req, res, next) => {
  req.cookies = {}
  const cookieHeader = req.headers.cookie

  if (cookieHeader) {
    const pairs = cookieHeader.split(';')
    for (const pair of pairs) {
      const idx = pair.indexOf('=')
      if (idx !== -1) {
        const name = pair.substring(0, idx).trim()
        const val = pair.substring(idx + 1).trim()
        if (name) {
          try {
            req.cookies[name] = decodeURIComponent(val)
          } catch (e) {
            req.cookies[name] = val
          }
        }
      }
    }
  }
  next()
}

export default {
  securityHeaders,
  mongoSanitize,
  xssSanitize,
  cookieParser,
}

