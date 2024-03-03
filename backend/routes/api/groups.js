const express = require("express");
const {
    validateGroupData,
    validateVenueData,
    validateEventData,
} = require("../../utils/old_validators");
const {
    Group,
    User,
    GroupImage,
    Venue,
    Event,
    EventImage,
} = require("../../db/models");
const { Op } = require("sequelize");
const router = express.Router();

// CONSIDER SWITCHING HELPER VALIDATOR TO EXPRESS-VALIDATOR CHAIN

const setPreviewImage = (groups) => {
    groups.forEach((group) => {
        const images = group.dataValues.GroupImages;
        let url;
        if (images.length) url = images.find((img) => img.preview);
        if (url) group.dataValues.previewImage = url.dataValues.url;
        else group.dataValues.previewImage = null;
        delete group.dataValues.GroupImages;
    });
};

// GET api/groups/current
router.get("/current", async (req, res, next) => {
    const { user } = req;
    const groups = await Group.findAll({
        include: [
            {
                model: User,
                as: "Member",
                through: { where: { userId: user.id } },
                attributes: [],
            },
            {
                model: GroupImage,
            },
        ],
        where: {
            [Op.or]: [{ organizerId: user.id }, { "$Member.id$": user.id }],
        },
    });

    for (let group of groups) {
        const numMembers = await group.countMember();
        group.dataValues.numMembers = numMembers;
    }
    setPreviewImage(groups);

    res.json(groups);
});

router.get("/:groupId", async (req, res, next) => {
    let { groupId } = req.params;
    groupId = parseInt(groupId);

    const foundGroup = await Group.findByPk(groupId, {
        include: [
            { model: User, as: "Member", attributes: [] },
            { model: GroupImage },
            {
                model: User,
                as: "Organizer",
                attributes: ["id", "firstName", "lastName"],
            },
            { model: Venue },
        ],
    });

    foundGroup.dataValues.numMembers = await foundGroup.countMember();

    res.json(foundGroup);
});

router.get("/:groupId/members", async (req, res, next) => {
    const { groupId } = req.params;
    const { user } = req;

    const options = {
        include: [
            {
                model: User,
                as: "Member",
                through: {
                    where: { groupId: groupId },
                    attributes: ["status"],
                },
                attributes: ["id", "firstName", "lastName"],
            },
        ],
        attributes: ["organizerId"],
    };

    let foundGroup = await Group.findByPk(groupId, options);
    if (!foundGroup)
        return res.status(404).json({ message: "Group couldn't be found" });

    foundGroup = foundGroup.toJSON();
    const orgId = foundGroup.organizerId;
    delete foundGroup.organizerId;

    // if user isn't organizer...
    if (orgId !== user.id) {
        return res.json({
            Members: foundGroup.Member.filter(
                (member) => member.Membership.status !== "pending"
            ),
        });
    }
    else res.json({ Members: foundGroup.Member });
});

router.post("/:groupId/images", async (req, res, next) => {
    let { groupId } = req.params;
    groupId = parseInt(groupId);

    const foundGroup = await Group.findByPk(groupId);
    if (!foundGroup)
        return res.status(404).json({ message: "Group couldn't be found" });

    const { url, preview } = req.body;

    const newGroupImage = await GroupImage.create({ groupId, url, preview });

    res.json({
        id: newGroupImage.id,
        url: newGroupImage.url,
        preview: newGroupImage.preview,
    });
});

router.get("/:groupId/venues", async (req, res, next) => {
    let { groupId } = req.params;
    groupId = parseInt(groupId);

    const venues = await Venue.findAll({
        include: [
            {
                model: Group,
                attributes: [],
            },
        ],
        where: { "$Group.id$": groupId },
    });

    res.json({ Venues: venues });
});

router.post("/:groupId/venues", async (req, res, next) => {
    let { groupId } = req.params;
    groupId = parseInt(groupId);
    const foundGroup = await Group.findByPk(groupId);
    if (!foundGroup)
        return res.status(404).json({ message: "Group couldn't be found" });

    const { address, city, state, lat, lng } = req.body;
    if (!validateVenueData(req, res)) return;

    const newVenue = await Venue.create({
        groupId,
        address,
        city,
        state,
        lat,
        lng,
    });

    res.json({
        id: newVenue.id,
        groupId: newVenue.groupId,
        address: newVenue.address,
        city: newVenue.city,
        state: newVenue.state,
        lat: parseFloat(newVenue.lat),
        lng: parseFloat(newVenue.lng),
    });
});

router.get("/:groupId/events", async (req, res, next) => {
    const { groupId } = req.params;
    const events = await Event.findAll({
        where: { groupId: groupId },
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

    if (!events.length)
        return res.status(404).json({ message: "Group couldn't be found" });

    // consider using aggregate fn instead of for loop
    for (let event of events) {
        const numAttending = await event.countUsers();
        event.dataValues.numAttending = numAttending;

        const previewImage = await EventImage.findOne({
            where: { eventId: event.id },
        });
        if (previewImage) event.dataValues.previewImage = previewImage.url;
        else event.dataValues.previewImage = null;
    }

    res.json({ Events: events });
});

router.post("/:groupId/events", async (req, res, next) => {
    let { groupId } = req.params;
    groupId = parseInt(groupId);

    const foundGroup = await Group.findByPk(groupId);
    if (!foundGroup)
        return res.status(404).json({ message: "Group couldn't be found" });

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

    const newEvent = await Event.create({
        groupId,
        venueId: venueId || null,
        name,
        type,
        capacity,
        price,
        description,
        startDate,
        endDate,
    });

    res.json({
        id: newEvent.id,
        groupId: newEvent.groupId,
        venueId: newEvent.venueId,
        name: newEvent.name,
        type: newEvent.type,
        capacity: newEvent.capacity,
        price: newEvent.price,
        description: newEvent.description,
        startDate: newEvent.startDate,
        endDate: newEvent.endDate,
    });
});

router.put("/:groupId", async (req, res, next) => {
    const { name, about, type, private, city, state } = req.body;
    const { groupId } = req.params;
    const foundGroup = await Group.findByPk(groupId);
    if (!foundGroup)
        return res.status(404).json({ message: "Group couldn't be found" });

    if (!validateGroupData(req, res)) return;

    foundGroup.name = name;
    foundGroup.about = about;
    foundGroup.type = type;
    foundGroup.private = private;
    foundGroup.city = city;
    foundGroup.state = state;

    await foundGroup.save();

    res.json(foundGroup);
});

router.delete("/:groupId", async (req, res, next) => {
    const { groupId } = req.params;

    const foundGroup = await Group.findByPk(groupId);
    if (!foundGroup)
        return res.status(404).json({ message: "Group couldn't be found" });

    await foundGroup.destroy();

    res.json({ message: "Successfully deleted" });
});

// GET /api/groups
router.get("/", async (req, res, next) => {
    const groups = await Group.findAll({
        include: [
            {
                model: User,
                as: "Member",
            },
            { model: GroupImage },
        ],
    });

    groups.forEach((group) => {
        group.dataValues.numMembers = group.Member.length;
        delete group.dataValues.Member;
    });

    setPreviewImage(groups);

    res.json({ Groups: groups });
});

router.post("/", async (req, res, next) => {
    const { name, about, type, private, city, state } = req.body;
    const { user } = req;

    if (!validateGroupData(req, res)) return;

    const newGroup = await Group.create({
        organizerId: user.id,
        name,
        about,
        type,
        private,
        city,
        state,
    });

    res.status(201).json(newGroup);
});

module.exports = router;
