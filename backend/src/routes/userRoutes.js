import express from 'express'
import {
  getUserWishlist,
  toggleWishlist,
  syncWishlist,
  getAllUsers,
  deleteUser
} from '../controllers/userController.js'
import { protect, authorize } from '../middleware/authMiddleware.js'

const router = express.Router()

// User Wishlist Routes
router.get('/wishlist', protect, getUserWishlist)
router.post('/wishlist/toggle', protect, toggleWishlist)
router.post('/wishlist/sync', protect, syncWishlist)

// Admin routes
router.get('/', protect, authorize('admin'), getAllUsers)
router.delete('/:id', protect, authorize('admin'), deleteUser)

export default router
