var express = require("express");
var router = express.Router();

// Require controller modules.
const messageController = require("../controllers/messageController");
const userController = require("../controllers/userController");

// MESSAGE ROUTES

// GET home page
router.get("/", messageController.index);

// USER ROUTES

// Get sign-up page
router.get("/sign-up", userController.signUpGet);

// Post sign-up page
router.post("/sign-up", userController.signUpPost);

// Get log-in page
router.get("/log-in", userController.logInGet);

// Post log-in page
router.post("/log-in", userController.logInPost);

module.exports = router;
