import { Router } from 'express'
import { searchCars, getCarDetails, getCarCategories, getRentalCompanies } from '../controllers/carController'
import { validateCarSearch, validateUUID } from '../middleware/validation'
import { optionalAuth } from '../middleware/auth'

const router: Router = Router()

// Public routes (with optional authentication)
router.get('/search', validateCarSearch, optionalAuth, searchCars)
router.get('/categories', optionalAuth, getCarCategories)
router.get('/companies', optionalAuth, getRentalCompanies)
router.get('/:carId', validateUUID('carId'), optionalAuth, getCarDetails)

export default router