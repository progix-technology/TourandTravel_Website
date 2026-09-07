import express from 'express'
import {
  submitCustomTrip,
  getCustomTrips,
  updateCustomTrip,
  updateCustomTripStatus,
  deleteCustomTrip,
} from '../controllers/customTripController.js'
import { protect, authorize } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/', submitCustomTrip)
router.get('/', protect, getCustomTrips) // Handles both admin and user via controller logic

// Admin routes
router.put('/:id', protect, authorize('admin'), updateCustomTrip)
router.patch('/:id/status', protect, authorize('admin'), updateCustomTripStatus)
router.delete('/:id', protect, authorize('admin'), deleteCustomTrip)

export default router
