const express = require("express");
const { Group, User, GroupImage, Venue } = require("../../db/models");
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
    const { groupId } = req.params;

    const foundGroup = await Group.findByPk(groupId);
    if (!foundGroup) return res.status(404).json({ message: "Group couldn't be found"});

    const { url, preview } = req.body;

    const newGroupImage = await GroupImage.create({ groupId, url, preview });

    res.json({
        id: newGroupImage.id,
        url: newGroupImage.url,
        preview: newGroupImage.preview,
    });
});

function validateGroupData(body, err) {
    const { name, about, type, private, city, state } = body;
    if (name.split("").length > 60)
        err.errors.push(`Name must be 60 characters or less`);
    if (about.split("").length < 50)
        err.errors.push(`About must be 50 characters or more`);
    if (type !== "In person" && type !== "Online")
        err.errors.push(`Type must be 'Online' or 'In person'`);
    if (typeof private !== "boolean")
        err.errors.push(`Private must be a boolean`);
    if (!city) err.errors.push(`City is required`);
    if (!state) err.errors.push(`State is required`);

    if (err.errors.length) res.status(400).json(err);
}

router.post("/", async (req, res, next) => {
    const { user } = req;
    const err = { message: "Bad Request", errors: [] };

    validateGroupData(req.body, err);

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
    const { groupId } = req.params;
    const foundGroup = await Group.findByPk(groupId);
    if (!foundGroup) return res.status(404).json({ message: "Group couldn't be found"});

    validateGroupData(req.body, err);

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
    if (!foundGroup) return res.status(404).json({ message: "Group couldn't be found"});

    await foundGroup.destroy();

    res.json({ message: "Successfully deleted" });
})

module.exports = router;
