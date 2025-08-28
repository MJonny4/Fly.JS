import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { User } from '../models'
import { logger } from '../utils/logger'

export interface AuthRequest extends Request {
    user?: any
}

export const generateToken = (userId: string): string => {
    const secret = process.env.JWT_SECRET
    if (!secret) {
        throw new Error('JWT_SECRET environment variable is required')
    }
    const expiresIn = process.env.JWT_EXPIRE || '15m'
    return (jwt as any).sign({ userId }, secret, { expiresIn })
}

export const generateRefreshToken = (userId: string): string => {
    const secret = process.env.JWT_REFRESH_SECRET
    if (!secret) {
        throw new Error('JWT_REFRESH_SECRET environment variable is required')
    }
    const expiresIn = process.env.JWT_REFRESH_EXPIRE || '7d'
    return (jwt as any).sign({ userId, type: 'refresh' }, secret, { expiresIn })
}

export const verifyToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                error: 'Access denied. No token provided or invalid format.'
            })
        }

        const token = authHeader.substring(7) // Remove 'Bearer ' prefix

        const secret = process.env.JWT_SECRET
        if (!secret) {
            throw new Error('JWT_SECRET environment variable is required')
        }
        const decoded = jwt.verify(token, secret) as any

        // Find the user
        const user = await User.findByPk(decoded.userId, {
            attributes: { exclude: ['password'] }
        })

        if (!user) {
            return res.status(401).json({
                error: 'User not found.'
            })
        }

        if (!user.isActive) {
            return res.status(401).json({
                error: 'Account is deactivated.'
            })
        }

        req.user = user
        next()
    } catch (error) {
        logger.error('Token verification failed', error as Error)
        
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({
                error: 'Token expired.'
            })
        }
        
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({
                error: 'Invalid token.'
            })
        }

        return res.status(500).json({
            error: 'Internal server error during authentication.'
        })
    }
}

export const optionalAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next() // No token provided, continue without user
        }

        const token = authHeader.substring(7)

        const secret = process.env.JWT_SECRET
        if (!secret) {
            throw new Error('JWT_SECRET environment variable is required')
        }
        const decoded = jwt.verify(token, secret) as any

        const user = await User.findByPk(decoded.userId, {
            attributes: { exclude: ['password'] }
        })

        if (user && user.isActive) {
            req.user = user
        }

        next()
    } catch (error) {
        // Log error but don't block the request
        logger.warn('Optional auth failed', { error: (error as Error).message })
        next()
    }
}