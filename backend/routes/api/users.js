const express = require("express");
const bcrypt = require("bcryptjs");

const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { User } = require("../../db/models");

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { Op } = require("sequelize");

const router = express.Router();

const validateSignup = [
    check("firstName")
        .exists({ checkFalsy: true })
        .withMessage("First Name is required."),
    check("lastName")
        .exists({ checkFalsy: true })
        .withMessage("Last Name is required."),
    check("email")
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage("Please provide a valid email."),
    check("username")
        .exists({ checkFalsy: true })
        .isLength({ min: 4 })
        .withMessage("Please provide a username with at least 4 characters."),
    check("username")
        .not()
        .isEmail()
        .withMessage("Username cannot be an email."),
    check("password")
        .exists({ checkFalsy: true })
        .isLength({ min: 6 })
        .withMessage("Password must be 6 characters or more."),
    handleValidationErrors,
];

router.post("/", validateSignup, async (req, res, next) => {
    // const err = { message: "Bad Request", errors: {} };
    const { firstName, lastName, email, username, password } = req.body;
    // if (!firstName) err.errors.firstName = "First Name is required";
    // if (!lastName) err.errors.lastName = "Last Name is required";
    // if (!username) err.errors.username = "Last Name is required";
    // if (!email) err.errors.email = "Invalid email";

    // if (Object.keys(err.errors).length) return res.status(400).json(err);

    const hashedPassword = bcrypt.hashSync(password);

    const foundUser = await User.findOne({
        where: { [Op.or]: [{ email }, { username }] },
    });
    console.log("FOUND_USER:", foundUser);

    if (foundUser && foundUser.email === email) {
        const err = new Error("User already exists");
        err.title = "User already exists";
        err.errors = { email: "User with that email already exists" };
        return next(err);
    } else if (foundUser && foundUser.username === username) {
        const err = new Error("User already exists");
        err.title = "User already exists";
        err.errors = { email: "User with that username already exists" };
        return next(err);
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
