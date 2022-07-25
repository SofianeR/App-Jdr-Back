const express = require("express");
const router = express.Router();

router.post("/character/create", async (req, res) => {
  try {
    const { generalInfo, characteristics, token } = req.fields;

    console.log(generalInfo, characteristics, token);

    if (generalInfo && characteristics && token) {
      const checkUser = await User.findOne({ token: req.fields.token });

      if (checkUser) {
        const newCharacter = new Character({
          name: generalInfo.name,
          class: generalInfo.class,
          race: generalInfo.race,
          alignment: generalInfo.alignment,

          characteristics: characteristics,
        });

        checkUser.characters.push(newCharacter);

        await newCharacter.save();

        await checkUser.save();

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

    console.log(UserInfo);

    const countCharacter = await User.findOne({ token: req.fields.token })
      .populate("characters")
      .count();

    res.json({ count: countCharacter, listCharacter: UserInfo.characters });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
