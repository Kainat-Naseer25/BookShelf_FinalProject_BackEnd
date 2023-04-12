const dotenv = require("dotenv");
const express = require("express");
const router = express.Router();
const User = require("./Models/UsersModel");
const jwt = require("jsonwebtoken");
const cookiesParser = require("cookie-parser");
var bcrypt = require("bcrypt");

dotenv.config();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(cookiesParser({ useCredentials: true }));

const secretKey = "secretKey";

router.post("/signup", async (req, res, next) => {
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
  let existingUser;
  jwt.sign(
    newUser.toJSON(),
    secretKey,
    { expiresIn: "500s" },
    async (er, newToken) => {
      token = newToken;
      existingUser = await User.findOne({ email: newUser.email });
      res.cookie("jwt", token, {
        maxAge: 900000,
        httpOnly: true,
        secure: true,
      });
      res.status(201).json({
        success: true,
        data: { user: existingUser, token: newToken },
      });
    }
  );
});

router.post("/login", async (req, res, next) => {
  const user = req.body;
  console.log("BODY", req.body);
  let existingUser;
  try {
    existingUser = await User.findOne({ email: user.email });
  } catch {
    const error = new Error("Error! Something went wrong.");
    return next(error);
  }
  if (
    !existingUser ||
    !bcrypt.compareSync(user.password, existingUser.password)
  ) {
    const error = new Error("Wrong details please check at once");
    return next(error);
  }

  jwt.sign(
    existingUser.toJSON(),
    secretKey,
    { expiresIn: "500s" },
    (er, token) => {
      res.cookie("jwt", token, {
        maxAge: 900000,
        httpOnly: true,
        secure: true,
      });
      res.status(200).json({
        success: true,
        message: "Login successful",
        user: existingUser,
        token: token,
      });
    }
  );
});

const verifyToken = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized access" });
  }

  jwt.verify(token, secretKey, (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ error: "Invalid token" });
    }
    req.user = decodedToken.user;
    next();
  });
};

router.use(verifyToken);

router.get("/logout", (req, res) => {
  try {
    console.log("Before Clearing Cookie: ", req.cookies); // Log the original cookies object
    res.clearCookie("jwt", { httpOnly: true, secure: true });
    console.log("After Clearing Cookie: ", req.cookies); // Log the cookies object after clearing the cookie
    res.status(200).json({ message: "Successfully logged out 😏 🍀" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/", (req, res) => {
  return res.json({ message: "Hello World" });
});

module.exports = router;
