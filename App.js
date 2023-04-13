require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const booksCRUDRouter = require("./BooksCRUD");
const authUsersRouter = require("./Auth");
const searchBook = require("./Search");
const Book = require("./Models/BooksModel");
const app = express();
const cors = require("cors");

let corsoption = {
  credentials: true,
};

app.use(cors(corsoption));

mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on("connected", () => console.log("Connected Successfully"));
db.on("error", (err) => console.log("Unable to connect" + err));

app.use(express.json());
app.get("/", (req, res) => {
  res.send("Server running");
});

app.use("/crud", booksCRUDRouter);
app.use("/users", authUsersRouter);
app.use("/search", searchBook);

app.get('/api/books', async (req, res) => {
  const searchTerm = req.query.search;
  console.log(searchTerm);
  const regex = new RegExp(searchTerm, 'i');
  const books = await Book.find({
    $or: [
      { BookName: { $regex: regex } },
      { Author: { $regex: regex } },
    ]
  });
  res.json(books);
});

app.listen(8000, () => console.log("Listening to port 8000"));
