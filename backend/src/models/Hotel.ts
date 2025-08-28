import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config/database'

interface HotelAttributes {
    id: string
    name: string
    description: string
    address: string
    city: string
    country: string
    zipCode: string
    rating: number
    amenities: string[]
    checkInTime: string
    checkOutTime: string
    latitude?: number
    longitude?: number
    imageUrls: string[]
    isActive: boolean
    createdAt?: Date
    updatedAt?: Date
    deletedAt?: Date
}

interface HotelCreationAttributes extends Optional<HotelAttributes, 'id' | 'isActive' | 'imageUrls' | 'amenities'> {}

class Hotel extends Model<HotelAttributes, HotelCreationAttributes> implements HotelAttributes {
    public id!: string
    public name!: string
    public description!: string
    public address!: string
    public city!: string
    public country!: string
    public zipCode!: string
    public rating!: number
    public amenities!: string[]
    public checkInTime!: string
    public checkOutTime!: string
    public latitude?: number
    public longitude?: number
    public imageUrls!: string[]
    public isActive!: boolean
    
    public readonly createdAt!: Date
    public readonly updatedAt!: Date
    public readonly deletedAt?: Date
}

Hotel.init(
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
        address: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        city: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        country: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        zipCode: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        rating: {
            type: DataTypes.DECIMAL(2, 1),
            allowNull: false,
            validate: {
                min: 1,
                max: 5
            }
        },
        amenities: {
            type: DataTypes.JSON,
            defaultValue: []
        },
        checkInTime: {
            type: DataTypes.TIME,
            allowNull: false,
            defaultValue: '15:00'
        },
        checkOutTime: {
            type: DataTypes.TIME,
            allowNull: false,
            defaultValue: '11:00'
        },
        latitude: {
            type: DataTypes.DECIMAL(10, 8),
            allowNull: true
        },
        longitude: {
            type: DataTypes.DECIMAL(11, 8),
            allowNull: true
        },
        imageUrls: {
            type: DataTypes.JSON,
            defaultValue: []
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    },
    {
        sequelize,
        modelName: 'Hotel',
        tableName: 'hotels'
    }
)

export default Hotel