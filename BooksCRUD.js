const dotenv = require("dotenv");
const express = require("express");
const router = express.Router();
const Book = require("./Models/BooksModel");
const cors = require("cors");
const cookiesParser = require("cookie-parser");

let corsoption = {
  credentials: true,
};

router.use(cors(corsoption));
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(cookiesParser({ useCredentials: true }));

dotenv.config();

//for fetching Books
router.get("/books/private/read/:id", async (req, res) => {
  try {
    const Books = await Book.find({AddedBy: req.params.id});
    res.send(Books);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

//For creating Books
router.post("/books/create", async (req, res) => {
  const newBook = await Book.create(req.body)
  res.status(200).send({ message: "User addded successfully", newBook });
});

//for updating Books
router.put("/books/update/:ISBN", async (req, res) => {
  try {
    const ISBN = req.params.ISBN;
    const updatedBook = await Book.findOneAndUpdate({ ISBN }, req.body, { new: true });
    res.send(updatedBook);
  } catch (err) {
    res.status(500).json({
      message: err.message
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
      message: err.message
    });
  }
});

module.exports = router;