import express from 'express'
import { getDashboardStats } from '../controllers/dashboardController.js'
import { protect, authorize } from '../middleware/authMiddleware.js'

const router = express.Router()

// @route   GET /api/v1/dashboard
router.route('/').get(protect, authorize('admin'), getDashboardStats)

export default router
