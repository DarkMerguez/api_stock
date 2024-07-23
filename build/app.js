"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const massi = "Mas";
console.log(massi);
const sequelize = require("./database");
const express = require("express");
const app = express();
const cors = require("cors");
const bcrypt = require('bcrypt');
const saltRounds = 10;
app.use(express.json());
app.use(cors());
app.listen(8051, () => {
    console.log("Youhouuuuu serveur lancé sur localhost:8066");
});
