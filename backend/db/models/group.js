"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Group extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Group.hasMany(models.Event, { foreignKey: "groupId" });

            Group.belongsTo(models.User, { foreignKey: "organizerId" });

            Group.belongsToMany(models.User, {
                through: "Memberships",
                foreignKey: "groupId",
                otherKey: "userId",
            });

            Group.hasMany(models.GroupImage, { foreignKey: "groupId" });

            Group.hasMany(models.Venue, { foreignKey: "groupId" });
        }
    }
    Group.init(
        {
            organizerId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
            },
            about: {
                type: DataTypes.TEXT,
            },
            type: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            private: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            city: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            state: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "Group",
        }
    );
    return Group;
};