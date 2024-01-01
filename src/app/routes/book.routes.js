const express = require('express');
const router = express.Router();
const tutorials = require("../controllers/book.controller.js");

router.get("/alive", tutorials.alive);

// Create a new Tutorial
router.post("/addBook", tutorials.create);

// Retrieve all Tutorials
router.get("/getAllBooks", tutorials.findAll);

module.exports = router;