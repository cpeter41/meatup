"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class EventImage extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            EventImage.belongsTo(models.Event, { foreignKey: "eventId" });
        }
    }
    EventImage.init(
        {
            eventId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: "Events", key: "id" },
                onDelete: "CASCADE",
            },
            url: {
                type: DataTypes.STRING,
            },
            preview: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
        },
        {
            sequelize,
            modelName: "EventImage",
        }
    );
    return EventImage;
};
