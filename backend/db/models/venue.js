"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Venue extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Venue.hasMany(models.Event, { foreignKey: "venueId" });

            Venue.belongsTo(models.Group, {
                foreignKey: "groupId",
                onDelete: "SET NULL",
            });
        }
    }
    Venue.init(
        {
            groupId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: "Groups", key: "id" },
                onDelete: "SET NULL",
            },
            address: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            city: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            state: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: { len: [2, 2] },
            },
            lat: {
                type: DataTypes.DECIMAL(10, 7),
                allowNull: false,
                validate: {
                    min: -90,
                    max: 90,
                },
            },
            lng: {
                type: DataTypes.DECIMAL(10, 7),
                allowNull: false,
                validate: {
                    min: -180,
                    max: 180,
                },
            },
        },
        {
            sequelize,
            modelName: "Venue",
            // implement model wide unique lat/lng for each location
            defaultScope: {
                attributes: {
                    exclude: ["createdAt", "updatedAt"],
                },
            },
        }
    );
    return Venue;
};
