const { DataTypes } = require("sequelize");
const sequelize = require("../database");
const Role = require("./Role");
const bcrypt = require('bcrypt');
const saltRounds = 10;

const User = sequelize.define("User", {
    firstName: DataTypes.TEXT,
    lastName: DataTypes.TEXT,
    password: {
        type: DataTypes.STRING,
        set(value) {
            const hash = bcrypt.hashSync(value, saltRounds);
            this.setDataValue("password", hash)
        },
    },
    email: DataTypes.TEXT
});


Role.hasMany(User);
User.belongsTo(Role);




module.exports = User;