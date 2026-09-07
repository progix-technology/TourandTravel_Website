import express from 'express'
import {
  createBooking,
  getUserBookings,
  cancelBooking,
  getAllBookings,
  updateBookingStatus
} from '../controllers/bookingController.js'
import { protect, authorize } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/', createBooking)
router.get('/my', protect, getUserBookings)
router.patch('/:id/cancel', protect, cancelBooking)

// Admin routes
router.get('/', protect, authorize('admin'), getAllBookings)
router.patch('/:id/status', protect, authorize('admin'), updateBookingStatus)

export default router
