import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config/database'

interface HotelBookingAttributes {
    id: string
    bookingId: string
    hotelRoomId: string
    guestName: string
    guestEmail: string
    guestPhone?: string
    checkInDate: Date
    checkOutDate: Date
    numberOfGuests: number
    numberOfNights: number
    pricePerNight: number
    totalPrice: number
    specialRequests?: string
    createdAt?: Date
    updatedAt?: Date
    deletedAt?: Date
}

interface HotelBookingCreationAttributes extends Optional<HotelBookingAttributes, 'id'> {}

class HotelBooking extends Model<HotelBookingAttributes, HotelBookingCreationAttributes> implements HotelBookingAttributes {
    public id!: string
    public bookingId!: string
    public hotelRoomId!: string
    public guestName!: string
    public guestEmail!: string
    public guestPhone?: string
    public checkInDate!: Date
    public checkOutDate!: Date
    public numberOfGuests!: number
    public numberOfNights!: number
    public pricePerNight!: number
    public totalPrice!: number
    public specialRequests?: string
    
    public readonly createdAt!: Date
    public readonly updatedAt!: Date
    public readonly deletedAt?: Date
}

HotelBooking.init(
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
        hotelRoomId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'hotel_rooms',
                key: 'id'
            }
        },
        guestName: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        guestEmail: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                isEmail: true
            }
        },
        guestPhone: {
            type: DataTypes.STRING(20),
            allowNull: true
        },
        checkInDate: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        checkOutDate: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        numberOfGuests: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        numberOfNights: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        pricePerNight: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        totalPrice: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        specialRequests: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    },
    {
        sequelize,
        modelName: 'HotelBooking',
        tableName: 'hotel_bookings'
    }
)

export default HotelBooking