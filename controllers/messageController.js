const Message = require("../models/message");

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Display Home Page Messages on Get
exports.index = asyncHandler(async (req, res, next) => {
    res.render("index", { title: "Messages" });
});
