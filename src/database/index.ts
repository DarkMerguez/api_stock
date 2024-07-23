const { Sequelize, DataTypes, Op } = require("sequelize");
const bcrypt = require('bcrypt');
const saltRounds = 10;

const login = {
    database: "gestion_stock",
    username: "admin",
    password: "admin"
};

// Connexion à la BDD
const sequelize = new Sequelize(login.database, login.username, login.password, {
    host: 'localhost',
    dialect: 'mysql',
    port: 3307,
    logging: false
});

// Vérifier la connexion
sequelize.authenticate()
    .then(() => console.log("Connexion à la base de données gestion_stock"))
    .catch(error => console.log(error));


module.exports = sequelize;
module.exports.Product = require("./Product");
module.exports.ProductCategory = require("./ProductCategory");
module.exports.User = require("./User");
module.exports.Role = require("./Role");
module.exports.Enterprise = require("./Enterprise");
module.exports.EnterpriseCategory = require("./EnterpriseCategory");
module.exports.Image = require("./Image");
module.exports.Bill = require("./Bill");
module.exports.BillProduct = require("./BillProduct");
module.exports.Carac = require("./Carac");
module.exports.CaracProduct = require("./CaracProduct");
module.exports.Cart = require("./Cart");
module.exports.Order = require("./Order");
module.exports.OrderProduct = require("./OrderProduct");
module.exports.ProductCart = require("./ProductCart");
module.exports.ProductImage = require("./ProductImage");

sequelize.sync({ force: true })
    .then(async () => {
        console.log("Les modèles et les tables sont synchronisés.")
    })
