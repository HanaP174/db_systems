const mongoose = require('mongoose');

// Schema section
const schemaUser = mongoose.Schema(
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
    username: { type: String, required: true },
    password: { type: String, required: true },
    activated: Boolean
  });

const schemaBook = mongoose.Schema(
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

const schemaBorrowedBook = mongoose.Schema(
  {
    bookId: String,
    userId: String,
    borrowDate: Date,
    returnDate: Date,
    isReturned: Boolean,
  }
);

const schemaNotification = mongoose.Schema(
  {
    userId: String,
    description: String,
    published: Boolean,
    type: String
  },
  { timestamps: true }
);

// Json method extension section
generateJsonMethod(schemaUser);
generateJsonMethod(schemaBook);
generateJsonMethod(schemaBorrowedBook);
generateJsonMethod(schemaNotification);

// Model section
const User = mongoose.model("users", schemaUser);
const Book = mongoose.model("books", schemaBook);
const BorrowedBook = mongoose.model("borrowedBooks", schemaBorrowedBook);
const Notification = mongoose.model("notifications", schemaNotification);

// Export all models
module.exports = {
  User,
  Book,
  BorrowedBook,
  Notification
};

function generateJsonMethod(schema) {
  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });
}
