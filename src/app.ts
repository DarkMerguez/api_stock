// Models :
const { ProductCategory } = require("./database");
const { EnterpriseCategory } = require("./database");
const { Product } = require("./database");
const { Carac } = require("./database");
const { Image } = require("./database");
const { User } = require("./database");
const { Cart } = require("./database");
const { Role } = require("./database");
const { CaracProduct } = require("./database");
const { ProductImage } = require("./database");
const { ProductCart } = require("./database");
const { Bill } = require("./database");
const { BillProduct } = require("./database");
const { Enterprise } = require("./database");
const { Order } = require("./database");
const { OrderProduct } = require("./database");



const sequelize = require("./database");
const { Op } = require("sequelize");


const express = require("express");
const app = express();
const cors = require("cors");

const bcrypt = require('bcrypt');
const saltRounds = 10;

app.use(express.json());
app.use(cors());



// ROUTES DE PRODUIT :

app.get("/products", async (req, res) => {

    try {
        const products = await Product.findAll();

        products.length > 0 ? res.status(200).json(products) : res.status(404).json({ message: "Aucun produit" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Erreur lors de la recherche des Produits." });
    }
});



app.get("/product/:id", async (req, res) => {
    const product = await Product.findByPk(req.params.id)
        .catch((error) => res.status(500).json("Erreur 500"));
    if (product) {
        res.status(200).json(product);
    } else {
        res.status(404).json({ message: "Aucun Produit trouvé avec cet id." });
    }
});



app.get("/products/search/:text", async (req, res) => {
    const text = req.params.text.toLowerCase();
    try {
        // doc sequelize : op like
        const products = await Product.findAll({
            where: {
                [Op.or]: [
                    {
                        name: {
                            [Op.like]: `%${text}%`
                        }
                    }
                    ,
                    {
                        description: {
                            [Op.like]: `%${text}%`
                        }
                    }
                ]
            }
        });

        products.length > 0 ? res.status(200).json(products) : res.status(404).json({ message: "Aucun Produit trouvé avec cette entrée." });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Erreur lors de la recherche des Produits." });
    }
});

app.post("/product", async (req, res) => {
    const newProduct = req.body;
    const product = {
        name: newProduct.name,
        price: newProduct.price,
        description: newProduct.description,
        isFavorite: newProduct.isFavorite,
        stock: newProduct.stock,
        EnterpriseId: newProduct.EnterpriseId,
        ProductCategoryId: newProduct.ProductCategoryId
    };
    const productCategory = await ProductCategory.findByPk(newProduct.ProductCategoryId)
    if (productCategory) { 
        await Product.create(product)
        res.status(200).json(product.name + " a été ajouté à la liste des produits"); 
    }
    else { res.status(400).json("catégorie inexistante") }
})




app.listen(8051, () => {
    console.log("Youhouuuuu serveur lancé sur localhost:8051");
});