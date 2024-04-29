"use strict";

const { Venue } = require("../models");
const { Op } = require("sequelize");

let options = { validate: true };
if (process.env.NODE_ENV === "production") {
    options.schema = process.env.SCHEMA;
}

const venues = [
    {
        groupId: 1,
        address: "1234 Street St.",
        city: "Dana Point",
        state: "CA",
        lat: 50.1938495,
        lng: -30.1293864,
    },
    {
        groupId: 2,
        address: "9128 Road Rd.",
        city: "New York",
        state: "NY",
        lat: 89.1938495,
        lng: -100.1293864,
    },
    {
        groupId: 3,
        address: "8 Doober Pl.",
        city: "Boise",
        state: "ID",
        lat: -40.1938495,
        lng: -150.1293864,
    },
    {
        groupId: 4,
        address: "1000 Nyes Pl.",
        city: "Somerville",
        state: "ME",
        lat: 0,
        lng: 0,
    },
    {
        groupId: 4,
        address: "70 Bubble Blvd.",
        city: "Los Angeles",
        state: "CA",
        lat: 1.2345678,
        lng: -9.1011121,
    },
    {
        groupId: 5,
        address: "4 Lore Ct.",
        city: "Bellevue",
        state: "WA",
        lat: -45.101011,
        lng: 90.0,
    },
    {
        // 7
        groupId: 6,
        address: "683 Johnny Walker Ln.",
        city: "Memphis",
        state: "TN",
        lat: -40.8237467,
        lng: 20.0,
    },
    {
        groupId: 2,
        address: "43 Alamo Dr.",
        city: "Austin",
        state: "TX",
        lat: 0,
        lng: 0,
    },
    {
        groupId: 5,
        address: "55 Lancaster St.",
        city: "Hattiesburg",
        state: "MS",
        lat: 0,
        lng: 0,
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
        await Venue.bulkCreate(venues, options);
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        await queryInterface.bulkDelete(
            "Venues",
            // { groupId: { [Op.lte]: 5 } },
            null,
            options
        );
    },
};
