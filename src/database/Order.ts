const { DataTypes } = require("sequelize");
const sequelize = require("../database");
const Enterprise = require("./Enterprise");

const Order = sequelize.define("Order", {
    status: DataTypes.INTEGER
})


Order.belongsTo(Enterprise, { as: 'seller', foreignKey: 'sellerId' });
Order.belongsTo(Enterprise, { as: 'buyer', foreignKey: 'buyerId' });


module.exports = Order;