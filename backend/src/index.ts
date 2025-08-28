import path from 'path'
import fs from 'fs'
import express, {Application, Request, Response, NextFunction} from 'express'
import morgan from 'morgan'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import configDotenv from 'dotenv'
import { colorThemes, errorHandler, logger, requestIdMiddleware } from './utils/logger'
import { connectDatabase } from './config/database'

// Import routes
import authRoutes from './routes/auth'
import flightRoutes from './routes/flights'
import hotelRoutes from './routes/hotels'
import mealRoutes from './routes/meals'
import carRoutes from './routes/cars'
import bookingRoutes from './routes/bookings'

configDotenv.config()

const app: Application = express()

// Security middleware
app.use(helmet())
app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}))

// Rate limiting
const rateLimiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    message: {
        error: 'Too many requests, please try again later.',
        retryAfter: '15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false
})
app.use(rateLimiter)

// Basic middleware
app.use(requestIdMiddleware)
app.use(logger.morganMiddleware)
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

const PORT = process.env.PORT || 5555

// =============================================================================
// ROUTES
// =============================================================================

app.get('/', (req: Request, res: Response) => {
    res.json({
        message: 'Fly.JS Travel Booking API',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        endpoints: {
            auth: '/api/auth',
            flights: '/api/flights',
            hotels: '/api/hotels',
            meals: '/api/meals',
            cars: '/api/cars',
            bookings: '/api/bookings'
        }
    })
})

app.get('/health', (req: Request, res: Response) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    })
})

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/flights', flightRoutes)
app.use('/api/hotels', hotelRoutes)
app.use('/api/meals', mealRoutes)
app.use('/api/cars', carRoutes)
app.use('/api/bookings', bookingRoutes)

// Test routes (development only)
if (process.env.NODE_ENV === 'development') {
    app.get('/test-logs', (req: Request, res: Response) => {
        logger.debug('Debug information', { userId: 123, action: 'test' })
        res.json({ message: 'Check your console for colorful logs!' })
    })

    app.get('/test-error', async (req: Request, res: Response) => {
        throw new Error('This is a test error with full logging!')
    })
}

// =============================================================================
// ERROR HANDLING (Must be last!)
// =============================================================================

// 404 handler
app.use('*', (req: Request, res: Response) => {
    logger.warn(`404 - Route not found: ${req.method} ${req.originalUrl}`)
    res.status(404).json({
        error: 'Route not found',
        path: req.originalUrl,
        method: req.method,
    })
})

// Global error handler
app.use(errorHandler)

// =============================================================================
// SERVER START
// =============================================================================

const startServer = async () => {
    try {
        // Initialize database connection
        await connectDatabase()
        
        // Start the server
        app.listen(PORT, () => {
            logger.serverStart(Number(PORT), process.env.NODE_ENV || 'development')
        })
    } catch (error) {
        logger.error('Failed to start server', error as Error)
        process.exit(1)
    }
}

startServer()

export default app
