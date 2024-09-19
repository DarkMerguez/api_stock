"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { DataTypes } = require("sequelize");
const sequelize = require("../database");
const ProductCategory = require("./ProductCategory");
const Enterprise = require("./Enterprise");
const Product = sequelize.define("Product", {
    name: DataTypes.TEXT,
    price: DataTypes.FLOAT,
    description: DataTypes.TEXT,
    isFavorite: DataTypes.BOOLEAN,
    stock: DataTypes.INTEGER
});
ProductCategory.hasMany(Product);
Product.belongsTo(ProductCategory);
/* Enterprise.hasMany(Product);
Product.belongsTo(Enterprise);  */
module.exports = Product;
