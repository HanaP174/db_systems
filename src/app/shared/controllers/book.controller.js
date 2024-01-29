const { Book, BorrowedBook } = require("../model/library.model");

exports.add = async (req, res) => {
  // Validate request
  if (req.body == null || req.body == undefined) {
    res.status(400).send({ message: "Content can not be empty!" });
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
      res.send(data);
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
    res.status(400).send({ message: "Book id missing!" });
    return;
  }

  const book = await Book.find({ _id: req.params.id });
  res.json(book);
};

exports.update = async (req, res) => {
  if (req.params == null || req.params.id == null || req.body == null) {
    res.status(400).send({ message: "Request content or book id missing!" });
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
      res.status(400).send({ message: "Update operation was not acknowledged by the server" });
    }
  } catch (error) {
    res.status(400).send({ message: "Error whend updating: " + error });
  }
};

exports.delete = async (req, res) => {
  if (req.params == null || req.params.id == null) {
    res.status(400).send({ message: "Book id missing!" });
    return;
  }

  try {
    const deleted = await Book.deleteOne({ _id: req.params.id });
    if (deleted.acknowledged === true) {
      res.json(deleted.deletedCount);
    } else {
      res.status(400).send({ message: "Delete operation was not acknowledged by the server" });
    }
  } catch (error) {
    res.status(400).send({ message: "Error whend deleting: " + error });
  }
};

exports.findAll = async (req, res) => {
  const allBooks = await Book.find({});
  res.json(allBooks);
};

exports.userBorrowed = async (req, res) => {
  if (req.params == null || req.params.userId == null) {
    res.status(400).send({ message: "User id missing!" });
    return;
  }

  const userBorrowedBooks = await BorrowedBook.find({ userId: req.params.userId });
  res.json(userBorrowedBooks);
};

exports.insertUpdateBorrowed = async (req, res) => {
  if (req.params == null || req.params.id == null || req.body == null) {
    res.status(400).send({ message: "Request content or book id missing!" });
    return;
  }

  const filter = { bookId: req.params.id };
  const udpate = {
    $set: {
      userId: req.body.userId,
      borrowDate: req.body.borrowDate,
      returnDate: req.body.returnDate,
      isReturned: req.body.isReturned
    }
  };
  const options = { upsert: true };

  try {
    const updated = await BorrowedBook.updateOne(filter, udpate, options);
    if (updated.acknowledged === true) {
      res.json(updated.matchedCount);
    } else {
      res.status(400).send({ message: "Update operation was not acknowledged by the server" });
    }
  } catch (error) {
    res.status(400).send({ message: "Error whend updating: " + error });
  }
}
