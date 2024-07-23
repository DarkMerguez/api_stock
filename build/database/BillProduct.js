"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { DataTypes } = require("sequelize");
const sequelize = require("../database");
const Product = require("./Product");
const Bill = require("./Bill");
const BillProduct = sequelize.define("BillProduct", {
    quantity: DataTypes.INTEGER
});
Product.belongsToMany(Bill, { through: BillProduct });
Bill.belongsToMany(Product, { through: BillProduct });
module.exports = BillProduct;
