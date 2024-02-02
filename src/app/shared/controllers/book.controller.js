const mongoose = require("mongoose");
const { Book, BorrowedBook } = require("../model/library.model");

exports.add = async (req, res) => {
  // Validate request
  if (req.body == null || req.body == undefined) {
    res.status(400).send("Content can not be empty!");
    return;
  }

  // Create a Book
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    numberOfPages: req.body.numberOfPages,
    year: req.body.year,
    cover: req.body.cover,
    availableCopies: req.body.availableCopies,
    totalCopies: req.body.totalCopies
  });

  // Save Book in the database
  await book
    .save()
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Tutorial."
      });
    });
};

exports.get = async (req, res) => {
  if (req.params == null || req.params.id == null) {
    res.status(400).send("Book id missing!");
    return;
  }

  const book = await Book.find({ _id: req.params.id });
  res.json(book);
};

exports.update = async (req, res) => {
  if (req.params == null || req.params.id == null || req.body == null) {
    res.status(400).send("Request content or book id missing!");
    return;
  }

  const filter = { _id: req.params.id };
  const udpate = {
    $set: {
      title: req.body.title,
      author: req.body.author,
      numberOfPages: req.body.numberOfPages,
      year: req.body.year,
      cover: req.body.cover,
      availableCopies: req.body.availableCopies,
      totalCopies: req.body.totalCopies
    }
  };

  try {
    const updated = await Book.updateOne(filter, udpate);
    if (updated.acknowledged === true) {
      res.json(updated.matchedCount);
    } else {
      res.status(400).send("Update operation was not acknowledged by the server");
    }
  } catch (error) {
    res.status(400).send("Error whend updating: " + error);
  }
};

exports.delete = async (req, res) => {
  if (req.params == null || req.params.id == null) {
    res.status(400).send("Book id missing!");
    return;
  }

  try {
    const deleted = await Book.deleteOne({ _id: req.params.id });
    if (deleted.acknowledged === true) {
      res.json(deleted.deletedCount);
    } else {
      res.status(400).send("Delete operation was not acknowledged by the server");
    }
  } catch (error) {
    res.status(400).send("Error whend deleting: " + error);
  }
};

exports.findAll = async (req, res) => {
  const allBooks = await Book.find({});
  res.json(allBooks);
};

exports.userBorrowed = async (req, res) => {
  if (req.params == null || req.params.userId == null) {
    res.status(400).send("User id missing!");
    return;
  }

  const userBorrowedBooks = await BorrowedBook.find({ userId: req.params.userId });
  res.json(userBorrowedBooks);
};

exports.insertUpdateBorrowed = async (req, res) => {
  if (req.params == null || req.params.id == null || req.body == null) {
    res.status(400).send("Request content or book id missing!");
    return;
  }

  let book = await Book.findOne({ _id: req.body.bookId });
  let bookUpdatedMatch = 0;

  if (req.body.isReturned === false) {
    if (book.availableCopies !== undefined && 0 < book.availableCopies) {
      const bookUpdated = await Book.updateOne({ _id: req.body.bookId }, { $set: { availableCopies: (book.availableCopies - 1) } });
      bookUpdatedMatch = bookUpdated.matchedCount;
    } else {
      res.status(400).send("All books already returned");
      return;
    }
  } else {
    if (book.availableCopies !== undefined && book.availableCopies < book.totalCopies) {
      const bookUpdated = await Book.updateOne({ _id: req.body.bookId }, { $set: { availableCopies: (book.availableCopies + 1) } });
      bookUpdatedMatch = bookUpdated.matchedCount;
    } else {
      res.status(400).send("No available books");
      return;
    }
  }

  if (bookUpdatedMatch === 0) {
    res.status(400).send("Update operation for book was not acknowledged by the server");
    return;
  }

  const userBorrowedBooks = await BorrowedBook.findOne({
    $and: [
      {bookId: new mongoose.Types.ObjectId(req.params.id)}, {userId: new mongoose.Types.ObjectId(req.body.userId)}
    ]
   }).sort({borrowDate: -1});

  if (userBorrowedBooks === null || userBorrowedBooks === undefined || userBorrowedBooks.isReturned) {
    const borrowedBook = new BorrowedBook({
      bookId: req.params.id,
      userId: req.body.userId,
      borrowDate: req.body.borrowDate,
      isReturned: false
    });

    await borrowedBook
      .save()
      .then(data => {
        res.status(200).send("1");
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while saving borrowed book to database"
        });
      });
  } else {
    const filter = { _id: userBorrowedBooks._id };
    const udpate = {
      $set: {
        returnDate: req.body.returnDate,
        isReturned: true
      }
    };

    try {
      const updated = await BorrowedBook.updateOne(filter, udpate);
      if (updated.acknowledged === true) {
        res.json(bookUpdatedMatch);
      } else {
        res.status(400).send("Update operation for borrowed book was not acknowledged by the server");
      }
    } catch (error) {
      res.status(400).send("Error when updating: " + error);
    }
  }
}
