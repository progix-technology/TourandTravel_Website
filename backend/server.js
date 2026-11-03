// Tours & Travellers Backend Server - Active
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import mongoose from 'mongoose'
import connectDB from './src/config/db.js'
import errorHandler from './src/middleware/errorMiddleware.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables (supports running from backend/ or workspace root)
dotenv.config({ path: path.resolve(__dirname, '.env') })
dotenv.config()

// Import Routes
import authRoutes from './src/routes/authRoutes.js'
import tourRoutes from './src/routes/tourRoutes.js'
import destinationRoutes from './src/routes/destinationRoutes.js'
import bookingRoutes from './src/routes/bookingRoutes.js'
import customTripRoutes from './src/routes/customTripRoutes.js'
import contactRoutes from './src/routes/contactRoutes.js'
import userRoutes from './src/routes/userRoutes.js'
import reviewRoutes from './src/routes/reviewRoutes.js'
import blogRoutes from './src/routes/blogRoutes.js'
import couponRoutes from './src/routes/couponRoutes.js'
import mediaRoutes from './src/routes/mediaRoutes.js'
import dashboardRoutes from './src/routes/dashboardRoutes.js'
import uploadRoutes from './src/routes/uploadRoutes.js'
import paymentRoutes from './src/routes/paymentRoutes.js'
import {
  globalApiLimiter,
  authLimiter,
  bookingLimiter,
  paymentLimiter,
} from './src/middleware/rateLimitMiddleware.js'
import {
  securityHeaders,
  mongoSanitize,
  xssSanitize,
  cookieParser,
} from './src/middleware/securityMiddleware.js'

// Connect to Database
connectDB()

const app = express()

// 1. Enterprise Security Headers (Helmet Equivalent)
app.use(securityHeaders)

// 2. Native Cookie Parser (for secure httpOnly auth cookies)
app.use(cookieParser)

// 3. Strict Production CORS Policy
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
].filter(Boolean)

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, postman, direct server calls)
      if (!origin) return callback(null, true)

      const isAllowed =
        allowedOrigins.some((allowed) => allowed === origin) ||
        (process.env.NODE_ENV === 'production' && origin.endsWith('.vercel.app')) ||
        process.env.NODE_ENV !== 'production'

      if (isAllowed) {
        return callback(null, true)
      }

      // Strict rejection in production for unauthorized domains
      console.warn(`[CORS Blocked] Unauthorized origin attempted access: ${origin}`)
      return callback(new Error('Access Denied by Strict CORS Policy'), false)
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['RateLimit-Limit', 'RateLimit-Remaining', 'RateLimit-Reset', 'Retry-After'],
  })
)

// Body Parsers
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// 4. NoSQL Operator Injection Sanitization ($ and . removal)
app.use(mongoSanitize)

// 5. Cross-Site Scripting (XSS) Sanitization
app.use(xssSanitize)

// Serve uploads folder statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// Health Check Endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Tours & Travels REST API',
    version: '1.0.0',
    status: 'Active',
    endpoints: {
      auth: '/api/v1/auth',
      users: '/api/v1/users',
      tours: '/api/v1/tours',
      destinations: '/api/v1/destinations',
      bookings: '/api/v1/bookings',
      customTrips: '/api/v1/custom-trips',
      contact: '/api/v1/contact',
      reviews: '/api/v1/reviews',
      blogs: '/api/v1/blogs',
      coupons: '/api/v1/coupons',
      media: '/api/v1/media',
    },
  })
})

app.get('/api/v1/health', (req, res) => {
  const dbState = mongoose.connection.readyState
  const statusMap = { 0: 'Disconnected', 1: 'Connected', 2: 'Connecting', 3: 'Disconnecting' }
  res.json({
    status: 'OK',
    database: statusMap[dbState] || 'Unknown',
    dbReadyState: dbState,
    dbHost: mongoose.connection.host || 'none',
    timestamp: new Date().toISOString(),
  })
})

// Apply Global Rate Limiting across all /api/v1 endpoints
app.use('/api/v1', globalApiLimiter)

// Mount API Routes with specialized security tiers
app.use('/api/v1/auth', authLimiter, authRoutes)
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/tours', tourRoutes)
app.use('/api/v1/destinations', destinationRoutes)
app.use('/api/v1/bookings', bookingLimiter, bookingRoutes)
app.use('/api/v1/custom-trips', bookingLimiter, customTripRoutes)
app.use('/api/v1/contact', bookingLimiter, contactRoutes)
app.use('/api/v1/reviews', reviewRoutes)
app.use('/api/v1/blogs', blogRoutes)
app.use('/api/v1/coupons', couponRoutes)
app.use('/api/v1/media', mediaRoutes)
app.use('/api/v1/dashboard', dashboardRoutes)
app.use('/api/v1/upload', uploadRoutes)
app.use('/api/v1/payment', paymentLimiter, paymentRoutes)

// Centralized Error Handling Middleware
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`\n======================================================`)
  console.log(`🚀 Tours & Travels Backend Running on Port ${PORT}`)
  console.log(`🌐 Base API URL: http://localhost:${PORT}/api/v1`)
  console.log(`✨ Mode: ${process.env.NODE_ENV || 'development'}`)
  console.log(`======================================================\n`)
})

export default app
