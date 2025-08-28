import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config/database'

interface HotelRoomAttributes {
    id: string
    hotelId: string
    roomType: string
    roomNumber: string
    capacity: number
    pricePerNight: number
    description: string
    amenities: string[]
    size: number
    bedType: string
    isAvailable: boolean
    imageUrls: string[]
    createdAt?: Date
    updatedAt?: Date
    deletedAt?: Date
}

interface HotelRoomCreationAttributes extends Optional<HotelRoomAttributes, 'id' | 'isAvailable' | 'imageUrls' | 'amenities'> {}

class HotelRoom extends Model<HotelRoomAttributes, HotelRoomCreationAttributes> implements HotelRoomAttributes {
    public id!: string
    public hotelId!: string
    public roomType!: string
    public roomNumber!: string
    public capacity!: number
    public pricePerNight!: number
    public description!: string
    public amenities!: string[]
    public size!: number
    public bedType!: string
    public isAvailable!: boolean
    public imageUrls!: string[]
    
    public readonly createdAt!: Date
    public readonly updatedAt!: Date
    public readonly deletedAt?: Date
}

HotelRoom.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        hotelId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'hotels',
                key: 'id'
            }
        },
        roomType: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        roomNumber: {
            type: DataTypes.STRING(10),
            allowNull: false
        },
        capacity: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        pricePerNight: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        amenities: {
            type: DataTypes.JSON,
            defaultValue: []
        },
        size: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: 'Size in square meters'
        },
        bedType: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        isAvailable: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        imageUrls: {
            type: DataTypes.JSON,
            defaultValue: []
        }
    },
    {
        sequelize,
        modelName: 'HotelRoom',
        tableName: 'hotel_rooms',
        indexes: [
            {
                unique: true,
                fields: ['hotel_id', 'room_number']
            }
        ]
    }
)

export default HotelRoom