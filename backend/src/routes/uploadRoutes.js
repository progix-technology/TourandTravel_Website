import express from 'express'
import upload from '../middleware/uploadMiddleware.js'
import { uploadImage } from '../controllers/uploadController.js'
import { protect, authorize } from '../middleware/authMiddleware.js'

const router = express.Router()

// Only admins can upload images
router.post('/', protect, authorize('admin'), upload.single('image'), uploadImage)

export default router
