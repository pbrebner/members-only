const express = require("express");
const router = express.Router();

// Require controller modules.
const messageController = require("../controllers/messageController");
const userController = require("../controllers/userController");

// MESSAGE ROUTES

// GET home page
router.get("/", messageController.index);

// Get message form
router.get("/new-message", messageController.newMessageGet);

// Post new message
router.post("/new-message", messageController.newMessagePost);

// USER ROUTES

// Get sign-up page
router.get("/sign-up", userController.signUpGet);

// Post sign-up page
router.post("/sign-up", userController.signUpPost);

// Get log-in page
router.get("/log-in", userController.logInGet);

// Post log-in page
router.post("/log-in", userController.logInPost);

// Get log-out
router.get("/log-out", userController.logOutGet);

module.exports = router;
