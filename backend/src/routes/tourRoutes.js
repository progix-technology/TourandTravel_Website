import express from 'express'
import {
  getTours,
  getTourBySlug,
  createTour,
  updateTour,
  deleteTour,
} from '../controllers/tourController.js'
import { protect, authorize } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', getTours)
router.get('/:slug', getTourBySlug)

// Admin routes
router.post('/', protect, authorize('admin'), createTour)
router.put('/:id', protect, authorize('admin'), updateTour)
router.delete('/:id', protect, authorize('admin'), deleteTour)

export default router
