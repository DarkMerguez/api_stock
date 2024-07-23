const { DataTypes } = require("sequelize");
const sequelize = require("../database");
const  Product  = require("./Product");
const Image  = require("./Image");

const ProductImage = sequelize.define("ProductImage", {
    value: DataTypes.INTEGER
})


Product.belongsToMany(Image, { through: ProductImage });
Image.belongsToMany(Product, { through: ProductImage });


module.exports = ProductImage;