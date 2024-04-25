"use strict";

const { Group } = require("../models");

let options = { validate: true };
if (process.env.NODE_ENV === "production") {
    options.schema = process.env.SCHEMA;
}

const groups = [
    {
        organizerId: 2,
        name: "Ribeye Fanclub",
        about: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris facilisis congue odio, id tempor nisl gravida ut. Vestibulum eget purus elit.",
        type: "Online",
        private: false,
        city: "Austin",
        state: "TX",
    },
    {
        organizerId: 3,
        name: "Los Angeles Barbeque Squadron",
        about: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris facilis",
        type: "In person",
        private: false,
        city: "Los Angeles",
        state: "CA",
    },
    {
        organizerId: 1,
        name: "Filet Fiends",
        about: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris facilisis congue odio, id tempor nisl gravida ut.",
        type: "In person",
        private: false,
        city: "Anaheim",
        state: "CA",
    },
    {
        organizerId: 4,
        name: "The Sausage Fest",
        about: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        type: "Online",
        private: true,
        city: "Dana Point",
        state: "CA",
    },
    {
        organizerId: 5,
        name: "Meat Pie Enjoyers",
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
            null,
            options
        );
    },
};
