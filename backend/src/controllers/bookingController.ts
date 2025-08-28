import { Request, Response } from 'express'
import { Transaction } from 'sequelize'
import { sequelize, Booking, FlightBooking, HotelBooking, CarRental, MealBooking, Flight, Seat, HotelRoom, Car, Meal } from '../models'
import { AuthRequest } from '../middleware/auth'
import { logger } from '../utils/logger'
import { v4 as uuidv4 } from 'uuid'

const generateBookingReference = (): string => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const numbers = '0123456789'
    let result = ''
    
    // Generate 2 letters
    for (let i = 0; i < 2; i++) {
        result += letters.charAt(Math.floor(Math.random() * letters.length))
    }
    
    // Generate 4 numbers
    for (let i = 0; i < 4; i++) {
        result += numbers.charAt(Math.floor(Math.random() * numbers.length))
    }
    
    return result
}

export const createBooking = async (req: AuthRequest, res: Response) => {
    const transaction: Transaction = await sequelize.transaction()
    
    try {
        const userId = req.user.id
        const {
            flightBooking,
            hotelBooking,
            carRental,
            mealBookings = []
        } = req.body

        let totalAmount = 0
        const bookingReference = generateBookingReference()

        // Create main booking
        const booking = await Booking.create({
            id: uuidv4(),
            userId,
            bookingReference,
            totalAmount: 0, // Will be updated after calculating all items
            status: 'pending',
            paymentStatus: 'pending',
            bookingDate: new Date()
        }, { transaction })

        const bookingItems = []

        // Handle flight booking
        if (flightBooking) {
            const flight = await Flight.findByPk(flightBooking.flightId, { transaction })
            if (!flight) {
                throw new Error('Flight not found')
            }

            if (flight.availableSeats < 1) {
                throw new Error('No available seats on this flight')
            }

            let seatPrice = 0
            let seat = null

            // Handle seat selection
            if (flightBooking.seatId) {
                seat = await Seat.findByPk(flightBooking.seatId, { transaction })
                if (!seat || !seat.isAvailable) {
                    throw new Error('Selected seat is not available')
                }
                seatPrice = parseFloat(seat.price.toString())

                // Mark seat as unavailable
                await seat.update({ isAvailable: false }, { transaction })
            }

            const flightPrice = parseFloat(flight.economyClassPrice.toString())
            const flightBookingRecord = await FlightBooking.create({
                id: uuidv4(),
                bookingId: booking.id,
                flightId: flightBooking.flightId,
                seatId: flightBooking.seatId || null,
                passengerName: flightBooking.passengerName,
                passengerEmail: flightBooking.passengerEmail,
                passengerPhone: flightBooking.passengerPhone || null,
                passengerPassport: flightBooking.passengerPassport || null,
                flightPrice,
                seatPrice
            }, { transaction })

            totalAmount += flightPrice + seatPrice
            bookingItems.push({ type: 'flight', item: flightBookingRecord })

            // Update flight available seats
            await flight.update({
                availableSeats: flight.availableSeats - 1
            }, { transaction })

            // Handle meal bookings for this flight
            if (mealBookings.length > 0) {
                for (const mealBooking of mealBookings) {
                    const meal = await Meal.findByPk(mealBooking.mealId, { transaction })
                    if (!meal) {
                        throw new Error(`Meal with ID ${mealBooking.mealId} not found`)
                    }

                    const mealPrice = parseFloat(meal.price.toString())
                    const quantity = mealBooking.quantity || 1
                    const mealTotalPrice = mealPrice * quantity

                    const mealBookingRecord = await MealBooking.create({
                        id: uuidv4(),
                        flightBookingId: flightBookingRecord.id,
                        mealId: mealBooking.mealId,
                        quantity,
                        totalPrice: mealTotalPrice
                    }, { transaction })

                    totalAmount += mealTotalPrice
                    bookingItems.push({ type: 'meal', item: mealBookingRecord })
                }
            }
        }

        // Handle hotel booking
        if (hotelBooking) {
            const hotelRoom = await HotelRoom.findByPk(hotelBooking.hotelRoomId, { transaction })
            if (!hotelRoom || !hotelRoom.isAvailable) {
                throw new Error('Hotel room not found or not available')
            }

            const checkIn = new Date(hotelBooking.checkInDate)
            const checkOut = new Date(hotelBooking.checkOutDate)
            const numberOfNights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))

            if (numberOfNights <= 0) {
                throw new Error('Check-out date must be after check-in date')
            }

            const pricePerNight = parseFloat(hotelRoom.pricePerNight.toString())
            const hotelTotalPrice = pricePerNight * numberOfNights

            const hotelBookingRecord = await HotelBooking.create({
                id: uuidv4(),
                bookingId: booking.id,
                hotelRoomId: hotelBooking.hotelRoomId,
                guestName: hotelBooking.guestName,
                guestEmail: hotelBooking.guestEmail,
                guestPhone: hotelBooking.guestPhone || null,
                checkInDate: checkIn,
                checkOutDate: checkOut,
                numberOfGuests: hotelBooking.numberOfGuests,
                numberOfNights,
                pricePerNight,
                totalPrice: hotelTotalPrice,
                specialRequests: hotelBooking.specialRequests || null
            }, { transaction })

            totalAmount += hotelTotalPrice
            bookingItems.push({ type: 'hotel', item: hotelBookingRecord })
        }

        // Handle car rental
        if (carRental) {
            const car = await Car.findByPk(carRental.carId, { transaction })
            if (!car || !car.isAvailable) {
                throw new Error('Car not found or not available')
            }

            const pickupDate = new Date(carRental.pickupDate)
            const dropoffDate = new Date(carRental.dropoffDate)
            const numberOfDays = Math.ceil((dropoffDate.getTime() - pickupDate.getTime()) / (1000 * 60 * 60 * 24))

            if (numberOfDays <= 0) {
                throw new Error('Drop-off date must be after pickup date')
            }

            const pricePerDay = parseFloat(car.pricePerDay.toString())
            const insuranceCost = carRental.insurance ? 15.00 * numberOfDays : 0 // $15 per day insurance
            const carTotalPrice = (pricePerDay * numberOfDays) + insuranceCost

            const carRentalRecord = await CarRental.create({
                id: uuidv4(),
                bookingId: booking.id,
                carId: carRental.carId,
                renterName: carRental.renterName,
                renterEmail: carRental.renterEmail,
                renterPhone: carRental.renterPhone || null,
                renterLicense: carRental.renterLicense,
                pickupDate: pickupDate,
                dropoffDate: dropoffDate,
                pickupLocation: carRental.pickupLocation,
                dropoffLocation: carRental.dropoffLocation,
                numberOfDays,
                pricePerDay,
                totalPrice: carTotalPrice,
                additionalDrivers: carRental.additionalDrivers || null,
                insurance: carRental.insurance || false,
                insuranceCost
            }, { transaction })

            totalAmount += carTotalPrice
            bookingItems.push({ type: 'car', item: carRentalRecord })

            // Mark car as unavailable for the rental period
            await car.update({ isAvailable: false }, { transaction })
        }

        // Update booking with total amount
        await booking.update({ totalAmount }, { transaction })

        await transaction.commit()

        logger.success('Booking created successfully', {
            userId,
            bookingId: booking.id,
            bookingReference,
            totalAmount,
            itemTypes: bookingItems.map(item => item.type)
        })

        res.status(201).json({
            message: 'Booking created successfully',
            booking: {
                id: booking.id,
                bookingReference,
                totalAmount,
                status: booking.status,
                paymentStatus: booking.paymentStatus,
                bookingDate: booking.bookingDate
            },
            items: bookingItems
        })
    } catch (error) {
        await transaction.rollback()
        logger.error('Booking creation failed', error as Error, { userId: req.user?.id })
        
        const errorMessage = (error as Error).message
        const statusCode = errorMessage.includes('not found') || errorMessage.includes('not available') ? 400 : 500
        
        res.status(statusCode).json({
            error: errorMessage || 'Internal server error during booking creation'
        })
    }
}

