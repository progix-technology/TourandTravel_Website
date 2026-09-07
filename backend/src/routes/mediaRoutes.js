import express from 'express'
import {
  getMedia,
  createMedia,
  updateMedia,
  deleteMedia
} from '../controllers/mediaController.js'
import { protect, authorize } from '../middleware/authMiddleware.js'

const router = express.Router()

// Public route for gallery viewers
router.get('/', getMedia)

// Admin protected routes
router.post('/', protect, authorize('admin'), createMedia)
router.put('/:id', protect, authorize('admin'), updateMedia)
router.delete('/:id', protect, authorize('admin'), deleteMedia)

export default router
