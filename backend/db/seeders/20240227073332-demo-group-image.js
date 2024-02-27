"use strict";

const { GroupImage } = require("../models");
const { Op } = require("sequelize");

let options = { validate: true };
if (process.env.NODE_ENV === "production") {
    options.schema = process.env.SCHEMA;
}

const groupImages = [
    {
        groupId: 1,
        url: "https://google.com",
        preview: true,
    },
    {
        groupId: 2,
        url: "https://google.com",
        preview: false,
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
    {
        groupId: 5,
        url: "https://google.com",
        preview: true,
    },
    {
        groupId: 1,
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
        await GroupImage.bulkCreate(groupImages, options);
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        await queryInterface.bulkDelete("GroupImages", {
            groupId: {
                [Op.lte]: 5,
            },
        });
    },
};
