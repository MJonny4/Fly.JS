import { Request, Response } from 'express'
import { Op } from 'sequelize'
import { Meal } from '../models'
import { logger } from '../utils/logger'

export const getMeals = async (req: Request, res: Response) => {
    try {
        const { type, search, maxPrice } = req.query

        const whereCondition: any = { isActive: true }

        if (type) {
            whereCondition.type = type
        }

        if (search) {
            whereCondition[Op.or] = [
                { name: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } }
            ]
        }

        if (maxPrice) {
            whereCondition.price = { [Op.lte]: parseFloat(maxPrice as string) }
        }

        const meals = await Meal.findAll({
            where: whereCondition,
            order: [['type', 'ASC'], ['name', 'ASC']]
        })

        logger.info('Meals retrieved', { type, search, maxPrice, count: meals.length })

        res.json({
            filters: {
                type,
                search,
                maxPrice
            },
            meals,
            total: meals.length
        })
    } catch (error) {
        logger.error('Get meals failed', error as Error, { query: req.query })
        res.status(500).json({
            error: 'Internal server error'
        })
    }
}

export const getMealDetails = async (req: Request, res: Response) => {
    try {
        const { mealId } = req.params

        const meal = await Meal.findByPk(mealId)

        if (!meal) {
            return res.status(404).json({
                error: 'Meal not found'
            })
        }

        logger.info('Meal details retrieved', { mealId })

        res.json({
            meal
        })
    } catch (error) {
        logger.error('Get meal details failed', error as Error, { mealId: req.params.mealId })
        res.status(500).json({
            error: 'Internal server error'
        })
    }
}

export const getMealsByType = async (req: Request, res: Response) => {
    try {
        const meals = await Meal.findAll({
            where: { isActive: true },
            order: [['type', 'ASC'], ['name', 'ASC']]
        })

        // Group meals by type
        const mealsByType = meals.reduce((acc: any, meal) => {
            if (!acc[meal.type]) {
                acc[meal.type] = []
            }
            acc[meal.type].push(meal)
            return acc
        }, {})

        logger.info('Meals grouped by type retrieved', { totalMeals: meals.length })

        res.json({
            mealsByType,
            total: meals.length
        })
    } catch (error) {
        logger.error('Get meals by type failed', error as Error)
        res.status(500).json({
            error: 'Internal server error'
        })
    }
}