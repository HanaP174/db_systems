const express = require('express');
const router = express.Router();
const multer = require('multer');
const backupController = require("../controllers/backup.controller.js");

router.get("/backup/export", backupController.get);
router.post("/backup/import", multer().single('file'), backupController.post);

module.exports = router;
