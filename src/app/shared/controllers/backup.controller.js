const fs = require('fs');
const { User, Book, BorrowedBook, Notification } = require('../model/library.model');

exports.get = async (req, res) => {
  try {
    const exportedData = {
      users: await User.find().lean(),
      books: await Book.find().lean(),
      borrowedBooks: await BorrowedBook.find().lean(),
      notifications: await Notification.find().lean(),
    };

    const exportFilePath = 'backup.json';
    fs.writeFileSync(exportFilePath, JSON.stringify(exportedData));

    res.download(exportFilePath, 'backup.json', (err) => {
      if (err) {
        res.status(500).json({ error: 'Error downloading export file' });
      } else {
        fs.unlinkSync(exportFilePath); // Remove the temporary export file
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

exports.post = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const importFileBuffer = req.file.buffer;

  try {
    const importedData = JSON.parse(importFileBuffer.toString());

    await User.deleteMany();
    await Book.deleteMany();
    await BorrowedBook.deleteMany();
    await Notification.deleteMany();

    await User.insertMany(importedData.users);
    await Book.insertMany(importedData.books);
    await BorrowedBook.insertMany(importedData.borrowedBooks);
    await Notification.insertMany(importedData.notifications);

    res.json({ message: 'Data imported successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
