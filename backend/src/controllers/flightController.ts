import { Request, Response } from 'express'
import { Op } from 'sequelize'
import { Flight, Airline, Airport, Aircraft, Seat } from '../models'
import { logger } from '../utils/logger'

export const searchFlights = async (req: Request, res: Response) => {
    try {
        const {
            from,
            to,
            departureDate,
            returnDate,
            passengers = 1,
            class: flightClass = 'economy'
        } = req.query

        // Find airports by code
        const [departureAirport, arrivalAirport] = await Promise.all([
            Airport.findOne({ where: { code: from as string } }),
            Airport.findOne({ where: { code: to as string } })
        ])

        if (!departureAirport) {
            return res.status(404).json({
                error: `Departure airport with code '${from}' not found`
            })
        }

        if (!arrivalAirport) {
            return res.status(404).json({
                error: `Arrival airport with code '${to}' not found`
            })
        }

        // Search for outbound flights
        const outboundFlights = await Flight.findAll({
            where: {
                departureAirportId: departureAirport.id,
                arrivalAirportId: arrivalAirport.id,
                departureTime: {
                    [Op.gte]: new Date(departureDate as string),
                    [Op.lt]: new Date(new Date(departureDate as string).getTime() + 24 * 60 * 60 * 1000)
                },
                availableSeats: {
                    [Op.gte]: parseInt(passengers as string)
                },
                status: 'scheduled'
            },
            include: [
                {
                    model: Airline,
                    as: 'airline',
                    attributes: ['id', 'name', 'code', 'logoUrl']
                },
                {
                    model: Airport,
                    as: 'departureAirport',
                    attributes: ['id', 'name', 'code', 'city', 'country']
                },
                {
                    model: Airport,
                    as: 'arrivalAirport',
                    attributes: ['id', 'name', 'code', 'city', 'country']
                },
                {
                    model: Aircraft,
                    as: 'aircraft',
                    attributes: ['id', 'model', 'manufacturer', 'totalSeats']
                }
            ],
            order: [['departureTime', 'ASC']]
        })

        let returnFlights: any[] = []
        if (returnDate) {
            returnFlights = await Flight.findAll({
                where: {
                    departureAirportId: arrivalAirport.id,
                    arrivalAirportId: departureAirport.id,
                    departureTime: {
                        [Op.gte]: new Date(returnDate as string),
                        [Op.lt]: new Date(new Date(returnDate as string).getTime() + 24 * 60 * 60 * 1000)
                    },
                    availableSeats: {
                        [Op.gte]: parseInt(passengers as string)
                    },
                    status: 'scheduled'
                },
                include: [
                    {
                        model: Airline,
                        as: 'airline',
                        attributes: ['id', 'name', 'code', 'logoUrl']
                    },
                    {
                        model: Airport,
                        as: 'departureAirport',
                        attributes: ['id', 'name', 'code', 'city', 'country']
                    },
                    {
                        model: Airport,
                        as: 'arrivalAirport',
                        attributes: ['id', 'name', 'code', 'city', 'country']
                    },
                    {
                        model: Aircraft,
                        as: 'aircraft',
                        attributes: ['id', 'model', 'manufacturer', 'totalSeats']
                    }
                ],
                order: [['departureTime', 'ASC']]
            })
        }

        logger.info('Flight search completed', {
            from,
            to,
            departureDate,
            returnDate,
            outboundCount: outboundFlights.length,
            returnCount: returnFlights.length
        })

        res.json({
            searchParams: {
                from: departureAirport.code,
                to: arrivalAirport.code,
                departureDate,
                returnDate,
                passengers,
                class: flightClass
            },
            outboundFlights,
            returnFlights,
            total: {
                outbound: outboundFlights.length,
                return: returnFlights.length
            }
        })
    } catch (error) {
        logger.error('Flight search failed', error as Error, { query: req.query })
        res.status(500).json({
            error: 'Internal server error during flight search'
        })
    }
}

