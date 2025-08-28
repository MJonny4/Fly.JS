import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config/database'

interface SeatAttributes {
    id: string
    flightId: string
    seatNumber: string
    seatClass: 'first' | 'business' | 'economy'
    isAvailable: boolean
    isWindowSeat: boolean
    isAisleSeat: boolean
    extraLegroom: boolean
    price: number
    createdAt?: Date
    updatedAt?: Date
    deletedAt?: Date
}

interface SeatCreationAttributes extends Optional<SeatAttributes, 'id' | 'isAvailable' | 'isWindowSeat' | 'isAisleSeat' | 'extraLegroom'> {}

class Seat extends Model<SeatAttributes, SeatCreationAttributes> implements SeatAttributes {
    public id!: string
    public flightId!: string
    public seatNumber!: string
    public seatClass!: 'first' | 'business' | 'economy'
    public isAvailable!: boolean
    public isWindowSeat!: boolean
    public isAisleSeat!: boolean
    public extraLegroom!: boolean
    public price!: number
    
    public readonly createdAt!: Date
    public readonly updatedAt!: Date
    public readonly deletedAt?: Date
}

Seat.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        flightId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'flights',
                key: 'id'
            }
        },
        seatNumber: {
            type: DataTypes.STRING(5),
            allowNull: false
        },
        seatClass: {
            type: DataTypes.ENUM('first', 'business', 'economy'),
            allowNull: false
        },
        isAvailable: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        isWindowSeat: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        isAisleSeat: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        extraLegroom: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        }
    },
    {
        sequelize,
        modelName: 'Seat',
        tableName: 'seats',
        indexes: [
            {
                unique: true,
                fields: ['flight_id', 'seat_number']
            }
        ]
    }
)

export default Seat