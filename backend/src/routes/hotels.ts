import { Router } from 'express'
import { searchHotels, getHotelDetails, getHotelRooms } from '../controllers/hotelController'
import { validateHotelSearch, validateUUID } from '../middleware/validation'
import { optionalAuth } from '../middleware/auth'

const router: Router = Router()

// Public routes (with optional authentication)
router.get('/search', validateHotelSearch, optionalAuth, searchHotels)
router.get('/:hotelId', validateUUID('hotelId'), optionalAuth, getHotelDetails)
router.get('/:hotelId/rooms', validateUUID('hotelId'), optionalAuth, getHotelRooms)

export default router