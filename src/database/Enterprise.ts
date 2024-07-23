const { DataTypes } = require("sequelize");
const sequelize = require("../database");
const User = require("./User");

const Enterprise = sequelize.define("Enterprise", {
    name: DataTypes.TEXT,
    address: DataTypes.TEXT,
    siret: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    }
});


Enterprise.hasMany(User);
User.belongsTo(Enterprise);


module.exports = Enterprise;