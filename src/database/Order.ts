const { DataTypes } = require("sequelize");
const sequelize = require("../database");
const Enterprise = require("./Enterprise");

const Order = sequelize.define("Order", {
    status: {
        type: DataTypes.ENUM('WaitingForValidation', 'Validated', 'Shipped', 'Finished'),
        allowNull: false,
        defaultValue: 'WaitingForValidation', // Valeur par défaut
    },
    totalPrice: {
      type: DataTypes.DECIMAL(10, 2), // Précision pour des valeurs monétaires
      allowNull: false,
      defaultValue: 0.00,
    }
})


Order.belongsTo(Enterprise, { as: 'seller', foreignKey: 'sellerId' });
Order.belongsTo(Enterprise, { as: 'buyer', foreignKey: 'buyerId' });


module.exports = Order;