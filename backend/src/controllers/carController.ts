import { Request, Response } from 'express'
import { Op } from 'sequelize'
import { Car, CarRentalCompany } from '../models'
import { logger } from '../utils/logger'

export const searchCars = async (req: Request, res: Response) => {
    try {
        const {
            location,
            pickupDate,
            dropoffDate,
            category,
            transmission,
            fuelType,
            seats,
            maxPrice
        } = req.query

        const whereCondition: any = { isAvailable: true }

        if (category) {
            whereCondition.category = category
        }

        if (transmission) {
            whereCondition.transmission = transmission
        }

        if (fuelType) {
            whereCondition.fuelType = fuelType
        }

        if (seats) {
            whereCondition.seats = { [Op.gte]: parseInt(seats as string) }
        }

        if (maxPrice) {
            whereCondition.pricePerDay = { [Op.lte]: parseFloat(maxPrice as string) }
        }

        const cars = await Car.findAll({
            where: whereCondition,
            include: [
                {
                    model: CarRentalCompany,
                    as: 'rentalCompany',
                    attributes: ['id', 'name', 'logoUrl', 'contactEmail', 'contactPhone']
                }
            ],
            order: [['pricePerDay', 'ASC'], ['make', 'ASC'], ['model', 'ASC']]
        })

        logger.info('Car search completed', {
            location,
            pickupDate,
            dropoffDate,
            category,
            count: cars.length
        })

        res.json({
            searchParams: {
                location,
                pickupDate,
                dropoffDate,
                category,
                transmission,
                fuelType,
                seats,
                maxPrice
            },
            cars,
            total: cars.length
        })
    } catch (error) {
        logger.error('Car search failed', error as Error, { query: req.query })
        res.status(500).json({
            error: 'Internal server error during car search'
        })
    }
}

export const getCarDetails = async (req: Request, res: Response) => {
    try {
        const { carId } = req.params

        const car = await Car.findByPk(carId, {
            include: [
                {
                    model: CarRentalCompany,
                    as: 'rentalCompany'
                }
            ]
        })

        if (!car) {
            return res.status(404).json({
                error: 'Car not found'
            })
        }

        logger.info('Car details retrieved', { carId })

        res.json({
            car
        })
    } catch (error) {
        logger.error('Get car details failed', error as Error, { carId: req.params.carId })
        res.status(500).json({
            error: 'Internal server error'
        })
    }
}

export const getCarCategories = async (req: Request, res: Response) => {
    try {
        const categories = await Car.findAll({
            attributes: ['category'],
            where: { isAvailable: true },
            group: ['category'],
            raw: true
        })

        const categoryList = categories.map((item: any) => item.category)

        logger.info('Car categories retrieved', { count: categoryList.length })

        res.json({
            categories: categoryList,
            total: categoryList.length
        })
    } catch (error) {
        logger.error('Get car categories failed', error as Error)
        res.status(500).json({
            error: 'Internal server error'
        })
    }
}

export const getRentalCompanies = async (req: Request, res: Response) => {
    try {
        const companies = await CarRentalCompany.findAll({
            where: { isActive: true },
            attributes: ['id', 'name', 'description', 'logoUrl', 'contactEmail', 'contactPhone'],
            order: [['name', 'ASC']]
        })

        logger.info('Rental companies retrieved', { count: companies.length })

        res.json({
            companies,
            total: companies.length
        })
    } catch (error) {
        logger.error('Get rental companies failed', error as Error)
        res.status(500).json({
            error: 'Internal server error'
        })
    }
}