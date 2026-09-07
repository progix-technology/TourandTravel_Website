import express from 'express'
import {
  getReviews,
  updateReviewStatus,
  deleteReview
} from '../controllers/reviewController.js'
import { protect, authorize } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', protect, authorize('admin'), getReviews)
router.patch('/:id/status', protect, authorize('admin'), updateReviewStatus)
router.delete('/:id', protect, authorize('admin'), deleteReview)

export default router
