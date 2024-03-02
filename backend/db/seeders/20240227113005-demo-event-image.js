"use strict";

const { EventImage } = require("../models");
const { Op } = require("sequelize");

let options = { validate: true };
if (process.env.NODE_ENV === "production") {
    options.schema = process.env.SCHEMA;
}

const eventImages = [
    {
        eventId: 1,
        url: "https://google.com",
        preview: true,
    },
    {
        eventId: 2,
        url: "https://google.com",
        preview: true,
    },
    {
        eventId: 3,
        url: "https://google.com",
        preview: true,
    },
    {
        eventId: 3,
        url: "https://yahoo.com",
        preview: false,
    },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        /**
         * Add seed commands here.
         *
         * Example:
         * await queryInterface.bulkInsert('People', [{
         *   name: 'John Doe',
         *   isBetaMember: false
         * }], {});
         */
        await EventImage.bulkCreate(eventImages, options);
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        options.tableName = "EventImages";
        await queryInterface.bulkDelete(
            options,
            { eventId: { [Op.lte]: 5 } },
            {}
        );
    },
};
