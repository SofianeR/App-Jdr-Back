require("dotenv").config();

const express = require("express");
const formidable = require("express-formidable");

const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");

const app = express();
app.use(formidable());

const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI);

const Character = mongoose.model("Character", {
  name: String,
  class: String,
  race: String,
  alignment: String,
  characteristics: {
    force: Number,
    dexterite: Number,
    constitution: Number,
    intelligence: Number,
    sagesse: Number,
    charisme: Number,
  },
});

const User = mongoose.model("User", {
  email: {
    required: true,
    type: String,
  },
  username: {
    required: true,
    type: String,
  },
  hash: String,
  salt: String,
  token: String,
  characters: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Character",
  },
});

app.post("/character/create", async (req, res) => {
  try {
    const { generalInfo, characteristicsArray } = req.fields;

    console.log(generalInfo.alignment);

    const characteristics = {};

    characteristicsArray.map((item) => {
      const keys = Object.keys(item);
      characteristics[keys] = item[keys];
    });

    if (req.fields.generalInfo && req.fields.characteristicsArray) {
      const newCharacter = new Character({
        name: generalInfo.name,
        class: generalInfo.class,
        race: generalInfo.race,
        alignment: generalInfo.alignment,

        characteristics: {
          force: characteristics.force,
          dexterite: characteristics.dext,
          constitution: characteristics.const,
          intelligence: characteristics.int,
          sagesse: characteristics.sag,
          charisme: characteristics.char,
        },
      });

      await newCharacter.save();

      res.json(newCharacter);
    } else {
      res.status(400).json({ message: "Missing fields" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get("/character/all", async (req, res) => {
  try {
    const listCharacter = await Character.find();
    const countCharacter = await Character.find().count();

    res.json({ count: countCharacter, listCharacter: listCharacter });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.post("/user/signup", async (req, res) => {
  try {
    if (req.fields.email && req.fields.username && req.fields.password) {
      const checkForEmail = await User.findOne({ email: req.fields.email });

      if (!checkForEmail) {
        const salt = uid2(32);
        const token = uid2(32);
        const hash = SHA256(req.fields.password + salt).toString(encBase64);

        const newUser = new User({
          email: req.fields.email,
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

app.get("/", async (req, res) => {
  res.status(400).json("Page introuvable");
});

app.listen(process.env.PORT, () => {
  console.log("Server launched ! 🦒");
});
