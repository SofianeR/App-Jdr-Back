const mongoose = require("mongoose");

const Spells = mongoose.model("Spells", {
  classe: String,
  listOfSpells: Array,
});
module.exports = Spells;
