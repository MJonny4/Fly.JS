import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config/database'

interface AirportAttributes {
    id: string
    name: string
    code: string
    city: string
    country: string
    timezone: string
    latitude?: number
    longitude?: number
    isActive: boolean
    createdAt?: Date
    updatedAt?: Date
    deletedAt?: Date
}

interface AirportCreationAttributes extends Optional<AirportAttributes, 'id' | 'isActive'> {}

class Airport extends Model<AirportAttributes, AirportCreationAttributes> implements AirportAttributes {
    public id!: string
    public name!: string
    public code!: string
    public city!: string
    public country!: string
    public timezone!: string
    public latitude?: number
    public longitude?: number
    public isActive!: boolean
    
    public readonly createdAt!: Date
    public readonly updatedAt!: Date
    public readonly deletedAt?: Date
}

Airport.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        code: {
            type: DataTypes.STRING(3),
            allowNull: false,
            unique: true
        },
        city: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        country: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        timezone: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        latitude: {
            type: DataTypes.DECIMAL(10, 8),
            allowNull: true
        },
        longitude: {
            type: DataTypes.DECIMAL(11, 8),
            allowNull: true
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    },
    {
        sequelize,
        modelName: 'Airport',
        tableName: 'airports'
    }
)

export default Airport