import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config/database'

interface MealBookingAttributes {
    id: string
    flightBookingId: string
    mealId: string
    quantity: number
    totalPrice: number
    createdAt?: Date
    updatedAt?: Date
    deletedAt?: Date
}

interface MealBookingCreationAttributes extends Optional<MealBookingAttributes, 'id'> {}

class MealBooking extends Model<MealBookingAttributes, MealBookingCreationAttributes> implements MealBookingAttributes {
    public id!: string
    public flightBookingId!: string
    public mealId!: string
    public quantity!: number
    public totalPrice!: number
    
    public readonly createdAt!: Date
    public readonly updatedAt!: Date
    public readonly deletedAt?: Date
}

MealBooking.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        flightBookingId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'flight_bookings',
                key: 'id'
            }
        },
        mealId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'meals',
                key: 'id'
            }
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        totalPrice: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        }
    },
    {
        sequelize,
        modelName: 'MealBooking',
        tableName: 'meal_bookings'
    }
)

export default MealBooking