const express = require("express");
const mongoose = require("mongoose");
const app = express();
const dotenv = require("dotenv");
const User = require("./usersmodel");
const Book = require("./books");
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
const db = mongoose.connection;

db.on("connected", () => console.log("DB Connected Successfully"));
db.on("error", (err) => console.log("DB not Connected", err));

// creating new users
// app.post("/books/create", async (req, res) => {
//   var myData = new Book(req.body);
//   myData.save()
//     .then(item => {
//       res.send("item saved to database");
//     })
//     .catch(err => {
//       res.status(400).send("unable to save to database");
//     });
// });
app.post("/books/create", async (req, res) => {
  const newBook = await Book.create(req.body)
  res.status(200).send({ message: "User addded successfully", newBook });
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
