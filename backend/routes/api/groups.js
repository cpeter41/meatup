const express = require("express");
const { Group } = require("../../db/models");
const router = express.Router();

router.get("/", async (req, res, next) => {
    const results = await Group.findAll();
    results.map((group) => group.dataValues);
    res.json({ Groups: results });
});

module.exports = router;