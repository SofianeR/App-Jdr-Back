require("dotenv").config();

const express = require("express");
const formidable = require("express-formidable");

const axios = require("axios");

const app = express();
app.use(formidable());

const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI);

const userRoutes = require("./routes/userRoutes");
app.use(userRoutes);

const characterRoutes = require("./routes/characterRoutes");
const Spells = require("./Models/spells");
app.use(characterRoutes);

app.get("/", async (req, res) => {
  res.status(400).json("Page introuvable");
});

// app.get("/fill/database", async (req, res) => {
//   let arrayAllSpells = [];
//   try {
//     const response = await axios.get("https://www.dnd5eapi.co/api/spells");
//     // console.log(response.data);

//     arrayAllSpells = response.data.results;

//     let arraySingleSpell = [];

//     const promise = arrayAllSpells.map(async (item, index) => {
//       const responseDetail = await axios.get(
//         `https://www.dnd5eapi.co${item.url}`
//       );
//       arraySingleSpell.push(responseDetail.data);
//     });

//     Promise.all(promise).then(async () => {
//       let arrayBarbarian = [];
//       let arrayBard = [];
//       let arrayCleric = [];
//       let arrayDruid = [];
//       let arrayFighter = [];
//       let arrayMonk = [];
//       let arrayPaladin = [];
//       let arrayRanger = [];
//       let arrayRogue = [];
//       let arraySorcer = [];
//       let arrayWarlock = [];
//       let arrayWizard = [];

//       arraySingleSpell.map((item) => {
//         console.log(item.classes);
//         if (item.classes.length > 0) {
//           item.classes.map((classe) => {
//             console.log(item.level, item.name);
//             if (classe.name === "Barbarian") {
//               arrayBarbarian.push({
//                 index: item.index,
//                 name: item.name,
//                 level: item.level,
//                 data: item,
//               });
//             } else if (classe.name === "Bard") {
//               arrayBard.push({
//                 index: item.index,
//                 name: item.name,
//                 level: item.level,
//                 data: item,
//               });
//             } else if (classe.name === "Cleric") {
//               arrayCleric.push({
//                 index: item.index,
//                 name: item.name,
//                 level: item.level,
//                 data: item,
//               });
//             } else if (classe.name === "Druid") {
//               arrayDruid.push({
//                 index: item.index,
//                 name: item.name,
//                 level: item.level,
//                 data: item,
//               });
//             } else if (classe.name === "Fighter") {
//               arrayBarbarian.push({
//                 index: item.index,
//                 name: item.name,
//                 level: item.level,
//                 data: item,
//               });
//             } else if (classe.name === "Monk") {
//               arrayMonk.push({
//                 index: item.index,
//                 name: item.name,
//                 level: item.level,
//                 data: item,
//               });
//             } else if (classe.name === "Paladin") {
//               arrayPaladin.push({
//                 index: item.index,
//                 name: item.name,
//                 level: item.level,
//                 data: item,
//               });
//             } else if (classe.name === "Ranger") {
//               arrayRanger.push({
//                 index: item.index,
//                 name: item.name,
//                 level: item.level,
//                 data: item,
//               });
//             } else if (classe.name === "Rogue") {
//               arrayRogue.push({
//                 index: item.index,
//                 name: item.name,
//                 level: item.level,
//                 data: item,
//               });
//             } else if (classe.name === "Sorcerer") {
//               arraySorcer.push({
//                 index: item.index,
//                 name: item.name,
//                 level: item.level,
//                 data: item,
//               });
//             } else if (classe.name === "Warlock") {
//               arrayWarlock.push({
//                 index: item.index,
//                 name: item.name,
//                 level: item.level,
//                 data: item,
//               });
//             } else if (classe.name === "Wizard") {
//               arrayWizard.push({
//                 index: item.index,
//                 name: item.name,
//                 level: item.level,
//                 data: item,
//               });
//             }
//           });
//         }
//       });

//       const spells = [
//         { classe: "barbarian", listOfSpells: arrayBarbarian },
//         { classe: "bard", listOfSpells: arrayBard },
//         { classe: "cleric", listOfSpells: arrayCleric },
//         { classe: "druid", listOfSpells: arrayDruid },
//         { classe: "fighter", listOfSpells: arrayFighter },
//         { classe: "monk", listOfSpells: arrayMonk },
//         { classe: "paladin", listOfSpells: arrayPaladin },
//         { classe: "ranger", listOfSpells: arrayRanger },
//         { classe: "rogue", listOfSpells: arrayRogue },
//         { classe: "sorcerer", listOfSpells: arraySorcer },
//         { classe: "wizard", listOfSpells: arrayWizard },
//         { classe: "warlock", listOfSpells: arrayWarlock },
//       ];

//       const promiseSpells = spells.map(async (item) => {
//         const newSpells = new Spells({
//           classe: item.classe,
//           listOfSpells: item.listOfSpells,
//         });

//         await newSpells.save();
//       });

//       return Promise.all(promiseSpells).then(() => {
//         console.log("peute tre");
//         res.json("peut etre que oui");
//       });
//     });
//   } catch (error) {
//     res.status(400).json(error.message);
//   }
// });

app.get("/spells", async (req, res) => {
  // console.log(req.query.classe);

  let filterObject = {};

  if (req.query.classe) {
    filterObject.classe = req.query.classe;
  }

  const allSpells = await Spells.find(filterObject);

  res.json(allSpells);
});

app.listen(process.env.PORT, () => {
  console.log("Server launched ! 🦒");
});
