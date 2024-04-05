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
    Membership,
} = require("../../db/models");
const { requireAuth } = require("../../utils/auth.js");
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
router.get("/current", requireAuth, async (req, res, next) => {
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

    let foundGroup = await Group.findByPk(groupId, {
        include: [
            { model: User, as: "Member", attributes: [] },
            { model: GroupImage, attributes: ["id", "url", "preview"] },
            {
                model: User,
                as: "Organizer",
                attributes: ["id", "firstName", "lastName"],
            },
            { model: Venue },
        ],
    });

    if (!foundGroup)
        return res.status(404).json({ message: "Group couldn't be found" });

    foundGroup.dataValues.numMembers = await foundGroup.countMember();
    foundGroup = foundGroup.toJSON();
    // console.log(foundGroup);

    if (foundGroup.Venue && foundGroup.Venue.length) {
        for (let venue of foundGroup.Venue) {
            venue.lat = parseFloat(venue.lat);
            venue.lng = parseFloat(venue.lng);
        }
    }

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
    } else res.json({ Members: foundGroup.Member });
});

router.post("/:groupId/membership", requireAuth, async (req, res, next) => {
    const { user } = req;
    let { groupId } = req.params;
    groupId = parseInt(groupId);

    let foundGroup = await Group.findByPk(groupId, {
        include: [
            {
                model: User,
                as: "Member",
            },
        ],
    });

    if (!foundGroup)
        return res.status(404).json({ message: "Group couldn't be found" });

    foundGroup = foundGroup.toJSON();

    let existingUser;
    if (foundGroup.Member.length)
        existingUser = foundGroup.Member.find(
            (member) => member.id === user.id
        );
    if (existingUser) {
        if (existingUser.Membership.status === "pending") {
            return res
                .status(400)
                .json({ message: "Membership has already been requested" });
        } else
            return res
                .status(400)
                .json({ message: "User is already a member of the group" });
    }

    const newMember = await Membership.create({
        userId: user.id,
        groupId,
        status: "pending",
    });

    res.json({
        groupId: newMember.groupId,
        memberId: newMember.userId,
        status: newMember.status,
    });
});

router.put("/:groupId/membership", requireAuth, async (req, res, next) => {
    const groupId = parseInt(req.params.groupId);
    const { memberId, status } = req.body;
    const { user } = req;

    if (status === "pending")
        return res.status(400).json({
            message: "Bad Request",
            errors: {
                status: "Cannot change a membership status to pending",
            },
        });

    let foundGroup = await Group.findByPk(groupId, {
        include: [
            {
                model: User,
                as: "Member",
                through: { attributes: ["status"] },
            },
        ],
    });

    if (!foundGroup)
        return res.status(404).json({ message: "Group couldn't be found" });

    foundGroup = foundGroup.toJSON();

    const foundUser = await User.findByPk(memberId);
    if (!foundUser)
        return res.status(404).json({ message: "User couldn't be found" });

    const foundMember = await Membership.findOne({
        where: {
            userId: memberId,
            groupId,
        },
        attributes: ["id", "userId", "groupId", "status"],
    });

    if (!foundMember)
        return res.status(404).json({
            message: "Membership between the user and the group does not exist",
        });

    let isCoHost = false;
    for (let member of foundGroup.Member) {
        if (member.id === user.id && member.Membership.status === "co-host")
            isCoHost = true;
    }

    if (
        foundGroup.organizerId === user.id ||
        (foundGroup.status === "pending" && status === "member" && isCoHost)
    )
        foundMember.status = status;
    else return next(new Error("Forbidden"));

    await foundMember.save();

    res.json({
        id: foundMember.id,
        groupId: foundMember.groupId,
        memberId: foundMember.userId,
        status: foundMember.status,
    });
});

router.delete(
    "/:groupId/membership/:memberId",
    requireAuth,
    async (req, res, next) => {
        const { groupId, memberId } = req.params;
        const { user } = req;

        const foundUser = await User.findByPk(memberId);
        if (!foundUser)
            return res.status(404).json({ message: "User couldn't be found" });
        const foundGroup = await Group.findByPk(groupId);
        if (!foundGroup)
            return res.status(404).json({ message: "Group couldn't be found" });

        const foundMember = await Membership.findOne({
            where: {
                groupId,
                userId: memberId,
            },
        });

        if (!foundMember)
            return res
                .status(404)
                .json({ message: "Membership does not exist for this User" });

        const isOrganizer = foundGroup.toJSON().organizerId === user.id;
        const isOwnUser = foundMember.toJSON().userId === user.id;
        if (!isOrganizer && !isOwnUser) return next(new Error("Forbidden"));

        await foundMember.destroy();

        return res.json({
            message: "Successfully deleted membership from group",
        });
    }
);

