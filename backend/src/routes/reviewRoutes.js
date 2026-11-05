import express from 'express'
import {
  getReviews,
  getPublicReviews,
  updateReviewStatus,
  deleteReview
} from '../controllers/reviewController.js'
import { protect, authorize } from '../middleware/authMiddleware.js'

const router = express.Router()

// Public endpoint to show approved client reviews on website
router.get('/public', getPublicReviews)

// Admin management endpoints
router.get('/', protect, authorize('admin'), getReviews)
router.patch('/:id/status', protect, authorize('admin'), updateReviewStatus)
router.delete('/:id', protect, authorize('admin'), deleteReview)

export default router
