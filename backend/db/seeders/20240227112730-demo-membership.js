'use strict';

const { Membership } = require("../models");
const { Op } = require("sequelize");

let options = { validate: true };
if (process.env.NODE_ENV === "production") {
    options.schema = process.env.SCHEMA;
};

const memberships = [
    {
        userId: 1,
        groupId: 1,
        status: "co-host"
    },
    {
        userId: 2,
        groupId: 1,
        status: "co-host"
    },
    {
        userId: 2,
        groupId: 2,
        status: "member"
    },
    {
        userId: 3,
        groupId: 2,
        status: "pending"
    },
    {
        userId: 4,
        groupId: 3,
        status: "co-host"
    },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await Membership.bulkCreate(memberships, options);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Memberships', {
        userId: {
            [Op.lte]: 5
        }
    }, options);
  }
};
