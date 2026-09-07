import express from 'express'
import {
  getBlogs,
  createBlog,
  updateBlog,
  deleteBlog
} from '../controllers/blogController.js'
import { protect, authorize } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', getBlogs)

// Admin routes
router.post('/', protect, authorize('admin'), createBlog)
router.put('/:id', protect, authorize('admin'), updateBlog)
router.delete('/:id', protect, authorize('admin'), deleteBlog)

export default router
