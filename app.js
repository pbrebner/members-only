const createError = require("http-errors");
const express = require("express");
const path = require("path");
require("dotenv").config();
const session = require("express-session");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const indexRouter = require("./routes/index");

const compression = require("compression");
const helmet = require("helmet");

const app = express();

// Set up rate limiter: maximum of sixty requests per minute
const RateLimit = require("express-rate-limit");
const limiter = RateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 60,
});
// Apply rate limiter to all requests
app.use(limiter);

// Add helmet to the middleware chain.
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            "script-src": ["'self'", "https://kit.fontawesome.com", ,],
            "connect-src": [" 'self' ", "https://ka-f.fontawesome.com/"],
        },
    })
);

// Set up mongoose connection
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const mongoDB = process.env.MONGODB_URL;

main().catch((err) => console.log(err));
async function main() {
    await mongoose.connect(mongoDB);
}

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
    })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression());
app.use(express.static(path.join(__dirname, "public")));

// Set up to be able to access currentUser from local variables
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;
