import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config/database'

interface CarRentalAttributes {
    id: string
    bookingId: string
    carId: string
    renterName: string
    renterEmail: string
    renterPhone?: string
    renterLicense: string
    pickupDate: Date
    dropoffDate: Date
    pickupLocation: string
    dropoffLocation: string
    numberOfDays: number
    pricePerDay: number
    totalPrice: number
    additionalDrivers?: string[]
    insurance: boolean
    insuranceCost?: number
    createdAt?: Date
    updatedAt?: Date
    deletedAt?: Date
}

interface CarRentalCreationAttributes extends Optional<CarRentalAttributes, 'id' | 'insurance'> {}

class CarRental extends Model<CarRentalAttributes, CarRentalCreationAttributes> implements CarRentalAttributes {
    public id!: string
    public bookingId!: string
    public carId!: string
    public renterName!: string
    public renterEmail!: string
    public renterPhone?: string
    public renterLicense!: string
    public pickupDate!: Date
    public dropoffDate!: Date
    public pickupLocation!: string
    public dropoffLocation!: string
    public numberOfDays!: number
    public pricePerDay!: number
    public totalPrice!: number
    public additionalDrivers?: string[]
    public insurance!: boolean
    public insuranceCost?: number
    
    public readonly createdAt!: Date
    public readonly updatedAt!: Date
    public readonly deletedAt?: Date
}

CarRental.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        bookingId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'bookings',
                key: 'id'
            }
        },
        carId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'cars',
                key: 'id'
            }
        },
        renterName: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        renterEmail: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                isEmail: true
            }
        },
        renterPhone: {
            type: DataTypes.STRING(20),
            allowNull: true
        },
        renterLicense: {
            type: DataTypes.STRING(30),
            allowNull: false
        },
        pickupDate: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        dropoffDate: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        pickupLocation: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        dropoffLocation: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        numberOfDays: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        pricePerDay: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        totalPrice: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        additionalDrivers: {
            type: DataTypes.JSON,
            allowNull: true
        },
        insurance: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        insuranceCost: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
            defaultValue: 0
        }
    },
    {
        sequelize,
        modelName: 'CarRental',
        tableName: 'car_rentals'
    }
)

export default CarRental