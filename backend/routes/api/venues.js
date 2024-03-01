const express = require("express");
const { validateVenueData } = require("../../utils/old_validators");
const { Group, Venue, Event } = require("../../db/models");
// const { Op } = require("sequelize");
const router = express.Router();

router.post("/test", function (req, res) {
    res.json({ requestBody: req.body });
});

router.put("/:venueId", async (req, res, next) => {
    const { address, city, state, lat, lng } = req.body;
    const { venueId } = req.params;

    const foundVenue = await Venue.findByPk(venueId);
    if (!foundVenue)
        return res.status(404).json({ message: "Venue couldn't be found" });

    if(!validateVenueData(req, res)) return;

    foundVenue.address = address;
    foundVenue.city = city;
    foundVenue.state = state;
    foundVenue.lat = lat;
    foundVenue.lng = lng;

    await foundVenue.save();

    res.json({
        id: foundVenue.dataValues.id,
        groupId: foundVenue.dataValues.groupId,
        address: foundVenue.dataValues.address,
        city: foundVenue.dataValues.city,
        state: foundVenue.dataValues.state,
        lat: foundVenue.dataValues.lat,
        lng: foundVenue.dataValues.lng,
    });
});

module.exports = router;
