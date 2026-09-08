import express from 'express'
import {
  getDestinations,
  getDestinationBySlug,
  getDestinationsByCountry,
  deleteDestination,
  createDestination,
  updateDestination,
} from '../controllers/destinationController.js'
import { protect, authorize } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', getDestinations)
router.get('/country/:country', getDestinationsByCountry)
router.get('/:slug', getDestinationBySlug)

// Admin routes
router.post('/', protect, authorize('admin'), createDestination)
router.put('/:id', protect, authorize('admin'), updateDestination)
router.delete('/:id', protect, authorize('admin'), deleteDestination)

export default router
