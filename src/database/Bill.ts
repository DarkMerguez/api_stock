const { DataTypes } = require("sequelize");
const sequelize = require("../database");
const Order = require("./Order");
const Enterprise = require("./Enterprise");

const Bill = sequelize.define("Bill", {

})


Bill.belongsTo(Order);
Order.hasOne(Bill);

Bill.belongsTo(Enterprise, { as: 'seller', foreignKey: 'sellerId' });
Bill.belongsTo(Enterprise, { as: 'buyer', foreignKey: 'buyerId' });



module.exports = Bill;