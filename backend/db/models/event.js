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
            Event.belongsToMany(models.User, {
                through: "Attendances",
                foreignKey: "eventId",
                otherKey: "userId",
            });

            Event.hasMany(models.EventImage, { foreignKey: "eventId" });

            Event.belongsTo(models.Venue, { foreignKey: "venueId" });

            Event.belongsTo(models.Group, { foreignKey: "groupId" });
        }
    }
    Event.init(
        {
            venueId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            groupId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            type: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            capacity: {
                type: DataTypes.INTEGER,
            },
            price: {
                type: DataTypes.INTEGER,
            },
            startDate: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            endDate: {
                type: DataTypes.DATE,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "Event",
        }
    );
    return Event;
};