const express = require('express');
const router = express.Router();
const backupController = require("../controllers/backup.controller.js");

router.get("/backup/export", backupController.get);

module.exports = router;
