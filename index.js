require("dotenv").config();

const express = require("express");
const formidable = require("express-formidable");

const app = express();
app.use(formidable());

const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI);

const userRoutes = require("./routes/userRoutes");
app.use(userRoutes);

const characterRoutes = require("./routes/characterRoutes");
app.use(characterRoutes);

app.get("/", async (req, res) => {
  res.status(400).json("Page introuvable");
});

app.listen(process.env.PORT, () => {
  console.log("Server launched ! 🦒");
});
