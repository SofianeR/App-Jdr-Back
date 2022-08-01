const express = require("express");
const router = express.Router();

const User = require("../Models/user.js");
const Character = require("../Models/character.js");

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

router.post("/character/create", async (req, res) => {
  try {
    const { characterSheet, token } = req.fields;

    const character = JSON.parse(characterSheet);

    const { picture } = req.files;

    if (character && token) {
      const checkUser = await User.findOne({ token: req.fields.token });

      if (checkUser) {
        const newCharacter = new Character({
          name: character.name,
          description: character.flavorText,

          alignment: character.alignment,

          race: character.race,
          classe: character.classe,

          characteristics: character.characteristics,

          spells: character.spellList,
        });

        if (picture) {
          const result = await cloudinary.uploader.upload(picture.path);

          newCharacter.picture = result.secure_url;
        }

        checkUser.characters.push(newCharacter);

        await newCharacter.save();

        await checkUser.save();

        // console.log(newCharacter);

        res.json(newCharacter);
      } else {
        res.status(401).json({ message: "can't find user" });
      }
    } else {
      res.status(400).json({ message: "Missing fields" });
    }
  } catch (error) {
    res.status(400).json({ message: "catch " + error.message });
  }
});

router.post("/character/all", async (req, res) => {
  try {
    const UserInfo = await User.findOne({
      token: req.fields.token,
    }).populate("characters");

    // console.log(UserInfo.characters);

    const countCharacter = await User.findOne({ token: req.fields.token })
      .populate("characters")
      .count();

    res.json({ count: countCharacter, listCharacter: UserInfo.characters });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
