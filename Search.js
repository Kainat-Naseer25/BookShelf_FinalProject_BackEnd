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

async function searchBooks(query) {
  return Book.find({
    $and: [
      {
        $or: [
          { BookName: { $regex: new RegExp(query, "i") } },
          { Author: { $regex: new RegExp(query, "i") } },
        ],
      },
      { visibility: "public" },
    ],
  })
    .then((results) => {
      return results;
    })
    .catch((error) => {
      console.error(error);
      throw new Error("An error occurred while searching for books.");
    });
}

router.get("/search", (req, res) => {
  const query = req.query.q;
  console.log(query);
  searchBooks(query)
    .then((results) => {
      res.json(results);
      console.log(results);
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

module.exports = router;