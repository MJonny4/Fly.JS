import { Request, Response, NextFunction } from 'express'
import { body, param, query, validationResult } from 'express-validator'

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: 'Validation failed',
            details: errors.array()
        })
    }
    next()
}

// User validation rules
export const validateUserRegistration = [
    body('firstName')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('First name must be between 2 and 50 characters'),
    body('lastName')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Last name must be between 2 and 50 characters'),
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
    body('phoneNumber')
        .optional()
        .isMobilePhone('any')
        .withMessage('Please provide a valid phone number'),
    body('dateOfBirth')
        .optional()
        .isDate()
        .withMessage('Please provide a valid date of birth'),
    body('passportNumber')
        .optional()
        .isLength({ min: 6, max: 20 })
        .withMessage('Passport number must be between 6 and 20 characters'),
    body('nationality')
        .optional()
        .isLength({ min: 2, max: 50 })
        .withMessage('Nationality must be between 2 and 50 characters'),
    handleValidationErrors
]

export const validateUserLogin = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
    handleValidationErrors
]

// Flight search validation
export const validateFlightSearch = [
    query('from')
        .notEmpty()
        .isLength({ min: 3, max: 3 })
        .withMessage('Departure airport code must be 3 characters'),
    query('to')
        .notEmpty()
        .isLength({ min: 3, max: 3 })
        .withMessage('Arrival airport code must be 3 characters'),
    query('departureDate')
        .notEmpty()
        .isDate()
        .withMessage('Please provide a valid departure date'),
    query('returnDate')
        .optional()
        .isDate()
        .withMessage('Please provide a valid return date'),
    query('passengers')
        .optional()
        .isInt({ min: 1, max: 9 })
        .withMessage('Number of passengers must be between 1 and 9'),
    query('class')
        .optional()
        .isIn(['economy', 'business', 'first'])
        .withMessage('Flight class must be economy, business, or first'),
    handleValidationErrors
]

// Booking validation
export const validateBooking = [
    body('flightId')
        .optional()
        .isUUID()
        .withMessage('Flight ID must be a valid UUID'),
    body('seatId')
        .optional()
        .isUUID()
        .withMessage('Seat ID must be a valid UUID'),
    body('hotelRoomId')
        .optional()
        .isUUID()
        .withMessage('Hotel room ID must be a valid UUID'),
    body('carId')
        .optional()
        .isUUID()
        .withMessage('Car ID must be a valid UUID'),
    body('passengerName')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Passenger name must be between 2 and 100 characters'),
    body('passengerEmail')
        .optional()
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid passenger email'),
    body('passengerPhone')
        .optional()
        .isMobilePhone('any')
        .withMessage('Please provide a valid passenger phone number'),
    handleValidationErrors
]

// Hotel search validation
export const validateHotelSearch = [
    query('city')
        .notEmpty()
        .isLength({ min: 2, max: 50 })
        .withMessage('City must be between 2 and 50 characters'),
    query('checkIn')
        .notEmpty()
        .isDate()
        .withMessage('Please provide a valid check-in date'),
    query('checkOut')
        .notEmpty()
        .isDate()
        .withMessage('Please provide a valid check-out date'),
    query('guests')
        .optional()
        .isInt({ min: 1, max: 10 })
        .withMessage('Number of guests must be between 1 and 10'),
    handleValidationErrors
]

// Car rental search validation
export const validateCarSearch = [
    query('location')
        .notEmpty()
        .isLength({ min: 2, max: 100 })
        .withMessage('Location must be between 2 and 100 characters'),
    query('pickupDate')
        .notEmpty()
        .isDate()
        .withMessage('Please provide a valid pickup date'),
    query('dropoffDate')
        .notEmpty()
        .isDate()
        .withMessage('Please provide a valid dropoff date'),
    query('category')
        .optional()
        .isIn(['economy', 'compact', 'intermediate', 'standard', 'full-size', 'premium', 'luxury', 'suv', 'convertible'])
        .withMessage('Invalid car category'),
    handleValidationErrors
]

// UUID parameter validation
export const validateUUID = (paramName: string) => [
    param(paramName)
        .isUUID()
        .withMessage(`${paramName} must be a valid UUID`),
    handleValidationErrors
]