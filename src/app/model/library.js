module.exports = mongoose => {
  return mongoose.model(
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
};

module.exports = mongoose => {
  return mongoose.model(
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
};

module.exports = mongoose => {
  return mongoose.model(
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
};

module.exports = mongoose => {
  return mongoose.model(
    "notifications",
    mongoose.Schema(
      {
        userId: String,
        description: String,
        published: Boolean,
        type: String
      },
      {timeStamp: true}
    )
  );
};
