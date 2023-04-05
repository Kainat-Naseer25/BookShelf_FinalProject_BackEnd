const mongoose = require("mongoose")

const BooksModel = new mongoose.Schema({

    BookName: {type: String, required: true},
    Author: {type: String, required: true},
    Rating: {type: String, required: true},
    Price: {type: String, required: true},
    ISBN: {type: String, required: true},
    Category: {type: String, required: true},
    CoverImage: {type: String, required: true},
})

const Book = mongoose.model("books", BooksModel);

module.exports = Book;