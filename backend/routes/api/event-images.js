const express = require("express");
const {
    EventImage,
    Event,
    Group,
    User,
    Membership,
} = require("../../db/models");
const router = express.Router();
const { requireAuth } = require("../../utils/auth.js");

router.delete("/:imageId", requireAuth, async (req, res, next) => {
    const { imageId } = req.params;
    const { user } = req;

    let foundImage = await EventImage.findOne({
        where: { id: imageId },
        include: {
            model: Event,
            include: {
                model: Group,
                attributes: ["organizerId"],
                include: {
                    model: User,
                    as: "Member",
                    through: {
                        model: Membership,
                        where: {
                            status: "co-host",
                            userId: user.id,
                        },
                        required: false,
                        attributes: ["userId", "groupId", "status"],
                    },
                },
            },
        },
    });

    if (!foundImage)
        return res
            .status(404)
            .json({ message: "Event Image couldn't be found" });

    const jsonImage = foundImage.toJSON();

    const isOrganizer = jsonImage.Event.Group.organizerId === user.id;
    const isCoHost = jsonImage.Event.Group.Member.length !== 0;

    if (isCoHost || isOrganizer) {
        await foundImage.destroy();
        return res.json({ message: "Successfully deleted" });
    } else next(new Error("Forbidden"));
});

module.exports = router;
