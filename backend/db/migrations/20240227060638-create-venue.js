"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
    options.schema = process.env.SCHEMA;
};

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("Venues", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            groupId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: "Groups", key: "id" }
            },
            address: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            },
            city: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            state: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            lat: {
                // add params to decimal
                type: Sequelize.DECIMAL,
                allowNull: false,
            },
            lng: {
                // add params to decimal
                type: Sequelize.DECIMAL,
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
        }, options);
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("Venues");
    },
};
