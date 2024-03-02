"use strict";
const { Model, Validator } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            User.belongsToMany(models.Event, {
                through: "Attendance",
                foreignKey: "userId",
                otherKey: "eventId",
            });

            User.hasMany(models.Group, { foreignKey: "organizerId", as: "Organizer" });

            User.belongsToMany(models.Group, {
                through: "Membership",
                foreignKey: "userId",
                otherKey: "groupId",
                as: "Member",
            });
        }
    }
    User.init(
        {
            firstName: DataTypes.STRING(64),
            lastName: DataTypes.STRING(64),
            username: {
                type: DataTypes.STRING(30),
                allowNull: false,
                unique: true,
                validate: {
                    len: [4, 30],
                    isNotEmail(val) {
                        if (Validator.isEmail(val))
                            throw new Error("Cannot be email!");
                    },
                },
            },
            email: {
                type: DataTypes.STRING(256),
                allowNull: false,
                unique: true,
                validate: {
                    len: [3, 256],
                    isEmail: true,
                },
            },
            hashedPassword: {
                type: DataTypes.STRING.BINARY,
                allowNull: false,
                validate: {
                    len: [60, 60],
                },
            },
        },
        {
            sequelize,
            modelName: "User",
            defaultScope: {
                attributes: {
                    exclude: [
                        "email",
                        "hashedPassword",
                        "createdAt",
                        "updatedAt",
                    ],
                },
            },
        }
    );
    return User;
};
