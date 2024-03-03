"use strict";

const { User } = require("../models");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");

let options = { validate: true };
if (process.env.NODE_ENV === "production") {
    options.schema = process.env.SCHEMA;
}

const users = [
    {
        firstName: "John",
        lastName: "Smith",
        username: "demoguy",
        email: "demo@guy.com",
        hashedPassword: bcrypt.hashSync("password123"),
    },
    {
        firstName: "Chris",
        lastName: "Peters",
        username: "spingo",
        email: "spingo@gmail.com",
        hashedPassword: bcrypt.hashSync("securepassword!"),
    },
    {
        firstName: "Jill",
        lastName: "Book",
        username: "entropyth",
        email: "jill@book.com",
        hashedPassword: bcrypt.hashSync("pass1234"),
    },
    {
        firstName: "Jake",
        lastName: "Michaels",
        username: "JMdude",
        email: "jmichaels@aol.net",
        hashedPassword: bcrypt.hashSync("helloworld!"),
    },
    {
        firstName: "Allison",
        lastName: "Shmallison",
        username: "aliS",
        email: "aliS@gmail.com",
        hashedPassword: bcrypt.hashSync("7a5ej1#cj2c*"),
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
        await User.bulkCreate(users, options);

        const users = await User.findAll();
        console.log(users);

        /*
            users table not populated after seed? check with code above ^
        */


    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        // options.tableName = "Users";
        options.tableName = "Users";
        await queryInterface.bulkDelete(
            options,
            {
                username: {
                    [Op.in]: [
                        "demoguy",
                        "spingo",
                        "entropyth",
                        "JMdude",
                        "aliS",
                    ],
                },
            },
            {}
        );
    },
};
