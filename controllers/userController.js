const User = require("../models/user");

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Display Sign-Up Form on Get
exports.signUpGet = asyncHandler(async (req, res, next) => {
    res.render("sign-up", { title: "Sign Up Form" });
});

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
    body("email", "Must use valid email").trim().isEmail().escape(),
    body("password", "Password must not be empty")
        .trim()
        .isLength({ min: 5 })
        .escape(),
    body("passwordConfirm", "Passwords must match").custom((value, { req }) => {
        return value === req.body.password;
    }),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        //Create User object with data
        const user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
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
    }),
];

// Display Log-In on Get
exports.logInGet = asyncHandler(async (req, res, next) => {
    res.send("Not implemented Yet");
});

// Handle Log-In Post
exports.logInPost = asyncHandler(async (req, res, next) => {
    res.send("Not implemented Yet");
});
