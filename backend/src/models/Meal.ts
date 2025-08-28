import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config/database'

interface MealAttributes {
    id: string
    name: string
    description: string
    type: 'regular' | 'vegetarian' | 'vegan' | 'kosher' | 'halal' | 'gluten-free' | 'diabetic'
    price: number
    imageUrl?: string
    isActive: boolean
    createdAt?: Date
    updatedAt?: Date
    deletedAt?: Date
}

interface MealCreationAttributes extends Optional<MealAttributes, 'id' | 'isActive'> {}

class Meal extends Model<MealAttributes, MealCreationAttributes> implements MealAttributes {
    public id!: string
    public name!: string
    public description!: string
    public type!: 'regular' | 'vegetarian' | 'vegan' | 'kosher' | 'halal' | 'gluten-free' | 'diabetic'
    public price!: number
    public imageUrl?: string
    public isActive!: boolean
    
    public readonly createdAt!: Date
    public readonly updatedAt!: Date
    public readonly deletedAt?: Date
}

Meal.init(
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
        type: {
            type: DataTypes.ENUM('regular', 'vegetarian', 'vegan', 'kosher', 'halal', 'gluten-free', 'diabetic'),
            allowNull: false
        },
        price: {
            type: DataTypes.DECIMAL(8, 2),
            allowNull: false
        },
        imageUrl: {
            type: DataTypes.STRING(500),
            allowNull: true
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    },
    {
        sequelize,
        modelName: 'Meal',
        tableName: 'meals'
    }
)

export default Meal