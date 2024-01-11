const Message = require("../models/message");
const User = require("../models/user");

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Display Home Page Messages on Get
exports.index = asyncHandler(async (req, res, next) => {
    const messages = await Message.find()
        .sort({ timeStamp: 1 })
        .populate("author")
        .exec();
    res.render("index", { title: "Members Only", messages: messages });
});

// Display New Message Form on Get
exports.newMessageGet = asyncHandler(async (req, res, next) => {
    if (req.user && req.user.memberStatus == true) {
        res.render("new-message", { title: "Create New Message" });
    } else {
        res.redirect("/log-in");
    }
});

// Handle new message post
exports.newMessagePost = [
    body("title", "Title must be between 1 and 30 character.")
        .trim()
        .isLength({ min: 1, max: 30 })
        .escape(),
    body("message", "Message must be between 1 and 140 characters.")
        .trim()
        .isLength({ min: 1, max: 140 })
        .escape(),
    asyncHandler(async (req, res, next) => {
        if (req.user && req.user.memberStatus == true) {
            const errors = validationResult(req);
            // Create new message object with data
            const message = new Message({
                title: req.body.title,
                author: req.user._id,
                message: req.body.message,
            });

            if (!errors.isEmpty()) {
                res.render("new-message", {
                    title: "Create New Message",
                    message: message,
                    errors: errors.array(),
                });
            } else {
                await message.save();
                await User.findByIdAndUpdate(req.user._id, {
                    $push: { messages: message._id },
                });
                res.redirect("/");
            }
        } else {
            res.redirect("/log-in");
        }
    }),
];

// Display remove message on get
exports.removeMessageGet = asyncHandler(async (req, res, next) => {
    if (req.user) {
        if (req.user.admin == true) {
            const message = await Message.findOne({ _id: req.params.id })
                .populate("author")
                .exec();

            res.render("remove-message", {
                title: "Confirm Remove Message",
                message: message,
            });
        } else {
            res.redirect("/");
        }
    } else {
        res.redirect("/log-in");
    }
});

// Handle remove message post
exports.removeMessagePost = asyncHandler(async (req, res, next) => {
    if (req.user) {
        if (req.user.admin == true) {
            const message = await Message.findOne({ _id: req.params.id })
                .populate("author")
                .exec();

            if (message) {
                await Message.deleteOne({ _id: req.params.id });
                await User.findOneAndUpdate(
                    { _id: message.author._id },
                    { $pull: { messages: message._id } }
                );
            } else {
                res.render("remove-message", {
                    title: "Confirm Remove Message",
                    message: message,
                    errors: "Unable to Find and Delete Message",
                });
            }

            res.redirect("/");
        } else {
            res.redirect("/");
        }
    } else {
        res.redirect("/log-in");
    }
});
