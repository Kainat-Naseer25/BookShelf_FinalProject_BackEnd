const express = require("express");
const mongoose = require("mongoose");
const app = express();
const dotenv = require("dotenv");
const User = require("./usersmodel");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookiesParser = require("cookie-parser");
var bcrypt = require("bcrypt");

const port = 5000;

let corsoption = {
  credentials: true,
};

dotenv.config();
app.use(cors(corsoption));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookiesParser({ useCredentials: true }));

mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;

db.on("connected", () => console.log("DB Connected Successfully"));
db.on("error", (err) => console.log("DB not Connected", err));

const secretKey = "secretKey";

app.post("/signup", async (req, res, next) => {
  const newUser = User({
    fullname: req.body.fullname,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  });

  try {
    await newUser.save();
  } catch {
    const error = new Error("Error! Something went wrong.");
    return next(error);
  }
  let token;
  try {
    jwt.sign(newUser, secretKey, { expiresIn: "500s" }, (er, newToken) => {
      token = newToken;
      res.cookie("jwt", token, {
        maxAge: 900000,
        httpOnly: true,
        secure: true,
      });
      res.status(201).json({
        success: true,
        data: { userId: newUser.id, email: newUser.email, token: token },
      });
    });
  } catch (err) {
    const error = new Error("Error! Something went wrong.");
    return next(error);
  }
});

app.post("/login", async (req, res, next) => {
  const user = req.body;
  console.log("BODY", req.body);
  let existingUser;
  try {
    existingUser = await User.findOne({ email: user.email });
  } catch {
    const error = new Error("Error! Something went wrong.");
    return next(error);
  }
  if (!existingUser || !bcrypt.compare(user.password, existingUser.password)) {
    const error = Error("Wrong details please check at once");
    return next(error);
  }

  jwt.sign(user, secretKey, { expiresIn: "500s" }, (er, token) => {
    res.cookie("jwt", token, { maxAge: 900000, httpOnly: true, secure: true });
    res.status(200).json({ success: true, message: "Login successful" });
  });
});

const verifyToken = (req, res, next) => {
  console.log("VERIFY", req.cookies);
  const JWT = req.cookies.jwt;
  // if (!authHeader) {
  //     res.status(401).send("Invalid Token");
  // }

  jwt.verify(JWT, secretKey, (err, authData) => {
    if (err) {
      res.status(401).send("Invalid Token");
    } else {
      // req.user = authData.user;
      next();
    }
  });
};

app.get("/logout", (req, res) => {
    return res
      .clearCookie("jwt")
      .status(200)
      .json({ message: "Successfully logged out 😏 🍀" });
  });
  

app.use(verifyToken);

app.get("/", (req, res) => {
  return res.json({ message: "Hello World" });
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
