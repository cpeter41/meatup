"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("Groups", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            organizerId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: "Users", key: "id" },
            },
            name: {
                type: Sequelize.STRING,
                unique: true,
                allowNull: false,
            },
            about: {
                type: Sequelize.TEXT,
            },
            type: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            private: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            city: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            state: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("Groups");
    },
};