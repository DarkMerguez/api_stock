"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductCart = void 0;
const { DataTypes } = require("sequelize");
const sequelize = require("../database");
const Product = require("./Product");
const Cart = require("./Cart");
exports.ProductCart = sequelize.define("ProductCart", {
    quantity: DataTypes.INTEGER
});
Product.belongsToMany(Cart, { through: exports.ProductCart });
Cart.belongsToMany(Product, { through: exports.ProductCart });
module.exports = exports.ProductCart;
