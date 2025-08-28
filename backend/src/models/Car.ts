import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config/database'

interface CarAttributes {
    id: string
    rentalCompanyId: string
    make: string
    model: string
    year: number
    category: 'economy' | 'compact' | 'intermediate' | 'standard' | 'full-size' | 'premium' | 'luxury' | 'suv' | 'convertible'
    transmission: 'manual' | 'automatic'
    fuelType: 'gasoline' | 'diesel' | 'hybrid' | 'electric'
    seats: number
    doors: number
    airConditioning: boolean
    pricePerDay: number
    mileage?: number
    licensePlate: string
    color: string
    isAvailable: boolean
    imageUrls: string[]
    features: string[]
    createdAt?: Date
    updatedAt?: Date
    deletedAt?: Date
}

interface CarCreationAttributes extends Optional<CarAttributes, 'id' | 'isAvailable' | 'imageUrls' | 'features' | 'airConditioning'> {}

class Car extends Model<CarAttributes, CarCreationAttributes> implements CarAttributes {
    public id!: string
    public rentalCompanyId!: string
    public make!: string
    public model!: string
    public year!: number
    public category!: 'economy' | 'compact' | 'intermediate' | 'standard' | 'full-size' | 'premium' | 'luxury' | 'suv' | 'convertible'
    public transmission!: 'manual' | 'automatic'
    public fuelType!: 'gasoline' | 'diesel' | 'hybrid' | 'electric'
    public seats!: number
    public doors!: number
    public airConditioning!: boolean
    public pricePerDay!: number
    public mileage?: number
    public licensePlate!: string
    public color!: string
    public isAvailable!: boolean
    public imageUrls!: string[]
    public features!: string[]
    
    public readonly createdAt!: Date
    public readonly updatedAt!: Date
    public readonly deletedAt?: Date
}

Car.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        rentalCompanyId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'car_rental_companies',
                key: 'id'
            }
        },
        make: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        model: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        year: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        category: {
            type: DataTypes.ENUM('economy', 'compact', 'intermediate', 'standard', 'full-size', 'premium', 'luxury', 'suv', 'convertible'),
            allowNull: false
        },
        transmission: {
            type: DataTypes.ENUM('manual', 'automatic'),
            allowNull: false
        },
        fuelType: {
            type: DataTypes.ENUM('gasoline', 'diesel', 'hybrid', 'electric'),
            allowNull: false
        },
        seats: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        doors: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        airConditioning: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        pricePerDay: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        mileage: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Current mileage in km'
        },
        licensePlate: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true
        },
        color: {
            type: DataTypes.STRING(30),
            allowNull: false
        },
        isAvailable: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        imageUrls: {
            type: DataTypes.JSON,
            defaultValue: []
        },
        features: {
            type: DataTypes.JSON,
            defaultValue: []
        }
    },
    {
        sequelize,
        modelName: 'Car',
        tableName: 'cars'
    }
)

export default Car