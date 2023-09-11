/* eslint import/no-cycle: 0 */

import {
    Sequelize,
    DataTypes,
} from 'sequelize';
import { USER_ROLE } from '../utils/enums'
import { DatabaseModel } from '../types/db';


export class UserModel extends DatabaseModel {
    id: number;
    name: string;
    surname: string;
    nickName: string;
    email: string;
    age: number;
    role: USER_ROLE;
    password: string; 
}

export default (sequelize: Sequelize) => {
    UserModel.init({
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(128),
            allowNull: false
        },
        surname: {
            type: DataTypes.STRING(128),
            allowNull: false
        },
        nickName: {
            type: DataTypes.STRING(128),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(128),
            allowNull: false,
            unique: true
        },
        age: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        role: {
            type: DataTypes.ENUM(USER_ROLE.ADMIN, USER_ROLE.USER),
            allowNull: false
        },
        password: {  
            type: DataTypes.STRING(256), 
            allowNull: false
        }
    }, {
        paranoid: true,
        timestamps: true,
        sequelize,
        modelName: 'user'
    });

    UserModel.associate = (models) => {
		(UserModel as any).hasMany(models.UserExercise, {
			foreignKey: {
				name: 'exerciseId',
				as: 'userExercise'
			}
		})
	}

    return UserModel;
}



