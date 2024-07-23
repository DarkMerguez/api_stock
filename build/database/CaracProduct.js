"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { DataTypes } = require("sequelize");
const sequelize = require("../database");
const Product = require("./Product");
const Carac = require("./Carac");
const CaracProduct = sequelize.define("CaracProduct", {
    value: DataTypes.INTEGER
});
Product.belongsToMany(Carac, { through: CaracProduct });
Carac.belongsToMany(Product, { through: CaracProduct });
module.exports = CaracProduct;
