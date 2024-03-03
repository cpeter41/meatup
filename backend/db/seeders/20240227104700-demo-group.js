"use strict";

const { Group } = require("../models");
const { Op } = require("sequelize");

let options = { validate: true };
if (process.env.NODE_ENV === "production") {
    options.schema = process.env.SCHEMA;
}

const groups = [
    {
        organizerId: 2,
        name: "Goofy Goobers",
        about: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris facilisis congue odio, id tempor nisl gravida ut. Vestibulum eget purus elit.",
        type: "Online",
        private: false,
        city: "Austin",
        state: "TX",
    },
    {
        organizerId: 3,
        name: "Orange County Hiking Club",
        about: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris facilis",
        type: "In person",
        private: false,
        city: "Laguna Niguel",
        state: "CA",
    },
    {
        organizerId: 1,
        name: "Los Angeles Divorced Dads",
        about: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris facilisis congue odio, id tempor nisl gravida ut.",
        type: "In person",
        private: false,
        city: "Anaheim",
        state: "CA",
    },
    {
        organizerId: 4,
        name: "South Coast Tabletop Club",
        about: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        type: "Online",
        private: true,
        city: "Dana Point",
        state: "CA",
    },
    {
        organizerId: 5,
        name: "Mensa 2",
        about: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        type: "In person",
        private: false,
        city: "Hattiesburg",
        state: "MS",
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
        await Group.bulkCreate(groups, options);
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        await queryInterface.bulkDelete(
            "Groups",
            {
                name: {
                    [Op.in]: [
                        "Goofy Goobers",
                        "Orange County Hiking Club",
                        "Los Angeles Divorced Dads",
                        "South Coast Tabletop Club",
                        "Mensa 2",
                    ],
                },
            },
            options
        );
    },
};
