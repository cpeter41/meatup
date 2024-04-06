"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class GroupImage extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            GroupImage.belongsTo(models.Group, { foreignKey: "groupId" });
        }
    }
    GroupImage.init(
        {
            groupId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: "Groups", key: "id" },
                // onDelete: "CASCADE",
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
            modelName: "GroupImage",
            defaultScope: {
                attributes: {
                    include: ["id", "url", "preview"],
                },
            },
        }
    );
    return GroupImage;
};
