"use strict";

const { User } = require('../models');
const bcrypt = require('bcryptjs');

let options = {};
if (process.env.NODE_ENV === 'production') {
    options.schema = process.env.SCHEMA;
};

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
        await User.bulkCreate([
            {
                username: "demoguy",
                email: "demo@guy.com",
                hashedPassword: bcrypt.hashSync('password123')
            }
        ], { validate: true });
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        options.tableName = "Users";
        await queryInterface.bulkDelete(options, {
            username: "demoguy"
        }, {});
    },
};
