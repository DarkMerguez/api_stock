const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const Carac = sequelize.define("Carac", {
    name: DataTypes.TEXT,
    unit: DataTypes.TEXT,
})


module.exports = Carac;