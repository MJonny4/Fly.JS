import { Router } from 'express'
import { getMeals, getMealDetails, getMealsByType } from '../controllers/mealController'
import { validateUUID } from '../middleware/validation'
import { optionalAuth } from '../middleware/auth'

const router: Router = Router()

// Public routes (with optional authentication)
router.get('/', optionalAuth, getMeals)
router.get('/by-type', optionalAuth, getMealsByType)
router.get('/:mealId', validateUUID('mealId'), optionalAuth, getMealDetails)

export default router