"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Attendance extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Attendance.init(
        {
            eventId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: "Events", key: "id" },
                // onDelete: "CASCADE",
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: "Users", key: "id" },
                // onDelete: "CASCADE",
            },
            status: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isIn: [["attending", "waitlist", "pending"]],
                },
            },
        },
        {
            sequelize,
            modelName: "Attendance",
        }
    );
    return Attendance;
};
