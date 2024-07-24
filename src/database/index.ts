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
        console.log("Les modèles et les tables sont synchronisés.");

        const Product = sequelize.models.Product;
        const Enterprise = sequelize.models.Enterprise;
        const productCategory = sequelize.models.ProductCategory;
        const enterpriseCategory = sequelize.models.EnterpriseCategory;

        const produits = await Product.bulkCreate([
            {
                name: "Peugeot 208 jaune",
                price: 2000,
                description: "Voiture de la Poste",
                isFavorite: 1,
                stock: 10
            },
            {
                name: "Renault Partner jaune",
                price: 10000,
                description: "Camion de livraison des colis",
                isFavorite: 0,
                stock: 1000
            }
        ]);

        const produit = await Product.create(
            {
                name: "PC gaming Asus",
                price: 3000,
                description: "Si ta mère te l'achète tu seras vraiment bien",
                isFavorite: 1,
                stock: 50
            }
        )

        const enterprises = await Enterprise.bulkCreate([
            {
                name: "La Poste",
                address: "12 rue du 22 Fevrier 1993",
                siret: 2222222
            },
            {
                name: "Stock'tout",
                address: "1075 Avenue du Maréchal Laroche",
                siret: 22021993
            }
        ]);

        const enterprise = await Enterprise.create(
            {
                name: "Tech'83",
                address: "13 boulevard Massinissa",
                siret: 492019394
            });

        const voitures = await productCategory.create({
            title: "Voitures"
        })

        const ordinateurs = await productCategory.create({
            title: "Ordinateurs"
        })

        const logistique = await enterpriseCategory.create({
            title: "Logistique"
        })

        const informatique = await enterpriseCategory.create({
            title: "Informatique"
        })

        await voitures.addProducts(produits);
        await ordinateurs.addProduct(produit);

        await logistique.addEnterprises(enterprises);
        await informatique.addEnterprise(enterprise);

        await enterprises[0].addProducts(produits);
        await enterprise.addProduct(produit);
    })
