"use strict";
const { Model, ValidationError } = require("sequelize");
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

            Group.belongsTo(models.User, {
                // foreignKey: "organizerId",
                as: "Organizer",
            });

            Group.belongsToMany(models.User, {
                through: "Membership",
                foreignKey: "groupId",
                otherKey: "userId",
                as: "Member",
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
                references: { model: "Users", key: "id" },
            },
            name: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
                validate: {
                    len: [1, 60],
                },
            },
            about: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            type: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            private: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            city: {
                type: DataTypes.STRING,
            },
            state: {
                type: DataTypes.STRING,
            },
        },
        {
            sequelize,
            modelName: "Group",
            validate: {
                // validateAll() {
                //     const err = new ValidationError("Bad Request");
                //     if (this.name.split("").length > 60)
                //         err.errors.push(`Name must be 60 characters or less`);
                //     if (this.about.split("").length < 50)
                //         err.errors.push(`About must be 50 characters or more`);
                //     if (this.type !== "In person" && this.type !== "Online")
                //         err.errors.push(`Type must be 'Online' or 'In person'`);
                //     if (typeof this.private !== "boolean")
                //         err.errors.push(`Private must be a boolean`);
                //     if (!this.city) err.errors.push(`City is required`);
                //     if (!this.state) err.errors.push(`State is required`);
                //     if (err.errors.length) throw err;
                // },
            },
        }
    );
    return Group;
};
