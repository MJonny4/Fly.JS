import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config/database'

interface CarRentalCompanyAttributes {
    id: string
    name: string
    description: string
    logoUrl?: string
    contactEmail: string
    contactPhone: string
    isActive: boolean
    createdAt?: Date
    updatedAt?: Date
    deletedAt?: Date
}

interface CarRentalCompanyCreationAttributes extends Optional<CarRentalCompanyAttributes, 'id' | 'isActive'> {}

class CarRentalCompany extends Model<CarRentalCompanyAttributes, CarRentalCompanyCreationAttributes> implements CarRentalCompanyAttributes {
    public id!: string
    public name!: string
    public description!: string
    public logoUrl?: string
    public contactEmail!: string
    public contactPhone!: string
    public isActive!: boolean
    
    public readonly createdAt!: Date
    public readonly updatedAt!: Date
    public readonly deletedAt?: Date
}

CarRentalCompany.init(
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
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        logoUrl: {
            type: DataTypes.STRING(500),
            allowNull: true
        },
        contactEmail: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                isEmail: true
            }
        },
        contactPhone: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    },
    {
        sequelize,
        modelName: 'CarRentalCompany',
        tableName: 'car_rental_companies'
    }
)

export default CarRentalCompany