export const getFlightDetails = async (req: Request, res: Response) => {
    try {
        const { flightId } = req.params

        const flight = await Flight.findByPk(flightId, {
            include: [
                {
                    model: Airline,
                    as: 'airline',
                    attributes: ['id', 'name', 'code', 'country', 'logoUrl']
                },
                {
                    model: Airport,
                    as: 'departureAirport',
                    attributes: ['id', 'name', 'code', 'city', 'country', 'timezone']
                },
                {
                    model: Airport,
                    as: 'arrivalAirport',
                    attributes: ['id', 'name', 'code', 'city', 'country', 'timezone']
                },
                {
                    model: Aircraft,
                    as: 'aircraft',
                    attributes: ['id', 'model', 'manufacturer', 'totalSeats', 'firstClassSeats', 'businessClassSeats', 'economyClassSeats']
                },
                {
                    model: Seat,
                    as: 'seats',
                    attributes: ['id', 'seatNumber', 'seatClass', 'isAvailable', 'isWindowSeat', 'isAisleSeat', 'extraLegroom', 'price']
                }
            ]
        })

        if (!flight) {
            return res.status(404).json({
                error: 'Flight not found'
            })
        }

        logger.info('Flight details retrieved', { flightId })

        res.json({
            flight
        })
    } catch (error) {
        logger.error('Get flight details failed', error as Error, { flightId: req.params.flightId })
        res.status(500).json({
            error: 'Internal server error'
        })
    }
}

export const getFlightSeats = async (req: Request, res: Response) => {
    try {
        const { flightId } = req.params
        const { class: seatClass } = req.query

        const whereCondition: any = { flightId }
        if (seatClass) {
            whereCondition.seatClass = seatClass
        }

        const seats = await Seat.findAll({
            where: whereCondition,
            order: [['seatNumber', 'ASC']]
        })

        if (seats.length === 0) {
            // Check if flight exists
            const flight = await Flight.findByPk(flightId)
            if (!flight) {
                return res.status(404).json({
                    error: 'Flight not found'
                })
            }
        }

        logger.info('Flight seats retrieved', { flightId, seatClass, count: seats.length })

        res.json({
            flightId,
            seats,
            summary: {
                total: seats.length,
                available: seats.filter(seat => seat.isAvailable).length,
                occupied: seats.filter(seat => !seat.isAvailable).length
            }
        })
    } catch (error) {
        logger.error('Get flight seats failed', error as Error, { flightId: req.params.flightId })
        res.status(500).json({
            error: 'Internal server error'
        })
    }
}

export const getAirlines = async (req: Request, res: Response) => {
    try {
        const airlines = await Airline.findAll({
            where: { isActive: true },
            attributes: ['id', 'name', 'code', 'country', 'logoUrl'],
            order: [['name', 'ASC']]
        })

        logger.info('Airlines retrieved', { count: airlines.length })

        res.json({
            airlines,
            total: airlines.length
        })
    } catch (error) {
        logger.error('Get airlines failed', error as Error)
        res.status(500).json({
            error: 'Internal server error'
        })
    }
}

export const getAirports = async (req: Request, res: Response) => {
    try {
        const { search, country } = req.query
        
        const whereCondition: any = { isActive: true }
        
        if (search) {
            whereCondition[Op.or] = [
                { name: { [Op.like]: `%${search}%` } },
                { code: { [Op.like]: `%${search}%` } },
                { city: { [Op.like]: `%${search}%` } }
            ]
        }
        
        if (country) {
            whereCondition.country = country
        }

        const airports = await Airport.findAll({
            where: whereCondition,
            attributes: ['id', 'name', 'code', 'city', 'country', 'timezone'],
            order: [['name', 'ASC']],
            limit: 50 // Limit results for performance
        })

        logger.info('Airports retrieved', { search, country, count: airports.length })

        res.json({
            airports,
            total: airports.length
        })
    } catch (error) {
        logger.error('Get airports failed', error as Error)
        res.status(500).json({
            error: 'Internal server error'
        })
    }
}