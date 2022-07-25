const mongoose = require("mongoose");

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
  characters: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Character",
    },
  ],
});

module.exports = User;