router.post("/:groupId/images", requireAuth, async (req, res, next) => {
    let { groupId } = req.params;
    groupId = parseInt(groupId);
    const { user } = req;

    let foundGroup = await Group.findByPk(groupId);
    if (!foundGroup)
        return res.status(404).json({ message: "Group couldn't be found" });
    foundGroup = foundGroup.toJSON();
    if (foundGroup.organizerId !== user.id) return next(new Error("Forbidden"));

    const { url, preview } = req.body;

    const newGroupImage = await GroupImage.create({ groupId, url, preview });

    res.json({
        id: newGroupImage.id,
        url: newGroupImage.url,
        preview: newGroupImage.preview,
    });
});

router.get("/:groupId/venues", requireAuth, async (req, res, next) => {
    let { groupId } = req.params;
    groupId = parseInt(groupId);
    const { user } = req;
    let foundGroup = await Group.findByPk(groupId, {
        include: [
            {
                model: User,
                as: "Member",
                through: {
                    where: { userId: user.id, status: "co-host" },
                    required: false,
                },
            },
        ],
    });
    if (!foundGroup)
        res.status(404).json({ message: "Group couldn't be found" });

    foundGroup = foundGroup.toJSON();
    const isOrganizer = foundGroup.organizerId === user.id;
    let isCoHost = false;
    if (foundGroup.Member && foundGroup.Member.length) isCoHost = true;

    if (!isOrganizer && !isCoHost) return next(new Error("Forbidden"));

    const venues = await Venue.findAll({
        include: [
            {
                model: Group,
                where: { id: groupId },
                // attributes: [],
            },
        ],
    });

    for (let venue of venues) {
        venue.lat = parseFloat(venue.lat);
        venue.lng = parseFloat(venue.lng);
    }

    res.json({ Venues: venues });
});

router.post("/:groupId/venues", requireAuth, async (req, res, next) => {
    let { groupId } = req.params;
    groupId = parseInt(groupId);
    const { user } = req;
    let foundGroup = await Group.findByPk(groupId, {
        include: {
            model: User,
            as: "Member",
            through: { where: { userId: user.id, status: "co-host" } },
        },
    });

    if (!foundGroup)
        return res.status(404).json({ message: "Group couldn't be found" });

    const { address, city, state, lat, lng } = req.body;
    if (!validateVenueData(req, res)) return;

    foundGroup = foundGroup.toJSON();

    const isOrganizer = foundGroup.organizerId === user.id;
    let isCoHost = false;
    if (foundGroup.Member && foundGroup.Member.length)
        isCoHost = foundGroup.Member[0].Membership.status === "co-host";
    if (!isOrganizer && !isCoHost) next(new Error("Forbidden"));

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

router.post("/:groupId/events", requireAuth, async (req, res, next) => {
    const { user } = req;
    let { groupId } = req.params;
    groupId = parseInt(groupId);

    let foundGroup = await Group.findByPk(groupId, {
        include: {
            model: User,
            as: "Member",
            where: { id: user.id },
            required: false,
        },
    });

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

    foundGroup = foundGroup.toJSON();
    const isOrganizer = foundGroup.organizerId === user.id;
    let isCoHost = false;
    if (foundGroup.Member.length > 0)
        isCoHost = foundGroup.Member[0].Membership.status === "co-host";
    if (!isOrganizer && !isCoHost) return next(new Error("Forbidden"));

    if (!validateEventData(req, res)) return;

    const newEvent = await Event.create({
        groupId,
        venueId: venueId || null,
        name,
        type,
        capacity,
        price: parseFloat(price),
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
        price: parseFloat(newEvent.price),
        description: newEvent.description,
        startDate: newEvent.startDate,
        endDate: newEvent.endDate,
    });
});

router.put("/:groupId", requireAuth, async (req, res, next) => {
    const { name, about, type, private, city, state } = req.body;
    const { user } = req;
    const { groupId } = req.params;
    const foundGroup = await Group.findByPk(groupId);
    if (!foundGroup)
        return res.status(404).json({ message: "Group couldn't be found" });
    if (foundGroup.toJSON().organizerId !== user.id)
        return next(new Error("Forbidden"));

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

router.delete("/:groupId", requireAuth, async (req, res, next) => {
    const { groupId } = req.params;
    const { user } = req;

    const foundGroup = await Group.findByPk(groupId);
    if (!foundGroup)
        return res.status(404).json({ message: "Group couldn't be found" });

    if (foundGroup.toJSON().organizerId !== user.id)
        return next(new Error("Forbidden"));

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

router.post("/", requireAuth, async (req, res, next) => {
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
