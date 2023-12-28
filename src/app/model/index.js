const dbConfig = require("../db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
const { User, Book, BorrowedBook, Notification } = require("./library.model.js");

// Assign the models to the db object
db.User = User;
db.Book = Book;
db.BorrowedBook = BorrowedBook;
db.Notification = Notification;
 
module.exports = db;
