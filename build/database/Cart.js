"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cart = void 0;
const { DataTypes } = require("sequelize");
const sequelize = require("../database");
const Enterprise = require("./Enterprise");
exports.Cart = sequelize.define("Cart", {
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
exports.Cart.belongsTo(Enterprise);
Enterprise.hasOne(exports.Cart);
module.exports = exports.Cart;
