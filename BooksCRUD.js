const dotenv = require("dotenv");
const express = require("express");
const router = express.Router();
const Book = require("./Models/BooksModel");
const cookiesParser = require("cookie-parser");
const User = require("./Models/UsersModel");

router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(cookiesParser({ useCredentials: true }));

dotenv.config();

//for fetching Books
router.get("/books/private/read/:id", async (req, res) => {
  try {
    const Books = await Book.find({ AddedBy: req.params.id });
    res.send(Books);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

//For creating Books
router.post("/books/create", async (req, res) => {
  const newBook = await Book.create(req.body);
  res.status(200).send({ message: "User addded successfully", newBook });
});

//for updating Books
router.put("/books/update/:bookId", async (req, res) => {
  console.log("edited", req.params.bookId, "body", req.body);
  try {
    const bookId = req.params.bookId;
    const updatedBook = await Book.findOneAndUpdate({ _id: bookId }, req.body, {
      new: true,
    });
    res.send(updatedBook);
    console.log("updated", updatedBook)
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

//for deleting Books
router.delete("/books/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const deletedBook = await Book.deleteOne({ _id: id });
    res.json(deletedBook);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

router.post("/books/bookshelf/:userId", async (req, res) => {
  try {
    console.log(req.body, req.params);
    const user = await User.findById(req.params.userId);
    const book = await Book.findById(req.body.bookId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Add book to user's bookshelf
    if (user.bookshelf.indexOf(req.body.bookId) < 0) {
      user.bookshelf.push(book);
    }

    await user.save();

    res.json(user.bookshelf);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/books/bookshelf/read/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate("bookshelf");
    console.log("USER", user);
    console.log("BOOKSHELF", user.bookshelf);
    res.json(user.bookshelf); // This will log an array of Book documents
    // do something with user.books...
  } catch (err) {
    res.status(500).json({ message: err });
    // handle the error...
  }
});

router.put("/books/bookshelf/remove/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const bookId = req.body.bookId;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove book from user's bookshelf
    const index = user.bookshelf.indexOf(bookId);
    if (index > -1) {
      user.bookshelf.splice(index, 1);
      await user.save();
    }

    res.json(user.bookshelf);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/books/public/read/:menu", async (req, res) => {
  const menu = req.params.menu;
  try {
    if(menu === "All"){
      const books = await Book.find({ visibility: 'public' });
      res.json(books);
      console.log(books);
    }
    else{
      const books = await Book.find({ visibility: 'public', Category: menu });
      res.json(books);
      console.log(books);
    }
    
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
