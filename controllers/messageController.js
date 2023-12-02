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
    res.render("index", { title: "Messages", messages: messages });
});

// Display New Message Form on Get
exports.newMessageGet = asyncHandler(async (req, res, next) => {
    res.render("new-message", { title: "Create New Message" });
});

// Handle new message post
exports.newMessagePost = [
    body("title", "Title must be between 1 and 30 character")
        .trim()
        .isLength({ min: 1, max: 30 })
        .escape(),
    body("message", "Message must be between 1 and 140 characters")
        .trim()
        .isLength({ min: 1, max: 140 })
        .escape(),
    asyncHandler(async (req, res, next) => {
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
            const user = await User.find({ _id: req.user._id });

            if (user[0].messages.length == 0) {
                await User.findOneAndUpdate(
                    { _id: req.user._id },
                    { $set: { messages: message._id } }
                );
            } else {
                await User.findOneAndUpdate(
                    { _id: req.user._id },
                    { $push: { messages: message._id } }
                );
            }
            await message.save();
            res.redirect("/");
        }
    }),
];
