const User = require("../models/user");

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

// Set up passport to authenticate login
passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            const user = await User.findOne({ email: username });
            console.log(user);
            if (!user) {
                return done(null, false, { message: "Incorrect username" });
            }
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                // passwords do not match!
                return done(null, false, { message: "Incorrect password" });
            }
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    })
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

// Display Sign-Up Form on Get
exports.signUpGet = (req, res, next) => {
    res.render("sign-up", { title: "Sign Up Form" });
};

// Handle Sign-up Form Post
exports.signUpPost = [
    // Validate and sanatize the inputs
    body("firstName", "First name must not be empty")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("lastName", "Last name must not be empty")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("email", "Must use valid email")
        .trim()
        .isEmail()
        .custom(async (value) => {
            const user = await User.find({ email: value });
            if (user.length > 0) {
                throw new Error(
                    "Email is already in use, please use a different one"
                );
            }
        })
        .escape(),
    body("password", "Password must not be a minimum of 5 characters")
        .trim()
        .isLength({ min: 5 })
        .escape(),
    body("passwordConfirm", "Passwords must match").custom((value, { req }) => {
        return value === req.body.password;
    }),
    body("adminCode").trim().escape(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
            if (err) {
                return next(err);
            } else {
                //Create User object with data
                const user = new User({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    password: hashedPassword,
                    memberStatus: true,
                    admin: req.body.adminCode === "secretCode" ? true : false,
                });

                if (!errors.isEmpty()) {
                    res.render("sign-up", {
                        title: "Sign-up Form",
                        user: user,
                        errors: errors.array(),
                    });
                } else {
                    await user.save();
                    res.redirect("/");
                }
            }
        });
    }),
];

// Display Log-In on Get
exports.logInGet = (req, res, next) => {
    res.render("log-in", { title: "Log In" });
};

// Handle Log-In Post
exports.logInPost = passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/log-in",
    failueMessage: true,
});

// Handle Log-Out
exports.logOutGet = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
};
