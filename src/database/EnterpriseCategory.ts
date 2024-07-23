const { DataTypes } = require("sequelize");
const sequelize = require("../database");
const Enterprise = require("./Enterprise");

const EnterpriseCategory = sequelize.define("EnterpriseCategory", {
    title: DataTypes.TEXT
})



EnterpriseCategory.hasMany(Enterprise);
Enterprise.belongsTo(EnterpriseCategory);


module.exports = EnterpriseCategory;