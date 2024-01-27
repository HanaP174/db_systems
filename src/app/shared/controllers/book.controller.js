const { Book } = require("../model/library.model");

exports.create = async (req, res) => {
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

// Retrieve all Books from the database.
exports.findAll = async (req, res) => {
  const allBooksDb = await Book.find().exec();
  const allBooks = allBooksDb.map(b => b.toJSON());

  res.json(allBooks);
};
