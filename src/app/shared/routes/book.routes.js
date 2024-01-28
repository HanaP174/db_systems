const express = require('express');
const router = express.Router();
const bookController = require("../controllers/book.controller.js");

// Add a new Book
router.post("/book/add", bookController.add);

// Retrieve all books
router.get("/book/list", bookController.findAll);

// Get a book
router.get("/book/:id", bookController.get);

// Update a book
router.put("/book/:id", bookController.update);

// Delete a book
router.delete("/book/:id", bookController.delete);

// Retrieve all books borrowed by user
router.get("/book/userBorrowed/:userId", bookController.userBorrowed);

module.exports = router;