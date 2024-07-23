const { DataTypes } = require("sequelize");
const sequelize = require("../database");
const  Product  = require("./Product");
const Cart = require("./Cart");

const ProductCart = sequelize.define("ProductCart", {
    quantity: DataTypes.INTEGER
})


Product.belongsToMany(Cart, { through: ProductCart });
Cart.belongsToMany(Product, { through: ProductCart });


module.exports = ProductCart;