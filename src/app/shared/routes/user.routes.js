const express = require('express');
const router = express.Router();
const userController = require("../controllers/user.controller.js");

// Add a new user
router.post("/user/add", userController.signUp);

// Retrieve all users
router.get("/user/list", userController.getAllUsers);

// Login user
router.post("/user/login", userController.login);

module.exports = router;
