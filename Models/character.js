const mongoose = require("mongoose");

// const Character = mongoose.model("Character", {
//   name: String,
//   class: String,
//   race: String,
//   alignment: String,
//   characteristics: [{ name: String, value: String, modificateur: Number }],
// });

const Character = mongoose.model("Character", {
  name: String,
  description: Object,

  alignment: String,

  race: Object,
  classe: Object,

  characteristics: Array,

  spells: Array,

  picture: String,
});

module.exports = Character;
