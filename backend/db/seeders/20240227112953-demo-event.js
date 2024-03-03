"use strict";

const { Event } = require("../models");
const { Op } = require("sequelize");

let options = { validate: true };
if (process.env.NODE_ENV === "production") {
    options.schema = process.env.SCHEMA;
}

const events = [
    {
        venueId: 1,
        groupId: 1,
        name: "event name 1",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris facilisis congue odio, id tempor nisl gravida ut. Vestibulum eget purus elit.",
        type: "In person",
        capacity: 20,
        price: 19.99,
        startDate: "2026-03-01 00:00:00",
        endDate: "2026-03-02 00:00:00",
    },
    {
        venueId: 3,
        groupId: 2,
        name: "event name 2",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris facilisis congue odio, id tempor nisl gravida ut. Vestibulum eget purus elit.",
        type: "Online",
        capacity: 50,
        price: 39.99,
        startDate: "2024-06-01 00:00:00",
        endDate: "2026-06-01 06:00:00",
    },
    {
        venueId: 2,
        groupId: 5,
        name: "event name 3",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris facilisis congue odio, id tempor nisl gravida ut. Vestibulum eget purus elit.",
        type: "In person",
        capacity: 12,
        price: 9.49,
        startDate: "2025-10-20 00:00:00",
        endDate: "2025-10-25 00:00:00",
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
        await Event.bulkCreate(events, options);
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        options.tableName = "Events";
        await queryInterface.bulkDelete(
            "Events",
            { groupId: { [Op.lte]: 5 } },
            options
        );
    },
};
