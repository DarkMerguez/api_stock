"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { DataTypes } = require("sequelize");
const sequelize = require("../database");
const Role = sequelize.define("Role", {
    name: DataTypes.TEXT,
    importance: {
        type: DataTypes.INTEGER,
        defaultValue: 2
    }
});
module.exports = Role;
