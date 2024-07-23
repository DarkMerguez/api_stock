const { DataTypes } = require("sequelize");
const sequelize = require("../database");
const Enterprise = require("./Enterprise");

const Cart = sequelize.define("Cart", {

})


Cart.belongsTo(Enterprise);
Enterprise.hasOne(Cart);


module.exports = Cart;