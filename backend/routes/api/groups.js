const express = require("express");
const { Group } = require("../../db/models");
const router = express.Router();

router.get("/", async (req, res, next) => {
    const results = Group.findAll();
    console.log(results);
    // res.json(results.dataValues);
});

module.exports = router;