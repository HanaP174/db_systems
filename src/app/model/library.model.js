const mongoose = require('mongoose');

// Define the users model
const User = mongoose.model(
  "users",
  mongoose.Schema(
    {
      name: String,
      surname: String,
      role: String,
      birthNumber: String,
      address: {
        street: String,
        zipcode: String,
        city: String,
        streetNumber: String
      },
      userName: String,
      password: String,
      activated: Boolean
    },
  )
);

// Define the books model
const Book = mongoose.model(
  "books",
  mongoose.Schema(
    {
      title: String,
      author: String,
      numberOfPages: Number,
      year: Number,
      cover: Buffer,
      availableCopies: Number,
      totalCopies: Number
    },
  )
);

// Define the borrowedBooks model
const BorrowedBook = mongoose.model(
  "borrowedBooks",
  mongoose.Schema(
    {
      bookId: String,
      userId: String,
      borrowDate: Date,
      returnDate: Date,
      isReturned: Boolean,
    },
  )
);

// Define the notifications model
const Notification = mongoose.model(
  "notifications",
  mongoose.Schema(
    {
      userId: String,
      description: String,
      published: Boolean,
      type: String
    },
    { timestamps: true }
  )
);

// Export all models
module.exports = {
  User,
  Book,
  BorrowedBook,
  Notification
};