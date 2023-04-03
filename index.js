const express = require("express");
const mongoose = require("mongoose");
const app = express();
const dotenv = require("dotenv");
const User = require("./usersmodel");
const cors = require("cors");
const cookiesParser = require("cookie-parser");

const port = 5000;

let corsoption = {
  credentials: true,
};

app.use(cors(corsoption));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookiesParser({ useCredentials: true }));

dotenv.config();

app.use(express.json());

mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;

db.on("connected", () => console.log("DB Connected Successfully"));
db.on("error", (err) => console.log("DB not Connected", err));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
