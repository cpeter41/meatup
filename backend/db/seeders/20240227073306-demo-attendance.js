"use strict";

const { Attendance } = require("../models");
const { Op } = require("sequelize");

let options = { validate: true };
if (process.env.NODE_ENV === "production") {
    options.schema = process.env.SCHEMA;
}

const attendances = [
    {
        eventId: 1,
        userId: 1,
        status: "attending",
    },
    {
        eventId: 2,
        userId: 2,
        status: "pending",
    },
    {
        eventId: 3,
        userId: 3,
        status: "waitlist",
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
        await Attendance.bulkCreate(attendances, options);
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        await queryInterface.bulkDelete(
            "Attendances",
            { userId: { [Op.lte]: 5 } },
            options
        );
    },
};
