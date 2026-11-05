import express from 'express'
import upload from '../middleware/uploadMiddleware.js'
import { uploadImage } from '../controllers/uploadController.js'

const router = express.Router()

// Multer processes 'image' buffer -> Controller uploads to Cloudinary (folder: tours-and-travellers)
router.post('/', upload.single('image'), uploadImage)

export default router