export const getUserBookings = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.id
        const { status, limit = 10, offset = 0 } = req.query

        const whereCondition: any = { userId }
        if (status) {
            whereCondition.status = status
        }

        const bookings = await Booking.findAll({
            where: whereCondition,
            include: [
                {
                    model: FlightBooking,
                    as: 'flightBookings',
                    include: [
                        { model: Flight, as: 'flight' },
                        { model: Seat, as: 'seat' },
                        { model: MealBooking, as: 'mealBookings' }
                    ]
                },
                {
                    model: HotelBooking,
                    as: 'hotelBookings',
                    include: [
                        { model: HotelRoom, as: 'hotelRoom' }
                    ]
                },
                {
                    model: CarRental,
                    as: 'carRentals',
                    include: [
                        { model: Car, as: 'car' }
                    ]
                }
            ],
            order: [['createdAt', 'DESC']],
            limit: parseInt(limit as string),
            offset: parseInt(offset as string)
        })

        logger.info('User bookings retrieved', { userId, count: bookings.length })

        res.json({
            bookings,
            total: bookings.length,
            pagination: {
                limit: parseInt(limit as string),
                offset: parseInt(offset as string)
            }
        })
    } catch (error) {
        logger.error('Get user bookings failed', error as Error, { userId: req.user?.id })
        res.status(500).json({
            error: 'Internal server error'
        })
    }
}

