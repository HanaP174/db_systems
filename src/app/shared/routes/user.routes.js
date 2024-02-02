const express = require('express');
const router = express.Router();
const userController = require("../controllers/user.controller.js");

// Add a new user
router.post("/user/add", userController.signUp);

// Retrieve all users
router.get("/user/list", userController.getAllUsers);

// Get a user
router.get("/book/:id", userController.get);

// Edit a user
router.put("/user/:id", userController.update);

// Delete a user
router.delete("/user/:id", userController.delete);

// Login user
router.post("/user/login", userController.login);

module.exports = router;
