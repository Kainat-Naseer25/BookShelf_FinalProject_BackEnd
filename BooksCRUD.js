const express = require("express");
const mongoose = require("mongoose");
const app = express();
const dotenv = require("dotenv");
const Book = require("./Models/BooksModel");
const cors = require("cors");
const cookiesParser = require("cookie-parser");

const port = 8000;

let corsoption = {
  credentials: true,
};

app.use(cors(corsoption));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookiesParser({ useCredentials: true }));

dotenv.config();


mongoose.connect(process.env.DATABASE_URL);
// const db = mongoose.connection;

// db.on("connected", () => console.log("DB Connected Successfully"));
// db.on("error", (err) => console.log("DB not Connected", err));

//for fetching Books
app.get("/books/read", async (req, res) => {
  try {
    const Books = await Book.find();
    res.send(Books);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

//For creating Books
app.post("/books/create", async (req, res) => {
  const newBook = await Book.create(req.body)
  res.status(200).send({ message: "User addded successfully", newBook });
});

//for updating Books
app.put("/books/update/:ISBN", async (req, res) => {
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
  app.delete("/books/delete/:ISBN", async (req, res) => {
    try {
      const bookISBN = req.params.ISBN;
      const deletedBook = await Book.deleteOne({ ISBN: bookISBN });
      res.json(deletedBook);
    } catch (err) {
      res.status(500).json({
        message: err.message
      });
    }
  });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});