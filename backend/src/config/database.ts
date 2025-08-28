import { Sequelize } from 'sequelize'
import { logger } from '../utils/logger'

const sequelize = new Sequelize(
    process.env.DB_NAME || 'flyjs',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '3306'),
        dialect: 'mysql',
        logging: (msg) => logger.debug('Database Query', { query: msg }),
        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        define: {
            timestamps: true,
            underscored: true,
            paranoid: true
        }
    }
)

export const connectDatabase = async () => {
    try {
        await sequelize.authenticate()
        logger.success('Database connection established successfully')
        
        // Sync all models
        await sequelize.sync({ alter: true })
        logger.success('Database models synchronized')
        
    } catch (error) {
        logger.error('Unable to connect to the database', error as Error)
        throw error
    }
}

export default sequelize