import { Request, Response } from 'express'
import { Op } from 'sequelize'
import { Hotel, HotelRoom } from '../models'
import { logger } from '../utils/logger'

export const searchHotels = async (req: Request, res: Response) => {
    try {
        const {
            city,
            checkIn,
            checkOut,
            guests = 1,
            minRating,
            maxPrice,
            amenities
        } = req.query

        const whereCondition: any = {
            city: { [Op.like]: `%${city}%` },
            isActive: true
        }

        if (minRating) {
            whereCondition.rating = { [Op.gte]: parseFloat(minRating as string) }
        }

        // Build amenities filter
        if (amenities) {
            const amenityList = (amenities as string).split(',')
            whereCondition.amenities = {
                [Op.contains]: amenityList
            }
        }

        const hotels = await Hotel.findAll({
            where: whereCondition,
            include: [
                {
                    model: HotelRoom,
                    as: 'rooms',
                    where: {
                        capacity: { [Op.gte]: guests },
                        isAvailable: true,
                        ...(maxPrice && { pricePerNight: { [Op.lte]: parseFloat(maxPrice as string) } })
                    },
                    required: true
                }
            ],
            order: [['rating', 'DESC'], ['name', 'ASC']]
        })

        logger.info('Hotel search completed', {
            city,
            checkIn,
            checkOut,
            guests,
            count: hotels.length
        })

        res.json({
            searchParams: {
                city,
                checkIn,
                checkOut,
                guests,
                minRating,
                maxPrice,
                amenities
            },
            hotels,
            total: hotels.length
        })
    } catch (error) {
        logger.error('Hotel search failed', error as Error, { query: req.query })
        res.status(500).json({
            error: 'Internal server error during hotel search'
        })
    }
}

export const getHotelDetails = async (req: Request, res: Response) => {
    try {
        const { hotelId } = req.params

        const hotel = await Hotel.findByPk(hotelId, {
            include: [
                {
                    model: HotelRoom,
                    as: 'rooms',
                    where: { isAvailable: true },
                    required: false
                }
            ]
        })

        if (!hotel) {
            return res.status(404).json({
                error: 'Hotel not found'
            })
        }

        logger.info('Hotel details retrieved', { hotelId })

        res.json({
            hotel
        })
    } catch (error) {
        logger.error('Get hotel details failed', error as Error, { hotelId: req.params.hotelId })
        res.status(500).json({
            error: 'Internal server error'
        })
    }
}

export const getHotelRooms = async (req: Request, res: Response) => {
    try {
        const { hotelId } = req.params
        const { checkIn, checkOut, guests } = req.query

        const whereCondition: any = {
            hotelId,
            isAvailable: true
        }

        if (guests) {
            whereCondition.capacity = { [Op.gte]: parseInt(guests as string) }
        }

        const rooms = await HotelRoom.findAll({
            where: whereCondition,
            include: [
                {
                    model: Hotel,
                    as: 'hotel',
                    attributes: ['id', 'name', 'checkInTime', 'checkOutTime']
                }
            ],
            order: [['pricePerNight', 'ASC']]
        })

        if (rooms.length === 0) {
            // Check if hotel exists
            const hotel = await Hotel.findByPk(hotelId)
            if (!hotel) {
                return res.status(404).json({
                    error: 'Hotel not found'
                })
            }
        }

        logger.info('Hotel rooms retrieved', { hotelId, count: rooms.length })

        res.json({
            hotelId,
            checkIn,
            checkOut,
            guests,
            rooms,
            total: rooms.length
        })
    } catch (error) {
        logger.error('Get hotel rooms failed', error as Error, { hotelId: req.params.hotelId })
        res.status(500).json({
            error: 'Internal server error'
        })
    }
}