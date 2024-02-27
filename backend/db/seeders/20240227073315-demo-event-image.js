"use strict";

const { EventImage } = require("../models");
const { Op } = require("sequelize");

let options = { validate: true };
if (process.env.NODE_ENV === "production") {
    options.schema = process.env.SCHEMA;
}

const eventImages = [
    {
        groupId: 1,
        url: "https://google.com",
        preview: true,
    },
    {
        groupId: 2,
        url: "https://google.com",
        preview: true,
    },
    {
        groupId: 3,
        url: "https://google.com",
        preview: true,
    },
    {
        groupId: 4,
        url: "https://google.com",
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
        await queryInterface.bulkDelete(
            "EventImages",
            { groupId: { [Op.lte]: 5 } },
            options
        );
    },
};
