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
 * Recursively scans and strips keys starting with '$' or containing '.' in-place
 * from req.body, req.query, and req.params without reassigning getter-only properties.
 */
const hasMongoOperator = (str) => {
  return typeof str === 'string' && (str.startsWith('$') || str.includes('.'))
}

const sanitizeInPlace = (obj, depth = 0) => {
  if (!obj || typeof obj !== 'object' || depth > 10) return

  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      if (typeof obj[i] === 'object' && obj[i] !== null) {
        sanitizeInPlace(obj[i], depth + 1)
      }
    }
    return
  }

  for (const key of Object.keys(obj)) {
    if (hasMongoOperator(key)) {
      console.warn(`🚨 [Security Alert] Blocked suspicious NoSQL operator key: "${key}"`)
      delete obj[key]
      continue
    }
    if (obj[key] && typeof obj[key] === 'object') {
      sanitizeInPlace(obj[key], depth + 1)
    }
  }
}

export const mongoSanitize = (req, res, next) => {
  try {
    if (req.body && typeof req.body === 'object') {
      sanitizeInPlace(req.body)
    }
    if (req.query && typeof req.query === 'object') {
      sanitizeInPlace(req.query)
    }
    if (req.params && typeof req.params === 'object') {
      sanitizeInPlace(req.params)
    }
  } catch (err) {
    console.warn('mongoSanitize warning:', err)
  }
  next()
}

/**
 * 3. Cross-Site Scripting (XSS) Input Sanitization
 * Strips script tags, javascript: protocols, and malicious event handlers from user text inputs in-place.
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

const sanitizeXssInPlace = (obj, depth = 0) => {
  if (!obj || typeof obj !== 'object' || depth > 10) return

  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      if (typeof obj[i] === 'string') {
        obj[i] = cleanXssString(obj[i])
      } else if (typeof obj[i] === 'object' && obj[i] !== null) {
        sanitizeXssInPlace(obj[i], depth + 1)
      }
    }
    return
  }

  for (const key of Object.keys(obj)) {
    if (typeof obj[key] === 'string') {
      obj[key] = cleanXssString(obj[key])
    } else if (obj[key] && typeof obj[key] === 'object') {
      sanitizeXssInPlace(obj[key], depth + 1)
    }
  }
}

export const xssSanitize = (req, res, next) => {
  try {
    if (req.body && typeof req.body === 'object') {
      sanitizeXssInPlace(req.body)
    }
    if (req.params && typeof req.params === 'object') {
      sanitizeXssInPlace(req.params)
    }
  } catch (err) {
    console.warn('xssSanitize warning:', err)
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

