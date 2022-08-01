const express = require("express");
const router = express.Router();

const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");

const User = require("../Models/user.js");

router.post("/user/signup", async (req, res) => {
  try {
    if (req.fields.email && req.fields.username && req.fields.password) {
      const checkForEmail = await User.findOne({
        email: req.fields.email.toLowerCase(),
      });

      if (!checkForEmail) {
        const salt = uid2(32);
        const token = uid2(32);
        const hash = SHA256(req.fields.password + salt).toString(encBase64);

        // console.log(req.fields.email, req.fields.email.toLowerCase());

        const newUser = new User({
          email: req.fields.email.toLowerCase(),
          username: req.fields.username,
          salt: salt,
          token: token,
          hash: hash,
        });

        await newUser.save();

        res.json(newUser);
      } else {
        res.status(400).json({ message: "Un compte utilise déja cet email" });
      }
    } else {
      res.status(400).json({ message: "Missing fields" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/user/login", async (req, res) => {
  try {
    if (req.fields.email && req.fields.password) {
      // console.log(req.fields);

      const checkUser = await User.findOne({
        email: req.fields.email.toLowerCase(),
      });

      // console.log(checkUser);

      if (checkUser) {
        const { hash, salt, token, username } = checkUser;
        const checkPassword = SHA256(req.fields.password + salt).toString(
          encBase64
        );

        if (checkPassword === hash) {
          res.json({ token: token, username: username });
        } else {
          res.status(400).json({ message: "Invalid password or mail" });
        }
      } else {
        res.status(400).json({ message: "Unauthorized" });
      }
    } else {
      res.status(400).json({ message: "missing fields" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
