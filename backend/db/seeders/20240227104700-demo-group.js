"use strict";

const { Group } = require("../models");

let options = { validate: true };
if (process.env.NODE_ENV === "production") {
    options.schema = process.env.SCHEMA;
}

const groups = [
    {
        organizerId: 1,
        name: "Filet Friends",
        about: "This is the demo user's Group.",
        type: "In person",
        private: false,
        city: "Bellevue",
        state: "WA",
    },
    {
        organizerId: 2,
        name: "Ribeye Fanclub",
        about: "Welcome to the Ribeye Fanclub, where succulence meets sizzle! Join us in celebrating the unparalleled flavor, marbling perfection, and juicy tenderness of the king of steaks. Whether you prefer it grilled, seared, or smoked, our club is a haven for those who appreciate the artistry of a perfectly cooked ribeye. Come savor the steak experience with us!",
        type: "Online",
        private: false,
        city: "Austin",
        state: "TX",
    },
    {
        organizerId: 3,
        name: "Los Angeles Barbeque Squadron",
        about: "Introducing the LA BBQ Squadron, where smoke signals friendship and flavor reigns supreme! Join our sizzling community of grill masters, pit enthusiasts, and BBQ aficionados as we gather to share recipes, swap smoking techniques, and bond over the irresistible aroma of slow-cooked perfection. From mouthwatering ribs to tender brisket, every gathering is a celebration of good food and great company. Come stoke the flames of friendship with us!",
        type: "In person",
        private: false,
        city: "Los Angeles",
        state: "CA",
    },
    {
        organizerId: 4,
        name: "The Sausage Fest",
        about: "Welcome to the The Sausage Fest! Dive into a world of savory delights with fellow enthusiasts. From classic bratwurst to exotic merguez, join us to share recipes, swap tips, and savor the flavor-packed journey of every link. Come join the sizzle!",
        type: "Online",
        private: true,
        city: "Dana Point",
        state: "CA",
    },
    {
        organizerId: 5,
        name: "Meat Pie Connoisseurs Collective",
        about: "Welcome to the Meat Pie Connoisseurs Collective! Join fellow enthusiasts in celebrating the ultimate comfort food: meat pies. From flaky crusts to savory fillings, our club is dedicated to sharing recipes, swapping tips, and indulging in the timeless joy of every delicious bite. Join us in honoring this culinary classic!",
        type: "In person",
        private: false,
        city: "Hattiesburg",
        state: "MS",
    },
    {
        organizerId: 3,
        name: '"Hot Chicks" Chicken Enthusiasts',
        about: 'Introducing the "Hot Chicks" Chicken Enthusiasts Join us in celebrating the versatile and flavorful world of chicken. Whether you\'re a grilling guru, a roasting aficionado, or a stir-fry sensation, our club is the perfect place to share recipes, swap cooking techniques, and revel in the delicious possibilities of this beloved protein. From crispy wings to succulent thighs, come cluck around with us!',
        type: "In person",
        private: true,
        city: "Memphis",
        state: "TN",
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
        await queryInterface.bulkDelete("Groups", null, options);
    },
};
