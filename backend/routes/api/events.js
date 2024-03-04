const express = require("express");
const {
    validateVenueData,
    validateEventData,
} = require("../../utils/old_validators");
const {
    Event,
    EventImage,
    User,
    Group,
    Venue,
    Attendance,
    Membership,
} = require("../../db/models");
const { Sequelize, EmptyResultError } = require("sequelize");
const router = express.Router();

router.post("/:eventId/images", async (req, res, next) => {
    let { eventId } = req.params;
    eventId = parseInt(eventId);

    const foundEvent = await Event.findByPk(eventId);
    if (!foundEvent)
        return res.status(404).json({ message: "Event couldn't be found" });

    const { url, preview } = req.body;

    // no validation according to API docs

    const newImage = await EventImage.create({
        eventId,
        url,
        preview,
    });

    res.json({
        id: newImage.id,
        url: newImage.url,
        preview: newImage.preview,
    });
});

router.put("/:eventId", async (req, res, next) => {
    const { eventId } = req.params;

    const foundEvent = await Event.findByPk(eventId);
    if (!foundEvent)
        return res.status(404).json({ message: "Event couldn't be found" });

    const {
        venueId,
        name,
        type,
        capacity,
        price,
        description,
        startDate,
        endDate,
    } = req.body;

    const foundVenue = await Venue.findByPk(venueId);
    if (!foundVenue)
        return res.status(404).json({ message: "Venue couldn't be found" });

    if (!validateEventData(req, res)) return;

    foundEvent.venueId = venueId;
    foundEvent.name = name;
    foundEvent.type = type;
    foundEvent.capacity = capacity;
    foundEvent.price = price;
    foundEvent.description = description;
    foundEvent.startDate = startDate;
    foundEvent.endDate = endDate;

    await foundEvent.save();

    res.json({
        id: foundEvent.id,
        groupId: foundEvent.groupId,
        venueId: foundEvent.venueId,
        name: foundEvent.name,
        type: foundEvent.type,
        capacity: foundEvent.capacity,
        price: foundEvent.price,
        description: foundEvent.description,
        startDate: foundEvent.startDate,
        endDate: foundEvent.endDate,
    });
});

router.delete("/:eventId", async (req, res, next) => {
    const { eventId } = req.params;

    const foundEvent = await Event.findByPk(eventId);
    if (!foundEvent)
        return res.status(404).json({ message: "Event couldn't be found" });

    await foundEvent.destroy();

    res.json({ message: "Successfully deleted" });
});

router.get("/:eventId/attendees", async (req, res, next) => {
    const { eventId } = req.params;
    const { user } = req;

    const options = {
        include: [
            {
                model: User,
                through: {
                    where: { eventId },
                    attributes: ["status"],
                },
                attributes: ["id", "firstName", "lastName"],
            },
            {
                model: Group,
                attributes: ["organizerId"],
                include: [
                    {
                        model: User,
                        as: "Member",
                        through: { attributes: ["status"] },
                    },
                ],
            },
        ],
        attributes: [],
    };

    let foundEvent = await Event.findByPk(eventId, options);
    if (!foundEvent)
        return res.status(404).json({ message: "Event couldn't be found" });

    foundEvent = foundEvent.toJSON();

    const orgId = foundEvent.Group.organizerId;
    let isCoHost = false;
    if (foundEvent.Group.Member[0]) {
        console.log(foundEvent.Group.Member[0].Membership.status === "co-host");
        isCoHost = foundEvent.Group.Member[0].Membership.status === "co-host";
    }
    delete foundEvent.Group;

    // if user isn't organizer...
    if (orgId !== user.id && !isCoHost) {
        return res.json({
            Attendees: foundEvent.Users.filter(
                (user) => user.Attendance.status !== "pending"
            ),
        });
    } else res.json({ Attendees: foundEvent.Users });
});

router.post("/:eventId/attendance", async (req, res, next) => {
    const { user } = req;
    let { eventId } = req.params;
    eventId = parseInt(eventId);

    const foundEvent = await Event.findByPk(eventId, {
        include: [
            {
                model: User,
                through: {
                    where: { eventId },
                    attributes: ["id", "status"],
                },
            },
        ],
    });
    if (!foundEvent)
        return res.status(404).json({ message: "Event couldn't be found" });

    const existingUser = foundEvent.Users.find(
        (attendee) => attendee.id === user.id
    );
    if (existingUser) {
        if (existingUser.Attendance.status === "pending") {
            return res
                .status(400)
                .json({ message: "Attendance has already been requested" });
        } else
            return res
                .status(400)
                .json({ message: "User is already an attendee of the event" });
    }

    const newAttendee = await Attendance.create({
        eventId,
        userId: user.id,
        status: "pending",
    });

    res.json({
        eventId: newAttendee.eventId,
        userId: newAttendee.userId,
        status: newAttendee.status,
    });
});

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

    // parse decimal strings into decimals (postgres thing)
    foundEvent.dataValues.price = parseFloat(foundEvent.dataValues.price);
    foundEvent.dataValues.Venue.lat = parseFloat(
        foundEvent.dataValues.Venue.lat
    );
    foundEvent.dataValues.Venue.lng = parseFloat(
        foundEvent.dataValues.Venue.lng
    );

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
