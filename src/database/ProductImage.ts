const { DataTypes } = require("sequelize");
const sequelize = require("../database");
const  Product  = require("./Product");
const Image  = require("./Image");

const ProductImage = sequelize.define("ProductImage", {
    ProductId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Products', // le nom exact de la table `Product`
            key: 'id'
        }
    },
    ImageId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Images', // le nom exact de la table `Image`
            key: 'id'
        }
    }
});


Product.belongsToMany(Image, { through: ProductImage });
Image.belongsToMany(Product, { through: ProductImage });


module.exports = ProductImage;