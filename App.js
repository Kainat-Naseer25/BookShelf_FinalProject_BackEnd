require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const booksCRUDRouter = require("./BooksCRUD");
const authUsersRouter = require("./auth");
const app = express();

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

app.listen(8000, () => console.log("Listening to port 8000"));
