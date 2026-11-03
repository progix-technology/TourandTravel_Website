import express from 'express'
import { submitContactMessage, getAllEnquiries, updateEnquiryStatus, deleteEnquiry } from '../controllers/contactController.js'
import { protect, authorize } from '../middleware/authMiddleware.js'
import { validateContact } from '../middleware/validatorMiddleware.js'

const router = express.Router()

router.post('/', validateContact, submitContactMessage)

// Admin routes
router.get('/', protect, authorize('admin'), getAllEnquiries)
router.patch('/:id/status', protect, authorize('admin'), updateEnquiryStatus)
router.delete('/:id', protect, authorize('admin'), deleteEnquiry)

export default router
