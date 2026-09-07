import express from 'express'
import {
  getCoupons,
  createCoupon,
  updateCouponStatus,
  deleteCoupon
} from '../controllers/couponController.js'
import { protect, authorize } from '../middleware/authMiddleware.js'

const router = express.Router()

// Admin routes
router.get('/', protect, authorize('admin'), getCoupons)
router.post('/', protect, authorize('admin'), createCoupon)
router.patch('/:id/status', protect, authorize('admin'), updateCouponStatus)
router.delete('/:id', protect, authorize('admin'), deleteCoupon)

export default router
