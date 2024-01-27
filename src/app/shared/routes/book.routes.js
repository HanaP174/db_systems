const express = require('express');
const router = express.Router();
const bookController = require("../controllers/book.controller.js");

// Add a new Book
router.post("book/add", bookController.create);

// Retrieve all books
router.get("book/list", bookController.findAll);

module.exports = router;