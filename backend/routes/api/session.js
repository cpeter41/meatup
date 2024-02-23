const express = require("express");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");

const { setTokenCookie, restoreUser } = require("../../utils/auth");
const { User } = require("../../db/models");

const router = express.Router();

router.post("/", async (req, res, next) => {
    const { credential, password } = req.body;

    const user = await User.unscoped().findOne({
        where: {
            [Op.or]: {
                username: credential,
                email: credential,
            },
        },
    });

    if (
        !user ||
        !bcrypt.compareSync(password, user.hashedPassword.toString())
    ) {
        next(new Error("Login failed"));
    }

    const newUser = {
        id: user.id,
        email: user.email,
        username: user.username,
    };

    await setTokenCookie(res, newUser);

    res.json({ user: newUser });
});

router.delete("/", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "success" });
});

router.get("/", (req, res) => {
    const { user } = req;
    if (user) {
        const safeUser = {
            id: user.id,
            email: user.email,
            username: user.username,
        };
        res.json({ user: safeUser });
    } else res.json({ user: null });
});

module.exports = router;
