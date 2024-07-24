"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { DataTypes } = require("sequelize");
const sequelize = require("../database");
const User = require("./User");
const Enterprise = sequelize.define("Enterprise", {
    name: DataTypes.TEXT,
    address: DataTypes.TEXT,
    siret: {
        type: DataTypes.BIGINT,
        allowNull: false,
        unique: true
    }
});
Enterprise.hasMany(User);
User.belongsTo(Enterprise);
module.exports = Enterprise;
