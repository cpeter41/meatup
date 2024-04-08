const express = require("express");
const bcrypt = require("bcryptjs");

const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { User } = require("../../db/models");

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { Op } = require("sequelize");

const router = express.Router();

const validateSignup = [
    check("email")
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage("Email or username is required"),
    check("username")
        .exists({ checkFalsy: true })
        .isLength({ min: 4 })
        .withMessage("Please provide a username with at least 4 characters."),
    check("username")
        .not()
        .isEmail()
        .withMessage("Username cannot be an email."),
    check("firstName")
        .exists({ checkFalsy: true })
        .withMessage("First Name is required."),
    check("lastName")
        .exists({ checkFalsy: true })
        .withMessage("Last Name is required."),
    check("password")
        .exists({ checkFalsy: true })
        .isLength({ min: 6 })
        .withMessage("Password is required"),
    handleValidationErrors,
];

router.post("/", validateSignup, async (req, res, next) => {
    const { firstName, lastName, email, username, password } = req.body;

    const hashedPassword = bcrypt.hashSync(password);

    const foundUser = await User.findOne({
        where: { [Op.or]: [{ email }, { username }] },
        attributes: ["firstName", "lastName", "email", "username"],
    });

    if (foundUser && foundUser.email === email) {
        return res.status(500).json({
            message: "User already exists",
            errors: {
                email: "User with that email already exists",
            },
        });
    } else if (foundUser && foundUser.username === username) {
        return res.status(500).json({
            message: "User already exists",
            errors: {
                username: "User with that username already exists",
            },
        });
    }

    const user = await User.create({
        firstName,
        lastName,
        email,
        username,
        hashedPassword,
    });

    const newUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
    };

    await setTokenCookie(res, newUser);

    res.json({ user: newUser });
});

module.exports = router;
