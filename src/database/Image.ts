const { DataTypes } = require("sequelize");
const sequelize = require("../database");
const User = require("./User");
const Enterprise = require("./Enterprise");

const Image = sequelize.define("Image", {
    url: DataTypes.TEXT
})


User.belongsTo(Image);
Image.hasOne(User);

Enterprise.belongsTo(Image);
Image.hasOne(Enterprise);


module.exports = Image;