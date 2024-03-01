const express = require("express");
const {
    validateGroupData,
    validateVenueData,
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

// GET /api/groups
router.get("/", async (req, res, next) => {
    const groups = await Group.findAll({
        include: [
            {
                model: User,
                // attributes: [],
                as: "Member",
            },
            {
                model: GroupImage,
                // where: { preview: true },
                // attributes: ["url"],
            },
        ],
    });

    groups.forEach((group) => {
        group.dataValues.numMembers = group.dataValues.Member.length;
        delete group.dataValues.Member;
    });

    setPreviewImage(groups);

    res.json({ Groups: groups });
});

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
        id: newVenue.dataValues.id,
        groupId: newVenue.dataValues.groupId,
        address: newVenue.dataValues.address,
        city: newVenue.dataValues.city,
        state: newVenue.dataValues.state,
        lat: parseFloat(newVenue.dataValues.lat),
        lng: parseFloat(newVenue.dataValues.lng),
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
            where: { eventId: event.dataValues.id },
        });
        if (previewImage)
            event.dataValues.previewImage = previewImage.dataValues.url;
        else event.dataValues.previewImage = null;
    }

    res.json({ Events: events });
});

router.post("/:groupId/events", async (req, res, next) => {
    const { groupId } = req.params;
    // const { venueId, name, type, capacity, price, description, startDate, endDate }
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

module.exports = router;
