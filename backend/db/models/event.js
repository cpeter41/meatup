"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Event extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Event.hasMany(models.EventImage, { foreignKey: "eventId" });

            Event.belongsToMany(models.User, {
                through: "Attendance",
                foreignKey: "eventId",
                otherKey: "userId",
            });

            Event.belongsTo(models.Venue, { foreignKey: "venueId" });

            Event.belongsTo(models.Group, { foreignKey: "groupId" });
        }
    }
    Event.init(
        {
            groupId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            venueId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            type: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isIn: [["In person", "Online"]],
                },
            },
            startDate: {
                type: DataTypes.DATE,
                allowNull: false,
                // validate: {
                //     isDate: true,
                //     isAfter: sequelize.literal("CURRENT_TIMESTAMP"),
                // },
            },
            endDate: {
                type: DataTypes.DATE,
                allowNull: false,
                // validate: { isDate: true },
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            capacity: {
                type: DataTypes.INTEGER,
            },
            price: {
                type: DataTypes.DECIMAL(6, 2),
            },
        },
        {
            sequelize,
            modelName: "Event",
            validate: {
                checkEndDate() {
                    if (this.endDate < this.startDate) {
                        throw new Error("End date is less than start date");
                    }
                },
            },
        }
    );
    return Event;
};
