const { DataTypes } = require("sequelize");
const sequelize = require("../database");
const Enterprise = require("./Enterprise");

export const Cart = sequelize.define("Cart", {

    isPaid: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    totalPrice: {
        type: DataTypes.DECIMAL(10, 2), // Précision pour des valeurs monétaires
        allowNull: false,
        defaultValue: 0.00,
      }
})


Cart.belongsTo(Enterprise);
Enterprise.hasOne(Cart);




module.exports = Cart;