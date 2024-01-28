const express = require('express');
const router = express.Router();
const bookController = require("../controllers/book.controller.js");

// Add a new Book
router.post("/book/add", bookController.create);

// Retrieve all books
router.get("/book/list", bookController.findAll);

// Retrieve all books borrowed by user
router.get("/book/userBorrowed/:userId", bookController.userBorrowed);

module.exports = router;