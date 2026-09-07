import jwt from 'jsonwebtoken'
import User from '../models/User.js'

import Admin from '../models/Admin.js'

// Protect routes
export const protect = async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]
  }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route. Please login first.',
    })
  }

  try {
    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'tours_and_travellers_super_secret_jwt_key_2026_luxury_voyages'
    )

    if (decoded.role === 'admin') {
      req.user = await Admin.findById(decoded.id)
    } else {
      req.user = await User.findById(decoded.id)
    }

    if (!req.user) {
      // Mock user fallback if token is a valid mock
      req.user = { _id: decoded.id, name: 'Explorer', email: decoded.email, role: decoded.role || 'user' }
    }
    next()
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token',
    })
  }
}

// Grant access to specific roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`,
      })
    }
    next()
  }
}
