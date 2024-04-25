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
        url: "https://girlscangrill.com/wp-content/uploads/2023/05/sliced-ninja-ribeye-500x500.jpg",
        preview: true,
    },
    {
        groupId: 2,
        url: "https://assets3.thrillist.com/v1/image/3080265/750x500.jpg",
        preview: true,
    },
    {
        groupId: 3,
        url: "https://hips.hearstapps.com/hmg-prod/images/delish-filet-mignon-horizontal-1541189043.jpeg",
        preview: true,
    },
    {
        groupId: 4,
        url: "https://www.thespruceeats.com/thmb/nEMd5amKMZn798vYigT5jO_wJLU=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/assorted-german-sausages-126552028-5812490d3df78c2c7362bd64.jpg",
        preview: true,
    },
    {
        groupId: 5,
        url: "https://www.recipetineats.com/wp-content/uploads/2021/09/Meat-Pie-Family-Size_39-new-SQ.jpg",
        preview: true,
    },
    {
        groupId: 3,
        url: "https://cdn.apartmenttherapy.info/image/upload/f_auto,q_auto:eco,c_fill,g_auto,w_1500,ar_3:2/k%2FPhoto%2FRecipes%2F2023-12-filet-mignon%2Ffilet-mignon-514.jpg",
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
        await queryInterface.bulkDelete(
            "GroupImages",
            // { groupId: { [Op.lte]: 5 } },
            null,
            options
        );
    },
};
