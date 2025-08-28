import express, { Request, Response, NextFunction } from 'express'
import morgan from 'morgan'
import chalk from 'chalk'
import winston from 'winston'
import rfs from 'rotating-file-stream'
import path from 'path'
import fs from 'fs'

// =============================================================================
// 1. ENVIRONMENT CONFIGURATION
// =============================================================================

interface LogConfig {
    level: string
    colors: boolean
    file: boolean
    console: boolean
}

const configs: Record<string, LogConfig> = {
    development: {
        level: 'debug',
        colors: true,
        file: false,
        console: true,
    },
    staging: {
        level: 'info',
        colors: true,
        file: true,
        console: true,
    },
    production: {
        level: 'warn',
        colors: false,
        file: true,
        console: false,
    },
}

// =============================================================================
// 2. CHALK COLOR THEMES
// =============================================================================

export const colorThemes = {
    success: chalk.green,
    info: chalk.blue,
    warning: chalk.yellow,
    error: chalk.red,
    debug: chalk.gray,
    highlight: chalk.cyan,
    bold: chalk.bold,
    dim: chalk.dim,

    // HTTP Method Colors
    method: {
        GET: chalk.green,
        POST: chalk.blue,
        PUT: chalk.yellow,
        PATCH: chalk.magenta,
        DELETE: chalk.red,
        OPTIONS: chalk.gray,
    },
}

// =============================================================================
// 3. CUSTOM MORGAN SETUP
// =============================================================================

// Custom morgan tokens
morgan.token('id', (req: any) => req.id || 'N/A')
morgan.token('colored-status', (req, res) => {
    const status = res.statusCode
    const color = status >= 500 ? chalk.red : status >= 400 ? chalk.yellow : status >= 300 ? chalk.cyan : chalk.green
    return color(status.toString())
})
morgan.token('colored-method', (req) => {
    const method = req.method
    const color = colorThemes.method[method as keyof typeof colorThemes.method] || chalk.white
    return color(method)
})

// =============================================================================
// 4. WINSTON LOGGER SETUP
// =============================================================================

const createWinstonLogger = (config: LogConfig) => {
    const logDir = 'logs'
    
    // Create logs directory if needed
    if (config.file && !fs.existsSync(logDir)) {
        fs.mkdirSync(logDir)
    }

    const transports: winston.transport[] = []

    // Only add console transport if we want console output
    if (config.console) {
        transports.push(
            new winston.transports.Console({
                format: winston.format.combine(
                    config.colors ? winston.format.colorize() : winston.format.uncolorize(),
                    winston.format.simple(),
                ),
            }),
        )
    }

    // File transports
    if (config.file) {
        transports.push(
            new winston.transports.File({
                filename: path.join(logDir, 'app.log'),
                format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
            }),
            new winston.transports.File({
                filename: path.join(logDir, 'error.log'),
                level: 'error',
                format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
            }),
        )
    }

    return winston.createLogger({
        level: config.level,
        transports,
    })
}

// =============================================================================
// 5. SIMPLIFIED LOGGER CLASS
// =============================================================================

class AppLogger {
    private config: LogConfig
    private winston: winston.Logger
    private morganStream: rfs.RotatingFileStream | NodeJS.WriteStream

    constructor(environment: string = process.env.NODE_ENV || 'development') {
        this.config = configs[environment] || configs['development']
        this.winston = createWinstonLogger(this.config)

        // Setup Morgan stream for file logging
        if (this.config.file) {
            const logDir = 'logs'
            if (!fs.existsSync(logDir)) fs.mkdirSync(logDir)
            
            this.morganStream = rfs.createStream('access.log', {
                interval: '1d',
                path: logDir,
                maxFiles: 10,
                compress: 'gzip',
            })
        } else {
            // In development, we want Morgan to use console, but not duplicate with Winston
            this.morganStream = process.stdout
        }
    }

    // Morgan middleware - handles HTTP request logging
    get morganMiddleware(): express.RequestHandler {
        const format = ':colored-method :url :colored-status :res[content-length] - :response-time ms'
        
        return morgan(format, {
            stream: this.morganStream,
            skip: this.config.console ? undefined : (req: Request, res: Response) => res.statusCode < 400,
        })
    }

    // Application logging methods - ONLY use Winston (no console.log duplication)
    success(message: string, ...args: any[]) {
        this.winston.info(`✅ SUCCESS: ${message}`, ...args)
    }

    info(message: string, ...args: any[]) {
        this.winston.info(`ℹ️  INFO: ${message}`, ...args)
    }

    warn(message: string, ...args: any[]) {
        this.winston.warn(`⚠️  WARNING: ${message}`, ...args)
    }

    error(message: string, error?: Error, ...args: any[]) {
        this.winston.error(`🔥 ERROR: ${message}`, { 
            error: error?.message, 
            stack: error?.stack 
        }, ...args)
    }

    debug(message: string, ...args: any[]) {
        this.winston.debug(`🐛 DEBUG: ${message}`, ...args)
    }

    // Server startup - special case with direct console output
    serverStart(port: number, environment: string) {
        const message = `🚀 Server running on port ${colorThemes.highlight(port.toString())} in ${colorThemes.bold(environment)} mode`
        
        // For server start, we want immediate console feedback regardless of config
        console.log(message)
        console.log(colorThemes.dim(`📊 Log Level: ${this.config.level}`))
        console.log(colorThemes.dim('─'.repeat(50)))

        this.winston.info('Server started', { port, environment })
    }
}

// =============================================================================
// 6. EXPORTS & MIDDLEWARE
// =============================================================================

export const logger = new AppLogger()

// Error handler middleware
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    const status = err.status || err.statusCode || 500

    logger.error(`HTTP Error: ${req.method} ${req.url}`, err)

    res.status(status).json({
        error: {
            status,
            message: err.message || 'Internal Server Error',
            timestamp: new Date().toISOString(),
            path: req.originalUrl,
            method: req.method,
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
        },
    })
}

// Request ID middleware
export const requestIdMiddleware = (req: any, res: Response, next: NextFunction) => {
    req.id = Math.random().toString(36).substr(2, 9)
    next()
}

export default logger