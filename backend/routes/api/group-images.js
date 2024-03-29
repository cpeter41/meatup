const express = require("express");
const { GroupImage } = require("../../db/models");
const router = express.Router();
const { requireAuth } = require("../../utils/auth.js");

router.delete("/:imageId", requireAuth, async (req, res, next) => {
    const { imageId } = req.params;
    const foundImage = await GroupImage.findByPk(imageId);
    if (!foundImage)
        return res
            .status(404)
            .json({ message: "Group Image couldn't be found" });

    await foundImage.destroy();

    res.json({ message: "Successfully deleted" });
});

module.exports = router;
