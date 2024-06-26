"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
    options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable(
            "Events",
            {
                id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: Sequelize.INTEGER,
                },
                venueId: {
                    type: Sequelize.INTEGER,
                    references: { model: "Venues", key: "id" },
                    onDelete: "CASCADE",
                },
                groupId: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    references: { model: "Groups", key: "id" },
                    onDelete: "CASCADE",
                },
                name: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                description: {
                    type: Sequelize.TEXT,
                    allowNull: false,
                },
                type: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                capacity: {
                    type: Sequelize.INTEGER,
                },
                price: {
                    type: Sequelize.DECIMAL(6, 2),
                },
                startDate: {
                    type: Sequelize.DATE,
                    allowNull: false,
                },
                endDate: {
                    type: Sequelize.DATE,
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
            },
            options
        );
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("Events", options);
    },
};
