const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const Role = sequelize.define("Role", {
    name: DataTypes.TEXT,
    importance: DataTypes.INTEGER
})




module.exports = Role;