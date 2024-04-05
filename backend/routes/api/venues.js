const express = require("express");
const { validateVenueData } = require("../../utils/old_validators");
const { Group, Venue, Event, User } = require("../../db/models");
const { requireAuth } = require("../../utils/auth.js");
const router = express.Router();

router.post("/test", function (req, res) {
    res.json({ requestBody: req.body });
});

router.put("/:venueId", requireAuth, async (req, res, next) => {
    const { address, city, state, lat, lng } = req.body;
    const { venueId } = req.params;
    const { user } = req;

    const foundVenue = await Venue.findByPk(venueId, {
        include: {
            model: Group,
            include: {
                model: User,
                as: "Member",
                through: {
                    where: {
                        userId: user.id,
                        status: "co-host",
                    },
                    required: false,
                },
            },
        },
    });

    if (!foundVenue)
        return res.status(404).json({ message: "Venue couldn't be found" });

    const jsonVenue = foundVenue.toJSON();

    const isOrganizer = jsonVenue.Group.organizerId === user.id;
    const isCoHost = jsonVenue.Group.Member && jsonVenue.Group.Member.length;

    // if current user is a member but isn't the group organizer or co-host
    if (!isOrganizer && !isCoHost) return next(new Error("Forbidden"));

    if (!validateVenueData(req, res)) return;

    foundVenue.address = address;
    foundVenue.city = city;
    foundVenue.state = state;
    foundVenue.lat = parseFloat(lat);
    foundVenue.lng = parseFloat(lng);

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
