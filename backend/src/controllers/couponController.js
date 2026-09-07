import Coupon from '../models/Coupon.js'

// @desc    Get all coupons (Admin)
// @route   GET /api/v1/coupons
// @access  Private/Admin
export const getCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find().sort('-createdAt')
    
    res.status(200).json({
      success: true,
      count: coupons.length,
      data: coupons
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Create new coupon (Admin)
// @route   POST /api/v1/coupons
// @access  Private/Admin
export const createCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.create(req.body)
    
    res.status(201).json({
      success: true,
      data: coupon
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update coupon status (Admin)
// @route   PATCH /api/v1/coupons/:id/status
// @access  Private/Admin
export const updateCouponStatus = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id)

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      })
    }

    coupon.isActive = req.body.isActive
    await coupon.save()

    res.status(200).json({
      success: true,
      data: coupon
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete coupon (Admin)
// @route   DELETE /api/v1/coupons/:id
// @access  Private/Admin
export const deleteCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id)

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      })
    }

    await Coupon.findByIdAndDelete(req.params.id)

    res.status(200).json({
      success: true,
      data: {}
    })
  } catch (error) {
    next(error)
  }
}
