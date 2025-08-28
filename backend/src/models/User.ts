import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config/database'
import bcrypt from 'bcrypt'

interface UserAttributes {
    id: string
    firstName: string
    lastName: string
    email: string
    password: string
    phoneNumber?: string
    dateOfBirth?: Date
    passportNumber?: string
    nationality?: string
    isActive: boolean
    emailVerified: boolean
    createdAt?: Date
    updatedAt?: Date
    deletedAt?: Date
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'isActive' | 'emailVerified'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: string
    public firstName!: string
    public lastName!: string
    public email!: string
    public password!: string
    public phoneNumber?: string
    public dateOfBirth?: Date
    public passportNumber?: string
    public nationality?: string
    public isActive!: boolean
    public emailVerified!: boolean
    
    public readonly createdAt!: Date
    public readonly updatedAt!: Date
    public readonly deletedAt?: Date

    public async comparePassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password)
    }

    public async hashPassword(): Promise<void> {
        const rounds = parseInt(process.env.BCRYPT_ROUNDS || '12')
        this.password = await bcrypt.hash(this.password, rounds)
    }
}

User.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        firstName: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        phoneNumber: {
            type: DataTypes.STRING(20),
            allowNull: true
        },
        dateOfBirth: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        passportNumber: {
            type: DataTypes.STRING(20),
            allowNull: true
        },
        nationality: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        emailVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },
    {
        sequelize,
        modelName: 'User',
        tableName: 'users',
        hooks: {
            beforeCreate: async (user: User) => {
                await user.hashPassword()
            },
            beforeUpdate: async (user: User) => {
                if (user.changed('password')) {
                    await user.hashPassword()
                }
            }
        }
    }
)

export default User