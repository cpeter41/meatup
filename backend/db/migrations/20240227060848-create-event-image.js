"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
    options.schema = process.env.SCHEMA;
};

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("EventImages", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            eventId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: "Events", key: "id" },
            },
            url: {
                type: Sequelize.STRING,
            },
            preview: {
                type: Sequelize.BOOLEAN,
                defaultValue: true,
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
        }, options);
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("EventImages");
    },
};
