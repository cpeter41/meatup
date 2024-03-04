const express = require("express");
const { validateEventData } = require("../../utils/old_validators");
const {
    Event,
    EventImage,
    User,
    Group,
    Venue,
    Attendance,
} = require("../../db/models");
const { Sequelize, EmptyResultError, Op } = require("sequelize");
const { requireAuth } = require("../../utils/auth.js");
const router = express.Router();

router.post("/:eventId/images", requireAuth, async (req, res, next) => {
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

router.put("/:eventId", requireAuth, async (req, res, next) => {
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

router.delete("/:eventId", requireAuth, async (req, res, next) => {
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

router.post("/:eventId/attendance", requireAuth, async (req, res, next) => {
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

router.put("/:eventId/attendance", requireAuth, async (req, res, next) => {
    const eventId = parseInt(req.params.eventId);
    const { userId, status } = req.body;
    const { user } = req;

    if (status === "pending")
        return res.status(400).json({
            message: "Bad Request",
            errors: {
                status: "Cannot change an attendance status to pending",
            },
        });

    const foundEvent = await Group.findByPk(eventId);
    if (!foundEvent)
        return res.status(404).json({ message: "Event couldn't be found" });

    let foundUser = await User.findByPk(userId, {
        include: [
            {
                model: Group,
                as: "Member",
                through: {
                    where: { userId },
                    attributes: ["status"],
                },
            },
        ],
    });
    if (!foundUser)
        return res.status(404).json({ message: "User couldn't be found" });

    const foundAttendee = await Attendance.findOne({
        where: {
            userId,
            eventId,
        },
        attributes: ["id", "userId", "eventId", "status"],
    });

    if (!foundAttendee)
        return res.status(404).json({
            message: "Attendance between the user and the event does not exist",
        });

    foundUser = foundUser.toJSON();
    if (status === 'co-host') console.log("AJKSDHJAS", foundUser);

    foundAttendee.status = status;

    await foundAttendee.save();

    res.json({
        id: foundAttendee.id,
        eventId: foundAttendee.eventId,
        userId: foundAttendee.userId,
        status: foundAttendee.status,
    });
});

router.delete(
    "/:eventId/attendance/:userId",
    requireAuth,
    async (req, res, next) => {
        const { eventId, userId } = req.params;

        const foundUser = await User.findByPk(userId);
        if (!foundUser)
            return res.status(404).json({ message: "User couldn't be found" });
        const foundGroup = await Event.findByPk(eventId);
        if (!foundGroup)
            return res.status(404).json({ message: "Event couldn't be found" });

        const foundAttendee = await Attendance.findOne({
            where: {
                eventId,
                userId,
            },
        });

        if (!foundAttendee)
            return res
                .status(404)
                .json({ message: "Attendance does not exist for this User" });

        await foundAttendee.destroy();

        res.json({ message: "Successfully deleted attendance from event" });
    }
);

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
    let { page, size, name, type, startDate } = req.query;
    const err = { message: "Bad Request", errors: {} };

    const options = {
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
        where: {},
    };

    if (!page) page = 1;
    else if (isNaN(page) || parseInt(page) < 1 || parseInt(page) > 10)
        err.errors.page = "Page must be greater than or equal to 1";

    if (!size) size = 20;
    else if (isNaN(size) || parseInt(size) < 1 || parseInt(size) > 20)
        err.errors.size = "Size must be greater than or equal to 1";

    options.offset = parseInt(size) * (parseInt(page) - 1);
    options.limit = parseInt(size);

    if (name) {
        if (typeof name === "string" && isNaN(parseInt(name)))
            options.where.name = name;
        else err.errors.name = "Name must be a string";
    }

    if (type) {
        if (type === "Online" || type === "In person")
            options.where.type = type;
        else err.errors.type = "Type must be 'Online' or 'In person'";
    }

    if (startDate) {
        const startDateObject = new Date(startDate);
        if (
            Object.prototype.toString.call(startDateObject) === "[object Date]"
        ) {
            if (isNaN(startDateObject)) {
                err.errors.startDate = "Start date must be a valid datetime";
            } else options.where.startDate = { [Op.gte]: startDate };
        } else err.errors.startDate = "Start date must be a valid datetime";
    }

    if (Object.keys(err.errors).length) return res.status(400).json(err);

    console.log(
        "----------------------------------OPTIONS----------------------------------",
        options
    );
    const events = await Event.findAll(options);

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

    res.json({
        Events: events,
        page: parseInt(page),
        size: parseInt(size),
    });
});

module.exports = router;
