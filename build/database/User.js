"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { DataTypes } = require("sequelize");
const sequelize = require("../database");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const User = sequelize.define("User", {
    firstName: DataTypes.TEXT,
    lastName: DataTypes.TEXT,
    password: {
        type: DataTypes.STRING,
        set(value) {
            const hash = bcrypt.hashSync(value, saltRounds);
            this.setDataValue("password", hash);
        },
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false, // Garantir qu'un email soit fourni
    },
    role: {
        type: DataTypes.ENUM('Admin', 'Gestionnaire', 'Employee'),
        allowNull: false,
        defaultValue: 'Employee', // Valeur par défaut
    },
});
module.exports = User;
