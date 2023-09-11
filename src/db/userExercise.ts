import {
    Sequelize,
    DataTypes,
} from 'sequelize';
import { DatabaseModel } from '../types/db';

export class UserExerciseModel extends DatabaseModel {
    id: number;
    userId: number;
    exerciseId: number;
    datetime: Date;
    duration: number;
}

export default (sequelize: Sequelize) => {
    UserExerciseModel.init({
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: 'users', 
                key: 'id'
            }
        },
        exerciseId: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: 'exercises', 
                key: 'id'
            }
        },
        datetime: {
            type: DataTypes.DATE,
            allowNull: false
        },
        duration: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        paranoid: true,
        timestamps: true,
        sequelize,
        modelName: 'userExercise'
    });

    UserExerciseModel.associate = (models) => {
        (UserExerciseModel as any).belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'user'
        });
        (UserExerciseModel as any).belongsTo(models.Exercise, {
            foreignKey: 'exerciseId',
            as: 'exercise'
        });
    }

    return UserExerciseModel;
}