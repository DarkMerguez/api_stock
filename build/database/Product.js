"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const { DataTypes } = require("sequelize");
const sequelize = require("../database");
const ProductCategory = require("./ProductCategory");
const Enterprise = require("./Enterprise");
exports.Product = sequelize.define("Product", {
    name: DataTypes.TEXT,
    price: DataTypes.FLOAT,
    description: DataTypes.TEXT,
    isFavorite: DataTypes.BOOLEAN,
    stock: DataTypes.INTEGER
});
ProductCategory.hasMany(exports.Product);
exports.Product.belongsTo(ProductCategory);
Enterprise.hasMany(exports.Product);
exports.Product.belongsTo(Enterprise);
module.exports = exports.Product;
