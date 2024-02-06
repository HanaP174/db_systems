const mongoose = require('mongoose');
const {BorrowedBook} = require("./library.model");
const {Book} = require("./library.model");

const scheduledTaskSchema = new mongoose.Schema({
  name: String,
  description: String,
  scheduledTime: Date,
});

scheduledTaskSchema.statics.checkAndReturnOverdueBooks = async function () {
  console.log('checking overdue books');
  const sixDaysAgo = new Date();
  sixDaysAgo.setDate(sixDaysAgo.getDate() - 6);

  const overdueBooks = await BorrowedBook.find({$and: [
      {isReturned: false},
      {borrowDate: { $lte: sixDaysAgo }}
  ]});

  overdueBooks.forEach(async (book) => {
    book.isReturned = true;
    book.returnDate = new Date;
    await book.save();
  });

  const bookIds = overdueBooks.map(book => book.bookId);

  // available copies +1
  const returnedBooks = await Book.find({ _id: { $in: bookIds }});
  returnedBooks.forEach(async (book) => {
    if (book != null) {
      book.availableCopies++;
      await book.save();
    }
  })

  console.log('Overdue books checked and returned:', overdueBooks);
};

const ScheduledTask = mongoose.model('ScheduledTask', scheduledTaskSchema);

module.exports = ScheduledTask;
