import { Router } from 'express'
import { createBooking, getUserBookings, getBookingDetails, cancelBooking } from '../controllers/bookingController'
import { validateBooking, validateUUID } from '../middleware/validation'
import { verifyToken } from '../middleware/auth'

const router: Router = Router()

// All booking routes require authentication
router.use(verifyToken)

router.post('/', validateBooking, createBooking)
router.get('/', getUserBookings)
router.get('/:bookingId', validateUUID('bookingId'), getBookingDetails)
router.patch('/:bookingId/cancel', validateUUID('bookingId'), cancelBooking)

export default router