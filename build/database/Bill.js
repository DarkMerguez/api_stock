"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { DataTypes } = require("sequelize");
const sequelize = require("../database");
const Order = require("./Order");
const Enterprise = require("./Enterprise");
const Bill = sequelize.define("Bill", {
    TVA: DataTypes.FLOAT,
    paymentMethod: DataTypes.STRING
});
Bill.belongsTo(Order);
Order.hasOne(Bill);
Bill.belongsTo(Enterprise, { as: 'seller', foreignKey: 'sellerId' });
Bill.belongsTo(Enterprise, { as: 'buyer', foreignKey: 'buyerId' });
module.exports = Bill;