export const getBookingDetails = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.id
        const { bookingId } = req.params

        const booking = await Booking.findOne({
            where: {
                id: bookingId,
                userId
            },
            include: [
                {
                    model: FlightBooking,
                    as: 'flightBookings',
                    include: [
                        { model: Flight, as: 'flight' },
                        { model: Seat, as: 'seat' },
                        { model: MealBooking, as: 'mealBookings', include: [{ model: Meal, as: 'meal' }] }
                    ]
                },
                {
                    model: HotelBooking,
                    as: 'hotelBookings',
                    include: [
                        { model: HotelRoom, as: 'hotelRoom' }
                    ]
                },
                {
                    model: CarRental,
                    as: 'carRentals',
                    include: [
                        { model: Car, as: 'car' }
                    ]
                }
            ]
        })

        if (!booking) {
            return res.status(404).json({
                error: 'Booking not found'
            })
        }

        logger.info('Booking details retrieved', { userId, bookingId })

        res.json({
            booking
        })
    } catch (error) {
        logger.error('Get booking details failed', error as Error, { userId: req.user?.id, bookingId: req.params.bookingId })
        res.status(500).json({
            error: 'Internal server error'
        })
    }
}

export const cancelBooking = async (req: AuthRequest, res: Response) => {
    const transaction: Transaction = await sequelize.transaction()
    
    try {
        const userId = req.user.id
        const { bookingId } = req.params

        const booking = await Booking.findOne({
            where: {
                id: bookingId,
                userId
            },
            include: [
                { model: FlightBooking, as: 'flightBookings', include: [{ model: Seat, as: 'seat' }] },
                { model: HotelBooking, as: 'hotelBookings' },
                { model: CarRental, as: 'carRentals' }
            ],
            transaction
        })

        if (!booking) {
            throw new Error('Booking not found')
        }

        if (booking.status === 'cancelled') {
            throw new Error('Booking is already cancelled')
        }

        if (booking.status === 'completed') {
            throw new Error('Cannot cancel a completed booking')
        }

        // Release resources
        for (const flightBooking of booking.flightBookings || []) {
            // Release seat
            if (flightBooking.seat) {
                await flightBooking.seat.update({ isAvailable: true }, { transaction })
            }
            
            // Update flight available seats
            const flight = await Flight.findByPk(flightBooking.flightId, { transaction })
            if (flight) {
                await flight.update({
                    availableSeats: flight.availableSeats + 1
                }, { transaction })
            }
        }

        for (const carRental of booking.carRentals || []) {
            // Release car
            const car = await Car.findByPk(carRental.carId, { transaction })
            if (car) {
                await car.update({ isAvailable: true }, { transaction })
            }
        }

        // Update booking status
        await booking.update({
            status: 'cancelled',
            paymentStatus: booking.paymentStatus === 'paid' ? 'refunded' : 'pending'
        }, { transaction })

        await transaction.commit()

        logger.success('Booking cancelled successfully', { userId, bookingId })

        res.json({
            message: 'Booking cancelled successfully',
            booking: {
                id: booking.id,
                bookingReference: booking.bookingReference,
                status: 'cancelled',
                paymentStatus: booking.paymentStatus === 'paid' ? 'refunded' : 'pending'
            }
        })
    } catch (error) {
        await transaction.rollback()
        logger.error('Booking cancellation failed', error as Error, { userId: req.user?.id, bookingId: req.params.bookingId })
        
        const errorMessage = (error as Error).message
        const statusCode = errorMessage.includes('not found') || errorMessage.includes('already cancelled') || errorMessage.includes('Cannot cancel') ? 400 : 500
        
        res.status(statusCode).json({
            error: errorMessage || 'Internal server error during booking cancellation'
        })
    }
}