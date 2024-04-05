const express = require("express");
const { GroupImage, Group, User, Membership } = require("../../db/models");
const router = express.Router();
const { requireAuth } = require("../../utils/auth.js");

router.delete("/:imageId", requireAuth, async (req, res, next) => {
    const { imageId } = req.params;
    const { user } = req;

    let foundImage = await GroupImage.findOne({
        where: { id: imageId },
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
    });

    if (!foundImage)
        return res
            .status(404)
            .json({ message: "Group Image couldn't be found" });

    const jsonImage = foundImage.toJSON();

    const isOrganizer = jsonImage.Group.organizerId === user.id;
    const isCoHost = jsonImage.Group.Member.length !== 0;

    if (isCoHost || isOrganizer) {
        await foundImage.destroy();
        res.json({ message: "Successfully deleted" });
    } else next(new Error("Forbidden"));
});

module.exports = router;
