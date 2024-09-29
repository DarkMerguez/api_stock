"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { DataTypes } = require("sequelize");
const sequelize = require("../database");
const Enterprise = require("./Enterprise");
const Cart = sequelize.define("Cart", {
    isPaid: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    totalPrice: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
    }
});
Cart.belongsTo(Enterprise);
Enterprise.hasOne(Cart);
module.exports = Cart;
