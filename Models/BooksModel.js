const mongoose = require("mongoose")
const User = require("./UsersModel");

const BooksModel = new mongoose.Schema({

    BookName: {type: String, required: true},
    Author: {type: String, required: true},
    Rating: {type: String, required: true},
    Price: {type: String, required: true},
    ISBN: {type: String, required: true},
    Category: {type: String, required: true},
    CoverImage: {type: String},
    visibility: {type: String, required: true},
    AddedBy: {type: String, required: true},
})

BooksModel.pre('remove', async function(next) {
    const book = this;
    try {
      await User.updateMany(
        { bookshelf: book._id },
        { $pull: { bookshelf: book._id } }
      );
      next();
    } catch (err) {
      next(err);
    }
  });

const Book = mongoose.model("books", BooksModel);

module.exports = Book;