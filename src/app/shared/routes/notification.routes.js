const express = require('express');
const router = express.Router();
const notificationController = require("../controllers/notification.controller.js");

// Add a new notification
router.post("/notification/add", notificationController.add);

// Retrieve all notifications
router.get("/notification/list", notificationController.getAll);

// Flag notifications in list as published
router.put("/notification/publishList", notificationController.publishList);

// Get a notification
router.get("/notification/:id", notificationController.get);

// Edit a notification
router.put("/notification/:id", notificationController.update);

// Delete a notification
router.delete("/notification/:id", notificationController.delete);


module.exports = router;