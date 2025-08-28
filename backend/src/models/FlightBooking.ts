import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config/database'

interface FlightBookingAttributes {
    id: string
    bookingId: string
    flightId: string
    seatId?: string
    passengerName: string
    passengerEmail: string
    passengerPhone?: string
    passengerPassport?: string
    flightPrice: number
    seatPrice?: number
    createdAt?: Date
    updatedAt?: Date
    deletedAt?: Date
}

interface FlightBookingCreationAttributes extends Optional<FlightBookingAttributes, 'id'> {}

class FlightBooking extends Model<FlightBookingAttributes, FlightBookingCreationAttributes> implements FlightBookingAttributes {
    public id!: string
    public bookingId!: string
    public flightId!: string
    public seatId?: string
    public passengerName!: string
    public passengerEmail!: string
    public passengerPhone?: string
    public passengerPassport?: string
    public flightPrice!: number
    public seatPrice?: number
    
    public readonly createdAt!: Date
    public readonly updatedAt!: Date
    public readonly deletedAt?: Date
}

FlightBooking.init(
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
        flightId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'flights',
                key: 'id'
            }
        },
        seatId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'seats',
                key: 'id'
            }
        },
        passengerName: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        passengerEmail: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                isEmail: true
            }
        },
        passengerPhone: {
            type: DataTypes.STRING(20),
            allowNull: true
        },
        passengerPassport: {
            type: DataTypes.STRING(20),
            allowNull: true
        },
        flightPrice: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        seatPrice: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
            defaultValue: 0
        }
    },
    {
        sequelize,
        modelName: 'FlightBooking',
        tableName: 'flight_bookings'
    }
)

export default FlightBooking