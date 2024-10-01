const { DataTypes } = require("sequelize");
const sequelize = require("../database");
const Order = require("./Order");
const Enterprise = require("./Enterprise");

const Bill = sequelize.define("Bill", {
    date : DataTypes.DATE,
    totalPrice: {
        type: DataTypes.DECIMAL(10, 2), // Précision pour des valeurs monétaires
        allowNull: false,
        defaultValue: 0.00,
      }
})


Bill.belongsTo(Order);
Order.hasOne(Bill);

Bill.belongsTo(Enterprise, { as: 'seller', foreignKey: 'sellerId' });
Bill.belongsTo(Enterprise, { as: 'buyer', foreignKey: 'buyerId' });



module.exports = Bill;