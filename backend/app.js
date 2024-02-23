const express = require("express");
require("express-async-errors");
const morgan = require("morgan");
const cors = require("cors");
const csurf = require("csurf");
const helmet = require("helmet");
const routes = require("./routes");
const cookieParser = require("cookie-parser");
const { environment } = require("./config");
const isProduction = environment === "production";

const app = express();

app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());

// cors only in dev
if (!isProduction) {
    app.use(cors());
}

// https://www.npmjs.com/package/helmet
app.use(
    helmet.crossOriginResourcePolicy({
        policy: "cross-origin",
    })
);

// csrf tokens
app.use(
    csurf({
        cookie: {
            secure: isProduction,
            sameSite: isProduction && "Lax",
            httpOnly: true,
        },
    })
);

// -- ROUTES --
app.use(routes);

module.exports = app;
