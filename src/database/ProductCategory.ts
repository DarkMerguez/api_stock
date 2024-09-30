const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const ProductCategory = sequelize.define("ProductCategory", {
    title: DataTypes.TEXT
})



module.exports = ProductCategory;