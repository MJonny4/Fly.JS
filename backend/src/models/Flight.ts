import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config/database'

interface FlightAttributes {
    id: string
    flightNumber: string
    airlineId: string
    departureAirportId: string
    arrivalAirportId: string
    aircraftId: string
    departureTime: Date
    arrivalTime: Date
    duration: number
    basePrice: number
    firstClassPrice?: number
    businessClassPrice?: number
    economyClassPrice: number
    availableSeats: number
    status: 'scheduled' | 'boarding' | 'departed' | 'arrived' | 'cancelled' | 'delayed'
    gate?: string
    createdAt?: Date
    updatedAt?: Date
    deletedAt?: Date
}

interface FlightCreationAttributes extends Optional<FlightAttributes, 'id' | 'status'> {}

class Flight extends Model<FlightAttributes, FlightCreationAttributes> implements FlightAttributes {
    public id!: string
    public flightNumber!: string
    public airlineId!: string
    public departureAirportId!: string
    public arrivalAirportId!: string
    public aircraftId!: string
    public departureTime!: Date
    public arrivalTime!: Date
    public duration!: number
    public basePrice!: number
    public firstClassPrice?: number
    public businessClassPrice?: number
    public economyClassPrice!: number
    public availableSeats!: number
    public status!: 'scheduled' | 'boarding' | 'departed' | 'arrived' | 'cancelled' | 'delayed'
    public gate?: string
    
    public readonly createdAt!: Date
    public readonly updatedAt!: Date
    public readonly deletedAt?: Date
}

Flight.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        flightNumber: {
            type: DataTypes.STRING(10),
            allowNull: false
        },
        airlineId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'airlines',
                key: 'id'
            }
        },
        departureAirportId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'airports',
                key: 'id'
            }
        },
        arrivalAirportId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'airports',
                key: 'id'
            }
        },
        aircraftId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'aircrafts',
                key: 'id'
            }
        },
        departureTime: {
            type: DataTypes.DATE,
            allowNull: false
        },
        arrivalTime: {
            type: DataTypes.DATE,
            allowNull: false
        },
        duration: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: 'Duration in minutes'
        },
        basePrice: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        firstClassPrice: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true
        },
        businessClassPrice: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true
        },
        economyClassPrice: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        availableSeats: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('scheduled', 'boarding', 'departed', 'arrived', 'cancelled', 'delayed'),
            defaultValue: 'scheduled'
        },
        gate: {
            type: DataTypes.STRING(10),
            allowNull: true
        }
    },
    {
        sequelize,
        modelName: 'Flight',
        tableName: 'flights'
    }
)

export default Flight