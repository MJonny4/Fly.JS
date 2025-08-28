import { Router } from 'express'
import { register, login, getProfile, updateProfile } from '../controllers/authController'
import { validateUserRegistration, validateUserLogin } from '../middleware/validation'
import { verifyToken } from '../middleware/auth'

const router: Router = Router()

// Public routes
router.post('/register', validateUserRegistration, register)
router.post('/login', validateUserLogin, login)

// Protected routes
router.get('/profile', verifyToken, getProfile)
router.put('/profile', verifyToken, updateProfile)

export default router