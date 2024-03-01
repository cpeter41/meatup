const express = require("express");
const { validateVenueData } = require("../../utils/old_validators");
const { Event, EventImage, User, Group, Venue } = require("../../db/models");
const { Sequelize } = require("sequelize");
const router = express.Router();

router.get("/:eventId", async (req, res, next) => {
    const { eventId } = req.params;
    const foundEvent = await Event.findByPk(eventId, {
        attributes: [
            "id",
            "groupId",
            "venueId",
            "name",
            "description",
            "type",
            "capacity",
            "price",
            "startDate",
            "endDate",
        ],
        include: [
            {
                model: Group,
                attributes: ["id", "name", "private", "city", "state"],
            },
            {
                model: Venue,
                attributes: ["id", "address", "city", "state", "lat", "lng"],
            },
            {
                model: EventImage,
                attributes: ["id", "url", "preview"],
            },
        ],
    });

    if (!foundEvent)
        return res.status(404).json({ message: "Event couldn't be found" });

    // consider using aggregate fn instead of count
    const numAttending = await foundEvent.countUsers();
    foundEvent.dataValues.numAttending = numAttending;

    res.json(foundEvent);
});

router.get("/", async (req, res, next) => {
    const events = await Event.findAll({
        attributes: [
            "id",
            "groupId",
            "venueId",
            "name",
            "type",
            "startDate",
            "endDate",
        ],
        include: [
            {
                model: Group,
                attributes: ["id", "name", "city", "state"],
            },
            {
                model: Venue,
                attributes: ["id", "city", "state"],
            },
        ],
    });

    // consider using aggregate fn instead of for loop
    for (let event of events) {
        const numAttending = await event.countUsers();
        event.dataValues.numAttending = numAttending;

        const previewImage = await EventImage.findOne({
            where: { eventId: event.dataValues.id },
        });
        if (previewImage)
            event.dataValues.previewImage = previewImage.dataValues.url;
        else event.dataValues.previewImage = null;
    }

    res.json({ Events: events });
});

module.exports = router;
