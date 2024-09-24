"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { DataTypes } = require("sequelize");
const sequelize = require("../database");
const Product = require("./Product");
const Image = require("./Image");
const ProductImage = sequelize.define("ProductImage", {
    ProductId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Products', // le nom exact de la table `Product`
            key: 'id'
        },
        primaryKey: true // Définir comme clé primaire
    },
    ImageId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Images', // le nom exact de la table `Image`
            key: 'id'
        },
        primaryKey: true // Définir comme clé primaire
    }
}, {
    timestamps: true // Cela crée automatiquement les champs createdAt et updatedAt
});
Product.belongsToMany(Image, {
    through: 'ProductImages', // Nom de la table de jointure
    foreignKey: 'ProductId',
    otherKey: 'ImageId',
    as: 'Images' // Alias pour l'association
});
Image.belongsToMany(Product, {
    through: 'ProductImages', // Nom de la table de jointure
    foreignKey: 'ImageId',
    otherKey: 'ProductId',
    as: 'Products' // Alias pour l'association inverse (si nécessaire)
});
module.exports = ProductImage;
