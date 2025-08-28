import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config/database'

interface AirlineAttributes {
    id: string
    name: string
    code: string
    country: string
    logoUrl?: string
    isActive: boolean
    createdAt?: Date
    updatedAt?: Date
    deletedAt?: Date
}

interface AirlineCreationAttributes extends Optional<AirlineAttributes, 'id' | 'isActive'> {}

class Airline extends Model<AirlineAttributes, AirlineCreationAttributes> implements AirlineAttributes {
    public id!: string
    public name!: string
    public code!: string
    public country!: string
    public logoUrl?: string
    public isActive!: boolean
    
    public readonly createdAt!: Date
    public readonly updatedAt!: Date
    public readonly deletedAt?: Date
}

Airline.init(
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
        country: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        logoUrl: {
            type: DataTypes.STRING(500),
            allowNull: true
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    },
    {
        sequelize,
        modelName: 'Airline',
        tableName: 'airlines'
    }
)

export default Airline