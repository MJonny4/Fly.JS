import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config/database'

interface AircraftAttributes {
    id: string
    model: string
    manufacturer: string
    totalSeats: number
    firstClassSeats: number
    businessClassSeats: number
    economyClassSeats: number
    isActive: boolean
    createdAt?: Date
    updatedAt?: Date
    deletedAt?: Date
}

interface AircraftCreationAttributes extends Optional<AircraftAttributes, 'id' | 'isActive'> {}

class Aircraft extends Model<AircraftAttributes, AircraftCreationAttributes> implements AircraftAttributes {
    public id!: string
    public model!: string
    public manufacturer!: string
    public totalSeats!: number
    public firstClassSeats!: number
    public businessClassSeats!: number
    public economyClassSeats!: number
    public isActive!: boolean
    
    public readonly createdAt!: Date
    public readonly updatedAt!: Date
    public readonly deletedAt?: Date
}

Aircraft.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        model: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        manufacturer: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        totalSeats: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        firstClassSeats: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        businessClassSeats: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        economyClassSeats: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    },
    {
        sequelize,
        modelName: 'Aircraft',
        tableName: 'aircrafts'
    }
)

export default Aircraft