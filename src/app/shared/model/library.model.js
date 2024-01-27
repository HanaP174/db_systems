const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
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
    username: {type: String, required: true},
    password: {type: String, required: true},
    activated: Boolean
  });

// Define the users model
const User = mongoose.model("users", userSchema);

var schemaBooks = mongoose.Schema(
  {
    title: String,
    author: String,
    numberOfPages: Number,
    year: Number,
    cover: Buffer,
    availableCopies: Number,
    totalCopies: Number
  }
);

schemaBooks.method("toJSON", function() {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

const Book = mongoose.model("books", schemaBooks);

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
