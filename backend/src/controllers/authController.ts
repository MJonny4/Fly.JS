import { Request, Response } from 'express'
import { User } from '../models'
import { generateToken, generateRefreshToken, AuthRequest } from '../middleware/auth'
import { logger } from '../utils/logger'
import { v4 as uuidv4 } from 'uuid'

export const register = async (req: Request, res: Response) => {
    try {
        const { firstName, lastName, email, password, phoneNumber, dateOfBirth, passportNumber, nationality } = req.body

        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } })
        if (existingUser) {
            return res.status(409).json({
                error: 'User with this email already exists'
            })
        }

        // Create new user
        const user = await User.create({
            id: uuidv4(),
            firstName,
            lastName,
            email,
            password,
            phoneNumber,
            dateOfBirth,
            passportNumber,
            nationality
        })

        // Generate tokens
        const token = generateToken(user.id)
        const refreshToken = generateRefreshToken(user.id)

        logger.success('User registered successfully', { userId: user.id, email: user.email })

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phoneNumber: user.phoneNumber,
                dateOfBirth: user.dateOfBirth,
                passportNumber: user.passportNumber,
                nationality: user.nationality,
                isActive: user.isActive,
                emailVerified: user.emailVerified
            },
            tokens: {
                accessToken: token,
                refreshToken,
                expiresIn: process.env.JWT_EXPIRE || '15m'
            }
        })
    } catch (error) {
        logger.error('User registration failed', error as Error, { body: req.body })
        res.status(500).json({
            error: 'Internal server error during registration'
        })
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body

        // Find user by email
        const user = await User.findOne({ where: { email } })
        if (!user) {
            return res.status(401).json({
                error: 'Invalid email or password'
            })
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(401).json({
                error: 'Account is deactivated'
            })
        }

        // Verify password
        const isPasswordValid = await user.comparePassword(password)
        if (!isPasswordValid) {
            return res.status(401).json({
                error: 'Invalid email or password'
            })
        }

        // Generate tokens
        const token = generateToken(user.id)
        const refreshToken = generateRefreshToken(user.id)

        logger.success('User logged in successfully', { userId: user.id, email: user.email })

        res.json({
            message: 'Login successful',
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phoneNumber: user.phoneNumber,
                dateOfBirth: user.dateOfBirth,
                passportNumber: user.passportNumber,
                nationality: user.nationality,
                isActive: user.isActive,
                emailVerified: user.emailVerified
            },
            tokens: {
                accessToken: token,
                refreshToken,
                expiresIn: process.env.JWT_EXPIRE || '15m'
            }
        })
    } catch (error) {
        logger.error('User login failed', error as Error, { email: req.body.email })
        res.status(500).json({
            error: 'Internal server error during login'
        })
    }
}

export const getProfile = async (req: AuthRequest, res: Response) => {
    try {
        const user = req.user

        res.json({
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phoneNumber: user.phoneNumber,
                dateOfBirth: user.dateOfBirth,
                passportNumber: user.passportNumber,
                nationality: user.nationality,
                isActive: user.isActive,
                emailVerified: user.emailVerified,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        })
    } catch (error) {
        logger.error('Get profile failed', error as Error, { userId: req.user?.id })
        res.status(500).json({
            error: 'Internal server error'
        })
    }
}

export const updateProfile = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.id
        const { firstName, lastName, phoneNumber, dateOfBirth, passportNumber, nationality } = req.body

        const user = await User.findByPk(userId)
        if (!user) {
            return res.status(404).json({
                error: 'User not found'
            })
        }

        // Update user
        await user.update({
            firstName: firstName || user.firstName,
            lastName: lastName || user.lastName,
            phoneNumber: phoneNumber || user.phoneNumber,
            dateOfBirth: dateOfBirth || user.dateOfBirth,
            passportNumber: passportNumber || user.passportNumber,
            nationality: nationality || user.nationality
        })

        logger.success('User profile updated successfully', { userId })

        res.json({
            message: 'Profile updated successfully',
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phoneNumber: user.phoneNumber,
                dateOfBirth: user.dateOfBirth,
                passportNumber: user.passportNumber,
                nationality: user.nationality,
                isActive: user.isActive,
                emailVerified: user.emailVerified
            }
        })
    } catch (error) {
        logger.error('Profile update failed', error as Error, { userId: req.user?.id })
        res.status(500).json({
            error: 'Internal server error during profile update'
        })
    }
}