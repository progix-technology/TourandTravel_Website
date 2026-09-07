import User from '../models/User.js'
import Admin from '../models/Admin.js'

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

    const token = user.getSignedJwtToken()

    res.status(201).json({
      success: true,
      token,
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
  } catch (error) {
    next(error)
  }
}

// @desc    Login user or admin
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

    // Check for admin first
    let user = await Admin.findOne({ email }).select('+password')
    let isUserAdmin = true

    // If not admin, check for user
    if (!user) {
      user = await User.findOne({ email }).select('+password')
      isUserAdmin = false
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please verify your email and password.',
      })
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password)

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please verify your email and password.',
      })
    }

    const token = user.getSignedJwtToken()

    res.status(200).json({
      success: true,
      token,
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
  } catch (error) {
    next(error)
  }
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
