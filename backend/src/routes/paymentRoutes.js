import express from 'express'
import {
  getRazorpayKey,
  createRazorpayOrder,
  verifyRazorpayPayment,
  getAdminPaymentSettings,
  updateAdminPaymentSettings,
  handleRazorpayWebhook,
} from '../controllers/paymentController.js'
import { protect, authorize } from '../middleware/authMiddleware.js'

const router = express.Router()

// Public checkout payment routes
router.get('/razorpay-key', getRazorpayKey)
router.post('/create-order', createRazorpayOrder)
router.post('/verify', verifyRazorpayPayment)
router.post('/webhook', handleRazorpayWebhook)

// Admin Dashboard Payment Configuration routes
router.get('/admin-settings', protect, authorize('admin'), getAdminPaymentSettings)
router.put('/admin-settings', protect, authorize('admin'), updateAdminPaymentSettings)

export default router

