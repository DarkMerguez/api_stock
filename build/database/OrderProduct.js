"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { DataTypes } = require("sequelize");
const sequelize = require("../database");
const Product = require("./Product");
const Order = require("./Order");
const OrderProduct = sequelize.define("OrderProduct", {
    quantity: DataTypes.INTEGER
});
Product.belongsToMany(Order, { through: OrderProduct });
Order.belongsToMany(Product, { through: OrderProduct });
module.exports = OrderProduct;
