import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config/database'

interface BookingAttributes {
    id: string
    userId: string
    bookingReference: string
    totalAmount: number
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
    paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
    paymentMethod?: string
    bookingDate: Date
    notes?: string
    createdAt?: Date
    updatedAt?: Date
    deletedAt?: Date
}

interface BookingCreationAttributes extends Optional<BookingAttributes, 'id' | 'status' | 'paymentStatus'> {}

class Booking extends Model<BookingAttributes, BookingCreationAttributes> implements BookingAttributes {
    public id!: string
    public userId!: string
    public bookingReference!: string
    public totalAmount!: number
    public status!: 'pending' | 'confirmed' | 'cancelled' | 'completed'
    public paymentStatus!: 'pending' | 'paid' | 'failed' | 'refunded'
    public paymentMethod?: string
    public bookingDate!: Date
    public notes?: string
    
    public readonly createdAt!: Date
    public readonly updatedAt!: Date
    public readonly deletedAt?: Date

    // Association properties
    public flightBookings?: any[]
    public hotelBookings?: any[]
    public carRentals?: any[]
}

Booking.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        bookingReference: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true
        },
        totalAmount: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'completed'),
            defaultValue: 'pending'
        },
        paymentStatus: {
            type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'),
            defaultValue: 'pending'
        },
        paymentMethod: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        bookingDate: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    },
    {
        sequelize,
        modelName: 'Booking',
        tableName: 'bookings'
    }
)

export default Booking