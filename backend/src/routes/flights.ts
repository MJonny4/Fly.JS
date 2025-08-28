import { Router } from 'express'
import { searchFlights, getFlightDetails, getFlightSeats, getAirlines, getAirports } from '../controllers/flightController'
import { validateFlightSearch, validateUUID } from '../middleware/validation'
import { optionalAuth } from '../middleware/auth'

const router: Router = Router()

// Public routes (with optional authentication)
router.get('/search', validateFlightSearch, optionalAuth, searchFlights)
router.get('/airlines', optionalAuth, getAirlines)
router.get('/airports', optionalAuth, getAirports)
router.get('/:flightId', validateUUID('flightId'), optionalAuth, getFlightDetails)
router.get('/:flightId/seats', validateUUID('flightId'), optionalAuth, getFlightSeats)

export default router