const express = require('express');
const router = express.Router();
const notificationController = require("../controllers/notification.controller.js");

// Add a new notification
router.post("/notification/add", notificationController.add);

// Retrieve all notifications
router.get("/notification/list", notificationController.getAll);

// Get a notification
router.get("/book/:id", notificationController.get);

// Edit a notification
router.put("/user/:id", notificationController.update);

// Delete a notification
router.delete("/user/:id", notificationController.delete);


module.exports = router;