"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { DataTypes } = require("sequelize");
const sequelize = require("../database");
const ProductCategory = sequelize.define("ProductCategory", {
    title: DataTypes.TEXT
});
module.exports = ProductCategory;
