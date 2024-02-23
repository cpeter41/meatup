"use strict";

let options = {};
if (process.env.NODE_ENV === 'production') {
    options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("Users", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            firstName: Sequelize.STRING(64),
            lastName: Sequelize.STRING(64),
            username: {
                type: Sequelize.STRING(30),
                allowNull: false,
                unique: true,
            },
            email: {
                type: Sequelize.STRING(256),
                allowNull: false,
                unique: true,
            },
            hashedPassword: {
                type: Sequelize.STRING.BINARY,
                allowNull: false,
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
        }, options);
        console.log('here');
    },
    async down(queryInterface, Sequelize) {
        // options.tableName = "Users";
        await queryInterface.dropTable("Users");
    },
};
