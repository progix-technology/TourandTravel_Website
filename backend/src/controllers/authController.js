import User from '../models/User.js'
import Admin from '../models/Admin.js'

// Helper to send token response + set secure httpOnly cookie
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken()

  const cookieOptions = [
    `token=${encodeURIComponent(token)}`,
    `Path=/`,
    `HttpOnly`,
    `SameSite=Strict`,
    `Max-Age=${30 * 24 * 60 * 60}`, // 30 days
  ]
  if (process.env.NODE_ENV === 'production') {
    cookieOptions.push('Secure')
  }

  res.setHeader('Set-Cookie', cookieOptions.join('; '))

  res.status(statusCode).json({
    success: true,
    token, // Send in body for backward compatibility
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      membership: user.membership,
      avatar: user.avatar,
      rewardPoints: user.rewardPoints,
      joinedDate: user.createdAt,
    },
  })
}

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, password, phone } = req.body
    const email = req.body.email ? req.body.email.trim().toLowerCase() : ''

    // Check if email already registered in either collection
    const existingUser = await User.findOne({ email })
    const existingAdmin = await Admin.findOne({ email })
    
    if (existingUser || existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists.',
      })
    }

    // Create user
    const user = await User.create({
      name: name ? name.trim() : '',
      email,
      password: password ? password.trim() : '',
      phone: phone ? phone.trim() : '',
    })

    sendTokenResponse(user, 201, res)
  } catch (error) {
    next(error)
  }
}

// @desc    Customer Login ONLY (Rejects admin logins on customer portal)
// @route   POST /api/v1/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const email = req.body.email ? req.body.email.trim().toLowerCase() : ''
    const password = req.body.password ? req.body.password.trim() : ''

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email and password',
      })
    }

    // Check in User collection
    const user = await User.findOne({ email }).select('+password')

    if (!user) {
      // Check if this is an Admin trying to log in on customer portal
      const isAdminAccount = await Admin.findOne({ email })
      if (isAdminAccount) {
        return res.status(403).json({
          success: false,
          isAdminRedirect: true,
          message: 'Admin accounts cannot log in through the customer portal. Please access the secure Administrator Portal at /admin/login.',
        })
      }

      return res.status(401).json({
        success: false,
        message: 'Invalid email or password. Please verify your credentials.',
      })
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password)

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password. Please verify your credentials.',
      })
    }

    sendTokenResponse(user, 200, res)
  } catch (error) {
    next(error)
  }
}

// @desc    Dedicated Sovereign Admin Login (Restricted to platform administrators)
// @route   POST /api/v1/auth/admin-login
// @access  Public (Admin Only)
export const adminLogin = async (req, res, next) => {
  try {
    const email = req.body.email ? req.body.email.trim().toLowerCase() : ''
    const password = req.body.password ? req.body.password.trim() : ''

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Administrative email and password are required',
      })
    }

    // Search strictly in Admin collection
    const admin = await Admin.findOne({ email }).select('+password')

    if (!admin) {
      // Check if a regular customer is trying to break into admin portal
      const regularUser = await User.findOne({ email })
      if (regularUser) {
        return res.status(403).json({
          success: false,
          message: 'Access Denied: Customer accounts cannot access the Administrator Terminal. Please log in at /login.',
        })
      }

      return res.status(401).json({
        success: false,
        message: 'Invalid administrative credentials.',
      })
    }

    const isMatch = await admin.matchPassword(password)

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid administrative credentials.',
      })
    }

    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip || 'unknown'
    console.log(`🔐 [Admin Gatekeeper] Super Admin Authorized: ${admin.email} from IP: ${clientIp}`)

    sendTokenResponse(admin, 200, res)
  } catch (error) {
    next(error)
  }
}

// @desc    Log user out / clear cookie
// @route   GET /api/v1/auth/logout
// @access  Public
export const logout = async (req, res) => {
  res.setHeader(
    'Set-Cookie',
    'token=none; Path=/; HttpOnly; SameSite=Strict; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
  )
  res.status(200).json({
    success: true,
    message: 'User logged out successfully',
  })
}

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    let user;
    if (req.user.role === 'admin') {
      user = await Admin.findById(req.user.id)
    } else {
      user = await User.findById(req.user.id)
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user,
    })
  } catch (error) {
    next(error)
  }
}
