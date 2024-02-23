const router = require("express").Router();
const {
    // setTokenCookie,
    restoreUser,
    // requireAuth,
} = require("../../utils/auth.js");
const { User } = require("../../db/models");

router.use(restoreUser);

// router.post("/test", function (req, res) {
//     res.json({ requestBody: req.body });
// });

// router.get("/set-token-cookie", async (req, res) => {
//     const user = await User.findOne({
//         where: {
//             username: "demoguy",
//         },
//     });
//     setTokenCookie(res, user);
//     res.json({ user: user });
// });

// router.get("/restore-user", (req, res) => {
//     res.json(req.user);
// });

// router.get("/require-auth", requireAuth, (req, res) => {
//     res.json(req.user);
// });

module.exports = router;
