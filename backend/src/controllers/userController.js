import User from '../models/User.js'

// @desc    Get user wishlist
// @route   GET /api/v1/users/wishlist
// @access  Private
export const getUserWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    res.status(200).json({
      success: true,
      data: user.wishlist || [],
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Toggle item in user wishlist (Add/Remove)
// @route   POST /api/v1/users/wishlist/toggle
// @access  Private
export const toggleWishlist = async (req, res, next) => {
  try {
    const { tourId } = req.body
    if (!tourId) {
      return res.status(400).json({ success: false, message: 'Tour ID is required' })
    }

    const user = await User.findById(req.user._id)
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    const existsIndex = user.wishlist.indexOf(tourId)
    let action = 'added'

    if (existsIndex > -1) {
      user.wishlist.splice(existsIndex, 1)
      action = 'removed'
    } else {
      user.wishlist.push(tourId)
    }

    await user.save()

    res.status(200).json({
      success: true,
      action,
      data: user.wishlist,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Sync local guest wishlist with database on login
// @route   POST /api/v1/users/wishlist/sync
// @access  Private
export const syncWishlist = async (req, res, next) => {
  try {
    const { tourIds } = req.body
    const user = await User.findById(req.user._id)

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    if (Array.isArray(tourIds) && tourIds.length > 0) {
      const combined = Array.from(new Set([...(user.wishlist || []), ...tourIds]))
      user.wishlist = combined
      await user.save()
    }

    res.status(200).json({
      success: true,
      data: user.wishlist || [],
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get all users (Admin)
// @route   GET /api/v1/users
// @access  Private/Admin
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort('-createdAt')
    
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete user (Admin)
// @route   DELETE /api/v1/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User not found with id of ${req.params.id}`
      })
    }

    await User.findByIdAndDelete(req.params.id)

    res.status(200).json({
      success: true,
      data: {}
    })
  } catch (error) {
    next(error)
  }
}
