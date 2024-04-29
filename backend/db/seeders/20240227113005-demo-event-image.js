"use strict";

const { EventImage } = require("../models");
const { Op } = require("sequelize");

let options = { validate: true };
if (process.env.NODE_ENV === "production") {
    options.schema = process.env.SCHEMA;
}

const eventImages = [
    {
        eventId: 1,
        url: "https://cdn.saleminteractivemedia.com/186/content/278804/bbq-ribs-quiz-880x440.jpg",
        preview: true,
    },
    {
        eventId: 2,
        url: "https://www.passionforpork.com/wp-content/uploads/2013/10/bc_pork_great_canadian_sausage_making_competition_9.jpg",
        preview: true,
    },
    {
        eventId: 3,
        url: "https://assets.bonappetit.com/photos/58aae4571c71b61d8a562f51/4:3/w_3260,h_2445,c_limit/GettyImages-526366486.jpg",
        preview: true,
    },
    {
        eventId: 4,
        url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRm6dYeZjrJc7TmMVHRpxWX2LEI1Z-TQ-kG27xdeRDYmw&s",
        preview: true,
    },
    {
        eventId: 5,
        url: "https://www.billboard.com/wp-content/uploads/2023/03/rammstein-prague-cr-matthias-matthies-2022-billboard-1548.jpg?w=942&h=623&crop=1",
        preview: true,
    },
    {
        eventId: 6,
        url: "https://upload.wikimedia.org/wikipedia/commons/9/91/Pizza-3007395.jpg",
        preview: true,
    },
    {
        eventId: 7,
        url: "https://cdn.mos.cms.futurecdn.net/7qYc6jWRZSx5cwCNEw85xj.jpg",
        preview: true,
    },
    {
        eventId: 8,
        url: "https://d7hftxdivxxvm.cloudfront.net/?quality=80&resize_to=width&src=https%3A%2F%2Fartsy-media-uploads.s3.amazonaws.com%2F-EKPTcrTup6_KShRV4SQZg%252Fa_bold_bluff.jpg&width=910",
        preview: true,
    },
    {
        eventId: 9,
        url: "https://upload.wikimedia.org/wikipedia/commons/b/b8/Speed_dating_scene.jpg",
        preview: true,
    },
    {
        eventId: 10,
        url: "https://m.media-amazon.com/images/M/MV5BMTg3NjUxMzM5NV5BMl5BanBnXkFtZTcwMzQ1NjQzMw@@._V1_.jpg",
        preview: true,
    },
    {
        eventId: 11,
        url: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjH0cbASNy56vX8B6ZMpTrBffbvOHd0IbiwF1ThbPJgTt0H7EpIiHvl7SbxsqR1fAWG3e3SQ-lWutx1Z0XVgrZpyIsbd-yOovKpitCdAAV3LF58FXvm6KkC-ESVKowCSUaXCxskSiGzKFjo/s1600/bacon-1024x754.jpg",
        preview: true,
    },
    {
        eventId: 12,
        url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWB1SfQ0MDF7is3RrYBL6ilMYEa-aLnRqWQFntz_Eo5Q&s",
        preview: true,
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
        await EventImage.bulkCreate(eventImages, options);
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        // options.tableName = "EventImages";
        await queryInterface.bulkDelete(
            "EventImages",
            // { eventId: { [Op.lte]: 5 } },
            null,
            options
        );
    },
};
