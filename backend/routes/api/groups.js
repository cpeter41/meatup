const express = require("express");
const { Group } = require("../../db/models");
const router = express.Router();

router.get("/", async (req, res, next) => {
    console.log('here');
    const results = await Group.findAll();
    console.log(results);
    // res.json(results.dataValues);
});

module.exports = router;