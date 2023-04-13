const dotenv = require("dotenv");
const express = require("express");
const router = express.Router();
const Book = require("./Models/BooksModel");
const cookiesParser = require("cookie-parser");
const User = require("./Models/UsersModel");
const { Op } = require('sequelize');

router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(cookiesParser({ useCredentials: true }));

dotenv.config();

router.get('/api/books?search', async (req, res) => {
  const searchTerm = req.query.search;
  const regex = new RegExp(searchTerm, 'i');
  const books = await Book.find({
    $or: [
      { BookName: { $regex: regex } },
      { Author: { $regex: regex } },
    ]
  });
  res.json(books);
});

module.exports = router;
