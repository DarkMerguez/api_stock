"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { DataTypes } = require("sequelize");
const sequelize = require("../database");
const User = require("./User");
const Enterprise = require("./Enterprise");
const Images = sequelize.define("Images", {
    url: DataTypes.TEXT
});
User.belongsTo(Images);
Images.hasOne(User);
Enterprise.belongsTo(Images);
Images.hasOne(Enterprise);
module.exports = Images;
