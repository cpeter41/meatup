"use strict";

const { Event } = require("../models");
const { Op } = require("sequelize");

let options = { validate: true };
if (process.env.NODE_ENV === "production") {
    options.schema = process.env.SCHEMA;
}

const events = [
    {
        venueId: 5,
        groupId: 3,
        name: "BBQuiz Trivia Night",
        description:
            "Fire up the grill and get ready to test your BBQ knowledge! Join us for a sizzling evening of trivia where we'll explore everything from regional barbecue styles to famous pitmasters. " +
            "From smokey secrets to mouthwatering recipes, come hungry for fun facts and delicious competition at our BBQ-themed trivia night!",
        type: "In person",
        capacity: 24,
        price: 0,
        startDate: "2024-07-01 00:00:00",
        endDate: "2024-07-02 00:00:00",
    },
    {
        venueId: 3,
        groupId: 4,
        name: "The Best of the Wurst Sausage Contest",
        description:
            "Step into the sizzling world of sausage supremacy at our epic sausage contest! Watch as grill masters and culinary wizards showcase their skills in crafting the perfect links. " +
            "From classic bratwurst to exotic chorizo, the aroma of spices and sizzling meat will tantalize your taste buds. Join us for a flavorful showdown where judges and attendees alike " +
            "will crown the ultimate sausage champion. Get ready to indulge in a smorgasbord of savory delights and witness the artistry of sausage-making unfold before your eyes!",
        type: "Online",
        capacity: 50,
        price: 29.99,
        startDate: "2024-06-01 00:00:00",
        endDate: "2024-06-01 06:00:00",
    },
    {
        venueId: 7,
        groupId: 6,
        name: '"Flippin\' the Bird" Rotisserie Chicken Night',
        description:
            "Get ready to spin into a world of succulent flavors at our Rotisserie Chicken Extravaganza! Join us as we celebrate the crispy, juicy perfection of everyone's favorite bird on a spit. " +
            "From traditional herb-infused classics to bold, globally-inspired marinades, our event promises a mouthwatering journey through the art of rotisserie chicken. Whether you're a die-hard " +
            "fan or a newcomer to the rotisserie game, come feast with us as we pay homage to this beloved culinary delight. It's an event that'll leave you clucking for more!",
        type: "In person",
        capacity: 30,
        price: 9.49,
        startDate: "2024-06-20 00:00:00",
        endDate: "2024-06-21 00:00:00",
    },
    {
        venueId: 5,
        groupId: 1,
        name: "Filet Tasting Sesh",
        description:
            "Indulge in the pinnacle of steak perfection at our Filet Mignon Tasting Sesh! Sample expertly-seared cuts of premium beef, paired with fine wines and delectable sides. Join us for a night of " +
            "culinary sophistication as we celebrate the buttery tenderness and rich flavors of this beloved delicacy.",
        type: "In person",
        capacity: 16,
        price: 39.99,
        startDate: "2024-03-20 12:00:00",
        endDate: "2024-03-20 15:00:00",
    },
    {
        venueId: 6,
        groupId: 1,
        name: "Flamin' Yon Concert",
        description:
            "Get ready to ignite your night with Flamin' Yon! Join us for a scorching concert experience filled with electrifying performances and fiery riffs. From blazing guitar solos to explosive rhythms, " +
            "Flamin' Yon promises to set the stage ablaze with their unique blend of rock and roll energy. Don't miss your chance to rock out with one of the hottest bands in town!",
        type: "In person",
        capacity: 200,
        price: 65.49,
        startDate: "2024-06-20 18:00:00",
        endDate: "2024-06-21 00:00:00",
    },
    {
        venueId: 6,
        groupId: 1,
        name: "Pizza Party",
        description:
            "Join us for the ultimate pizza extravaganza! Indulge in a cheesy, saucy celebration where every slice tells a delicious story. From classic Margheritas to bold BBQ chicken, our pizza party promises a " +
            "mouthwatering journey through flavor town. Bring your appetite and join the fun as we gather to enjoy everyone's favorite culinary delight - pizza!",
        type: "In person",
        capacity: 30,
        price: 0,
        startDate: "2024-11-11 12:30:00",
        endDate: "2024-11-11 17:00:00",
    },
    {
        venueId: 8,
        groupId: 2,
        name: "Marinade & Serenade Karaoke Night",
        description:
            "Get ready for a melodious marinade of music and merriment at our Marinade & Serenade Karaoke Night! Join us for a flavorful evening where you can marinate your vocals with your favorite tunes while indulging " +
            "in delicious meats and drinks. Whether you're a seasoned karaoke pro or a first-time crooner, come serenade the night away in a fun and festive atmosphere. It's a karaoke experience that's sure to leave you " +
            "singing and savoring every moment!",
        type: "In person",
        capacity: 12,
        price: 24.99,
        startDate: "2024-08-08 18:30:00",
        endDate: "2024-08-09 00:00:00",
    },
    {
        venueId: 6,
        groupId: 1,
        name: "High Steaks Poker Night",
        description:
            "Ante up for a sizzling evening of stakes and steaks at our High Steaks Poker Night! Join us for a high-stakes game where you can feast on juicy cuts of prime beef while testing your poker skills. From ribeyes to " +
            "sirloins, our menu promises to keep you fueled for the showdown. Gather your friends, sharpen your cards, and prepare for a night of savory indulgence and thrilling competition!",
        type: "In person",
        capacity: 8,
        price: 24.99,
        startDate: "2024-01-14 14:30:00",
        endDate: "2024-01-14 20:00:00",
    },
    {
        venueId: 8,
        groupId: 2,
        name: "Meat Cute Speed Dating",
        description:
            "Get ready to meat your match at Meat Cute Speed Dating! Join us for a unique and flavorful twist on traditional speed dating, where carnivores and omnivores alike can bond over their love of all" +
            "things meaty. From juicy conversations to tender connections, it's a chance to savor the moment and find your perfect pairing. Whether you prefer ribeye or chicken wings, come meet fellow meat enthusiasts in a fun and " +
            "relaxed atmosphere. Who knows? You might just find the missing ingredient to your heart!",
        type: "Online",
        capacity: 50,
        price: 0,
        startDate: "2025-01-01 00:00:00",
        endDate: "2025-01-01 12:00:00",
    },
    {
        venueId: 9,
        groupId: 5,
        name: "Sweeney Todd Movie Night",
        description:
            "Experience the dark and delicious tale of Sweeney Todd like never before at our Sweeney Todd Movie Night Event! Join us for a chilling cinematic journey into the macabre world of Victorian London, where revenge " +
            "and razor-sharp wit collide. Sit back, but keep a tight grip on your popcorn, as we immerse ourselves in the haunting melodies and savory thrills of this iconic musical masterpiece. With every twist of the plot, you'll be on " +
            "the edge of your seat, entranced by Sweeney Todd's sinister charm. It's a night of cinema that's sure to leave you both spellbound and hungry for more.",
        type: "In person",
        capacity: 50,
        price: 0,
        startDate: "2024-10-31 18:00:00",
        endDate: "2026-10-31 23:59:59",
    },
    {
        venueId: 9,
        groupId: 5,
        name: "Great British Bacon-Off",
        description:
            "Prepare your taste buds for a sizzling showdown at 'The Great British Bacon-Off'! Join us for a bacon extravaganza where chefs compete to create the most mouthwatering bacon dishes imaginable. From crispy classics to " +
            "innovative bacon-inspired creations, it's a celebration of all things bacon. Indulge in the smoky, savory goodness and cast your vote for the ultimate bacon champion. Get ready to pig out and savor every crispy, delicious moment!",
        type: "In person",
        capacity: 13,
        price: 12.99,
        startDate: "2024-03-01 00:00:00",
        endDate: "2024-03-01 06:00:00",
    },
    {
        venueId: 8,
        groupId: 2,
        name: "Prime Ribbing Comedy Roast",
        description:
            "Get ready to roast and toast at our Prime Ribbing Comedy Roast! Join us for a night of hearty laughter and savory jokes as we grill, slice, and carve through the finest cuts of comedy. From well-done punchlines to rare " +
            "zingers, our lineup of comedians will have you chuckling your way through a carnivorous feast of humor. So bring your appetite for laughs and prepare for a side-splitting evening that's sure to leave you well-seasoned and satisfied!",
        type: "In person",
        capacity: 60,
        price: 22.49,
        startDate: "2024-12-19 19:00:00",
        endDate: "2026-12-19 23:59:59",
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
        await Event.bulkCreate(events, options);
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        // options.tableName = "Events";
        await queryInterface.bulkDelete(
            "Events",
            // { groupId: { [Op.lte]: 5 } },
            null,
            options
        );
    },
};
