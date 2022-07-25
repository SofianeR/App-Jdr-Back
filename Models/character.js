const mongoose = require("mongoose");

const Character = mongoose.model("Character", {
  name: String,
  class: String,
  race: String,
  alignment: String,
  characteristics: [{ name: String, value: String, modificateur: Number }],
});
module.exports = Character;
