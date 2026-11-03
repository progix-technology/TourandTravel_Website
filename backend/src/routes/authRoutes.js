import express from 'express'
import { register, login, adminLogin, getMe, logout } from '../controllers/authController.js'
import { protect } from '../middleware/authMiddleware.js'
import { validateLogin, validateRegister } from '../middleware/validatorMiddleware.js'

const router = express.Router()

router.post('/register', validateRegister, register)
router.post('/login', validateLogin, login)
router.post('/admin-login', validateLogin, adminLogin)
router.get('/logout', logout)
router.get('/me', protect, getMe)

export default router
