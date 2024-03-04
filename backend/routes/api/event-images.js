const express = require("express");
const { EventImage } = require("../../db/models");
const router = express.Router();

router.delete("/:eventId", async (req, res, next) => {
    const { eventId } = req.params;
    const foundImage = await EventImage.findByPk(eventId);
    if (!foundImage)
        return res
            .status(404)
            .json({ message: "Event Image couldn't be found" });

    await foundImage.destroy();

    res.json({ message: "Successfully deleted" });
});

module.exports = router;
