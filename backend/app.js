const express = require("express");
require("express-async-errors");
require("dotenv").config();
const morgan = require("morgan");
const cors = require("cors");
const csurf = require("csurf");
const helmet = require("helmet");
const routes = require("./routes");
const cookieParser = require("cookie-parser");
const { environment } = require("./config");
const isProduction = environment === "production";
const { ValidationError } = require("sequelize");

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

// Catch unhandled requests and forward to error handler.
app.use((req, res, next) => {
    const err = new Error("The requested resource couldn't be found.");
    err.title = "Resource Not Found";
    err.errors = { message: "The requested resource couldn't be found." };
    err.status = 404;
    next(err);
});

// Process sequelize errors
app.use((err, req, res, next) => {
    if (err instanceof ValidationError) {
        let errors = {};
        for (let error of err.errors) {
            errors[error.path] = error.message;
        }
        err.title = "Validation error";
        err.errors = errors;
    }
    next(err);
});

// Error formatter
app.use((err, req, res, next) => {
    if (err.message === "Forbidden") {
        res.status(403).json({ message: "Forbidden" });
    }
    res.status(err.status || 500);
    console.error(err);
    res.json({
        title: err.title || "Server Error",
        message: err.message,
        errors: err.errors,
        stack: isProduction ? null : err.stack,
    });
});

if (require.main === module) {
    const port = 8000;
    app.listen(port, () => console.log("Server is listening on port", port));
} else {
    module.exports = app;
}
