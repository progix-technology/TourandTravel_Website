import express from 'express'
import upload from '../middleware/uploadMiddleware.js'
import { uploadImage } from '../controllers/uploadController.js'
import { protect, authorize } from '../middleware/authMiddleware.js'

const router = express.Router()

// Allow authenticated admins and users to upload images
router.post('/', protect, upload.single('image'), uploadImage)

export default router
